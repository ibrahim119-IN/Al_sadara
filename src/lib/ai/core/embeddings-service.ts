import { getGeminiClient } from './gemini-client'
import type { EmbeddingVector } from '../types'
import { withTimeout, TIMEOUTS } from '@/lib/utils/timeout'

/**
 * Embeddings Service
 * Handles generation and caching of embeddings for text content
 */
export class EmbeddingsService {
  private geminiClient = getGeminiClient()
  private cache = new Map<string, EmbeddingVector>()

  /**
   * Generate embedding for a single text with caching
   */
  async generateEmbedding(text: string, useCache: boolean = true): Promise<EmbeddingVector> {
    // Normalize text for cache key
    const normalizedText = text.trim().toLowerCase()

    // Check cache first
    if (useCache && this.cache.has(normalizedText)) {
      console.log('[EmbeddingsService] Cache hit for embedding')
      return this.cache.get(normalizedText)!
    }

    // Generate new embedding with timeout
    const startTime = Date.now()
    const embedding = await withTimeout(
      this.geminiClient.generateEmbedding(text),
      TIMEOUTS.EMBEDDING,
      '[EmbeddingsService] Embedding generation timed out'
    )

    console.log(`[EmbeddingsService] Embedding generated in ${Date.now() - startTime}ms`)

    // Cache result
    if (useCache) {
      this.cache.set(normalizedText, embedding)
    }

    return embedding
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateEmbeddingsBatch(
    texts: string[],
    useCache: boolean = true
  ): Promise<EmbeddingVector[]> {
    const results: EmbeddingVector[] = []
    const textsToGenerate: string[] = []
    const indices: number[] = []

    // Check cache for each text
    for (let i = 0; i < texts.length; i++) {
      const normalizedText = texts[i].trim().toLowerCase()

      if (useCache && this.cache.has(normalizedText)) {
        results[i] = this.cache.get(normalizedText)!
      } else {
        textsToGenerate.push(texts[i])
        indices.push(i)
      }
    }

    // Generate embeddings for uncached texts with timeout
    if (textsToGenerate.length > 0) {
      const startTime = Date.now()
      const newEmbeddings = await withTimeout(
        this.geminiClient.generateEmbeddingsBatch(textsToGenerate),
        TIMEOUTS.EMBEDDING * 2, // Double timeout for batch
        '[EmbeddingsService] Batch embedding generation timed out'
      )
      console.log(`[EmbeddingsService] Batch of ${textsToGenerate.length} embeddings generated in ${Date.now() - startTime}ms`)

      // Store in cache and results
      for (let i = 0; i < newEmbeddings.length; i++) {
        const embedding = newEmbeddings[i]
        const originalIndex = indices[i]
        const normalizedText = texts[originalIndex].trim().toLowerCase()

        results[originalIndex] = embedding

        if (useCache) {
          this.cache.set(normalizedText, embedding)
        }
      }
    }

    return results
  }

  /**
   * Calculate cosine similarity between two embedding vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimension')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (normA * normB)
  }

  /**
   * Find most similar vectors from a list
   */
  findMostSimilar(
    queryVector: number[],
    vectors: Array<{ id: string; vector: number[]; metadata?: any }>,
    limit: number = 10,
    threshold: number = 0.0
  ): Array<{ id: string; similarity: number; metadata?: any }> {
    const similarities = vectors.map((item) => ({
      id: item.id,
      similarity: this.cosineSimilarity(queryVector, item.vector),
      metadata: item.metadata,
    }))

    // Filter by threshold and sort by similarity
    return similarities
      .filter((item) => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }

  /**
   * Clear the embedding cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    memoryEstimate: string
  } {
    const size = this.cache.size
    // Rough estimate: each embedding is ~768 floats * 8 bytes + overhead
    const bytesPerEmbedding = 768 * 8 + 100 // 100 bytes for overhead
    const totalBytes = size * bytesPerEmbedding
    const mb = (totalBytes / (1024 * 1024)).toFixed(2)

    return {
      size,
      memoryEstimate: `${mb} MB`,
    }
  }
}

// Singleton instance
let embeddingsServiceInstance: EmbeddingsService | null = null

/**
 * Get or create the embeddings service instance
 */
export function getEmbeddingsService(): EmbeddingsService {
  if (!embeddingsServiceInstance) {
    embeddingsServiceInstance = new EmbeddingsService()
  }
  return embeddingsServiceInstance
}
