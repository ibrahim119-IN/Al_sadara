/**
 * Gemini Embeddings Service
 * Uses gemini-embedding-001 with flexible dimensions
 * Includes in-memory caching for better performance
 */
import { getGeminiClient, MODELS, CONFIG } from './client'
import { EmbeddingOptions, EmbeddingResult, BatchEmbeddingResult, GeminiError, GeminiErrorCodes } from './types'
import { getPayload } from 'payload'
import config from '@/payload.config'

// ===== Embedding Cache =====
interface CacheEntry {
  values: number[]
  dimensions: number
  timestamp: number
}

// In-memory cache for embeddings (LRU-style with TTL)
const embeddingCache = new Map<string, CacheEntry>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour
const MAX_CACHE_SIZE = 500 // Max entries

/**
 * Generate cache key from text and options
 */
function getCacheKey(text: string, dimensions: number): string {
  // Create a simple hash for the cache key
  const textHash = hashText(text)
  return `${textHash}_${dimensions}`
}

/**
 * Clean expired cache entries
 */
function cleanCache(): void {
  const now = Date.now()
  for (const [key, entry] of embeddingCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      embeddingCache.delete(key)
    }
  }

  // If still too large, remove oldest entries
  if (embeddingCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(embeddingCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)

    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE)
    for (const [key] of toRemove) {
      embeddingCache.delete(key)
    }
  }
}

/**
 * Get embedding from cache if available
 */
function getFromCache(key: string): CacheEntry | undefined {
  const entry = embeddingCache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry
  }
  return undefined
}

/**
 * Store embedding in cache
 */
function storeInCache(key: string, values: number[], dimensions: number): void {
  // Clean cache periodically
  if (embeddingCache.size > MAX_CACHE_SIZE * 0.9) {
    cleanCache()
  }

  embeddingCache.set(key, {
    values,
    dimensions,
    timestamp: Date.now(),
  })
}

/**
 * Clear embedding cache
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear()
  console.log('[Embeddings] Cache cleared')
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number; ttlMs: number } {
  return {
    size: embeddingCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlMs: CACHE_TTL,
  }
}

/**
 * Generate embedding for a single text
 * Uses caching for repeated queries
 */
export async function generateEmbedding(
  text: string,
  options: EmbeddingOptions = {}
): Promise<EmbeddingResult> {
  const { dimensions = CONFIG.EMBEDDING_DIMENSIONS, taskType } = options

  // Check cache first (only for retrieval queries which are repetitive)
  if (taskType === 'RETRIEVAL_QUERY') {
    const cacheKey = getCacheKey(text, dimensions)
    const cached = getFromCache(cacheKey)
    if (cached) {
      console.log('[Embeddings] Cache hit for:', text.substring(0, 50))
      return {
        values: cached.values,
        dimensions: cached.dimensions,
      }
    }
  }

  try {
    const ai = getGeminiClient()

    const result = await ai.models.embedContent({
      model: MODELS.EMBEDDING,
      contents: [text],
      config: {
        outputDimensionality: dimensions,
        ...(taskType && { taskType }),
      },
    })

    if (!result.embeddings?.[0]?.values) {
      throw new GeminiError(
        'No embedding returned from API',
        GeminiErrorCodes.EMBEDDING_ERROR
      )
    }

    const embeddingResult = {
      values: result.embeddings[0].values,
      dimensions: result.embeddings[0].values.length,
    }

    // Store in cache for retrieval queries
    if (taskType === 'RETRIEVAL_QUERY') {
      const cacheKey = getCacheKey(text, dimensions)
      storeInCache(cacheKey, embeddingResult.values, embeddingResult.dimensions)
      console.log('[Embeddings] Cached:', text.substring(0, 50))
    }

    return embeddingResult
  } catch (error) {
    if (error instanceof GeminiError) throw error

    throw new GeminiError(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
      GeminiErrorCodes.EMBEDDING_ERROR,
      undefined,
      true // retryable
    )
  }
}

/**
 * Generate embeddings for multiple texts (batch processing)
 */
