import { NextRequest, NextResponse } from 'next/server'
import { getGeminiClient } from '@/lib/ai/core/gemini-client'
import { getSystemPrompt } from '@/lib/ai/prompts/system-prompt'
import { ALL_FUNCTIONS } from '@/lib/ai/functions/schema' // ✅ FIX: Changed from FUNCTION_SCHEMAS
import { executeFunction } from '@/lib/ai/functions/executor'
import {
  getOrCreateConversation,
  addMessage,
  getConversationHistory,
} from '@/lib/ai/memory/conversation-manager'
import { searchProducts, searchKnowledgeBase } from '@/lib/ai/rag/vector-search'
import type { Message, FunctionCall, FunctionResult } from '@/lib/ai/types'
import type { Product } from '@/payload-types'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit'
import { ChatRequestSchema, validateRequest } from '@/lib/validations/api'
import { withTimeoutFallback, TIMEOUTS } from '@/lib/utils/timeout'

/**
 * AI Chat API Endpoint
 * Handles streaming chat with RAG, function calling, and conversation management
 *
 * POST /api/ai/chat
 * Body: {
 *   message: string
 *   sessionId?: string
 *   customerId?: string
 *   locale?: 'ar' | 'en'
 * }
 *
 * Returns: Streaming response (text/event-stream)
 */

/**
 * Filter out internal thinking/reasoning from AI response
 * Gemini sometimes exposes chain-of-thought which should not be shown to users
 */
