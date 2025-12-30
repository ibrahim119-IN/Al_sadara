import { NextRequest, NextResponse } from 'next/server'
import { isGeminiConfigured, MODELS, CONFIG } from '@/lib/gemini'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit'

/**
 * Voice API Endpoint
 *
 * This endpoint provides configuration and health checks for voice features.
 * The actual Live API connections happen client-side via WebSocket.
 *
 * GET /api/ai/voice - Get voice configuration and status
 * POST /api/ai/voice - Reserved for future audio processing
 */

export async function GET(request: NextRequest) {
  try {
    // Check if Gemini is configured
    const isConfigured = isGeminiConfigured()
    const isVoiceEnabled = CONFIG.ENABLE_VOICE_SEARCH

    return NextResponse.json({
      status: isConfigured && isVoiceEnabled ? 'available' : 'unavailable',
      features: {
        liveApi: isVoiceEnabled,
        speechRecognition: true, // Web Speech API fallback always available
        audioPlayback: true,
      },
      config: {
        model: MODELS.LIVE,
        supportedLanguages: [
          { code: 'ar-EG', name: 'العربية (مصر)' },
          { code: 'ar-SA', name: 'العربية (السعودية)' },
          { code: 'en-US', name: 'English (US)' },
        ],
        voices: [
          { id: 'Kore', name: 'Kore', description: 'متوازن ومهني' },
          { id: 'Charon', name: 'Charon', description: 'دافئ وودود' },
          { id: 'Fenrir', name: 'Fenrir', description: 'واضح ومفصل' },
          { id: 'Aoede', name: 'Aoede', description: 'هادئ وناعم' },
        ],
      },
      instructions: {
        webSpeechApi: {
          description: 'استخدم Web Speech API للتعرف على الكلام محلياً',
          supported: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window,
        },
        liveApi: {
          description: 'Live API يعمل عبر WebSocket من جانب العميل',
          note: 'قم بإنشاء الاتصال باستخدام useLiveSession hook',
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[VoiceAPI] Error:', error)

    return NextResponse.json(
      {
        error: 'فشل في جلب معلومات الصوت',
        status: 'error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ai/voice
 * Reserved for future audio processing (e.g., audio file transcription)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, 'ai-voice')
    const rateLimit = checkRateLimit(
      rateLimitKey,
      RATE_LIMITS.AI_CHAT.limit,
      RATE_LIMITS.AI_CHAT.windowMs
    )

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'تم تجاوز الحد الأقصى للطلبات',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )
    }

    // Check content type
    const contentType = request.headers.get('content-type') || ''

    // Handle audio file upload for transcription (future feature)
    if (contentType.includes('audio/') || contentType.includes('multipart/form-data')) {
      // TODO: Implement audio file transcription
      return NextResponse.json(
        {
          error: 'Audio file transcription not yet implemented',
          hint: 'Use Web Speech API or Live API for real-time transcription',
        },
        { status: 501 }
      )
    }

    // Handle text-to-speech request (future feature)
    const body = await request.json().catch(() => ({}))

    if (body.text && body.action === 'synthesize') {
      // TODO: Implement text-to-speech
      return NextResponse.json(
        {
          error: 'Text-to-speech not yet implemented',
          hint: 'Use Live API for voice responses',
        },
        { status: 501 }
      )
    }

    return NextResponse.json(
      {
        error: 'Invalid request',
        hint: 'This endpoint is reserved for future audio processing features',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('[VoiceAPI] POST Error:', error)

    return NextResponse.json(
      {
        error: 'فشل في معالجة الطلب',
      },
      { status: 500 }
    )
  }
}