export async function generateBatchEmbeddings(
  texts: string[],
  options: EmbeddingOptions = {}
): Promise<BatchEmbeddingResult> {
  const { dimensions = CONFIG.EMBEDDING_DIMENSIONS, taskType } = options

  try {
    const ai = getGeminiClient()

    // Process in parallel for efficiency
    const promises = texts.map((text) =>
      ai.models.embedContent({
        model: MODELS.EMBEDDING,
        contents: [text],
        config: {
          outputDimensionality: dimensions,
          ...(taskType && { taskType }),
        },
      })
    )

    const results = await Promise.all(promises)

    const embeddings: EmbeddingResult[] = results.map((result) => ({
      values: result.embeddings?.[0]?.values || [],
      dimensions: result.embeddings?.[0]?.values?.length || 0,
    }))

    return {
      embeddings,
      totalTokens: texts.reduce((sum, text) => sum + estimateTokens(text), 0),
    }
  } catch (error) {
    throw new GeminiError(
      `Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      GeminiErrorCodes.EMBEDDING_ERROR,
      undefined,
      true
    )
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB)
  return magnitude === 0 ? 0 : dotProduct / magnitude
}

/**
 * Find similar products by embedding
 */
export async function findSimilarByEmbedding(
  queryEmbedding: number[],
  limit: number = 10,
  minSimilarity: number = 0.7
): Promise<Array<{ id: string; similarity: number }>> {
  try {
    const payload = await getPayload({ config })

    // Fetch all product embeddings
    const embeddings = await payload.find({
      collection: 'product-embeddings',
      limit: 1000, // Adjust based on your product count
    })

    // Calculate similarities
    const similarities = embeddings.docs
      .map((doc) => {
        // Extract product ID from relationship
        const productId = typeof doc.product === 'number' ? String(doc.product) : String((doc.product as { id: number })?.id || '')
        // Extract embedding values from array of objects
        const embeddingValues = Array.isArray(doc.embedding)
          ? (doc.embedding as Array<{ value?: number | null }>).map((e) => e.value || 0)
          : []
        return {
          id: productId,
          similarity: cosineSimilarity(queryEmbedding, embeddingValues),
        }
      })
      .filter((item) => item.id && item.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return similarities
  } catch (error) {
    console.error('Error finding similar products:', error)
    return []
  }
}

/**
 * Index a product (generate and store its embedding)
 */
export async function indexProduct(product: {
  id: string | number
  name: string
  description?: string
  category?: string
}): Promise<void> {
  // Ensure ID is a number for Payload
  const productId = typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
  // Create searchable text from product data
  const searchableText = [
    product.name,
    product.description || '',
    product.category || '',
  ]
    .filter(Boolean)
    .join(' ')
    .slice(0, 2000) // Limit text length

  const { values } = await generateEmbedding(searchableText, {
    taskType: 'RETRIEVAL_DOCUMENT',
  })

  const payload = await getPayload({ config })

  // Check if embedding already exists
  const existing = await payload.find({
    collection: 'product-embeddings',
    where: {
      product: { equals: productId },
    },
  })

  // Convert flat array to Payload array format
  const embeddingData = values.map((value) => ({ value }))

  if (existing.docs.length > 0) {
    // Update existing
    await payload.update({
      collection: 'product-embeddings',
      id: existing.docs[0].id,
      data: {
        embedding: embeddingData,
        text: searchableText,
      },
    })
  } else {
    // Create new
    await payload.create({
      collection: 'product-embeddings',
      data: {
        product: productId,
        embedding: embeddingData,
        text: searchableText,
        locale: 'ar', // Default locale
      },
    })
  }
}

/**
 * Search products by semantic similarity
 */
export async function semanticSearch(
  query: string,
  options: {
    limit?: number
    minSimilarity?: number
    category?: string
  } = {}
): Promise<Array<{ productId: string; similarity: number }>> {
  const { limit = 10, minSimilarity = 0.6 } = options

  // Generate query embedding
  const { values: queryEmbedding } = await generateEmbedding(query, {
    taskType: 'RETRIEVAL_QUERY',
  })

  // Find similar products
  const results = await findSimilarByEmbedding(queryEmbedding, limit, minSimilarity)
  // Map id to productId for backward compatibility
  return results.map((r) => ({ productId: r.id, similarity: r.similarity }))
}

/**
 * Batch index multiple products
 */
export async function batchIndexProducts(
  products: Array<{
    id: string
    name: string
    description?: string
    category?: string
  }>
): Promise<{ indexed: number; errors: number }> {
  let indexed = 0
  let errors = 0

  // Process in batches of 10
  const batchSize = 10

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)

    const promises = batch.map(async (product) => {
      try {
        await indexProduct(product)
        indexed++
      } catch (error) {
        console.error(`Error indexing product ${product.id}:`, error)
        errors++
      }
    })

    await Promise.all(promises)

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < products.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return { indexed, errors }
}

// ===== Helper Functions =====

/**
 * Estimate token count (rough approximation)
 */
function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English, ~2 for Arabic
  const hasArabic = /[\u0600-\u06FF]/.test(text)
  const charsPerToken = hasArabic ? 2 : 4
  return Math.ceil(text.length / charsPerToken)
}

/**
 * Create a hash of text for change detection
 */
function hashText(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}
