/**
 * RAG Consistency Checker
 *
 * Utilities for maintaining data consistency between:
 * - Products and their embeddings
 * - Knowledge Base entries and their embeddings
 *
 * Features:
 * - Orphan embedding cleanup
 * - Missing embedding detection
 * - Reindex stale embeddings
 */

import { getPayload } from 'payload'
import config from '@/payload.config'
import { indexProduct } from './product-indexer'
import { indexingQueue } from './indexing-queue'

// ===== Types =====

interface ConsistencyReport {
  products: {
    total: number
    indexed: number
    missing: string[]
    orphans: string[]
  }
  knowledgeBase: {
    total: number
    withEmbeddings: number
    missing: string[]
  }
  recommendations: string[]
}

interface CleanupResult {
  orphansDeleted: number
  errors: string[]
}

// ===== Orphan Cleanup =====

/**
 * Find and delete orphan embeddings
 * Orphans are embeddings for products that no longer exist
 */
export async function cleanupOrphanEmbeddings(): Promise<CleanupResult> {
  const payload = await getPayload({ config })

  console.log('[ConsistencyChecker] Starting orphan cleanup...')

  let orphansDeleted = 0
  const errors: string[] = []

  try {
    // Get all product embeddings
    const embeddings = await payload.find({
      collection: 'product-embeddings',
      limit: 10000,
    })

    console.log(`[ConsistencyChecker] Checking ${embeddings.docs.length} embeddings...`)

    // Check each embedding's product reference
    for (const embedding of embeddings.docs) {
      const productId =
        typeof embedding.product === 'object'
          ? (embedding.product as { id: number }).id
          : embedding.product

      if (!productId) {
        // No product reference - delete orphan
        try {
          await payload.delete({
            collection: 'product-embeddings',
            id: embedding.id,
          })
          orphansDeleted++
          console.log(`[ConsistencyChecker] Deleted orphan embedding (no product ref): ${embedding.id}`)
        } catch (err) {
          errors.push(`Failed to delete orphan ${embedding.id}: ${err}`)
        }
        continue
      }

      try {
        // Try to find the product
        await payload.findByID({
          collection: 'products',
          id: productId,
        })
        // Product exists, embedding is valid
      } catch {
        // Product not found - delete orphan
        try {
          await payload.delete({
            collection: 'product-embeddings',
            id: embedding.id,
          })
          orphansDeleted++
          console.log(`[ConsistencyChecker] Deleted orphan embedding for product ${productId}`)
        } catch (err) {
          errors.push(`Failed to delete orphan ${embedding.id}: ${err}`)
        }
      }
    }

    console.log(`[ConsistencyChecker] Cleanup complete. Deleted ${orphansDeleted} orphans.`)
    if (errors.length > 0) {
      console.error(`[ConsistencyChecker] ${errors.length} errors during cleanup`)
    }

    return { orphansDeleted, errors }
  } catch (error) {
    console.error('[ConsistencyChecker] Error during cleanup:', error)
    return { orphansDeleted, errors: [String(error)] }
  }
}

// ===== Consistency Check =====

/**
 * Run a full consistency check
 * Returns a report of missing and orphan embeddings
 */
