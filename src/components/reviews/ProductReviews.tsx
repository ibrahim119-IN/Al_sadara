'use client'

import React, { useState, useCallback } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useReviews } from '@/hooks/useReviews'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'
import { RatingSummary } from './StarRating'

interface ProductReviewsProps {
  productId: string
  productName: string
  productNameAr?: string
  customerId?: string
  canReview?: boolean
}

export function ProductReviews({
  productId,
  productName,
  productNameAr,
  customerId,
  canReview = false,
}: ProductReviewsProps) {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'
  const [showForm, setShowForm] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    reviews,
    stats,
    totalPages,
    currentPage,
    isLoading,
    error,
    sortBy,
    filterRating,
    createReview,
    voteOnReview,
    changePage,
    changeSort,
    changeRatingFilter,
  } = useReviews({ productId })

  const handleSubmitReview = useCallback(async (data: {
    rating: number
    title: string
    content: string
    pros: string[]
    cons: string[]
    images: string[]
  }) => {
    if (!customerId) return

    const result = await createReview({
      productId,
      customerId,
      ...data,
    })

    if (result.success) {
      setShowForm(false)
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 5000)
    }
  }, [customerId, productId, createReview])

  const handleVote = useCallback(async (reviewId: string, vote: 'helpful' | 'not_helpful') => {
    await voteOnReview(reviewId, vote, customerId)
  }, [voteOnReview, customerId])

  const texts = {
    reviews: isArabic ? 'التقييمات والمراجعات' : 'Reviews & Ratings',
    writeReview: isArabic ? 'اكتب تقييم' : 'Write a Review',
    loginToReview: isArabic ? 'سجل دخول لكتابة تقييم' : 'Login to write a review',
    noReviews: isArabic ? 'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!' : 'No reviews yet. Be the first to review this product!',
    successMessage: isArabic ? 'شكراً! تم إرسال تقييمك وسيظهر بعد الموافقة عليه.' : 'Thank you! Your review has been submitted and will appear after approval.',
    cancelReview: isArabic ? 'إلغاء' : 'Cancel',
    reviewFor: isArabic ? 'تقييم لـ' : 'Review for',
  }

  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white">
          {texts.reviews}
        </h2>

        {canReview && customerId && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary px-6 py-3"
          >
            {texts.writeReview}
          </button>
        )}

        {!customerId && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {texts.loginToReview}
          </p>
        )}
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-green-700 dark:text-green-400 text-center">
            {texts.successMessage}
          </p>
        </div>
      )}

      {/* Review Form */}
      {showForm && customerId && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {texts.reviewFor} {isArabic ? productNameAr || productName : productName}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200"
            >
              {texts.cancelReview}
            </button>
          </div>
          <ReviewForm
            productId={productId}
            productName={isArabic ? productNameAr || productName : productName}
            locale={isArabic ? 'ar' : 'en'}
            onSubmit={handleSubmitReview as any}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Rating Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="mb-8">
          <RatingSummary
            averageRating={stats.averageRating}
            totalReviews={stats.totalReviews}
            ratingDistribution={stats.distribution as any}
            locale={isArabic ? 'ar' : 'en'}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Reviews List */}
      {!error && (
        <>
          {stats && stats.totalReviews > 0 ? (
            <ReviewList
              reviews={reviews as any}
              averageRating={stats?.averageRating || 0}
              totalReviews={stats?.totalReviews || 0}
              ratingDistribution={stats?.distribution as any || {}}
              locale={isArabic ? 'ar' : 'en'}
              onVote={handleVote as any}
              loading={isLoading}
            />
          ) : !isLoading ? (
            <div className="text-center py-12 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl">
              <svg
                className="w-16 h-16 mx-auto text-secondary-300 dark:text-secondary-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <p className="text-secondary-500 dark:text-secondary-400 text-lg">
                {texts.noReviews}
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
