'use client'

import { Bot } from 'lucide-react'

/**
 * Typing Indicator Component
 * Shows when AI is generating response
 *
 * Features:
 * - Animated dots
 * - Matches assistant message styling
 */

interface TypingIndicatorProps {
  locale: 'ar' | 'en'
}

export function TypingIndicator({ locale }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 items-start">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">
        <Bot className="w-5 h-5" />
      </div>

      {/* Typing Bubble */}
      <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
