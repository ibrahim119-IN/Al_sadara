'use client'

import { User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message as MessageType } from '@/lib/ai/types'
import { AIProductCard } from '../ProductCard/AIProductCard'
import { ProductComparison } from '../ProductCard/ProductComparison'
import { BudgetSolution } from '../ProductCard/BudgetSolution'

/**
 * Message Component
 * Displays a single message (user or assistant)
 *
 * Features:
 * - Different styling for user/assistant
 * - Visual components (product cards, comparison, budget)
 * - Markdown support with ReactMarkdown
 * - Timestamp (future enhancement)
 */

interface MessageProps {
  message: MessageType
  locale: 'ar' | 'en'
}

export function Message({ message, locale }: MessageProps) {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  // Don't display system messages
  if (message.role === 'system') {
    return null
  }

  // Check if message has visual components
  const hasProducts = message.products && message.products.length > 0
  const hasComparison = message.comparison && message.comparison.products.length >= 2
  const hasBudgetSolution = message.budgetSolution && message.budgetSolution.items.length > 0

  return (
    <div
      className={`
        flex gap-3 items-start
        ${isUser ? 'flex-row-reverse' : ''}
      `}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-700'}
        `}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-[85%]">
        {/* Text Message Bubble */}
        {message.content && (
          <div
            className={`
              px-4 py-3 rounded-2xl
              ${
                isUser
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
              }
            `}
          >
            {isUser ? (
              // User messages - plain text
              <div
                className={`
                  text-sm leading-relaxed whitespace-pre-wrap
                  ${isUser ? 'text-right' : locale === 'ar' ? 'text-right' : 'text-left'}
                `}
              >
                {message.content}
              </div>
            ) : (
              // Assistant messages - Markdown rendering
              <div
                className={`
                  prose prose-sm max-w-none
                  ${locale === 'ar' ? 'text-right prose-headings:text-right' : 'text-left'}
                  prose-p:my-1 prose-p:leading-relaxed
                  prose-ul:my-1 prose-ol:my-1
                  prose-li:my-0.5
                  prose-headings:my-2 prose-headings:font-semibold
                  prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
                  prose-strong:text-gray-900
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                  prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded-lg prose-pre:text-xs
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                `}
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Function Calls Indicator (for debugging) */}
            {message.functionCalls && message.functionCalls.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-60">
                {locale === 'ar' ? 'استخدم' : 'Used'}:{' '}
                {message.functionCalls.map((fc) => fc.name).join(', ')}
              </div>
            )}
          </div>
        )}

        {/* Visual Components Section */}
        {isAssistant && (hasProducts || hasComparison || hasBudgetSolution) && (
          <div className="mt-3 space-y-3">
            {/* Product Cards Grid */}
            {hasProducts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {message.products!.map((product) => (
                  <AIProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            )}

            {/* Product Comparison Table */}
            {hasComparison && (
              <div>
                <ProductComparison
                  products={message.comparison!.products}
                  locale={locale}
                  comparisonAspects={message.comparison!.aspects}
                />
              </div>
            )}

            {/* Budget Solution Display */}
            {hasBudgetSolution && (
              <div>
                <BudgetSolution
                  budget={message.budgetSolution!.budget}
                  items={message.budgetSolution!.items}
                  totalCost={message.budgetSolution!.totalCost}
                  locale={locale}
                  alternatives={message.budgetSolution!.alternatives}
                  notes={message.budgetSolution!.notes}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
