// @ts-nocheck
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getEmbeddingsService } from '../core/embeddings-service'
import type { Product } from '@/payload-types'

/**
 * Product Indexer
 * Generates and stores embeddings for products to enable semantic search
 */

/**
 * Build searchable text from product data
 * Combines name, description, specifications, and metadata
 */
function buildProductText(product: Product, locale: 'ar' | 'en' = 'ar'): string {
  const parts: string[] = []

  // Add product name
  if (product.name) {
    parts.push(`اسم المنتج: ${product.name}`)
  }

  // Add description
  if (product.description?.ar && locale === 'ar') {
    parts.push(`الوصف: ${product.description.ar}`)
  } else if (product.description?.en && locale === 'en') {
    parts.push(`Description: ${product.description.en}`)
  }

  // Add SKU
  if (product.sku) {
    parts.push(`رمز المنتج: ${product.sku}`)
  }

  // Add brand
  if (product.brand) {
    parts.push(`العلامة التجارية: ${product.brand}`)
  }

  // Add product type
  if (product.productType) {
    const typeLabels: Record<string, string> = {
      cctv: 'كاميرا مراقبة',
      'access-control': 'نظام تحكم في الدخول',
      intercom: 'إنتركم',
      pbx: 'سنترال',
      'nurse-call': 'نظام استدعاء الممرضات',
      'fire-alarm': 'نظام إنذار حريق',
      gps: 'نظام تتبع GPS',
      'raw-material': 'مواد خام',
    }
    parts.push(`نوع المنتج: ${typeLabels[product.productType] || product.productType}`)
  }

  // Add specifications
  if (product.specifications && product.specifications.length > 0) {
    const specsText = product.specifications
      .map((spec) => {
        const value = spec.value?.[locale] || spec.value?.ar || spec.value?.en || ''
        return `${spec.label?.[locale] || spec.label?.ar || spec.label?.en}: ${value}`
      })
      .join(', ')
    parts.push(`المواصفات: ${specsText}`)
  }

  // Add CCTV specific specs
  if (product.productType === 'cctv' && product.cctvSpecs) {
    const specs = product.cctvSpecs
    if (specs.resolution) parts.push(`الدقة: ${specs.resolution}`)
    if (specs.lensType) parts.push(`نوع العدسة: ${specs.lensType}`)
    if (specs.nightVisionRange) parts.push(`مدى الرؤية الليلية: ${specs.nightVisionRange} متر`)
    if (specs.weatherResistance) parts.push(`مقاوم للطقس: ${specs.weatherResistance}`)
  }

  // Add Access Control specific specs
  if (product.productType === 'access-control' && product.accessControlSpecs) {
    const specs = product.accessControlSpecs
    if (specs.accessMethod) parts.push(`طريقة الدخول: ${specs.accessMethod}`)
    if (specs.userCapacity) parts.push(`سعة المستخدمين: ${specs.userCapacity}`)
  }

  // Add price range
  if (product.price) {
    parts.push(`السعر: ${product.price} جنيه`)
  }

  // Add tags
  if (product.tags && product.tags.length > 0) {
    parts.push(`الكلمات المفتاحية: ${product.tags.join(', ')}`)
  }

  return parts.join('\n')
}

/**
 * Extract metadata for filtering
 */
function extractProductMetadata(product: Product): Record<string, any> {
  const category =
    typeof product.category === 'object' && product.category !== null
      ? product.category.slug
      : product.category

  const metadata: Record<string, any> = {
    productId: product.id,
    sku: product.sku,
    productType: product.productType,
    category,
    brand: product.brand,
    price: product.price,
  }

  // Determine price range
  if (product.price) {
    if (product.price < 1000) metadata.price_range = 'budget'
    else if (product.price < 5000) metadata.price_range = 'mid'
    else metadata.price_range = 'premium'
  }

  // Add availability
  metadata.inStock = product.stock && product.stock > 0
  metadata.stock = product.stock

  return metadata
}

/**
 * Index a single product
 */
