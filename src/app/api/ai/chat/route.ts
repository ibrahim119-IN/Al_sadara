import { NextRequest, NextResponse } from 'next/server'
import {
  streamChatResponse,
  generateChatResponse,
  ChatMessage,
  StreamChunk,
  SYSTEM_PROMPTS,
  isGeminiConfigured,
} from '@/lib/gemini'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit'
import { ChatRequestSchema, validateRequest } from '@/lib/validations/api'

/**
 * AI Chat API Endpoint (New Gemini SDK)
 *
 * POST /api/ai/chat
 * Body: {
 *   message: string
 *   sessionId?: string
 *   customerId?: string
 *   locale?: 'ar' | 'en'
 *   stream?: boolean (default: true)
 *   enableFunctions?: boolean (default: true)
 *   enableGrounding?: boolean (default: false)
 * }
 *
 * Returns: Streaming response (text/event-stream) or JSON
 */

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now()
  console.log('[ChatAPI] ========== New chat request ==========')

  try {
    // Check if Gemini is configured
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      )
    }

    // Rate Limiting - Check per-minute limit
    const rateLimitKey = getRateLimitKey(request, 'ai-chat')
    const minuteLimit = checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.AI_CHAT.limit,
      RATE_LIMITS.AI_CHAT.windowMs
    )

    if (!minuteLimit.allowed) {
      return NextResponse.json(
        {
          error: 'تم تجاوز الحد الأقصى للرسائل. يرجى الانتظار قليلاً.',
          retryAfter: minuteLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(minuteLimit.retryAfter),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    // Also check hourly limit
    const hourlyLimit = checkRateLimit(
      `${rateLimitKey}-hourly`,
      RATE_LIMITS.AI_CHAT_HOURLY.limit,
      RATE_LIMITS.AI_CHAT_HOURLY.windowMs
    )

    if (!hourlyLimit.allowed) {
      return NextResponse.json(
        {
          error: 'تم تجاوز الحد الأقصى للرسائل في الساعة. يرجى المحاولة لاحقاً.',
          retryAfter: hourlyLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(hourlyLimit.retryAfter),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = validateRequest(ChatRequestSchema, body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validation.errors,
        },
        { status: 400 }
      )
    }

    const {
      message,
      sessionId: inputSessionId,
      customerId: inputCustomerId,
      locale = 'ar',
    } = validation.data!

    // History is optional and not part of the schema
    const clientHistory = (body.history as Array<{ role: string; content: string }>) || []

    // Additional options from body (not validated by schema)
    const stream = body.stream !== false // default true
    const enableFunctions = body.enableFunctions !== false // default true
    const enableGrounding = body.enableGrounding === true // default false

    // Generate sessionId if not provided
    const sessionId =
      inputSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

    console.log('[ChatAPI] Session:', sessionId, 'Locale:', locale, 'Stream:', stream)

    // Build message history
    const messages: ChatMessage[] = [
      ...clientHistory.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'model',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Choose appropriate system prompt based on locale
    const systemPrompt =
      locale === 'en'
        ? SYSTEM_PROMPTS.SHOPPING_ASSISTANT.replace(/العربية/g, 'English')
        : SYSTEM_PROMPTS.SHOPPING_ASSISTANT

    // Non-streaming response
    if (!stream) {
      const response = await generateChatResponse(messages, {
        systemPrompt,
        enableFunctions,
        enableGrounding,
      })

      console.log(`[ChatAPI] Non-streaming response in ${Date.now() - requestStartTime}ms`)

      return NextResponse.json({
        text: response.text,
        sessionId,
        functionCalls: response.functionCalls,
        groundingMetadata: response.groundingMetadata,
      })
    }

    // Streaming response
    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamChatResponse(messages, {
            systemPrompt,
            enableFunctions,
            enableGrounding,
          })

          for await (const chunk of generator) {
            const data = formatChunk(chunk)
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

          console.log(`[ChatAPI] Stream completed in ${Date.now() - requestStartTime}ms`)
        } catch (error) {
          console.error('[ChatAPI] Stream error:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الرسالة',
              })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Session-Id': sessionId,
      },
    })
  } catch (error) {
    console.error('[ChatAPI] Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الطلب',
      },
      { status: 500 }
    )
  }
}

/**
 * Format stream chunk for SSE response
 */
function formatChunk(chunk: StreamChunk): Record<string, unknown> {
  switch (chunk.type) {
    case 'text':
      return { text: chunk.data }
    case 'function_call':
      return { type: 'function_call', functionCalls: chunk.data }
    case 'grounding':
      return { type: 'grounding', metadata: chunk.data }
    case 'error':
      return { error: (chunk.data as Error).message }
    default:
      return { type: chunk.type, data: chunk.data }
  }
}

/**
 * GET /api/ai/chat/health
 * Health check endpoint
 */
export async function GET() {
  const isConfigured = isGeminiConfigured()

  return NextResponse.json({
    status: isConfigured ? 'healthy' : 'unconfigured',
    service: 'gemini',
    timestamp: new Date().toISOString(),
  })
}
