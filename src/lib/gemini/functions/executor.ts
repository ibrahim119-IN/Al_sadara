/**
 * Function Executor - Executes functions called by Gemini
 */
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'
import { FunctionCall, FunctionResponse, ProductResult } from '../types'
import { semanticSearch } from '../embeddings'

/**
 * Execute a function call from the AI
 */
export async function executeFunction(
  functionCall: FunctionCall
): Promise<FunctionResponse> {
  const { name, args } = functionCall

  try {
    let response: unknown

    switch (name) {
      case 'search_products':
        response = await searchProducts(args as {
          query: string
          category?: string
          minPrice?: number
          maxPrice?: number
          inStock?: boolean
          limit?: number
        })
        break

      case 'get_product_details':
        response = await getProductDetails(args as {
          productId?: string
          productName?: string
        })
        break

      case 'get_recommendations':
        response = await getRecommendations(args as {
          productId?: string
          category?: string
          priceRange?: string
          limit?: number
        })
        break

      case 'compare_products':
        response = await compareProducts(args as {
          productIds?: string
          productNames?: string
        })
        break

      case 'check_stock':
        response = await checkStock(args as {
          productId?: string
          productName?: string
        })
        break

      case 'get_categories':
        response = await getCategories(args as {
          parentCategory?: string
        })
        break

      case 'add_to_cart':
        response = await addToCart(args as {
          productId: string
          quantity?: number
        })
        break

      case 'get_cart':
        response = await getCart()
        break

      case 'get_order_status':
        response = await getOrderStatus(args as {
          orderId: string
          email?: string
          phone?: string
        })
        break

      case 'calculate_shipping':
        response = await calculateShipping(args as {
          governorate: string
          weight?: number
          orderTotal?: number
        })
        break

      case 'get_deals':
        response = await getDeals(args as {
          category?: string
          minDiscount?: number
        })
        break

      case 'plan_budget':
        response = await planBudget(args as {
          budget: number
          categories?: string
          priorities?: string
        })
        break

      case 'search_knowledge':
        response = await searchKnowledge(args as {
          query: string
          type?: string
          category?: string
        })
        break

      default:
        response = { error: `Unknown function: ${name}` }
    }

    return { name, response }
  } catch (error) {
    console.error(`Error executing function ${name}:`, error)
    return {
      name,
      response: {
        error: `Failed to execute ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

/**
 * Execute multiple function calls
 */
export async function executeFunctions(
  functionCalls: FunctionCall[]
): Promise<FunctionResponse[]> {
  const results = await Promise.all(
    functionCalls.map((call) => executeFunction(call))
  )
  return results
}

// ===== Function Implementations =====

// Comprehensive keyword mapping for Arabic to English product terms
// Supports multiple search terms per keyword for better matching
const KEYWORD_MAP: Record<string, string[]> = {
  // === HDPE ===
  'hdpe': ['HDPE', 'High Density Polyethylene'],
  'اتش دي بي اي': ['HDPE', 'High Density Polyethylene'],
  'بولي ايثيلين عالي الكثافة': ['HDPE', 'High Density Polyethylene'],
  'بولي إيثيلين عالي': ['HDPE'],
  'high density polyethylene': ['HDPE'],

  // === LDPE ===
  'ldpe': ['LDPE', 'Low Density Polyethylene'],
  'ال دي بي اي': ['LDPE', 'Low Density Polyethylene'],
  'بولي ايثيلين منخفض الكثافة': ['LDPE', 'Low Density Polyethylene'],
  'بولي إيثيلين منخفض': ['LDPE'],
  'low density polyethylene': ['LDPE'],

  // === PP ===
  'pp': ['PP', 'Polypropylene'],
  'بي بي': ['PP', 'Polypropylene'],
  'بولي بروبيلين': ['PP', 'Polypropylene'],
  'polypropylene': ['PP', 'Polypropylene'],

  // === PVC ===
  'pvc': ['PVC', 'Polyvinyl Chloride'],
  'بي في سي': ['PVC', 'Polyvinyl Chloride'],
  'بولي فينيل كلورايد': ['PVC'],
  'polyvinyl chloride': ['PVC'],

  // === PET ===
  'pet': ['PET', 'Polyethylene Terephthalate'],
  'بي اي تي': ['PET', 'Polyethylene Terephthalate'],
  'بولي إيثيلين تيريفثاليت': ['PET'],

  // === PS ===
  'ps': ['PS', 'Polystyrene'],
  'بي اس': ['PS', 'Polystyrene'],
  'بولي ستايرين': ['PS', 'Polystyrene'],
  'polystyrene': ['PS', 'Polystyrene'],

  // === Recycled Materials ===
  'معاد تدويره': ['Recycled', 'Recycled Materials'],
  'خامات معاد تدويرها': ['Recycled', 'Recycled Materials'],
  'تدوير': ['Recycled', 'Recycled Materials'],
  'recycled': ['Recycled', 'Recycled Materials'],
  'regrind': ['Recycled', 'Regrind'],

  // === Masterbatch ===
  'ماستر باتش': ['Masterbatch', 'Color Masterbatch'],
  'masterbatch': ['Masterbatch'],
  'ملونات': ['Masterbatch', 'Pigment'],
  'صبغة': ['Masterbatch', 'Pigment', 'Color'],

  // === Additives ===
  'اضافات': ['Additives', 'Plastic Additives'],
  'additives': ['Additives', 'Plastic Additives'],
  'مثبتات': ['Stabilizers', 'UV Stabilizers'],
  'stabilizers': ['Stabilizers'],

  // === Raw Materials General ===
  'خامات': ['Raw Materials', 'Polymers'],
  'بوليمر': ['Polymer', 'Polymers'],
  'بوليمرات': ['Polymers'],
  'polymers': ['Polymers', 'Polymer'],
  'بلاستيك': ['Plastic', 'Plastics', 'Polymers'],
  'plastic': ['Plastic', 'Plastics'],
  'raw materials': ['Raw Materials', 'Polymers'],

  // === Applications ===
  'انابيب': ['Pipes', 'HDPE', 'PVC'],
  'pipes': ['Pipes', 'HDPE', 'PVC'],
  'تغليف': ['Packaging', 'LDPE', 'PP'],
  'packaging': ['Packaging', 'LDPE', 'PP'],
  'عبوات': ['Containers', 'PET', 'PP'],
  'containers': ['Containers', 'PET', 'PP'],
  'فيلم': ['Film', 'LDPE', 'HDPE'],
  'film': ['Film', 'LDPE', 'HDPE'],
}

// Fuzzy matching for common misspellings
const FUZZY_CORRECTIONS: Record<string, string> = {
  'اتش دي': 'hdpe',
  'ال دي': 'ldpe',
  'بولي بروبلين': 'بولي بروبيلين',
  'بولي إثيلين': 'بولي إيثيلين',
  'بلاستك': 'بلاستيك',
  'خاماة': 'خامات',
  'بوليمير': 'بوليمر',
}

/**
 * Normalize and expand a search query using keyword mapping
 * Returns an array of search terms to use
 */
function normalizeQuery(query: string): string[] {
  let lowerQuery = query.toLowerCase().trim()

  // Step 1: Apply fuzzy corrections for common misspellings
  if (FUZZY_CORRECTIONS[lowerQuery]) {
    console.log('[normalizeQuery] Fuzzy correction:', query, '->', FUZZY_CORRECTIONS[lowerQuery])
    lowerQuery = FUZZY_CORRECTIONS[lowerQuery]
  }

  // Step 2: Check for exact matches in keyword map
  if (KEYWORD_MAP[lowerQuery]) {
    console.log('[normalizeQuery] Exact match:', query, '->', KEYWORD_MAP[lowerQuery])
    return KEYWORD_MAP[lowerQuery]
  }

  // Step 3: Check for partial matches (query contains a keyword)
  for (const [keyword, terms] of Object.entries(KEYWORD_MAP)) {
    if (lowerQuery.includes(keyword)) {
      console.log('[normalizeQuery] Partial match:', query, '->', terms)
      return terms
    }
  }

  // Step 4: Check if any keyword contains the query
  for (const [keyword, terms] of Object.entries(KEYWORD_MAP)) {
    if (keyword.includes(lowerQuery) && lowerQuery.length >= 2) {
      console.log('[normalizeQuery] Reverse match:', query, '->', terms)
      return terms
    }
  }

  // Step 5: Return original query if no match found
  console.log('[normalizeQuery] No match, using original:', query)
  return [query]
}

async function searchProducts(params: {
  query: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  limit?: number
}): Promise<{ products: ProductResult[]; total: number }> {
  const payload = await getPayload({ config })
  const limit = params.limit || 10

  // Normalize the query using keyword mapping - returns array of terms
  const searchTerms = normalizeQuery(params.query)
  console.log('[searchProducts] Search terms:', searchTerms)

  // Build where clause for direct search
  const where: Record<string, unknown> = {
    status: { equals: 'published' },
  }

  if (params.category) {
    where['category.name'] = { contains: params.category }
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {}
    if (params.minPrice !== undefined) {
      (where.price as Record<string, unknown>).greater_than_equal = params.minPrice
    }
    if (params.maxPrice !== undefined) {
      (where.price as Record<string, unknown>).less_than_equal = params.maxPrice
    }
  }

  if (params.inStock) {
    where.stock = { greater_than: 0 }
  }

  // Try semantic search first with the primary search term
  let semanticResults: Array<{ productId: string; similarity: number }> = []
  try {
    // Use the first term for semantic search
    semanticResults = await semanticSearch(searchTerms[0], { limit })
    console.log('[searchProducts] Semantic results:', semanticResults.length)
  } catch (error) {
    console.log('[searchProducts] Semantic search failed, using text search:', error)
  }

  // If we have semantic results, filter by those IDs
  if (semanticResults.length > 0) {
    where.id = { in: semanticResults.map((r) => parseInt(r.productId, 10)) }
  } else {
    // Fallback to text search on name, nameAr, and brand fields
    // Build OR conditions for all search terms
    const orConditions: Array<Record<string, unknown>> = []

    // Add conditions for each search term
    for (const term of searchTerms) {
      orConditions.push({ name: { contains: term } })
      orConditions.push({ nameAr: { contains: term } })
      orConditions.push({ brand: { contains: term } })
    }

    // Also add the original query if it's different from the first term
    if (!searchTerms.includes(params.query)) {
      orConditions.push({ name: { contains: params.query } })
      orConditions.push({ nameAr: { contains: params.query } })
      orConditions.push({ brand: { contains: params.query } })
    }

    where.or = orConditions
    console.log('[searchProducts] Text search with', orConditions.length, 'conditions')
  }

  try {
    const result = await payload.find({
      collection: 'products',
      where: where as Where,
      limit,
      depth: 1, // Include related data
    })

    console.log('[searchProducts] Found:', result.totalDocs, 'products')

    return {
      products: result.docs.map(formatProduct),
      total: result.totalDocs,
    }
  } catch (error) {
    console.error('[searchProducts] Query error:', error)
    // Return empty result if query fails
    return { products: [], total: 0 }
  }
}

async function getProductDetails(params: {
  productId?: string
  productName?: string
}): Promise<ProductResult | { error: string }> {
  const payload = await getPayload({ config })

  let product

  if (params.productId) {
    try {
      product = await payload.findByID({
        collection: 'products',
        id: params.productId,
        depth: 1,
      })
    } catch {
      return { error: 'المنتج غير موجود' }
    }
  } else if (params.productName) {
    const result = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { like: `%${params.productName}%` } },
          { nameAr: { like: `%${params.productName}%` } },
        ],
      },
      limit: 1,
      depth: 1,
    })
    product = result.docs[0]
  }

  if (!product) {
    return { error: 'المنتج غير موجود' }
  }

  return formatProduct(product)
}

async function getRecommendations(params: {
  productId?: string
  category?: string
  priceRange?: string
  limit?: number
}): Promise<{ recommendations: ProductResult[] }> {
  const payload = await getPayload({ config })
  const limit = params.limit || 5

  const where: Record<string, unknown> = {
    status: { equals: 'published' },
    stock: { greater_than: 0 },
  }

  if (params.category) {
    where['category.name'] = { like: `%${params.category}%` }
  }

  if (params.priceRange) {
    switch (params.priceRange) {
      case 'low':
        where.price = { less_than_equal: 500 }
        break
      case 'medium':
        where.price = { greater_than: 500, less_than_equal: 2000 }
        break
      case 'high':
        where.price = { greater_than: 2000 }
        break
    }
  }

  // Exclude current product if provided
  if (params.productId) {
    where.id = { not_equals: parseInt(params.productId, 10) }
  }

  const result = await payload.find({
    collection: 'products',
    where: where as Where,
    limit,
    depth: 1,
    sort: '-createdAt', // Sort by newest
  })

  return {
    recommendations: result.docs.map(formatProduct),
  }
}

async function compareProducts(params: {
  productIds?: string
  productNames?: string
}): Promise<{ comparison: ProductResult[] }> {
  const payload = await getPayload({ config })

  let products: unknown[] = []

  if (params.productIds) {
    const ids = params.productIds.split(',').map((id) => id.trim())
    const result = await payload.find({
      collection: 'products',
      where: { id: { in: ids } },
    })
    products = result.docs
  } else if (params.productNames) {
    const names = params.productNames.split(',').map((name) => name.trim())
    const promises = names.map((name) =>
      payload.find({
        collection: 'products',
        where: { name: { contains: name } },
        limit: 1,
      })
    )
    const results = await Promise.all(promises)
    products = results.flatMap((r) => r.docs)
  }

  return {
    comparison: products.map(formatProduct),
  }
}

async function checkStock(params: {
  productId?: string
  productName?: string
}): Promise<{ available: boolean; quantity?: number; message: string }> {
  const product = await getProductDetails(params)

  if ('error' in product) {
    return { available: false, message: product.error }
  }

  return {
    available: product.inStock,
    message: product.inStock
      ? `المنتج "${product.name}" متوفر حالياً`
      : `المنتج "${product.name}" غير متوفر حالياً`,
  }
}

async function getCategories(params: {
  parentCategory?: string
}): Promise<{ categories: Array<{ id: string; name: string; count: number }> }> {
  const payload = await getPayload({ config })

  const where: Record<string, unknown> = {}

  if (params.parentCategory) {
    where['parent.name'] = { contains: params.parentCategory }
  }

  const result = await payload.find({
    collection: 'categories',
    where: where as Where,
    limit: 50,
  })

  return {
    categories: result.docs.map((cat) => ({
      id: String(cat.id),
      name: cat.name as string,
      count: 0, // Would need to count products
    })),
  }
}

async function addToCart(params: {
  productId: string
  quantity?: number
}): Promise<{ success: boolean; message: string }> {
  // Note: Cart functionality would need session/user context
  // This is a placeholder that returns instructions
  return {
    success: true,
    message: `يمكنك إضافة المنتج للسلة من خلال الضغط على زر "أضف للسلة" في صفحة المنتج. الكمية المطلوبة: ${params.quantity || 1}`,
  }
}

async function getCart(): Promise<{ message: string }> {
  // Note: Cart functionality would need session/user context
  return {
    message: 'يمكنك مشاهدة سلة التسوق من خلال أيقونة السلة في أعلى الصفحة',
  }
}

async function getOrderStatus(params: {
  orderId: string
  email?: string
  phone?: string
}): Promise<{ status?: string; message: string }> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: params.orderId },
      },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return { message: 'لم يتم العثور على الطلب. تأكد من رقم الطلب' }
    }

    const order = result.docs[0]
    const statusMessages: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'تم التأكيد',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    }

    return {
      status: order.status as string,
      message: `حالة الطلب رقم ${params.orderId}: ${statusMessages[order.status as string] || order.status}`,
    }
  } catch {
    return { message: 'حدث خطأ في البحث عن الطلب' }
  }
}

async function calculateShipping(params: {
  governorate: string
  weight?: number
  orderTotal?: number
}): Promise<{ cost: number; estimatedDays: string; freeShipping: boolean }> {
  // Shipping rates by governorate
  const rates: Record<string, { cost: number; days: string }> = {
    القاهرة: { cost: 30, days: '1-2 أيام' },
    الجيزة: { cost: 30, days: '1-2 أيام' },
    الإسكندرية: { cost: 45, days: '2-3 أيام' },
    default: { cost: 60, days: '3-5 أيام' },
  }

  const rate = rates[params.governorate] || rates.default

  // Free shipping for orders over 500 EGP
  const freeShippingThreshold = 500
  const freeShipping = (params.orderTotal || 0) >= freeShippingThreshold

  return {
    cost: freeShipping ? 0 : rate.cost,
    estimatedDays: rate.days,
    freeShipping,
  }
}

async function getDeals(params: {
  category?: string
  minDiscount?: number
}): Promise<{ deals: ProductResult[] }> {
  const payload = await getPayload({ config })

  const where: Record<string, unknown> = {
    status: { equals: 'published' },
    compareAtPrice: { exists: true },
    stock: { greater_than: 0 },
  }

  if (params.category) {
    where['category.name'] = { like: `%${params.category}%` }
  }

  const result = await payload.find({
    collection: 'products',
    where: where as Where,
    limit: 20,
    depth: 1,
  })

  // Filter by discount percentage
  const deals = result.docs.map(formatProduct).filter((p) => {
    if (!p.originalPrice) return false
    const discount = ((p.originalPrice - p.price) / p.originalPrice) * 100
    return discount >= (params.minDiscount || 10)
  })

  return { deals }
}

async function planBudget(params: {
  budget: number
  categories?: string
  priorities?: string
}): Promise<{ suggestions: ProductResult[]; totalCost: number; remaining: number }> {
  const payload = await getPayload({ config })

  const where: Record<string, unknown> = {
    status: { equals: 'published' },
    price: { less_than_equal: params.budget },
    stock: { greater_than: 0 },
  }

  if (params.categories) {
    const cats = params.categories.split(',').map((c) => c.trim())
    where.or = cats.map((cat) => ({ 'category.name': { like: `%${cat}%` } }))
  }

  // Sort based on priorities
  let sort = '-createdAt'
  if (params.priorities === 'price') {
    sort = 'price'
  }

  const result = await payload.find({
    collection: 'products',
    where: where as Where,
    limit: 10,
    depth: 1,
    sort,
  })

  const suggestions = result.docs.map(formatProduct)
  const totalCost = suggestions.reduce((sum, p) => sum + p.price, 0)

  return {
    suggestions,
    totalCost,
    remaining: params.budget - totalCost,
  }
}

/**
 * Search Knowledge Base
 * Searches policies, FAQs, and guides using semantic search
 */
async function searchKnowledge(params: {
  query: string
  type?: string
  category?: string
}): Promise<{
  results: Array<{
    title: string
    content: string
    type: string
    category: string | null
    similarity?: number
  }>
  total: number
  message: string
}> {
  const payload = await getPayload({ config })

  console.log('[searchKnowledge] Searching for:', params.query)

  // Build where clause
  const where: Record<string, unknown> = {
    isActive: { equals: true },
  }

  if (params.type) {
    where.type = { equals: params.type }
  }

  if (params.category) {
    where.category = { equals: params.category }
  }

  try {
    // First, try semantic search if embeddings are available
    const { generateEmbedding, cosineSimilarity } = await import('../embeddings')

    // Generate query embedding
    const queryEmbedding = await generateEmbedding(params.query, {
      taskType: 'RETRIEVAL_QUERY',
    })

    // Fetch all active knowledge base entries with embeddings
    const allEntries = await payload.find({
      collection: 'knowledge-base',
      where: where as Where,
      limit: 100,
    })

    if (allEntries.docs.length === 0) {
      return {
        results: [],
        total: 0,
        message: 'لم يتم العثور على نتائج في قاعدة المعرفة',
      }
    }

    // Calculate similarities and rank results
    const rankedResults = allEntries.docs
      .filter((doc) => doc.embedding && Array.isArray(doc.embedding))
      .map((doc) => {
        const embedding = doc.embedding as number[]
        const similarity = cosineSimilarity(queryEmbedding.values, embedding)
        return {
          doc,
          similarity,
        }
      })
      .filter((item) => item.similarity >= 0.3) // Minimum similarity threshold
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5) // Top 5 results

    console.log('[searchKnowledge] Found', rankedResults.length, 'semantic matches')

    if (rankedResults.length > 0) {
      return {
        results: rankedResults.map((item) => ({
          title: item.doc.title as string,
          content: (item.doc.content as string).substring(0, 1000),
          type: item.doc.type as string,
          category: item.doc.category as string | null,
          similarity: Math.round(item.similarity * 100) / 100,
        })),
        total: rankedResults.length,
        message: `تم العثور على ${rankedResults.length} نتائج`,
      }
    }
  } catch (error) {
    console.log('[searchKnowledge] Semantic search failed, falling back to text:', error)
  }

  // Fallback to text search
  const textSearchWhere: Record<string, unknown> = {
    ...where,
    or: [
      { title: { contains: params.query } },
      { content: { contains: params.query } },
    ],
  }

  const result = await payload.find({
    collection: 'knowledge-base',
    where: textSearchWhere as Where,
    limit: 5,
  })

  console.log('[searchKnowledge] Text search found', result.docs.length, 'results')

  return {
    results: result.docs.map((doc) => ({
      title: doc.title as string,
      content: (doc.content as string).substring(0, 1000),
      type: doc.type as string,
      category: doc.category as string | null,
    })),
    total: result.docs.length,
    message:
      result.docs.length > 0
        ? `تم العثور على ${result.docs.length} نتائج`
        : 'لم يتم العثور على نتائج. جرب البحث بكلمات مختلفة',
  }
}

// ===== Helper Functions =====

function formatProduct(product: unknown): ProductResult {
  const p = product as Record<string, unknown>

  // Get category name from relationship
  const category = p.category as Record<string, unknown> | null
  const categoryName = category?.name as string || ''

  // Get images from array
  const images = Array.isArray(p.images)
    ? (p.images as Array<Record<string, unknown>>).map((item) => {
        const img = item.image as Record<string, unknown> | null
        return img?.url as string || ''
      }).filter(Boolean)
    : []

  // Determine if in stock based on stock quantity
  const stock = (p.stock as number) ?? 0
  const inStock = stock > 0

  return {
    id: String(p.id),
    name: (p.nameAr as string) || (p.name as string) || '',
    description: '', // Rich text field - skip for now
    price: (p.price as number) || 0,
    originalPrice: (p.compareAtPrice as number) || undefined,
    category: categoryName,
    images,
    inStock,
    rating: undefined, // Not in schema
    reviewCount: undefined, // Not in schema
  }
}
