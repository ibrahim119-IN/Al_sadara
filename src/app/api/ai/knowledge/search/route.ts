import { NextRequest, NextResponse } from 'next/server'
import { searchKnowledge } from '@/lib/ai/rag/knowledge-search'

/**
 * API endpoint to search knowledge base
 * POST /api/ai/knowledge/search
 *
 * Body:
 * {
 *   query: string
 *   locale?: 'ar' | 'en'
 *   type?: 'policy' | 'faq'
 *   category?: string
 *   limit?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, locale = 'ar', type, category, limit = 5 } = body

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query is required',
        },
        { status: 400 }
      )
    }

    console.log('[API] Searching knowledge base:', { query, locale, type, category })

    const results = await searchKnowledge({
      query,
      locale,
      type,
      category,
      limit,
    })

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
    })
  } catch (error: any) {
    console.error('[API] Error searching knowledge base:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search knowledge base',
      },
      { status: 500 }
    )
  }
}
