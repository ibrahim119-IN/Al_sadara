import { getEmbeddingsService } from '../core/embeddings-service'
import type { VectorSearchOptions, VectorSearchResult, Product } from '../types'
import { withTimeout, withTimeoutFallback, TIMEOUTS } from '@/lib/utils/timeout'
import { getCachedPayload } from '@/lib/payload-client'

/**
 * Vector Search
 * Performs semantic search on product embeddings using cosine similarity
 */

/**
 * Search for products using vector similarity
 */
export async function searchProducts(options: VectorSearchOptions): Promise<VectorSearchResult[]> {
  try {
    const {
      query,
      locale = 'ar',
      limit = 5,
      similarityThreshold = 0.7,
      filters = {},
    } = options

    const startTime = Date.now()
    console.log(`[VectorSearch] Starting search for: "${query}"`)

    const payload = await getCachedPayload()
    const embeddingsService = getEmbeddingsService()

    // Generate embedding for the query with timeout
    const queryEmbedding = await withTimeout(
      embeddingsService.generateEmbedding(query),
      TIMEOUTS.EMBEDDING,
      '[VectorSearch] Query embedding generation timed out'
    )

    console.log(`[VectorSearch] Embedding generated in ${Date.now() - startTime}ms`)

    // Fetch product embeddings for the specified locale (reduced limit for performance)
    const where: any = {
      locale: { equals: locale },
    }

    const embeddingsResult = await withTimeout(
      payload.find({
        collection: 'product-embeddings',
        where,
        limit: 200, // Reduced from 1000 for better performance
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Fetch embeddings timed out'
    )

    if (embeddingsResult.docs.length === 0) {
      console.warn('[VectorSearch] No product embeddings found. Please run indexing first.')
      return []
    }

    console.log(`[VectorSearch] Found ${embeddingsResult.docs.length} embeddings for locale: ${locale}`)
    console.log(`[VectorSearch] Using similarity threshold: ${similarityThreshold}`)

    // Calculate similarities
    const similarities = embeddingsResult.docs
      .map((doc) => {
        // Extract embedding values from the array format
        const embeddingValues = doc.embedding?.map((item: any) => item.value) || []

        if (embeddingValues.length === 0) {
          console.warn(`[VectorSearch] Empty embedding for product:`, doc.product)
          return null
        }

        const similarity = embeddingsService.cosineSimilarity(
          queryEmbedding.values,
          embeddingValues
        )

        // Debug: Log similarity scores
        if (similarity > 0.2) {
          const productName = typeof doc.product === 'object' ? (doc.product as any).name : doc.product
          console.log(`[VectorSearch] Similarity for "${productName}": ${similarity.toFixed(3)}`)
        }

        return {
          embeddingDoc: doc,
          similarity,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .filter((item) => item.similarity >= similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit * 2) // Get more than needed for filtering

    // Fetch full product details
    const productIds = similarities.map((item) => {
      const productId =
        typeof item.embeddingDoc.product === 'string'
          ? item.embeddingDoc.product
          : item.embeddingDoc.product.id
      return productId
    })

    const products = await withTimeout(
      payload.find({
        collection: 'products',
        where: {
          id: { in: productIds },
        },
        limit: productIds.length,
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Fetch products timed out'
    )

    console.log(`[VectorSearch] Search completed in ${Date.now() - startTime}ms`)

    // Create a map for quick product lookup
    const productMap = new Map(products.docs.map((p) => [p.id, p]))

    // Build results with filtering
    const results: VectorSearchResult[] = []

    for (const item of similarities) {
      const productId =
        typeof item.embeddingDoc.product === 'string'
          ? item.embeddingDoc.product
          : item.embeddingDoc.product.id

      const product = productMap.get(productId)
      if (!product) continue

      // Apply filters
      if (filters.category) {
        const productCategory =
          typeof product.category === 'object' && product.category !== null
            ? product.category.slug
            : product.category
        if (productCategory !== filters.category) continue
      }

      if (filters.brand && product.brand !== filters.brand) {
        continue
      }

      if (filters.priceRange) {
        if (filters.priceRange.min && product.price && product.price < filters.priceRange.min) {
          continue
        }
        if (filters.priceRange.max && product.price && product.price > filters.priceRange.max) {
          continue
        }
      }

      results.push({
        product,
        similarity: item.similarity,
        text: item.embeddingDoc.text || '',
        metadata: item.embeddingDoc.metadata,
      })

      if (results.length >= limit) break
    }

    console.log(
      `[VectorSearch] Found ${results.length} products for query: "${query}" (locale: ${locale})`
    )

    return results
  } catch (error) {
    console.error('[VectorSearch] Error searching products:', error)
    // Return empty array instead of throwing to allow AI to continue without product results
    return []
  }
}

/**
 * Find similar products to a given product
 */
export async function findSimilarProducts(
  productId: string,
  limit: number = 5,
  locale: 'ar' | 'en' = 'ar'
): Promise<VectorSearchResult[]> {
  try {
    const payload = await getCachedPayload()
    const embeddingsService = getEmbeddingsService()

    // Get the product's embedding with timeout
    const productEmbedding = await withTimeout(
      payload.find({
        collection: 'product-embeddings',
        where: {
          and: [{ product: { equals: productId } }, { locale: { equals: locale } }],
        },
        limit: 1,
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Find product embedding timed out'
    )

    if (productEmbedding.docs.length === 0) {
      console.warn(`[VectorSearch] No embedding found for product ${productId}`)
      return []
    }

    const targetEmbedding = productEmbedding.docs[0].embedding?.map((item: any) => item.value) || []

    if (targetEmbedding.length === 0) {
      return []
    }

    // Get all other product embeddings with timeout
    const allEmbeddings = await withTimeout(
      payload.find({
        collection: 'product-embeddings',
        where: {
          and: [
            { product: { not_equals: productId } }, // Exclude the target product
            { locale: { equals: locale } },
          ],
        },
        limit: 200, // Reduced from 1000 for better performance
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Fetch all embeddings timed out'
    )

    // Calculate similarities
    const similarities = allEmbeddings.docs
      .map((doc) => {
        const embeddingValues = doc.embedding?.map((item: any) => item.value) || []
        if (embeddingValues.length === 0) return null

        const similarity = embeddingsService.cosineSimilarity(targetEmbedding, embeddingValues)

        return {
          embeddingDoc: doc,
          similarity,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    // Fetch product details
    const productIds = similarities.map((item) => {
      const id =
        typeof item.embeddingDoc.product === 'string'
          ? item.embeddingDoc.product
          : item.embeddingDoc.product.id
      return id
    })

    const products = await withTimeout(
      payload.find({
        collection: 'products',
        where: {
          id: { in: productIds },
        },
        limit: productIds.length,
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Fetch similar products timed out'
    )

    const productMap = new Map(products.docs.map((p) => [p.id, p]))

    const results: VectorSearchResult[] = similarities
      .map((item) => {
        const id =
          typeof item.embeddingDoc.product === 'string'
            ? item.embeddingDoc.product
            : item.embeddingDoc.product.id

        const product = productMap.get(id)
        if (!product) return null

        return {
          product,
          similarity: item.similarity,
          text: item.embeddingDoc.text || '',
          metadata: item.embeddingDoc.metadata,
        }
      })
      .filter((item): item is VectorSearchResult => item !== null)

    console.log(`[VectorSearch] Found ${results.length} similar products for ${productId}`)

    return results
  } catch (error) {
    console.error('[VectorSearch] Error finding similar products:', error)
    // Return empty array instead of throwing
    return []
  }
}

/**
 * Hybrid search: Combines vector search with keyword matching
 */
export async function hybridSearch(
  query: string,
  locale: 'ar' | 'en' = 'ar',
  limit: number = 10
): Promise<VectorSearchResult[]> {
  try {
    const payload = await getCachedPayload()

    // 1. Vector search (already has timeouts)
    const vectorResults = await searchProducts({
      query,
      locale,
      limit: limit * 2, // Get more for merging
    })

    // 2. Keyword search with timeout
    const keywordResults = await withTimeout(
      payload.find({
        collection: 'products',
        where: {
          or: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { brand: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        limit: limit * 2,
      }),
      TIMEOUTS.DB_QUERY,
      '[VectorSearch] Keyword search timed out'
    )

    // 3. Merge results (prefer vector search, but boost keyword matches)
    const resultMap = new Map<string, VectorSearchResult>()

    // Add vector results
    for (const result of vectorResults) {
      resultMap.set(result.product.id, result)
    }

    // Add/boost keyword results
    for (const product of keywordResults.docs) {
      if (resultMap.has(product.id)) {
        // Boost similarity for keyword matches
        const existing = resultMap.get(product.id)!
        existing.similarity = Math.min(1.0, existing.similarity * 1.2)
      } else {
        // Add new keyword result with default similarity
        resultMap.set(product.id, {
          product,
          similarity: 0.6, // Default similarity for keyword-only matches
          text: product.name || '',
        })
      }
    }

    // Sort by similarity and limit
    const results = Array.from(resultMap.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    console.log(`[VectorSearch] Hybrid search found ${results.length} products for: "${query}"`)

    return results
  } catch (error) {
    console.error('[VectorSearch] Error in hybrid search:', error)
    // Return empty array instead of throwing
    return []
  }
}

/**
 * Search knowledge base (policies, FAQs) using vector similarity
 */
export async function searchKnowledgeBase(
  query: string,
  locale: 'ar' | 'en' = 'ar',
  type?: 'policy' | 'faq' | 'guide',
  limit: number = 3
): Promise<any[]> {
  try {
    const startTime = Date.now()
    console.log(`[VectorSearch] Starting knowledge base search for: "${query}"`)

    const payload = await getCachedPayload()
    const embeddingsService = getEmbeddingsService()

    // Generate query embedding with timeout
    const queryEmbedding = await withTimeout(
      embeddingsService.generateEmbedding(query),
      TIMEOUTS.EMBEDDING,
      '[VectorSearch] Query embedding generation timed out'
    )

    // Build where clause
    const where: any = {
      and: [{ locale: { equals: locale } }, { isActive: { equals: true } }],
    }

    if (type) {
      where.and.push({ type: { equals: type } })
    }

    // Fetch knowledge base entries with timeout
    const kbEntries = await withTimeout(
      payload.find({
        collection: 'knowledge-base',
        where,
        limit: 50, // Reduced from 100 for better performance
      }),
      TIMEOUTS.KNOWLEDGE_SEARCH,
      '[VectorSearch] Fetch knowledge base timed out'
    )

    if (kbEntries.docs.length === 0) {
      return []
    }

    // Calculate similarities
    const similarities = kbEntries.docs
      .map((doc) => {
        // ✅ FIX: Handle both array and object formats
        let embeddingValues: number[]
        if (Array.isArray(doc.embedding)) {
          // If it's already an array of numbers
          embeddingValues = doc.embedding as number[]
        } else if (doc.embedding && typeof doc.embedding === 'object') {
          // Check if it has .values property (Gemini format)
          if ((doc.embedding as any).values) {
            embeddingValues = (doc.embedding as any).values
          } else {
            // If it's array of objects with .value
            embeddingValues = (doc.embedding as any[]).map((item: any) => item.value || item) || []
          }
        } else {
          embeddingValues = []
        }

        if (embeddingValues.length === 0) {
          console.warn(`[VectorSearch] No embedding for KB entry: ${doc.id}`)
          return null
        }

        // Ensure query embedding is also extracted from values
        const queryValues = queryEmbedding.values || queryEmbedding

        const similarity = embeddingsService.cosineSimilarity(queryValues, embeddingValues)

        return {
          doc,
          similarity,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    const results = similarities.map((item) => ({
      ...item.doc,
      similarity: item.similarity,
    }))

    console.log(
      `[VectorSearch] Found ${results.length} knowledge base entries for: "${query}" (type: ${type || 'all'}) in ${Date.now() - startTime}ms`
    )

    return results
  } catch (error) {
    console.error('[VectorSearch] Error searching knowledge base:', error)
    // Return empty array instead of throwing
    return []
  }
}
