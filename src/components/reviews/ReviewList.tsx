'use client'

import { useState } from 'react'
import { ReviewCard } from './ReviewCard'
import { RatingSummary } from './StarRating'
import { ChevronDown, Filter, SlidersHorizontal } from 'lucide-react'

interface Review {
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

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
  locale: 'ar' | 'en'
  onVote?: (reviewId: string | number, helpful: boolean) => void
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'

export function ReviewList({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  locale,
  onVote,
  onLoadMore,
  hasMore = false,
  loading = false,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const labels = {
    ar: {
      reviews: 'المراجعات',
      noReviews: 'لا توجد مراجعات بعد',
      beFirst: 'كن أول من يقيم هذا المنتج',
      sortBy: 'ترتيب حسب',
      newest: 'الأحدث',
      oldest: 'الأقدم',
      highest: 'الأعلى تقييماً',
      lowest: 'الأقل تقييماً',
      helpful: 'الأكثر فائدة',
      filterByRating: 'تصفية حسب التقييم',
      allRatings: 'جميع التقييمات',
      stars: 'نجوم',
      star: 'نجمة',
      loadMore: 'تحميل المزيد',
      loading: 'جاري التحميل...',
      showingOf: 'عرض',
      of: 'من',
    },
    en: {
      reviews: 'Reviews',
      noReviews: 'No reviews yet',
      beFirst: 'Be the first to review this product',
      sortBy: 'Sort by',
      newest: 'Newest',
      oldest: 'Oldest',
      highest: 'Highest Rated',
      lowest: 'Lowest Rated',
      helpful: 'Most Helpful',
      filterByRating: 'Filter by rating',
      allRatings: 'All ratings',
      stars: 'stars',
      star: 'star',
      loadMore: 'Load More',
      loading: 'Loading...',
      showingOf: 'Showing',
      of: 'of',
    },
  }

  const t = labels[locale]

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return b.helpfulVotes - a.helpfulVotes
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // Filter reviews
  const filteredReviews = filterRating
    ? sortedReviews.filter((review) => review.rating === filterRating)
    : sortedReviews

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t.newest },
    { value: 'oldest', label: t.oldest },
    { value: 'highest', label: t.highest },
    { value: 'lowest', label: t.lowest },
    { value: 'helpful', label: t.helpful },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.reviews} ({totalReviews})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors lg:hidden"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{locale === 'ar' ? 'تصفية' : 'Filter'}</span>
        </button>
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
          ratingDistribution={ratingDistribution}
          locale={locale}
        />
      )}

      {/* Filters & Sort */}
      <div className={`${showFilters ? 'block' : 'hidden lg:flex'} flex-col lg:flex-row gap-4 items-start lg:items-center justify-between`}>
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">{t.sortBy}:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-lg px-4 py-2 pe-10 text-sm text-secondary-700 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter by Rating */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-secondary-600 dark:text-secondary-400">{t.filterByRating}:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterRating === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600'
              }`}
            >
              {t.allRatings}
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating === filterRating ? null : rating)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filterRating === rating
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                }`}
              >
                {rating} {rating === 1 ? t.star : t.stars}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              locale={locale}
              onVote={onVote}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-secondary-500 dark:text-secondary-400 text-lg mb-2">
            {t.noReviews}
          </p>
          <p className="text-secondary-400 dark:text-secondary-500">
            {t.beFirst}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? t.loading : t.loadMore}
          </button>
        </div>
      )}

      {/* Showing count */}
      {filteredReviews.length > 0 && (
        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          {t.showingOf} {filteredReviews.length} {t.of} {totalReviews}
        </p>
      )}
    </div>
  )
}
