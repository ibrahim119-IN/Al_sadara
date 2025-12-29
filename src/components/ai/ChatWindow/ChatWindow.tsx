'use client'

import { useEffect, useRef } from 'react'
import { X, Trash2, RefreshCw } from 'lucide-react'
import { useAIChat } from '@/hooks/useAIChat'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'
import { QuickSuggestions } from './QuickSuggestions'

/**
 * Chat Window Component
 * Main AI chat interface
 *
 * Features:
 * - Full conversation display
 * - Streaming responses
 * - Message input
 * - Clear conversation
 * - Start new conversation
 * - Responsive (mobile/desktop)
 * - RTL support
 */

interface ChatWindowProps {
  locale: 'ar' | 'en'
}

export function ChatWindow({ locale }: ChatWindowProps) {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    startNewConversation,
    closeChat,
    clearError,
  } = useAIChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)
  }

  const handleClearChat = () => {
    if (confirm(locale === 'ar' ? 'هل تريد مسح المحادثة؟' : 'Clear conversation?')) {
      clearMessages()
    }
  }

  const handleNewConversation = () => {
    if (
      messages.length === 0 ||
      confirm(
        locale === 'ar' ? 'هل تريد بدء محادثة جديدة؟' : 'Start a new conversation?'
      )
    ) {
      startNewConversation()
    }
  }

  return (
    <div
      className={`
        fixed inset-0 md:inset-auto z-50
        ${locale === 'ar' ? 'md:left-6' : 'md:right-6'}
        md:bottom-24 md:top-auto
        md:w-96 md:h-[600px]
        bg-white
        md:rounded-2xl
        shadow-2xl
        flex flex-col
        animate-slide-up md:animate-fade-in
      `}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 md:rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">
              {locale === 'ar' ? 'مساعد ITs' : 'ITs Assistant'}
            </h3>
            <p className="text-xs text-white/80">
              {locale === 'ar' ? 'أونلاين الآن' : 'Online now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* New conversation button */}
          <button
            onClick={handleNewConversation}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={locale === 'ar' ? 'محادثة جديدة' : 'New conversation'}
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Clear chat button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={locale === 'ar' ? 'مسح المحادثة' : 'Clear chat'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Close button */}
          <button
            onClick={closeChat}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={locale === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-3 flex items-start justify-between">
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          /* Welcome Message */
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-primary-600"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {locale === 'ar' ? 'مرحباً بك!' : 'Welcome!'}
            </h3>

            <p className="text-gray-600 mb-6 max-w-sm">
              {locale === 'ar'
                ? 'أنا مساعدك الذكي من مجموعة ITs. يمكنني مساعدتك في اختيار المنتجات المناسبة (خامات بلاستيك أو إلكترونيات)، معرفة شركاتنا، والتواصل معنا.'
                : "I'm your AI assistant from ITs Group. I can help you choose the right products (plastics or electronics), learn about our companies, and get in touch with us."}
            </p>

            <div className="text-sm text-gray-500 space-y-2">
              <p className="font-semibold">
                {locale === 'ar' ? 'جرب السؤال عن:' : 'Try asking about:'}
              </p>
              <ul className="space-y-1 text-right">
                <li>• {locale === 'ar' ? 'ما هي شركاتكم؟' : 'What are your companies?'}</li>
                <li>
                  • {locale === 'ar' ? 'خامات بلاستيك PE أو PP' : 'PE or PP plastic materials'}
                </li>
                <li>• {locale === 'ar' ? 'كاميرات مراقبة' : 'Security cameras'}</li>
                <li>• {locale === 'ar' ? 'فرعكم في السعودية؟' : 'Your branch in Saudi Arabia?'}</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} locale={locale} />
            <div ref={messagesEndRef} />
          </>
        )}

        {/* Typing Indicator */}
        {isStreaming && <TypingIndicator locale={locale} />}
      </div>

      {/* Quick Suggestions - Only show when chat is empty or few messages */}
      {messages.length < 4 && !isLoading && !isStreaming && (
        <QuickSuggestions
          locale={locale}
          onSuggestionClick={handleSendMessage}
        />
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isStreaming={isStreaming}
        locale={locale}
      />
    </div>
  )
}
