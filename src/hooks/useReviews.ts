'use client'

import { useState, useCallback, useEffect } from 'react'

interface Review {
  id: string
  product: { id: string; name?: string; nameAr?: string }
  customer: { id: string; name?: string; email?: string }
  rating: number
  title: string
  content: string
  pros: Array<{ text: string }>
  cons: Array<{ text: string }>
  images: Array<{ image: { url: string; alt?: string } }>
  verifiedPurchase: boolean
  helpfulVotes: number
  notHelpfulVotes: number
  status: 'pending' | 'approved' | 'rejected'
  adminReply?: string
  createdAt: string
  updatedAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  distribution: Record<number, number>
}

interface ReviewsResponse {
  docs: Review[]
  totalDocs: number
  totalPages: number
  page: number
  stats: ReviewStats
}

interface UseReviewsOptions {
  productId: string
  initialPage?: number
  limit?: number
  sort?: string
  autoFetch?: boolean
}

interface CreateReviewData {
  productId: string
  customerId: string
  rating: number
  title?: string
  content?: string
  pros?: string[]
  cons?: string[]
  images?: string[]
}

export function useReviews({
  productId,
  initialPage = 1,
  limit = 10,
  sort = '-createdAt',
  autoFetch = true,
}: UseReviewsOptions) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState(sort)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  const fetchReviews = useCallback(async (page = currentPage) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: limit.toString(),
        sort: sortBy,
        status: 'approved',
      })

      if (filterRating) {
        params.set('rating', filterRating.toString())
      }

      const response = await fetch(`/api/reviews?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data: ReviewsResponse = await response.json()
      setReviews(data.docs)
      setStats(data.stats)
      setTotalPages(data.totalPages)
      setCurrentPage(data.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }, [productId, currentPage, limit, sortBy, filterRating])

  const createReview = useCallback(async (data: CreateReviewData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create review')
      }

      return { success: true, review: result.review, message: result.message }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create review'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const voteOnReview = useCallback(async (
    reviewId: string,
    vote: 'helpful' | 'not_helpful',
    customerId?: string
  ) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote, customerId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to vote')
      }

      // Update local state
      setReviews(prev => prev.map(review =>
        review.id === reviewId
          ? {
              ...review,
              helpfulVotes: result.helpfulVotes,
              notHelpfulVotes: result.notHelpfulVotes,
            }
          : review
      ))

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to vote'
      }
    }
  }, [])

  const changePage = useCallback((page: number) => {
    setCurrentPage(page)
    fetchReviews(page)
  }, [fetchReviews])

  const changeSort = useCallback((newSort: string) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }, [])

  const changeRatingFilter = useCallback((rating: number | null) => {
    setFilterRating(rating)
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    if (autoFetch && productId) {
      fetchReviews()
    }
  }, [autoFetch, productId, sortBy, filterRating])

  return {
    reviews,
    stats,
    totalPages,
    currentPage,
    isLoading,
    error,
    sortBy,
    filterRating,
    fetchReviews,
    createReview,
    voteOnReview,
    changePage,
    changeSort,
    changeRatingFilter,
  }
}
