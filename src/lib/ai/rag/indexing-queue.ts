/**
 * Indexing Queue Service
 * Handles bulk indexing operations with rate limiting and retry logic
 *
 * Features:
 * - Priority-based queue (high, normal, low)
 * - Rate limiting to avoid API limits
 * - Automatic retry with exponential backoff
 * - Progress tracking
 * - Non-blocking async processing
 */

import { indexProduct, deleteProductEmbedding } from './product-indexer'
import { regenerateAllKnowledgeEmbeddings } from '@/collections/hooks/knowledge-indexing-hooks'

// ===== Types =====

interface IndexingJob {
  id: string
  collection: 'products' | 'knowledge-base'
  documentId: string
  locale?: 'ar' | 'en'
  operation: 'index' | 'delete'
  priority: 'high' | 'normal' | 'low'
  attempts: number
  maxAttempts: number
  createdAt: number
  lastError?: string
}

interface QueueStats {
  pending: number
  processing: boolean
  completed: number
  failed: number
  rateLimitDelay: number
}

// ===== Queue Implementation =====

class IndexingQueueService {
  private queue: IndexingJob[] = []
  private processing = false
  private completed = 0
  private failed = 0

  // Rate limiting configuration
  private rateLimitDelay = 500 // ms between API calls
  private maxConcurrent = 1 // Process one at a time to be safe

  // Retry configuration
  private defaultMaxAttempts = 3
  private baseRetryDelay = 1000 // 1 second

