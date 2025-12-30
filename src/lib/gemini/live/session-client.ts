/**
 * Gemini Live API Session Management - Client Safe Version
 * This version does NOT auto-execute functions (which require server-side Payload)
 * Function calls are returned to the client to handle via API
 */

import { getGeminiClient, MODELS, SYSTEM_PROMPTS } from '../client'
import {
  LiveSessionConfig,
  LiveSessionCallbacks,
  LiveSession,
  LiveMessage,
  FunctionCall,
  FunctionResponse,
  GeminiError,
  GeminiErrorCodes,
} from '../types'

// Client-safe function declarations (without server imports)
const CLIENT_FUNCTION_DECLARATIONS = [
  {
    name: 'search_products',
    description: 'البحث في المنتجات بالاسم أو الوصف أو الفئة',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'كلمات البحث' },
        category: { type: 'STRING', description: 'الفئة (اختياري)' },
        minPrice: { type: 'NUMBER', description: 'الحد الأدنى للسعر' },
        maxPrice: { type: 'NUMBER', description: 'الحد الأقصى للسعر' },
        inStock: { type: 'BOOLEAN', description: 'متوفر فقط' },
        limit: { type: 'NUMBER', description: 'عدد النتائج' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_details',
    description: 'الحصول على تفاصيل منتج معين',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'معرف المنتج' },
        productName: { type: 'STRING', description: 'اسم المنتج' },
      },
    },
  },
  {
    name: 'get_recommendations',
    description: 'الحصول على توصيات منتجات',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'معرف المنتج الحالي' },
        category: { type: 'STRING', description: 'الفئة' },
        priceRange: { type: 'STRING', description: 'نطاق السعر: low, medium, high' },
        limit: { type: 'NUMBER', description: 'عدد التوصيات' },
      },
    },
  },
]

/**
 * Create a Live API session for real-time voice conversations
 * Client-safe version - function calls are returned, not auto-executed
 */
export async function createLiveSessionClient(
  config: LiveSessionConfig,
  callbacks: LiveSessionCallbacks & {
    onFunctionCall?: (calls: FunctionCall[]) => void
  }
): Promise<LiveSession> {
  const ai = getGeminiClient()

  const {
    model = MODELS.LIVE,
    systemPrompt = SYSTEM_PROMPTS.VOICE_ASSISTANT,
    responseModalities = ['AUDIO', 'TEXT'],
    enableFunctions = true,
    voiceConfig = { languageCode: 'ar-EG' },
  } = config

  let session: unknown = null
  let isConnected = false

  try {
    // Build tools array
    const tools: unknown[] = []
    if (enableFunctions) {
      tools.push({ functionDeclarations: CLIENT_FUNCTION_DECLARATIONS })
    }

    // Connect to Live API
    session = await (ai as unknown as {
      live: {
        connect: (config: unknown) => Promise<unknown>
      }
    }).live.connect({
      model,
      config: {
        responseModalities,
        systemInstruction: systemPrompt,
        ...(tools.length > 0 && { tools }),
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceConfig.voiceName || 'Kore',
            },
          },
        },
      },
      callbacks: {
        onopen: () => {
          isConnected = true
          callbacks.onOpen?.()
        },
        onmessage: async (message: unknown) => {
          const msg = message as Record<string, unknown>

          if (msg.text) {
            callbacks.onMessage({
              type: 'text',
              data: msg.text as string,
            })
          }

          if (msg.audio) {
            callbacks.onMessage({
              type: 'audio',
              data: msg.audio as ArrayBuffer,
            })
          }

          if (msg.functionCalls) {
            const functionCalls = msg.functionCalls as FunctionCall[]
            callbacks.onMessage({
              type: 'function_call',
              data: functionCalls,
            })
            // Let the client handle function execution via callback
            callbacks.onFunctionCall?.(functionCalls)
          }

          if (msg.interrupted) {
            callbacks.onInterrupted?.()
            callbacks.onMessage({ type: 'interrupted' })
          }

          if (msg.turnComplete) {
            callbacks.onMessage({ type: 'turn_complete' })
          }
        },
        onerror: (error: Error) => {
          callbacks.onError(error)
        },
        onclose: () => {
          isConnected = false
          callbacks.onClose?.()
        },
      },
    })

    const send = (message: LiveMessage) => {
      if (!session || !isConnected) return

      const sessionObj = session as {
        send: (data: unknown) => void
      }

      switch (message.type) {
        case 'text':
          sessionObj.send({ text: message.data as string })
          break
        case 'audio':
          sessionObj.send({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm',
                  data: message.data as ArrayBuffer,
                },
              ],
            },
          })
          break
        case 'function_response':
          sessionObj.send({
            toolResponse: {
              functionResponses: [message.data as FunctionResponse],
            },
          })
          break
      }
    }

    const sendText = (text: string) => {
      send({ type: 'text', data: text })
    }

    const sendAudio = (audioData: ArrayBuffer) => {
      send({ type: 'audio', data: audioData })
    }

    const sendFunctionResponse = (response: FunctionResponse) => {
      send({ type: 'function_response', data: response })
    }

    const close = () => {
      if (session) {
        const sessionObj = session as { close: () => void }
        sessionObj.close()
        isConnected = false
      }
    }

    return {
      send,
      sendText,
      sendAudio,
      sendFunctionResponse,
      close,
      isConnected: () => isConnected,
    }
  } catch (error) {
    throw new GeminiError(
      `Failed to create Live session: ${error instanceof Error ? error.message : 'Unknown error'}`,
      GeminiErrorCodes.LIVE_SESSION_ERROR
    )
  }
}

/**
 * Available voice options
 */
export const VOICE_OPTIONS = {
  KORE: 'Kore',
  CHARON: 'Charon',
  FENRIR: 'Fenrir',
  PUCK: 'Puck',
  AOEDE: 'Aoede',
} as const

/**
 * Check if Live API is supported in current environment
 */
export function isLiveApiSupported(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof WebSocket === 'undefined') return false
  if (typeof AudioContext === 'undefined' && typeof (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext === 'undefined') return false
  if (!navigator.mediaDevices?.getUserMedia) return false
  return true
}

/**
 * Get microphone permission status
 */
export async function getMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    return result.state
  } catch {
    return 'prompt'
  }
}

/**
 * Request microphone access
 */
export async function requestMicrophoneAccess(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    return stream
  } catch (error) {
    console.error('Failed to get microphone access:', error)
    return null
  }
}