function filterInternalThinking(text: string): string {
  if (!text) return ''

  // Patterns that indicate internal thinking (should be filtered)
  const thinkingPatterns = [
    // English patterns
    /^Wait,?\s+.*/gim,
    /^Let me\s+.*/gim,
    /^I('ll| will| should| need to| can| see| think)\s+.*/gim,
    /^Actually,?\s+.*/gim,
    /^Hmm,?\s+.*/gim,
    /^OK,?\s+so\s+.*/gim,
    /^Now,?\s+.*/gim,
    /^First,?\s+.*/gim,
    /^If I can't find.*/gim,
    /^The (search|tool|function|result|query).*/gim,
    /tool call result/gi,
    /function (call|result)/gi,
    /count:\s*\d+/gi,
    /result:\s*\{/gi,
    /\.\.\.searching\.\.\./gi,
    // Arabic patterns
    /^دعني\s+.*/gim,
    /^سأحاول\s+.*/gim,
    /^أفكر\s+.*/gim,
    /^لم أجد\s+.*/gim,
    /^الدالة رجعت.*/gim,
    /^نتيجة البحث.*/gim,
  ]

  let filtered = text

  // Check if the entire text is just thinking (starts with thinking pattern)
  for (const pattern of thinkingPatterns) {
    if (pattern.test(filtered.trim())) {
      // If the whole message is thinking, return empty
      const match = filtered.match(pattern)
      if (match && match[0].length > filtered.trim().length * 0.5) {
        console.log('[ChatAPI] Filtered out internal thinking:', filtered.substring(0, 50))
        return ''
      }
      // Otherwise just remove the pattern
      filtered = filtered.replace(pattern, '').trim()
    }
  }

  // Remove any remaining thinking fragments
  filtered = filtered
    .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
    .trim()

  return filtered
}

/**
 * Extract visual data from function results
 */
function extractVisualDataFromFunctions(
  functionCalls: FunctionCall[],
  functionResults: FunctionResult[]
): {
  products?: Product[]
  comparison?: {
    products: Product[]
    aspects?: string[]
  }
  budgetSolution?: {
    budget: number
    items: Array<{
      product: Product
      quantity: number
      subtotal: number
    }>
    totalCost: number
    alternatives?: any[]
    notes?: string
  }
} {
  const visualData: any = {}

  functionResults.forEach((result, index) => {
    const functionName = result.name
    const functionCall = functionCalls[index]
    const data = result.result

    // Skip if error
    if (!data || data.success === false) return

    switch (functionName) {
      case 'search_products':
      case 'get_recommendations':
      case 'get_similar_products':
        // These functions return products array
        if (data.products && Array.isArray(data.products)) {
          visualData.products = data.products.slice(0, 6) // Limit to 6 products
        }
        break

      case 'compare_products':
        // Comparison function returns products to compare
        if (data.products && Array.isArray(data.products)) {
          visualData.comparison = {
            products: data.products,
            aspects: functionCall.arguments.aspects || undefined,
          }
        }
        break

      case 'calculate_budget_solution':
        // Budget solution returns complete plan
        if (data.solution) {
          visualData.budgetSolution = {
            budget: functionCall.arguments.budget,
            items: data.solution.products || [],
            totalCost: data.solution.totalCost || 0,
            alternatives: data.alternatives || undefined,
            notes: data.explanation || undefined,
          }
        }
        break
    }
  })

  return visualData
}

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now()
  console.log('[ChatAPI] ========== New chat request ==========')

  try {
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

    // Parse and validate request body with Zod
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

    const { message, sessionId: inputSessionId, customerId: inputCustomerId, locale, cartItems } = validation.data!

    // Generate sessionId if not provided
    const sessionId = inputSessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const customerId = inputCustomerId ? String(inputCustomerId) : undefined

    // Log without exposing full message content in production
    if (process.env.NODE_ENV === 'development') {
      console.log('[ChatAPI] Processing message:', message.substring(0, 100))
      console.log('[ChatAPI] Session:', sessionId, 'Customer:', customerId, 'Locale:', locale)
    } else {
      console.log('[ChatAPI] Processing request for session:', sessionId.substring(0, 8))
    }

    // 1. Get or create conversation
    const conversation = await getOrCreateConversation({
      sessionId,
      customerId,
      locale,
    })

    console.log('[ChatAPI] Conversation ID:', conversation.id)

    // 2. Load conversation history (last 20 messages)
    const history = await getConversationHistory(conversation.id, {
      limit: 20,
      includeSystem: false,
    })

    console.log('[ChatAPI] Loaded history:', history.length, 'messages')

    // 3. RAG: Retrieve relevant context with timeout fallback
    const ragStartTime = Date.now()
    console.log('[ChatAPI] Starting RAG retrieval...')

    // Wrap RAG in overall timeout - if it takes too long, skip and continue
    const [productResults, knowledgeResults] = await withTimeoutFallback(
      Promise.all([
        // Search products using semantic search
        searchProducts({
          query: message,
          locale,
          limit: 5,
          similarityThreshold: 0.3,
        }).catch((error) => {
          console.error('[ChatAPI] Product search error:', error)
          return []
        }),

        // Search knowledge base (policies, FAQs)
        searchKnowledgeBase(message, locale).catch((error) => {
          console.error('[ChatAPI] Knowledge base search error:', error)
          return []
        }),
      ]),
      TIMEOUTS.RAG_TOTAL,
      [[], []], // Return empty arrays if timeout
      (error) => {
        console.warn('[ChatAPI] RAG retrieval timed out, continuing without context:', error.message)
      }
    )

    console.log(`[ChatAPI] RAG completed in ${Date.now() - ragStartTime}ms`)

    console.log(
      '[ChatAPI] RAG results:',
      productResults.length,
      'products,',
      knowledgeResults.length,
      'knowledge items'
    )

    // 4. Build RAG context for the prompt
    let ragContext = ''

    if (productResults.length > 0) {
      ragContext += '## منتجات ذات صلة:\n'
      productResults.forEach((result, index) => {
        ragContext += `${index + 1}. ${result.metadata.text || 'معلومات المنتج'}\n`
      })
      ragContext += '\n'
    }

    if (knowledgeResults.length > 0) {
      ragContext += '## معلومات من قاعدة المعرفة:\n'
      knowledgeResults.forEach((item, index) => {
        ragContext += `${index + 1}. ${item.title}: ${item.content.substring(0, 200)}...\n`
      })
      ragContext += '\n'
    }

    // 5. Get customer info for personalized prompt
    let customerInfo
    if (customerId) {
      // You could fetch customer from database here
      // For now, we'll use basic info
      customerInfo = {
        preferredLanguage: locale,
      }
    }

    // 6. Build system instruction with context
    const systemInstruction = getSystemPrompt({
      tokenBudget: 'standard',
      customerInfo,
      conversationContext: ragContext,
    })

    // 7. Build message array for Gemini (WITHOUT system role)
    const messages: Message[] = [
      ...history,
      {
        role: 'user',
        content: message,
      },
    ]

    // 8. Save user message to database
    await addMessage(conversation.id, {
      role: 'user',
      content: message,
    })

    // 9. Call Gemini with streaming and function calling
    const geminiClient = getGeminiClient()

    console.log('[ChatAPI] Calling Gemini API...')

    // Create streaming response
    const encoder = new TextEncoder()
    let fullAssistantMessage = ''
    let functionCallsMade: FunctionCall[] = []

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream initial response from Gemini with system instruction
          const chatStream = geminiClient.chatStream(
            messages,
            ALL_FUNCTIONS, // ✅ FIX: Changed from FUNCTION_SCHEMAS
            undefined,
            systemInstruction
          )

          for await (const chunk of chatStream) {
            // Handle text chunks - filter out internal thinking
            if (chunk.text) {
              const filteredText = filterInternalThinking(chunk.text)

              // Only send and accumulate if there's actual content after filtering
              if (filteredText.length > 0) {
                fullAssistantMessage += filteredText
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: filteredText })}\n\n`))
              } else {
                console.log('[ChatAPI] Skipped internal thinking chunk')
              }
            }

            // Handle function calls
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              console.log('[ChatAPI] Function calls requested:', chunk.functionCalls.length)

              functionCallsMade.push(...chunk.functionCalls)

              // Execute all function calls
              const functionResults = await Promise.all(
                chunk.functionCalls.map(async (fc) => {
                  console.log('[ChatAPI] Executing function:', fc.name)

                  const result = await executeFunction(fc, {
                    customerId,
                    sessionId,
                    locale,
                    cartItems,
                  })

                  return result
                })
              )

              console.log('[ChatAPI] Function results:', functionResults.length)

              // ✅ ADD: Extract visual data from function results
              const visualData = extractVisualDataFromFunctions(chunk.functionCalls, functionResults)

              // Send visual data to frontend if available
              if (visualData.products || visualData.comparison || visualData.budgetSolution) {
                console.log('[ChatAPI] Sending visual data to frontend')
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: 'visual',
                      data: visualData,
                    })}\n\n`
                  )
                )
              }

              // Send function results back to Gemini to generate final response
              // ✅ FIX: Don't include any accumulated thinking text - only function calls matter here
              const followUpMessages: Message[] = [
                ...messages,
                {
                  role: 'assistant',
                  content: '', // ✅ Empty content - we only need to pass function calls
                  functionCalls: chunk.functionCalls,
                },
                {
                  role: 'function',
                  content: JSON.stringify(functionResults),
                },
              ]

              // Get final response with function results (pass same system instruction)
              const followUpStream = geminiClient.chatStream(
                followUpMessages,
                undefined,
                undefined,
                systemInstruction
              )

              for await (const followUpChunk of followUpStream) {
                // ✅ FIX: Also filter follow-up responses
                if (followUpChunk.text) {
                  const filteredFollowUpText = filterInternalThinking(followUpChunk.text)

                  if (filteredFollowUpText.length > 0) {
                    fullAssistantMessage += filteredFollowUpText
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text: filteredFollowUpText })}\n\n`)
                    )
                  } else {
                    console.log('[ChatAPI] Skipped internal thinking in follow-up')
                  }
                }

                if (followUpChunk.finishReason) {
                  console.log('[ChatAPI] Stream finished:', followUpChunk.finishReason)
                }
              }
            }

            // Handle finish reason
            if (chunk.finishReason) {
              console.log('[ChatAPI] Stream finished:', chunk.finishReason)
            }
          }

          // 10. Save assistant message to database
          if (fullAssistantMessage.trim()) {
            await addMessage(conversation.id, {
              role: 'assistant',
              content: fullAssistantMessage,
              functionCalls: functionCallsMade.length > 0 ? functionCallsMade : undefined,
            })

            console.log('[ChatAPI] Saved assistant message to database')
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error: any) {
          console.error('[ChatAPI] Stream error:', error)

          // Send error to client
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: error.message || 'حدث خطأ أثناء معالجة الرسالة',
              })}\n\n`
            )
          )

          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('[ChatAPI] Error:', error)

    return NextResponse.json(
      {
        error: error.message || 'حدث خطأ أثناء معالجة الطلب',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/chat?sessionId=xxx
 * Get conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 })
    }

    const conversation = await getOrCreateConversation({ sessionId })

    const history = await getConversationHistory(conversation.id, {
      limit: 50,
      includeSystem: false,
    })

    return NextResponse.json({
      conversationId: conversation.id,
      messages: history,
      messageCount: history.length,
    })
  } catch (error: any) {
    console.error('[ChatAPI] GET error:', error)

    return NextResponse.json(
      {
        error: error.message || 'حدث خطأ أثناء جلب المحادثة',
      },
      { status: 500 }
    )
  }
}
