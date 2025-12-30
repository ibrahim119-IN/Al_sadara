'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useLiveSession, VoiceSessionStatus } from '@/hooks/useLiveSession'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface VoiceSearchProps {
  onResult?: (text: string) => void
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  variant?: 'button' | 'full' | 'floating'
  useAI?: boolean // Use Gemini Live API vs Web Speech API
}

// Status messages in Arabic
const STATUS_MESSAGES: Record<VoiceSessionStatus, string> = {
  idle: 'اضغط للتحدث',
  connecting: 'جاري الاتصال...',
  connected: 'جاهز للاستماع',
  listening: 'جاري الاستماع...',
  processing: 'جاري المعالجة...',
  speaking: 'جاري الرد...',
  error: 'حدث خطأ',
  permission_denied: 'يرجى السماح بالميكروفون',
}

export function VoiceSearch({
  onResult,
  onSearch,
  placeholder = 'تحدث للبحث...',
  className = '',
  variant = 'button',
  useAI = false,
}: VoiceSearchProps) {
  const [transcript, setTranscript] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Gemini Live API session
  const liveSession = useLiveSession({
    onResponse: (text) => {
      setTranscript(text)
      onResult?.(text)
    },
    onError: (error) => {
      console.error('Voice session error:', error)
    },
  })

  // Web Speech API fallback
  const speechRecognition = useSpeechRecognition({
    language: 'ar-EG',
    continuous: false,
    interimResults: true,
    onResult: (text, isFinal) => {
      setTranscript(text)
      if (isFinal) {
        onResult?.(text)
        if (onSearch) {
          onSearch(text)
        }
      }
    },
    onError: (error) => {
      console.error('Speech recognition error:', error)
    },
  })

  // Use the appropriate recognition method
  const isSupported = useAI ? liveSession.isSupported : speechRecognition.isSupported
  const isListening = useAI ? liveSession.isListening : speechRecognition.isListening
  const error = useAI ? liveSession.error : speechRecognition.error
  const status = useAI ? liveSession.status : (isListening ? 'listening' : 'idle')

  // Start/stop listening
  const toggleListening = useCallback(async () => {
    if (isListening) {
      if (useAI) {
        liveSession.stopListening()
      } else {
        speechRecognition.stopListening()
      }
    } else {
      setTranscript('')
      if (useAI) {
        await liveSession.startListening()
      } else {
        speechRecognition.startListening()
      }
    }
  }, [isListening, useAI, liveSession, speechRecognition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (useAI) {
        liveSession.disconnect()
      }
    }
  }, [useAI])

  // Button variant
  if (variant === 'button') {
    return (
      <button
        onClick={toggleListening}
        disabled={!isSupported}
        className={`
          relative p-3 rounded-full transition-all duration-300
          ${isListening
            ? 'bg-primary-500 text-white animate-pulse'
            : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
          }
          ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        title={STATUS_MESSAGES[status as VoiceSessionStatus] || 'البحث الصوتي'}
        aria-label={isListening ? 'إيقاف الاستماع' : 'بدء البحث الصوتي'}
      >
        <MicrophoneIcon isActive={isListening} />

        {/* Pulse effect when listening */}
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25" />
        )}
      </button>
    )
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          disabled={!isSupported}
          className={`
            fixed bottom-24 left-6 z-40 p-4 rounded-full shadow-lg
            bg-primary-500 text-white hover:bg-primary-600
            transition-all duration-300 hover:scale-110
            ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          aria-label="البحث الصوتي"
        >
          <MicrophoneIcon isActive={false} size={24} />
        </button>

        {/* Voice Modal */}
        {showModal && (
          <VoiceModal
            isListening={isListening}
            transcript={transcript}
            status={status as VoiceSessionStatus}
            error={error}
            onToggle={toggleListening}
            onClose={() => {
              setShowModal(false)
              if (isListening) {
                if (useAI) {
                  liveSession.stopListening()
                } else {
                  speechRecognition.stopListening()
                }
              }
            }}
            onSearch={() => {
              if (transcript && onSearch) {
                onSearch(transcript)
                setShowModal(false)
              }
            }}
          />
        )}
      </>
    )
  }

  // Full variant
  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-2xl p-6 ${className}`}>
      <div className="text-center space-y-6">
        {/* Microphone button */}
        <button
          onClick={toggleListening}
          disabled={!isSupported}
          className={`
            relative mx-auto w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isListening
              ? 'bg-primary-500 text-white scale-110'
              : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
            }
            ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label={isListening ? 'إيقاف الاستماع' : 'بدء البحث الصوتي'}
        >
          <MicrophoneIcon isActive={isListening} size={32} />

          {/* Animated rings when listening */}
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-primary-500 animate-ping" />
              <span className="absolute inset-[-8px] rounded-full border-2 border-primary-400 animate-ping animation-delay-200" />
            </>
          )}
        </button>

        {/* Status text */}
        <p className="text-secondary-600 dark:text-secondary-400">
          {error || STATUS_MESSAGES[status as VoiceSessionStatus] || placeholder}
        </p>

        {/* Transcript */}
        {transcript && (
          <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
            <p className="text-lg font-medium text-secondary-900 dark:text-white">
              {transcript}
            </p>
          </div>
        )}

        {/* Search button */}
        {transcript && onSearch && (
          <button
            onClick={() => onSearch(transcript)}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            بحث عن "{transcript}"
          </button>
        )}
      </div>
    </div>
  )
}

// Voice Modal Component
interface VoiceModalProps {
  isListening: boolean
  transcript: string
  status: VoiceSessionStatus
  error: string | null
  onToggle: () => void
  onClose: () => void
  onSearch: () => void
}

function VoiceModal({
  isListening,
  transcript,
  status,
  error,
  onToggle,
  onClose,
  onSearch,
}: VoiceModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-secondary-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          aria-label="إغلاق"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
            البحث الصوتي
          </h3>

          {/* Microphone */}
          <button
            onClick={onToggle}
            className={`
              relative mx-auto w-24 h-24 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isListening
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300'
              }
            `}
          >
            <MicrophoneIcon isActive={isListening} size={40} />

            {isListening && (
              <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-25" />
            )}
          </button>

          {/* Status */}
          <p className={`text-sm ${error ? 'text-red-500' : 'text-secondary-500 dark:text-secondary-400'}`}>
            {error || STATUS_MESSAGES[status]}
          </p>

          {/* Transcript */}
          {transcript && (
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl min-h-[60px]">
              <p className="text-lg text-secondary-900 dark:text-white">
                {transcript}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
            >
              إلغاء
            </button>
            <button
              onClick={onSearch}
              disabled={!transcript}
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بحث
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Microphone Icon Component
interface MicrophoneIconProps {
  isActive: boolean
  size?: number
}

function MicrophoneIcon({ isActive, size = 20 }: MicrophoneIconProps) {
  if (isActive) {
    // Animated waveform when active
    return (
      <div className="flex items-center justify-center gap-1" style={{ width: size, height: size }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-current rounded-full animate-pulse"
            style={{
              width: size / 5,
              height: '100%',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

export default VoiceSearch
