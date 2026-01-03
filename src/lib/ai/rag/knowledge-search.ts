// @ts-nocheck
import { GeminiClient } from '../core/gemini-client'
import { getCachedPayload } from '@/lib/payload-client'
import { withTimeout, TIMEOUTS } from '@/lib/utils/timeout'

/**
 * Knowledge Base Search
 * Search for relevant policies and FAQs using vector similarity
 */

export interface KnowledgeSearchOptions {
  query: string
  locale?: 'ar' | 'en'
  type?: 'policy' | 'faq'
  category?: string
  limit?: number
  similarityThreshold?: number
}

export interface KnowledgeSearchResult {
  id: string
  title: string
  content: string
  type: 'policy' | 'faq'
  category: string
  similarity: number
  metadata?: Record<string, any>
}

const geminiClient = new GeminiClient()

/**
 * Search knowledge base using vector similarity
 */
export async function searchKnowledge(
  options: KnowledgeSearchOptions
): Promise<KnowledgeSearchResult[]> {
  const {
    query,
    locale = 'ar',
    type,
    category,
    limit = 5,
    similarityThreshold = 0.3, // ✅ OPTIMIZED: Lower threshold for better recall, will re-rank
  } = options

  try {
    console.log('[KnowledgeSearch] Searching for:', query)

    // Generate embedding for query with timeout
    const queryEmbedding = await withTimeout(
      geminiClient.generateEmbedding(query),
      TIMEOUTS.EMBEDDING,
      '[KnowledgeSearch] Query embedding generation timed out'
    )
    console.log(`[KnowledgeSearch] Query embedding dimension: ${queryEmbedding.length}`)

    const payload = await getCachedPayload()

    // Build filters
    const where: any = {
      locale: { equals: locale },
    }

    if (type) {
      where.type = { equals: type }
    }

    if (category) {
      where.category = { equals: category }
    }

    // Fetch all knowledge base items with filters
    const results = await withTimeout(
      payload.find({
        collection: 'knowledge-base',
        where,
        limit: 100, // Get more for better similarity ranking
      }),
      TIMEOUTS.KNOWLEDGE_SEARCH,
      '[KnowledgeSearch] Find knowledge base items timed out'
    )

    console.log(`[KnowledgeSearch] Found ${results.docs.length} knowledge base items`)

    // Calculate cosine similarity for each item
    const scoredResults = results.docs
      .map((doc) => {
        const embedding = doc.embedding as number[]

        if (!embedding || embedding.length === 0) {
          console.warn(`[KnowledgeSearch] No embedding for: ${doc.slug}`)
          return null
        }

        // ✅ ADD: Check if embedding is array or needs parsing
        let embeddingArray: number[]
        if (Array.isArray(embedding)) {
          embeddingArray = embedding
        } else if (typeof embedding === 'object' && embedding !== null) {
          // May be stored as object, convert to array
          embeddingArray = Object.values(embedding)
        } else {
          console.warn(`[KnowledgeSearch] Invalid embedding format for: ${doc.slug}`)
          return null
        }

        console.log(
          `[KnowledgeSearch] ${doc.slug}: embedding dimension = ${embeddingArray.length}, query dimension = ${queryEmbedding.length}`
        )

        if (embeddingArray.length !== queryEmbedding.length) {
          console.warn(
            `[KnowledgeSearch] Dimension mismatch for ${doc.slug}: ${embeddingArray.length} !== ${queryEmbedding.length} - SKIPPING`
          )
          return null
        }

        const similarity = cosineSimilarity(queryEmbedding, embeddingArray)

        console.log(`[KnowledgeSearch] ${doc.slug}: similarity = ${similarity.toFixed(3)}`)

        return {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          type: doc.type as 'policy' | 'faq',
          category: doc.category,
          similarity,
          metadata: doc.metadata as Record<string, any>,
        }
      })
      .filter((result): result is KnowledgeSearchResult => result !== null)
      .filter((result) => {
        const passed = result.similarity >= similarityThreshold
        if (!passed) {
          console.log(
            `[KnowledgeSearch] Filtered out ${result.id}: ${result.similarity.toFixed(3)} < ${similarityThreshold}`
          )
        }
        return passed
      })
      // ✅ ADD: Re-rank by combining similarity with keyword matching
      .map((result) => {
        const queryLower = query.toLowerCase()
        const titleLower = result.title.toLowerCase()
        const contentLower = result.content.toLowerCase().substring(0, 500)

        // Boost score if query keywords appear in title or content
        let boost = 0
        const queryWords = queryLower.split(/\s+/)
        queryWords.forEach((word) => {
          if (word.length < 3) return // Skip short words
          if (titleLower.includes(word)) boost += 0.15
          if (contentLower.includes(word)) boost += 0.05
        })

        return {
          ...result,
          finalScore: Math.min(1.0, result.similarity + boost),
        }
      })
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, limit)

    console.log(
      `[KnowledgeSearch] Returning ${scoredResults.length} results (threshold: ${similarityThreshold})`
    )

    return scoredResults
  } catch (error: any) {
    console.error('[KnowledgeSearch] Error:', error)
    // Return empty array instead of throwing to allow AI to continue
    return []
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Get specific policy by category
 */
export async function getPolicy(
  category: string,
  locale: 'ar' | 'en' = 'ar'
): Promise<string | null> {
  try {
    const payload = await getCachedPayload()

    const result = await withTimeout(
      payload.find({
        collection: 'knowledge-base',
        where: {
          type: { equals: 'policy' },
          category: { equals: category },
          locale: { equals: locale },
        },
        limit: 1,
      }),
      TIMEOUTS.KNOWLEDGE_SEARCH,
      '[KnowledgeSearch] Get policy timed out'
    )

    if (result.docs.length > 0) {
      return result.docs[0].content
    }

    return null
  } catch (error: any) {
    console.error('[KnowledgeSearch] Error getting policy:', error)
    return null
  }
}

/**
 * Get FAQs by category
 */
export async function getFAQs(
  category: string,
  locale: 'ar' | 'en' = 'ar'
): Promise<string | null> {
  try {
    const payload = await getCachedPayload()

    const result = await withTimeout(
      payload.find({
        collection: 'knowledge-base',
        where: {
          type: { equals: 'faq' },
          category: { equals: category },
          locale: { equals: locale },
        },
        limit: 1,
      }),
      TIMEOUTS.KNOWLEDGE_SEARCH,
      '[KnowledgeSearch] Get FAQs timed out'
    )

    if (result.docs.length > 0) {
      return result.docs[0].content
    }

    return null
  } catch (error: any) {
    console.error('[KnowledgeSearch] Error getting FAQs:', error)
    return null
  }
}
