'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showValue?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1
        const isFilled = value <= displayRating
        const isPartialFill = value > displayRating && value - 1 < displayRating
        const fillPercentage = isPartialFill ? (displayRating - (value - 1)) * 100 : 0

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`
              relative transition-transform
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${interactive && !isFilled ? 'hover:text-accent-400' : ''}
            `}
            aria-label={`${value} star${value !== 1 ? 's' : ''}`}
          >
            {/* Background star (empty) */}
            <Star
              className={`${sizeClasses[size]} text-secondary-200 dark:text-secondary-600`}
              fill="currentColor"
            />

            {/* Foreground star (filled) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: isFilled ? '100%' : `${fillPercentage}%` }}
            >
              <Star
                className={`${sizeClasses[size]} text-accent-500`}
                fill="currentColor"
              />
            </div>
          </button>
        )
      })}

      {showValue && (
        <span className={`${textSizeClasses[size]} text-secondary-600 dark:text-secondary-400 ms-2`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

interface RatingSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
  locale: 'ar' | 'en'
}

export function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  locale,
}: RatingSummaryProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution), 1)

  const labels = {
    ar: {
      reviews: 'مراجعة',
      outOf: 'من',
    },
    en: {
      reviews: 'reviews',
      outOf: 'out of',
    },
  }

  const t = labels[locale]

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl">
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-secondary-900 dark:text-white">
          {averageRating.toFixed(1)}
        </div>
        <StarRating rating={averageRating} size="lg" />
        <div className="text-secondary-500 dark:text-secondary-400 mt-2">
          {totalReviews} {t.reviews}
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingDistribution[stars] || 0
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

          return (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-secondary-600 dark:text-secondary-400 w-6 text-end">
                {stars}
              </span>
              <Star className="w-4 h-4 text-accent-500" fill="currentColor" />
              <div className="flex-1 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-secondary-500 dark:text-secondary-400 w-12">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