export async function checkConsistency(): Promise<ConsistencyReport> {
  const payload = await getPayload({ config })

  console.log('[ConsistencyChecker] Running consistency check...')

  // Get all published products
  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 10000,
  })

  // Get all product embeddings
  const embeddings = await payload.find({
    collection: 'product-embeddings',
    limit: 10000,
  })

  // Build sets for comparison
  const productIds = new Set(products.docs.map((p) => String(p.id)))
  const embeddingProductIds = new Set<string>()
  const embeddingIds = new Set<string>()

  for (const emb of embeddings.docs) {
    const productId =
      typeof emb.product === 'object'
        ? String((emb.product as { id: number }).id)
        : String(emb.product)
    embeddingProductIds.add(productId)
    embeddingIds.add(String(emb.id))
  }

  // Find missing embeddings (products without embeddings)
  const missing: string[] = []
  for (const productId of productIds) {
    if (!embeddingProductIds.has(productId)) {
      missing.push(productId)
    }
  }

  // Find orphan embeddings (embeddings without products)
  const orphans: string[] = []
  for (const emb of embeddings.docs) {
    const productId =
      typeof emb.product === 'object'
        ? String((emb.product as { id: number }).id)
        : String(emb.product)
    if (!productIds.has(productId)) {
      orphans.push(String(emb.id))
    }
  }

  // Check knowledge base
  const knowledgeBase = await payload.find({
    collection: 'knowledge-base',
    where: { isActive: { equals: true } },
    limit: 1000,
  })

  const kbWithEmbeddings = knowledgeBase.docs.filter(
    (doc) => doc.embedding && Array.isArray(doc.embedding) && doc.embedding.length > 0
  )

  const kbMissing = knowledgeBase.docs
    .filter((doc) => !doc.embedding || !Array.isArray(doc.embedding) || doc.embedding.length === 0)
    .map((doc) => String(doc.id))

  // Build recommendations
  const recommendations: string[] = []

  if (missing.length > 0) {
    recommendations.push(
      `Run bulk indexing for ${missing.length} products without embeddings`
    )
  }

  if (orphans.length > 0) {
    recommendations.push(
      `Run cleanupOrphanEmbeddings() to remove ${orphans.length} orphan embeddings`
    )
  }

  if (kbMissing.length > 0) {
    recommendations.push(
      `Update ${kbMissing.length} knowledge base entries to generate embeddings`
    )
  }

  const report: ConsistencyReport = {
    products: {
      total: products.totalDocs,
      indexed: embeddingProductIds.size,
      missing,
      orphans,
    },
    knowledgeBase: {
      total: knowledgeBase.totalDocs,
      withEmbeddings: kbWithEmbeddings.length,
      missing: kbMissing,
    },
    recommendations,
  }

  console.log('[ConsistencyChecker] Check complete.')
  console.log(`  Products: ${report.products.total} total, ${report.products.indexed} indexed`)
  console.log(`  Missing: ${report.products.missing.length}, Orphans: ${report.products.orphans.length}`)
  console.log(`  Knowledge Base: ${report.knowledgeBase.total} total, ${report.knowledgeBase.withEmbeddings} with embeddings`)

  return report
}

// ===== Reindex Missing =====

/**
 * Queue reindexing for all products missing embeddings
 */
export async function reindexMissing(): Promise<{
  queued: number
  productIds: string[]
}> {
  const report = await checkConsistency()

  if (report.products.missing.length === 0) {
    console.log('[ConsistencyChecker] No missing embeddings to reindex')
    return { queued: 0, productIds: [] }
  }

  console.log(`[ConsistencyChecker] Queueing ${report.products.missing.length} products for reindexing`)

  // Add all missing products to the indexing queue
  indexingQueue.addBatch(report.products.missing, 'products', {
    operation: 'index',
    priority: 'normal',
    locales: ['ar', 'en'],
  })

  return {
    queued: report.products.missing.length,
    productIds: report.products.missing,
  }
}

// ===== Scheduled Maintenance =====

/**
 * Run all maintenance tasks
 * Suitable for cron jobs or scheduled tasks
 */
export async function runMaintenance(): Promise<{
  consistency: ConsistencyReport
  cleanup: CleanupResult
  reindex: { queued: number }
}> {
  console.log('[ConsistencyChecker] Starting maintenance run...')

  // Step 1: Check consistency
  const consistency = await checkConsistency()

  // Step 2: Cleanup orphans
  const cleanup = await cleanupOrphanEmbeddings()

  // Step 3: Reindex missing
  const reindex = await reindexMissing()

  console.log('[ConsistencyChecker] Maintenance complete.')

  return { consistency, cleanup, reindex }
}
