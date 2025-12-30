'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
// Import from client-safe exports to avoid server-side Payload imports
import {
  createLiveSession,
  isLiveApiSupported,
  getMicrophonePermission,
  requestMicrophoneAccess,
  AudioProcessor,
  AudioPlayer,
  type LiveSession,
  type LiveMessage,
  type LiveSessionConfig,
} from '@/lib/gemini/client-safe'

export type VoiceSessionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error'
  | 'permission_denied'

export interface UseLiveSessionOptions {
  onTranscript?: (text: string, isFinal: boolean) => void
  onResponse?: (text: string) => void
  onFunctionCall?: (name: string, args: Record<string, unknown>) => void
  onError?: (error: Error) => void
  autoPlayAudio?: boolean
  systemPrompt?: string
}

export interface UseLiveSessionReturn {
  // State
  status: VoiceSessionStatus
  isSupported: boolean
  isListening: boolean
  isConnected: boolean
  currentTranscript: string
  lastResponse: string
  error: string | null

  // Actions
  connect: () => Promise<boolean>
  disconnect: () => void
  startListening: () => Promise<boolean>
  stopListening: () => void
  sendText: (text: string) => void

  // Permission
  checkPermission: () => Promise<'granted' | 'denied' | 'prompt'>
  requestPermission: () => Promise<boolean>
}

export function useLiveSession(
  options: UseLiveSessionOptions = {}
): UseLiveSessionReturn {
  const {
    onTranscript,
    onResponse,
    onFunctionCall,
    onError,
    autoPlayAudio = true,
    systemPrompt,
  } = options

  // State
  const [status, setStatus] = useState<VoiceSessionStatus>('idle')
  const [isSupported, setIsSupported] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [lastResponse, setLastResponse] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Refs
  const sessionRef = useRef<LiveSession | null>(null)
  const audioProcessorRef = useRef<AudioProcessor | null>(null)
  const audioPlayerRef = useRef<AudioPlayer | null>(null)

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported(isLiveApiSupported())
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  // Connect to Live API
  const connect = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('البحث الصوتي غير مدعوم في هذا المتصفح')
      setStatus('error')
      return false
    }

    try {
      setStatus('connecting')
      setError(null)

      // Initialize audio handlers
      audioProcessorRef.current = new AudioProcessor()
      audioPlayerRef.current = new AudioPlayer()
      await audioPlayerRef.current.initialize()

      // Create session config
      const config: LiveSessionConfig = {
        systemPrompt,
        enableFunctions: true,
        voiceConfig: {
          languageCode: 'ar-EG',
        },
      }

      // Create Live session
      const session = await createLiveSession(config, {
        onMessage: handleMessage,
        onError: handleError,
        onOpen: () => setStatus('connected'),
        onClose: () => {
          setStatus('idle')
          sessionRef.current = null
        },
        onInterrupted: () => setStatus('connected'),
      })

      sessionRef.current = session
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل الاتصال'
      setError(message)
      setStatus('error')
      onError?.(err instanceof Error ? err : new Error(message))
      return false
    }
  }, [isSupported, systemPrompt, onError])

  // Disconnect from Live API
  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close()
      sessionRef.current = null
    }

    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop()
      audioProcessorRef.current = null
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.cleanup()
      audioPlayerRef.current = null
    }

    setStatus('idle')
    setCurrentTranscript('')
  }, [])

  // Start listening (recording)
  const startListening = useCallback(async (): Promise<boolean> => {
    if (!sessionRef.current?.isConnected()) {
      const connected = await connect()
      if (!connected) return false
    }

    if (!audioProcessorRef.current) {
      audioProcessorRef.current = new AudioProcessor()
    }

    try {
      const started = await audioProcessorRef.current.start((audioData) => {
        sessionRef.current?.sendAudio(audioData)
      })

      if (started) {
        setStatus('listening')
        return true
      } else {
        setError('فشل تشغيل الميكروفون')
        setStatus('error')
        return false
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل تشغيل الميكروفون'
      setError(message)
      setStatus('error')
      return false
    }
  }, [connect])

  // Stop listening
  const stopListening = useCallback(() => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.stop()
    }
    if (status === 'listening') {
      setStatus('connected')
    }
  }, [status])

  // Send text message
  const sendText = useCallback((text: string) => {
    if (sessionRef.current?.isConnected()) {
      sessionRef.current.sendText(text)
      setStatus('processing')
    }
  }, [])

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: LiveMessage) => {
      switch (message.type) {
        case 'text':
          const text = message.data as string
          setLastResponse(text)
          setStatus('processing')
          onResponse?.(text)
          break

        case 'audio':
          if (autoPlayAudio && audioPlayerRef.current) {
            setStatus('speaking')
            audioPlayerRef.current.playAudio(message.data as ArrayBuffer)
          }
          break

        case 'function_call':
          const calls = message.data as Array<{ name: string; args: Record<string, unknown> }>
          calls.forEach((call) => {
            onFunctionCall?.(call.name, call.args)
          })
          break

        case 'turn_complete':
          if (audioProcessorRef.current?.getIsRecording()) {
            setStatus('listening')
          } else {
            setStatus('connected')
          }
          break

        case 'interrupted':
          if (audioPlayerRef.current) {
            audioPlayerRef.current.stop()
          }
          break
      }
    },
    [autoPlayAudio, onResponse, onFunctionCall]
  )

  // Handle errors
  const handleError = useCallback(
    (err: Error) => {
      setError(err.message)
      setStatus('error')
      onError?.(err)
    },
    [onError]
  )

  // Check microphone permission
  const checkPermission = useCallback(async (): Promise<
    'granted' | 'denied' | 'prompt'
  > => {
    return getMicrophonePermission()
  }, [])

  // Request microphone permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const stream = await requestMicrophoneAccess()
    if (stream) {
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach((track) => track.stop())
      return true
    }
    setStatus('permission_denied')
    setError('لم يتم منح إذن الميكروفون')
    return false
  }, [])

  return {
    // State
    status,
    isSupported,
    isListening: status === 'listening',
    isConnected: sessionRef.current?.isConnected() ?? false,
    currentTranscript,
    lastResponse,
    error,

    // Actions
    connect,
    disconnect,
    startListening,
    stopListening,
    sendText,

    // Permission
    checkPermission,
    requestPermission,
  }
}
