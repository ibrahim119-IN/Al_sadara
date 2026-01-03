'use client'

import { useEffect, useRef } from 'react'
import { Sparkles, Trash2, RefreshCw, History } from 'lucide-react'
import { useAIChat } from '@/hooks/useAIChat'
import { MessageList } from '@/components/ai/ChatWindow/MessageList'
import { MessageInput } from '@/components/ai/ChatWindow/MessageInput'
import { TypingIndicator } from '@/components/ai/ChatWindow/TypingIndicator'

/**
 * AI Assistant Page Content
 * Full-page AI chat interface
 *
 * Features:
 * - Full-screen chat
 * - Conversation history sidebar (future)
 * - Quick action buttons
 * - Better for extended conversations
 */

interface AIAssistantContentProps {
  locale: 'ar' | 'en'
  dict: any
}

export function AIAssistantContent({ locale, dict }: AIAssistantContentProps) {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    startNewConversation,
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {locale === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {locale === 'ar'
                    ? 'مساعدك الشخصي لاختيار أفضل حلول الأمان'
                    : 'Your personal guide to the best security solutions'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* History button (future feature) */}
              <button
                onClick={() => alert(locale === 'ar' ? 'قريباً' : 'Coming soon')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                title={locale === 'ar' ? 'سجل المحادثات' : 'Conversation history'}
              >
                <History className="w-5 h-5" />
                <span className="hidden md:inline">
                  {locale === 'ar' ? 'السجل' : 'History'}
                </span>
              </button>

              {/* New conversation */}
              <button
                onClick={handleNewConversation}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2"
                title={locale === 'ar' ? 'محادثة جديدة' : 'New conversation'}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="hidden md:inline">
                  {locale === 'ar' ? 'جديد' : 'New'}
                </span>
              </button>

              {/* Clear chat */}
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  title={locale === 'ar' ? 'مسح المحادثة' : 'Clear chat'}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden md:inline">
                    {locale === 'ar' ? 'مسح' : 'Clear'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
              <p className="text-red-600 text-sm flex-1">{error}</p>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {messages.length === 0 ? (
                /* Welcome Screen */
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <Sparkles className="w-14 h-14 text-white" />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {locale === 'ar' ? 'مرحباً بك!' : 'Welcome!'}
                  </h2>

                  <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                    {locale === 'ar'
                      ? 'أنا مساعدك الذكي المختص بخامات البلاستيك والبوليمرات. يمكنني مساعدتك في:'
                      : "I'm your AI assistant specialized in plastic raw materials and polymers. I can help you with:"}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                    {/* Quick Action Cards */}
                    <QuickActionCard
                      icon="🧪"
                      title={locale === 'ar' ? 'اختيار الخامات المناسبة' : 'Choose Right Materials'}
                      description={locale === 'ar' ? 'ساعدني في اختيار الخامة المناسبة لاحتياجاتي' : 'Help me choose the right material for my needs'}
                      onClick={() => sendMessage(locale === 'ar' ? 'أحتاج خامات لصناعة الأنابيب' : 'I need materials for pipe manufacturing')}
                    />
                    <QuickActionCard
                      icon="♻️"
                      title={locale === 'ar' ? 'خامات معاد تدويرها' : 'Recycled Materials'}
                      description={locale === 'ar' ? 'استكشف خياراتنا من الخامات المعاد تدويرها' : 'Explore our recycled material options'}
                      onClick={() => sendMessage(locale === 'ar' ? 'ما هي الخامات المعاد تدويرها المتوفرة؟' : 'What recycled materials are available?')}
                    />
                    <QuickActionCard
                      icon="💰"
                      title={locale === 'ar' ? 'طلب عرض سعر' : 'Request Quote'}
                      description={locale === 'ar' ? 'احصل على أسعار تنافسية لمتطلباتك' : 'Get competitive prices for your requirements'}
                      onClick={() => sendMessage(locale === 'ar' ? 'أريد عرض سعر لـ 5 طن HDPE' : 'I need a quote for 5 tons of HDPE')}
                    />
                    <QuickActionCard
                      icon="🔍"
                      title={locale === 'ar' ? 'مقارنة الخامات' : 'Compare Materials'}
                      description={locale === 'ar' ? 'قارن بين أنواع البوليمرات المختلفة' : 'Compare different polymer types'}
                      onClick={() => sendMessage(locale === 'ar' ? 'قارن بين HDPE و LDPE' : 'Compare HDPE and LDPE')}
                    />
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

            {/* Input Area */}
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isStreaming={isStreaming}
              locale={locale}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {locale === 'ar'
              ? 'المساعد الذكي مدعوم بتقنية Google Gemini AI'
              : 'AI Assistant powered by Google Gemini'}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Quick Action Card Component
 */
interface QuickActionCardProps {
  icon: string
  title: string
  description: string
  onClick: () => void
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border-2 border-gray-200 hover:border-primary-500 rounded-xl p-6 text-left transition-all hover:shadow-lg group"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  )
}
