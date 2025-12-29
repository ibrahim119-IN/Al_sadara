'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { VoiceInput } from './VoiceInput'

/**
 * Message Input Component
 * Input field for sending messages to AI
 *
 * Features:
 * - Auto-expanding textarea
 * - Enter to send, Shift+Enter for new line
 * - Character limit indicator
 * - Loading state
 * - Mobile keyboard optimization
 */

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>
  isLoading: boolean
  isStreaming: boolean
  locale: 'ar' | 'en'
}

const MAX_LENGTH = 2000

export function MessageInput({ onSendMessage, isLoading, isStreaming, locale }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const disabled = isLoading || isStreaming

  const handleSubmit = async () => {
    if (!message.trim() || disabled) return

    const messageToSend = message.trim()
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await onSendMessage(messageToSend)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value

    if (value.length <= MAX_LENGTH) {
      setMessage(value)

      // Auto-expand textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
      }
    }
  }

  const charsRemaining = MAX_LENGTH - message.length
  const showCharCount = message.length > MAX_LENGTH * 0.8

  return (
    <div className="border-t border-gray-200 p-4 bg-white md:rounded-b-2xl">
      <div className="flex gap-2 items-end">
        {/* Voice Input */}
        <VoiceInput
          locale={locale}
          onTranscript={(text) => setMessage((prev) => prev + (prev ? ' ' : '') + text)}
          disabled={disabled}
        />

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'
            }
            disabled={disabled}
            rows={1}
            className={`
              w-full px-4 py-3
              border border-gray-300 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              resize-none
              text-sm
              ${locale === 'ar' ? 'text-right' : 'text-left'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              transition-colors
            `}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />

          {/* Character count */}
          {showCharCount && (
            <div
              className={`
                absolute bottom-1 ${locale === 'ar' ? 'left-2' : 'right-2'}
                text-xs
                ${charsRemaining < 100 ? 'text-red-500' : 'text-gray-400'}
              `}
            >
              {charsRemaining}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={`
            w-12 h-12 flex-shrink-0
            bg-primary-600 text-white
            rounded-xl
            flex items-center justify-center
            transition-all duration-200
            ${
              disabled || !message.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-700 active:scale-95'
            }
          `}
          title={locale === 'ar' ? 'إرسال' : 'Send'}
        >
          {isLoading || isStreaming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 mt-2">
        {locale === 'ar'
          ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد'
          : 'Press Enter to send, Shift+Enter for new line'}
      </p>
    </div>
  )
}