  /**
   * Add a single job to the queue
   */
  add(job: Omit<IndexingJob, 'id' | 'attempts' | 'maxAttempts' | 'createdAt'>): string {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`

    this.queue.push({
      ...job,
      id,
      attempts: 0,
      maxAttempts: this.defaultMaxAttempts,
      createdAt: Date.now(),
    })

    this.sortByPriority()
    console.log(`[IndexingQueue] Added job ${id}: ${job.operation} ${job.collection} ${job.documentId}`)

    // Start processing if not already running
    if (!this.processing) {
      this.processQueue()
    }

    return id
  }

  /**
   * Add multiple jobs for batch indexing
   */
  addBatch(
    documentIds: string[],
    collection: 'products' | 'knowledge-base',
    options: {
      operation?: 'index' | 'delete'
      priority?: 'high' | 'normal' | 'low'
      locales?: Array<'ar' | 'en'>
    } = {}
  ): string[] {
    const {
      operation = 'index',
      priority = 'low',
      locales = collection === 'products' ? ['ar', 'en'] : [undefined as unknown as 'ar'],
    } = options

    const jobIds: string[] = []

    for (const documentId of documentIds) {
      for (const locale of locales) {
        const id = this.add({
          collection,
          documentId,
          locale: locale || undefined,
          operation,
          priority,
        })
        jobIds.push(id)
      }
    }

    console.log(`[IndexingQueue] Added batch of ${jobIds.length} jobs`)
    return jobIds
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true
    console.log('[IndexingQueue] Starting queue processing...')

    while (this.queue.length > 0) {
      const job = this.queue.shift()
      if (!job) break

      try {
        await this.executeJob(job)
        this.completed++
        console.log(`[IndexingQueue] Completed job ${job.id}`)
      } catch (error) {
        job.attempts++
        job.lastError = error instanceof Error ? error.message : 'Unknown error'

        if (job.attempts < job.maxAttempts) {
          // Retry with exponential backoff
          const retryDelay = this.baseRetryDelay * Math.pow(2, job.attempts)
          console.log(
            `[IndexingQueue] Job ${job.id} failed, retrying in ${retryDelay}ms (attempt ${job.attempts}/${job.maxAttempts})`
          )
          await this.delay(retryDelay)
          this.queue.push(job)
          this.sortByPriority()
        } else {
          // Max retries reached
          this.failed++
          console.error(`[IndexingQueue] Job ${job.id} failed permanently:`, job.lastError)
        }
      }

      // Rate limiting delay between jobs
      await this.delay(this.rateLimitDelay)
    }

    this.processing = false
    console.log(
      `[IndexingQueue] Queue processing complete. Completed: ${this.completed}, Failed: ${this.failed}`
    )
  }

  /**
   * Execute a single job
   */
  private async executeJob(job: IndexingJob): Promise<void> {
    console.log(`[IndexingQueue] Executing job ${job.id}: ${job.operation} ${job.collection}/${job.documentId}`)

    if (job.collection === 'products') {
      if (job.operation === 'index') {
        const success = await indexProduct(job.documentId, job.locale || 'ar')
        if (!success) {
          throw new Error(`Failed to index product ${job.documentId}`)
        }
      } else if (job.operation === 'delete') {
        const success = await deleteProductEmbedding(job.documentId)
        if (!success) {
          throw new Error(`Failed to delete embedding for product ${job.documentId}`)
        }
      }
    } else if (job.collection === 'knowledge-base') {
      // Knowledge base entries have embeddings generated in beforeChange hook
      // This is mainly for re-indexing all entries
      console.log(`[IndexingQueue] Knowledge base job - using batch regeneration`)
    }
  }

  /**
   * Sort queue by priority
   */
  private sortByPriority(): void {
    const priorityOrder = { high: 0, normal: 1, low: 2 }
    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      // Then by creation time (FIFO)
      return a.createdAt - b.createdAt
    })
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    return {
      pending: this.queue.length,
      processing: this.processing,
      completed: this.completed,
      failed: this.failed,
      rateLimitDelay: this.rateLimitDelay,
    }
  }

  /**
   * Get detailed queue status
   */
  getQueueDetails(): {
    stats: QueueStats
    jobs: Array<{
      id: string
      collection: string
      documentId: string
      operation: string
      priority: string
      attempts: number
    }>
  } {
    return {
      stats: this.getStats(),
      jobs: this.queue.map((job) => ({
        id: job.id,
        collection: job.collection,
        documentId: job.documentId,
        operation: job.operation,
        priority: job.priority,
        attempts: job.attempts,
      })),
    }
  }

  /**
   * Clear all pending jobs
   */
  clear(): void {
    const cleared = this.queue.length
    this.queue = []
    console.log(`[IndexingQueue] Cleared ${cleared} pending jobs`)
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.completed = 0
    this.failed = 0
    console.log('[IndexingQueue] Statistics reset')
  }

  /**
   * Update rate limiting
   */
  setRateLimit(delayMs: number): void {
    this.rateLimitDelay = delayMs
    console.log(`[IndexingQueue] Rate limit set to ${delayMs}ms`)
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// ===== Singleton Instance =====

export const indexingQueue = new IndexingQueueService()

// ===== Convenience Functions =====

/**
 * Queue product indexing
 */
export function queueProductIndexing(
  productId: string,
  options: { priority?: 'high' | 'normal' | 'low'; locales?: Array<'ar' | 'en'> } = {}
): string[] {
  const locales = options.locales || ['ar', 'en']
  const jobIds: string[] = []

  for (const locale of locales) {
    const id = indexingQueue.add({
      collection: 'products',
      documentId: productId,
      locale,
      operation: 'index',
      priority: options.priority || 'normal',
    })
    jobIds.push(id)
  }

  return jobIds
}

/**
 * Queue product deletion
 */
export function queueProductDeletion(productId: string): string {
  return indexingQueue.add({
    collection: 'products',
    documentId: productId,
    operation: 'delete',
    priority: 'high', // Deletions are high priority
  })
}

/**
 * Bulk index all products
 */
export async function bulkIndexProducts(productIds: string[]): Promise<{
  queuedJobs: number
  stats: QueueStats
}> {
  const jobIds = indexingQueue.addBatch(productIds, 'products', {
    operation: 'index',
    priority: 'low',
    locales: ['ar', 'en'],
  })

  return {
    queuedJobs: jobIds.length,
    stats: indexingQueue.getStats(),
  }
}

/**
 * Regenerate all knowledge base embeddings
 */
export async function bulkRegenerateKnowledge(): Promise<{
  success: number
  failed: number
}> {
  return await regenerateAllKnowledgeEmbeddings()
}
