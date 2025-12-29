'use client'

import { useState, useCallback, useEffect } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

/**
 * Voice Input Component
 * Uses Web Speech API for voice-to-text
 */

interface VoiceInputProps {
  locale: 'ar' | 'en'
  onTranscript: (text: string) => void
  disabled?: boolean
}

// Check if browser supports Speech Recognition
const isSpeechSupported = typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

export function VoiceInput({ locale, onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(isSpeechSupported)
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported || disabled) return

    try {
      // Create speech recognition instance
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      // Configure
      recognition.lang = locale === 'ar' ? 'ar-EG' : 'en-US'
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        if (transcript) {
          onTranscript(transcript)
        }
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.error('[VoiceInput] Error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error('[VoiceInput] Failed to start:', error)
      setIsListening(false)
    }
  }, [locale, onTranscript, isSupported, disabled])

  // Don't render if not supported
  if (!isSupported) {
    return null
  }

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={disabled || isListening}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isListening
          ? 'bg-red-100 text-red-600 animate-pulse'
          : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={
        isListening
          ? locale === 'ar' ? 'جاري الاستماع...' : 'Listening...'
          : locale === 'ar' ? 'تحدث' : 'Speak'
      }
    >
      {isListening ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  )
}

export default VoiceInput
