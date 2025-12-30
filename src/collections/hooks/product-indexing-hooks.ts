/**
 * Product Indexing Hooks
 * Automatically generates and maintains embeddings when products change
 *
 * Features:
 * - Auto-index on create/update (published products only)
 * - Auto-delete embeddings on product delete
 * - Debouncing to prevent rapid re-indexing
 * - Non-blocking (doesn't slow down admin operations)
 */

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { indexProduct, deleteProductEmbedding } from '@/lib/ai/rag/product-indexer'

// Debounce queue to prevent rapid re-indexing
const indexingQueue = new Map<string, NodeJS.Timeout>()
const DEBOUNCE_DELAY = 2000 // 2 seconds - wait for rapid changes to settle

/**
 * After Product Change Hook
 * Triggers embedding generation for published products
 */
export const afterProductChange: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only index published products
  if (doc.status !== 'published') {
    console.log(`[ProductHook] Skipping ${doc.id} - not published (status: ${doc.status})`)
    return doc
  }

  // Cancel any pending indexing for this product
  const existingTimeout = indexingQueue.get(String(doc.id))
  if (existingTimeout) {
    clearTimeout(existingTimeout)
    console.log(`[ProductHook] Cancelled pending indexing for ${doc.id}`)
  }

  // Schedule indexing with debounce (non-blocking)
  const timeout = setTimeout(async () => {
    try {
      console.log(`[ProductHook] Starting indexing for ${doc.id} (${operation})`)
      const startTime = Date.now()

      // Index for both locales in parallel
      const results = await Promise.allSettled([
        indexProduct(String(doc.id), 'ar'),
        indexProduct(String(doc.id), 'en'),
      ])

      // Log results
      const arResult = results[0].status === 'fulfilled' ? results[0].value : false
      const enResult = results[1].status === 'fulfilled' ? results[1].value : false

      const duration = Date.now() - startTime
      console.log(
        `[ProductHook] Indexing complete for ${doc.id}: AR=${arResult}, EN=${enResult} (${duration}ms)`
      )

      // Cleanup queue entry
      indexingQueue.delete(String(doc.id))
    } catch (error) {
      console.error(`[ProductHook] Error indexing ${doc.id}:`, error)
      indexingQueue.delete(String(doc.id))
    }
  }, DEBOUNCE_DELAY)

  indexingQueue.set(String(doc.id), timeout)
  console.log(`[ProductHook] Scheduled indexing for ${doc.id} (${operation})`)

  return doc
}

/**
 * After Product Delete Hook
 * Removes associated embeddings when a product is deleted
 */
export const afterProductDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    console.log(`[ProductHook] Deleting embeddings for product ${doc.id}`)

    // Cancel any pending indexing
    const existingTimeout = indexingQueue.get(String(doc.id))
    if (existingTimeout) {
      clearTimeout(existingTimeout)
      indexingQueue.delete(String(doc.id))
    }

    // Delete embeddings (non-blocking)
    deleteProductEmbedding(String(doc.id))
      .then((success) => {
        if (success) {
          console.log(`[ProductHook] Successfully deleted embeddings for ${doc.id}`)
        } else {
          console.warn(`[ProductHook] No embeddings found for ${doc.id}`)
        }
      })
      .catch((error) => {
        console.error(`[ProductHook] Error deleting embeddings for ${doc.id}:`, error)
      })
  } catch (error) {
    console.error(`[ProductHook] Error in delete hook for ${doc.id}:`, error)
  }

  return doc
}

/**
 * Get current indexing queue status
 * Useful for monitoring/debugging
 */
export function getIndexingQueueStatus(): {
  queueSize: number
  pendingProducts: string[]
} {
  return {
    queueSize: indexingQueue.size,
    pendingProducts: Array.from(indexingQueue.keys()),
  }
}

/**
 * Clear all pending indexing jobs
 * Useful for cleanup or testing
 */
export function clearIndexingQueue(): void {
  for (const timeout of indexingQueue.values()) {
    clearTimeout(timeout)
  }
  indexingQueue.clear()
  console.log('[ProductHook] Indexing queue cleared')
}
