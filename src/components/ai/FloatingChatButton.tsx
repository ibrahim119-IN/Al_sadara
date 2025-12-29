'use client'

import { MessageCircle, X } from 'lucide-react'
import { useAIChat } from '@/hooks/useAIChat'
import { ChatWindow } from './ChatWindow/ChatWindow'

/**
 * Floating Chat Button
 * Global AI assistant button that appears on all pages
 *
 * Features:
 * - Fixed position at bottom-right
 * - Opens chat window on click
 * - Shows unread message indicator
 * - Animated entrance
 * - RTL support
 */

interface FloatingChatButtonProps {
  locale: 'ar' | 'en'
}

export function FloatingChatButton({ locale }: FloatingChatButtonProps) {
  const { isChatOpen, toggleChat, messages } = useAIChat()

  // Check if there are any messages
  const hasMessages = messages.length > 0

  return (
    <>
      {/* Chat Window Modal */}
      {isChatOpen && <ChatWindow locale={locale} />}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-24 z-50
          ${locale === 'ar' ? 'left-6' : 'right-6'}
          w-14 h-14 md:w-16 md:h-16
          bg-primary-600 hover:bg-primary-700
          text-white
          rounded-full
          shadow-lg hover:shadow-xl
          transition-all duration-300
          flex items-center justify-center
          group
          animate-fade-in
        `}
        aria-label={isChatOpen ? 'إغلاق المساعد' : 'فتح المساعد الذكي'}
      >
        {isChatOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />

            {/* Unread indicator (pulse animation) */}
            {!hasMessages && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </>
        )}
      </button>

      {/* Tooltip on hover (desktop only) */}
      {!isChatOpen && (
        <div
          className={`
            fixed bottom-24 z-40
            ${locale === 'ar' ? 'left-24' : 'right-24'}
            px-4 py-2
            bg-gray-900 text-white text-sm
            rounded-lg
            shadow-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none
            hidden md:block
            whitespace-nowrap
          `}
        >
          {locale === 'ar' ? 'مساعد ITs الذكي' : 'ITs AI Assistant'}
        </div>
      )}
    </>
  )
}
