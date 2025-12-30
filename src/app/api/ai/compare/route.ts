import { NextRequest, NextResponse } from 'next/server'
import { executeCompareProducts } from '@/lib/ai/functions/product-functions'

/**
 * AI Product Comparison API
 *
 * POST /api/ai/compare
 * Body: {
 *   productIds: string[]     // Array of 2-4 product IDs
 *   aspects?: string[]       // Specific aspects to compare
 *   locale?: 'ar' | 'en'
 * }
 *
 * Returns: {
 *   success: boolean
 *   comparison: {
 *     products: Product[]
 *     comparisonTable: Record<string, any>
 *     recommendation?: string
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds, aspects, locale = 'ar' } = body

    // Validation
    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        {
          success: false,
          error:
            locale === 'ar'
              ? 'يجب تقديم معرفات المنتجات كمصفوفة'
              : 'Product IDs must be an array',
        },
        { status: 400 }
      )
    }

    if (productIds.length < 2 || productIds.length > 4) {
      return NextResponse.json(
        {
          success: false,
          error: locale === 'ar' ? 'يمكن مقارنة 2-4 منتجات فقط' : 'Can compare 2-4 products only',
        },
        { status: 400 }
      )
    }

    console.log('[CompareAPI] Comparing products:', productIds)

    // Execute comparison function
    const result = await executeCompareProducts({
      productIds,
      aspects,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[CompareAPI] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء مقارنة المنتجات',
      },
      { status: 500 }
    )
  }
}
