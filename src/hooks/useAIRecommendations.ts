import { useState, useCallback } from 'react'
import type { Product } from '@/payload-types'

/**
 * Hook for AI Product Recommendations
 * Can be used on product pages, cart, checkout, etc.
 */

interface RecommendationParams {
  context: string
  category?: string
  budget?: number
  limit?: number
  locale?: 'ar' | 'en'
}

interface RecommendationResult {
  success: boolean
  products?: Product[]
  message?: string
  error?: string
}

export function useAIRecommendations() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  const getRecommendations = useCallback(async (params: RecommendationParams) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data: RecommendationResult = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'فشل الحصول على التوصيات')
      }

      setRecommendations(data.products || [])
      return data.products || []
    } catch (error: any) {
      console.error('[useAIRecommendations] Error:', error)
      setError(error.message || 'فشل الحصول على التوصيات')
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearRecommendations = useCallback(() => {
    setRecommendations([])
    setError(null)
  }, [])

  return {
    isLoading,
    recommendations,
    error,
    getRecommendations,
    clearRecommendations,
  }
}

export default useAIRecommendations
