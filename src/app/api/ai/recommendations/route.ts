import { NextRequest, NextResponse } from 'next/server'
import { executeGetRecommendations } from '@/lib/ai/functions/product-functions'

/**
 * AI Product Recommendations API
 *
 * POST /api/ai/recommendations
 * Body: {
 *   context: string          // Description of customer needs
 *   category?: string        // Filter by category
 *   budget?: number          // Maximum budget
 *   limit?: number           // Number of recommendations (default: 5)
 *   locale?: 'ar' | 'en'
 * }
 *
 * Returns: {
 *   success: boolean
 *   products: Product[]
 *   message?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { context, category, budget, limit = 5, locale = 'ar' } = body

    // Validation
    if (!context || typeof context !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: locale === 'ar' ? 'يجب تقديم وصف للاحتياجات' : 'Context is required',
        },
        { status: 400 }
      )
    }

    console.log('[RecommendationsAPI] Getting recommendations for:', context.substring(0, 100))

    // Execute recommendation function
    const result = await executeGetRecommendations({
      context,
      category,
      budget,
      limit,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[RecommendationsAPI] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء جلب التوصيات',
      },
      { status: 500 }
    )
  }
}
