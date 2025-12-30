/**
 * AI System Health Check API
 *
 * GET /api/ai/health
 *
 * Returns comprehensive health information about the AI system:
 * - Gemini API status
 * - Product embeddings coverage
 * - Knowledge base status
 * - Indexing queue status
 */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { isGeminiConfigured } from '@/lib/gemini'
import { indexingQueue } from '@/lib/ai/rag/indexing-queue'

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  components: {
    gemini: {
      status: 'up' | 'down' | 'unconfigured'
      message?: string
    }
    products: {
      total: number
      indexed: number
      coverage: string
      status: 'healthy' | 'degraded' | 'needs_indexing'
    }
    knowledgeBase: {
      total: number
      withEmbeddings: number
      coverage: string
      status: 'healthy' | 'degraded' | 'needs_indexing'
    }
    indexingQueue: {
      pending: number
      processing: boolean
      completed: number
      failed: number
    }
  }
  recommendations?: string[]
}

export async function GET() {
  const startTime = Date.now()

  try {
    const payload = await getPayload({ config })

    // 1. Check Gemini configuration
    const geminiConfigured = isGeminiConfigured()

    // 2. Get product statistics
    const [publishedProducts, productEmbeddings] = await Promise.all([
      payload.count({
        collection: 'products',
        where: { status: { equals: 'published' } },
      }),
      payload.count({
        collection: 'product-embeddings',
      }),
    ])

    // Calculate product coverage
    // Each product should have 2 embeddings (ar + en)
    const expectedEmbeddings = publishedProducts.totalDocs * 2
    const productCoverage =
      expectedEmbeddings > 0
        ? (productEmbeddings.totalDocs / expectedEmbeddings) * 100
        : 0

    // 3. Get knowledge base statistics
    const activeKnowledge = await payload.find({
      collection: 'knowledge-base',
      where: { isActive: { equals: true } },
      limit: 1000,
    })

    const knowledgeWithEmbeddings = activeKnowledge.docs.filter(
      (doc) => doc.embedding && Array.isArray(doc.embedding) && doc.embedding.length > 0
    ).length

    const knowledgeCoverage =
      activeKnowledge.totalDocs > 0
        ? (knowledgeWithEmbeddings / activeKnowledge.totalDocs) * 100
        : 0

    // 4. Get indexing queue status
    const queueStats = indexingQueue.getStats()

    // 5. Build recommendations
    const recommendations: string[] = []

    if (!geminiConfigured) {
      recommendations.push('Configure GEMINI_API_KEY environment variable')
    }

    if (productCoverage < 50) {
      recommendations.push(
        `Only ${productCoverage.toFixed(0)}% of products are indexed. Run bulk indexing.`
      )
    }

    if (knowledgeCoverage < 100 && activeKnowledge.totalDocs > 0) {
      recommendations.push(
        `${activeKnowledge.totalDocs - knowledgeWithEmbeddings} knowledge base entries need embeddings`
      )
    }

    if (queueStats.failed > 0) {
      recommendations.push(
        `${queueStats.failed} indexing jobs failed. Check logs for details.`
      )
    }

    // 6. Determine overall status
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

    if (!geminiConfigured) {
      overallStatus = 'unhealthy'
    } else if (productCoverage < 50 || knowledgeCoverage < 50) {
      overallStatus = 'degraded'
    } else if (productCoverage < 90 || knowledgeCoverage < 90) {
      overallStatus = 'degraded'
    }

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      components: {
        gemini: {
          status: geminiConfigured ? 'up' : 'unconfigured',
          message: geminiConfigured
            ? 'Gemini API is configured'
            : 'GEMINI_API_KEY not set',
        },
        products: {
          total: publishedProducts.totalDocs,
          indexed: Math.floor(productEmbeddings.totalDocs / 2), // Divide by 2 (ar/en)
          coverage: `${productCoverage.toFixed(1)}%`,
          status:
            productCoverage >= 90
              ? 'healthy'
              : productCoverage >= 50
                ? 'degraded'
                : 'needs_indexing',
        },
        knowledgeBase: {
          total: activeKnowledge.totalDocs,
          withEmbeddings: knowledgeWithEmbeddings,
          coverage: `${knowledgeCoverage.toFixed(1)}%`,
          status:
            knowledgeCoverage >= 90
              ? 'healthy'
              : knowledgeCoverage >= 50
                ? 'degraded'
                : 'needs_indexing',
        },
        indexingQueue: {
          pending: queueStats.pending,
          processing: queueStats.processing,
          completed: queueStats.completed,
          failed: queueStats.failed,
        },
      },
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    }

    const duration = Date.now() - startTime

    return NextResponse.json(
      {
        ...result,
        _meta: {
          duration: `${duration}ms`,
        },
      },
      {
        status: overallStatus === 'unhealthy' ? 503 : 200,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    )
  } catch (error) {
    console.error('[HealthCheck] Error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