export async function indexProduct(
  productId: string,
  locale: 'ar' | 'en' = 'ar'
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })
    const embeddingsService = getEmbeddingsService()

    // Fetch product
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      console.error(`[ProductIndexer] Product not found: ${productId}`)
      return false
    }

    // Build searchable text
    const text = buildProductText(product, locale)

    // Generate embedding
    const embedding = await embeddingsService.generateEmbedding(text)

    // Extract metadata
    const metadata = extractProductMetadata(product)

    // Check if embedding already exists
    const existing = await payload.find({
      collection: 'product-embeddings',
      where: {
        and: [{ product: { equals: productId } }, { locale: { equals: locale } }],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Update existing embedding
      await payload.update({
        collection: 'product-embeddings',
        id: existing.docs[0].id,
        data: {
          embedding: embedding.values.map((value) => ({ value })),
          text,
          metadata,
        },
      })
      console.log(`[ProductIndexer] Updated embedding for product ${productId} (${locale})`)
    } else {
      // Create new embedding
      await payload.create({
        collection: 'product-embeddings',
        data: {
          product: productId,
          embedding: embedding.values.map((value) => ({ value })),
          text,
          locale,
          metadata,
        },
      })
      console.log(`[ProductIndexer] Created embedding for product ${productId} (${locale})`)
    }

    return true
  } catch (error) {
    console.error(`[ProductIndexer] Error indexing product ${productId}:`, error)
    return false
  }
}

/**
 * Index all products in the database
 */
export async function indexAllProducts(locales: Array<'ar' | 'en'> = ['ar', 'en']): Promise<{
  success: number
  failed: number
  total: number
}> {
  try {
    const payload = await getPayload({ config })

    console.log('[ProductIndexer] Starting full product indexing...')

    // Fetch all products
    const products = await payload.find({
      collection: 'products',
      limit: 1000, // Adjust based on your product count
      where: {
        status: { equals: 'published' }, // Only index published products
      },
    })

    console.log(`[ProductIndexer] Found ${products.docs.length} products to index`)

    let success = 0
    let failed = 0

    // Index each product for each locale
    for (const product of products.docs) {
      for (const locale of locales) {
        const result = await indexProduct(product.id, locale)
        if (result) {
          success++
        } else {
          failed++
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    const total = products.docs.length * locales.length

    console.log(`[ProductIndexer] Indexing complete:`)
    console.log(`  - Success: ${success}/${total}`)
    console.log(`  - Failed: ${failed}/${total}`)

    return { success, failed, total }
  } catch (error) {
    console.error('[ProductIndexer] Error indexing all products:', error)
    throw error
  }
}

/**
 * Re-index products that have been updated since a given date
 */
export async function reindexUpdatedProducts(since: Date): Promise<{
  success: number
  failed: number
}> {
  try {
    const payload = await getPayload({ config })

    const products = await payload.find({
      collection: 'products',
      where: {
        and: [{ updatedAt: { greater_than: since.toISOString() } }, { status: { equals: 'published' } }],
      },
      limit: 1000,
    })

    console.log(`[ProductIndexer] Re-indexing ${products.docs.length} updated products`)

    let success = 0
    let failed = 0

    for (const product of products.docs) {
      const arResult = await indexProduct(product.id, 'ar')
      const enResult = await indexProduct(product.id, 'en')

      if (arResult && enResult) success++
      else failed++

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return { success, failed }
  } catch (error) {
    console.error('[ProductIndexer] Error re-indexing products:', error)
    throw error
  }
}

/**
 * Delete embedding for a product
 */
export async function deleteProductEmbedding(productId: string): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    const embeddings = await payload.find({
      collection: 'product-embeddings',
      where: {
        product: { equals: productId },
      },
    })

    for (const embedding of embeddings.docs) {
      await payload.delete({
        collection: 'product-embeddings',
        id: embedding.id,
      })
    }

    console.log(`[ProductIndexer] Deleted embeddings for product ${productId}`)
    return true
  } catch (error) {
    console.error(`[ProductIndexer] Error deleting embeddings for product ${productId}:`, error)
    return false
  }
}
