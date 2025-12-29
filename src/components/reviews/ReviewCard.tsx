'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ThumbsUp, ThumbsDown, Check, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { StarRating } from './StarRating'
import { formatDistanceToNow } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

interface ReviewCardProps {
  review: {
    id: string | number
    title: string
    content: string
    rating: number
    pros?: { text: string }[]
    cons?: { text: string }[]
    images?: { image: { url: string; alt?: string } }[]
    verifiedPurchase?: boolean
    helpfulVotes: number
    notHelpfulVotes: number
    createdAt: string
    customer: {
      firstName: string
      lastName: string
    }
    adminReply?: string
    adminReplyDate?: string
  }
  locale: 'ar' | 'en'
  onVote?: (reviewId: string | number, helpful: boolean) => void
}

export function ReviewCard({ review, locale, onVote }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [voted, setVoted] = useState<'helpful' | 'not-helpful' | null>(null)

  const isRTL = locale === 'ar'
  const dateLocale = isRTL ? ar : enUS

  const labels = {
    ar: {
      verifiedPurchase: 'شراء موثق',
      pros: 'المميزات',
      cons: 'العيوب',
      helpful: 'مفيد',
      notHelpful: 'غير مفيد',
      peopleFoundHelpful: 'شخص وجد هذه المراجعة مفيدة',
      adminReply: 'رد الإدارة',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
    },
    en: {
      verifiedPurchase: 'Verified Purchase',
      pros: 'Pros',
      cons: 'Cons',
      helpful: 'Helpful',
      notHelpful: 'Not Helpful',
      peopleFoundHelpful: 'people found this helpful',
      adminReply: 'Store Response',
      showMore: 'Show more',
      showLess: 'Show less',
    },
  }

  const t = labels[locale]

  const handleVote = (helpful: boolean) => {
    if (voted) return
    setVoted(helpful ? 'helpful' : 'not-helpful')
    onVote?.(review.id, helpful)
  }

  const shouldTruncate = review.content.length > 300
  const displayContent = expanded ? review.content : review.content.slice(0, 300)

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {/* Customer Name & Verification */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-secondary-900 dark:text-white">
              {review.customer.firstName} {review.customer.lastName.charAt(0)}.
            </span>
            {review.verifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-xs text-success-600 dark:text-success-500">
                <Check className="w-3 h-3" />
                {t.verifiedPurchase}
              </span>
            )}
          </div>

          {/* Rating & Date */}
          <div className="flex items-center gap-3">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: dateLocale })}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">
        {review.title}
      </h4>

      {/* Content */}
      <p className="text-secondary-600 dark:text-secondary-300 whitespace-pre-line mb-4">
        {displayContent}
        {shouldTruncate && !expanded && '...'}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center gap-1 mb-4"
        >
          {expanded ? t.showLess : t.showMore}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}

      {/* Pros & Cons */}
      {(review.pros?.length || review.cons?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.pros && review.pros.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-success-600 dark:text-success-500 mb-2">
                {t.pros}
              </h5>
              <ul className="space-y-1">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                    <span className="text-success-600 dark:text-success-500">+</span>
                    {pro.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.cons && review.cons.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-error-600 dark:text-error-500 mb-2">
                {t.cons}
              </h5>
              <ul className="space-y-1">
                {review.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-secondary-600 dark:text-secondary-300">
                    <span className="text-error-600 dark:text-error-500">-</span>
                    {con.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowImages(!showImages)}
            className="text-primary-600 dark:text-primary-400 text-sm hover:underline mb-2"
          >
            {showImages ? t.showLess : `${review.images.length} ${isRTL ? 'صور' : 'images'}`}
          </button>
          {showImages && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {review.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={img.image.url}
                    alt={img.image.alt || `Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Admin Reply */}
      {review.adminReply && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="font-medium text-primary-700 dark:text-primary-300 text-sm">
              {t.adminReply}
            </span>
            {review.adminReplyDate && (
              <span className="text-xs text-secondary-500 dark:text-secondary-400">
                {formatDistanceToNow(new Date(review.adminReplyDate), { addSuffix: true, locale: dateLocale })}
              </span>
            )}
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-300">
            {review.adminReply}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700">
        <div className="text-sm text-secondary-500 dark:text-secondary-400">
          {review.helpfulVotes > 0 && (
            <span>
              {review.helpfulVotes} {t.peopleFoundHelpful}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(true)}
            disabled={voted !== null}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors
              ${voted === 'helpful'
                ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-300'
              }
              ${voted && voted !== 'helpful' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ThumbsUp className="w-4 h-4" />
            {t.helpful}
          </button>

          <button
            onClick={() => handleVote(false)}
            disabled={voted !== null}
            className={`
              flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors
              ${voted === 'not-helpful'
                ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-300'
              }
              ${voted && voted !== 'not-helpful' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ThumbsDown className="w-4 h-4" />
            {t.notHelpful}
          </button>
        </div>
      </div>
    </div>
  )
}
