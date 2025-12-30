/**
 * Gemini Live API Session Management
 * Real-time voice/audio conversations
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
import { getFunctionDeclarations } from '../functions/definitions'
import { executeFunction } from '../functions/executor'

// Note: Live API requires WebSocket which works differently in Node.js vs Browser
// This implementation is designed for browser-side usage

/**
 * Create a Live API session for real-time voice conversations
 */
export async function createLiveSession(
  config: LiveSessionConfig,
  callbacks: LiveSessionCallbacks
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
      tools.push({ functionDeclarations: getFunctionDeclarations() })
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
              voiceName: voiceConfig.voiceName || 'Kore', // Default Arabic-friendly voice
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

          // Handle different message types
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

            // Auto-execute functions and send responses
            for (const call of functionCalls) {
              const response = await executeFunction(call)
              sendFunctionResponse(response)
            }
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

    // Helper function to send messages
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
 * Available voice options for Arabic/Middle East
 */
export const VOICE_OPTIONS = {
  // Natural voices that work well with Arabic
  KORE: 'Kore', // Balanced, professional
  CHARON: 'Charon', // Warm, friendly
  FENRIR: 'Fenrir', // Clear, articulate
  PUCK: 'Puck', // Energetic
  AOEDE: 'Aoede', // Soft, calm
} as const

/**
 * Check if Live API is supported in current environment
 */
export function isLiveApiSupported(): boolean {
  // Check for WebSocket support
  if (typeof WebSocket === 'undefined') {
    return false
  }

  // Check for AudioContext support
  if (typeof AudioContext === 'undefined' && typeof (window as unknown as { webkitAudioContext: unknown }).webkitAudioContext === 'undefined') {
    return false
  }

  // Check for getUserMedia support
  if (!navigator.mediaDevices?.getUserMedia) {
    return false
  }

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
    // Fallback for browsers that don't support permissions query
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
