import { NextRequest, NextResponse } from 'next/server'
import { indexAllProducts, indexProduct } from '@/lib/ai/rag/product-indexer'

/**
 * Product Embeddings Indexing API
 * Generates and stores embeddings for products to enable semantic search
 *
 * POST /api/ai/embeddings/index
 * Body: {
 *   action: 'index_all' | 'index_one',
 *   productId?: string (required if action === 'index_one')
 * }
 *
 * This endpoint should be called:
 * - After adding new products
 * - After updating product descriptions
 * - Once initially to index all existing products
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, productId } = body

    console.log('[EmbeddingsAPI] Indexing request:', { action, productId })

    if (action === 'index_all') {
      console.log('[EmbeddingsAPI] Starting full product indexing...')

      const result = await indexAllProducts()

      console.log('[EmbeddingsAPI] Indexing complete:', result)

      return NextResponse.json({
        success: true,
        message: 'تم فهرسة جميع المنتجات بنجاح',
        ...result,
      })
    } else if (action === 'index_one') {
      if (!productId) {
        return NextResponse.json(
          {
            success: false,
            error: 'productId is required for index_one action',
          },
          { status: 400 }
        )
      }

      console.log('[EmbeddingsAPI] Indexing single product:', productId)

      const result = await indexProduct(productId)

      console.log('[EmbeddingsAPI] Product indexed:', result)

      return NextResponse.json({
        success: true,
        message: 'تم فهرسة المنتج بنجاح',
        ...result,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "index_all" or "index_one"',
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('[EmbeddingsAPI] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'فشل في فهرسة المنتجات',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to check indexing status
 */
export async function GET(request: NextRequest) {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@/payload.config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Count total products
    const products = await payload.find({
      collection: 'products',
      limit: 0, // Just get count
    })

    // Count indexed products (with embeddings)
    const embeddings = await payload.find({
      collection: 'product-embeddings',
      limit: 0,
    })

    const totalProducts = products.totalDocs
    const indexedProducts = embeddings.totalDocs
    const percentage = totalProducts > 0 ? Math.round((indexedProducts / totalProducts) * 100) : 0

    return NextResponse.json({
      totalProducts,
      indexedProducts,
      percentage,
      isComplete: totalProducts === indexedProducts && totalProducts > 0,
    })
  } catch (error: any) {
    console.error('[EmbeddingsAPI] Status check error:', error)

    return NextResponse.json(
      {
        error: error.message || 'Failed to check indexing status',
      },
      { status: 500 }
    )
  }
}
