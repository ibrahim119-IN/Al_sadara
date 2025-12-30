import { NextRequest, NextResponse } from 'next/server'
import { executeCalculateBudgetSolution } from '@/lib/ai/functions/product-functions'

/**
 * AI Budget Planning API
 *
 * POST /api/ai/budget-planner
 * Body: {
 *   budget: number                        // Total budget in EGP
 *   requirements: string                  // Description of needs
 *   priority?: 'quality' | 'balanced' | 'budget'
 *   locale?: 'ar' | 'en'
 * }
 *
 * Returns: {
 *   success: boolean
 *   solution: {
 *     products: Array<{product: Product, quantity: number}>
 *     totalPrice: number
 *     remainingBudget: number
 *     recommendations: string[]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { budget, requirements, priority = 'balanced', locale = 'ar' } = body

    // Validation
    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: locale === 'ar' ? 'يجب تقديم ميزانية صحيحة' : 'Valid budget is required',
        },
        { status: 400 }
      )
    }

    if (!requirements || typeof requirements !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error:
            locale === 'ar'
              ? 'يجب تقديم وصف للاحتياجات'
              : 'Requirements description is required',
        },
        { status: 400 }
      )
    }

    if (priority && !['quality', 'balanced', 'budget'].includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          error:
            locale === 'ar'
              ? 'الأولوية يجب أن تكون: quality, balanced, أو budget'
              : 'Priority must be: quality, balanced, or budget',
        },
        { status: 400 }
      )
    }

    console.log('[BudgetPlannerAPI] Planning budget:', budget, 'EGP for:', requirements)

    // Execute budget calculation function
    const result = await executeCalculateBudgetSolution({
      budget,
      requirements,
      priority,
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[BudgetPlannerAPI] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'حدث خطأ أثناء التخطيط للميزانية',
      },
      { status: 500 }
    )
  }
}
