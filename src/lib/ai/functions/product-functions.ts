import { getPayload } from 'payload'
import config from '@/payload.config'
import { searchProducts, findSimilarProducts } from '../rag/vector-search'
import type { Product } from '@/payload-types'

/**
 * Product Functions
 * Implementation of product-related AI functions
 */

// ==================== SEARCH PRODUCTS ====================

export async function executeSearchProducts(params: {
  query: string
  category?: string
  priceMin?: number
  priceMax?: number
  limit?: number
}): Promise<any> {
  try {
    const { query, category, priceMin, priceMax, limit = 5 } = params

    // Use vector search
    const results = await searchProducts({
      query,
      locale: 'ar',
      limit,
      filters: {
        category,
        priceRange: {
          min: priceMin,
          max: priceMax,
        },
      },
    })

    // Format results for AI
    const formattedResults = results.map((result) => ({
      id: result.product.id,
      name: result.product.name,
      sku: result.product.sku,
      price: result.product.price,
      brand: result.product.brand,
      productType: result.product.productType,
      description: typeof (result.product.description as any)?.ar === 'string' ? (result.product.description as any).ar.substring(0, 200) : undefined,
      inStock: result.product.stock && result.product.stock > 0,
      stock: result.product.stock,
      similarity: result.similarity,
    }))

    return {
      success: true,
      products: formattedResults,
      count: formattedResults.length,
      query,
    }
  } catch (error) {
    console.error('[ProductFunctions] Search products error:', error)
    return {
      success: false,
      error: 'فشل البحث عن المنتجات. حاول مرة أخرى.',
    }
  }
}

// ==================== GET PRODUCT DETAILS ====================

export async function executeGetProductDetails(params: { productId: string }): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const { productId } = params

    // Try to find by ID first
    let product: Product | null = null

    try {
      product = await payload.findByID({
        collection: 'products',
        id: productId,
      })
    } catch {
      // If not found by ID, try by SKU
      const results = await payload.find({
        collection: 'products',
        where: {
          sku: { equals: productId },
        },
        limit: 1,
      })

      if (results.docs.length > 0) {
        product = results.docs[0]
      }
    }

    if (!product) {
      return {
        success: false,
        error: 'المنتج غير موجود',
      }
    }

    // Format detailed product info
    return {
      success: true,
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        brand: product.brand,
        productType: product.productType,
        description: product.description,
        specifications: product.specifications,
        cctvSpecs: product.cctvSpecs,
        accessControlSpecs: product.accessControlSpecs,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        trackInventory: product.trackInventory,
        tags: product.tags,
        category:
          typeof product.category === 'object' && product.category !== null
            ? product.category.name
            : product.category,
        company:
          typeof (product as any).company === 'object' && (product as any).company !== null
            ? (product as any).company.name
            : (product as any).company,
      },
    }
  } catch (error) {
    console.error('[ProductFunctions] Get product details error:', error)
    return {
      success: false,
      error: 'فشل الحصول على تفاصيل المنتج',
    }
  }
}

// ==================== CHECK STOCK ====================

export async function executeCheckStock(params: { productIds: string[] }): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const { productIds } = params

    const products = await payload.find({
      collection: 'products',
      where: {
        id: { in: productIds },
      },
      limit: productIds.length,
    })

    const stockInfo = products.docs.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      inStock: product.stock && product.stock > 0,
      stock: product.stock,
      lowStock: product.stock && product.lowStockThreshold && product.stock <= product.lowStockThreshold,
    }))

    return {
      success: true,
      stockInfo,
    }
  } catch (error) {
    console.error('[ProductFunctions] Check stock error:', error)
    return {
      success: false,
      error: 'فشل التحقق من المخزون',
    }
  }
}

// ==================== COMPARE PRODUCTS ====================

export async function executeCompareProducts(params: {
  productIds: string[]
  aspects?: string[]
}): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const { productIds, aspects = ['price', 'specs', 'features'] } = params

    if (productIds.length < 2 || productIds.length > 4) {
      return {
        success: false,
        error: 'يجب مقارنة 2-4 منتجات',
      }
    }

    const products = await payload.find({
      collection: 'products',
      where: {
        id: { in: productIds },
      },
      limit: productIds.length,
    })

    if (products.docs.length === 0) {
      return {
        success: false,
        error: 'لم يتم العثور على المنتجات',
      }
    }

    // Build comparison table
    const comparison = {
      products: products.docs.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        inStock: p.stock && p.stock > 0,
        specifications: p.specifications,
        cctvSpecs: p.cctvSpecs,
        accessControlSpecs: p.accessControlSpecs,
        description: (p.description as any)?.ar,
      })),
      aspects: aspects,
    }

    return {
      success: true,
      comparison,
    }
  } catch (error) {
    console.error('[ProductFunctions] Compare products error:', error)
    return {
      success: false,
      error: 'فشل مقارنة المنتجات',
    }
  }
}

// ==================== GET RECOMMENDATIONS ====================

export async function executeGetRecommendations(params: {
  context: string
  category?: string
  budget?: number
  limit?: number
}): Promise<any> {
  try {
    const { context, category, budget, limit = 3 } = params

    // Use vector search with context
    const results = await searchProducts({
      query: context,
      locale: 'ar',
      limit,
      filters: {
        category,
        priceRange: budget
          ? {
              max: budget,
            }
          : undefined,
      },
    })

    const recommendations = results.map((result) => ({
      id: result.product.id,
      name: result.product.name,
      sku: result.product.sku,
      price: result.product.price,
      brand: result.product.brand,
      description: typeof (result.product.description as any)?.ar === 'string' ? (result.product.description as any).ar.substring(0, 150) : undefined,
      inStock: result.product.stock && result.product.stock > 0,
      relevanceScore: result.similarity,
      reason: `مناسب لاحتياجاتك (تطابق ${(result.similarity * 100).toFixed(0)}%)`,
    }))

    return {
      success: true,
      recommendations,
      context,
    }
  } catch (error) {
    console.error('[ProductFunctions] Get recommendations error:', error)
    return {
      success: false,
      error: 'فشل الحصول على التوصيات',
    }
  }
}

// ==================== GET SIMILAR PRODUCTS ====================

export async function executeGetSimilarProducts(params: {
  productId: string
  limit?: number
}): Promise<any> {
  try {
    const { productId, limit = 5 } = params

    const results = await findSimilarProducts(productId, limit, 'ar')

    const similarProducts = results.map((result) => ({
      id: result.product.id,
      name: result.product.name,
      sku: result.product.sku,
      price: result.product.price,
      brand: result.product.brand,
      description: typeof (result.product.description as any)?.ar === 'string' ? (result.product.description as any).ar.substring(0, 150) : undefined,
      inStock: result.product.stock && result.product.stock > 0,
      similarity: result.similarity,
    }))

    return {
      success: true,
      similarProducts,
      count: similarProducts.length,
    }
  } catch (error) {
    console.error('[ProductFunctions] Get similar products error:', error)
    return {
      success: false,
      error: 'فشل الحصول على المنتجات المشابهة',
    }
  }
}

// ==================== CALCULATE BUDGET SOLUTION ====================

export async function executeCalculateBudgetSolution(params: {
  budget: number
  requirements: string
  priority?: 'quality' | 'balanced' | 'budget'
}): Promise<any> {
  try {
    const { budget, requirements, priority = 'balanced' } = params

    // Search for products matching requirements
    const results = await searchProducts({
      query: requirements,
      locale: 'ar',
      limit: 20,
      filters: {
        priceRange: {
          max: budget,
        },
      },
    })

    if (results.length === 0) {
      return {
        success: false,
        error: 'لم نجد منتجات ضمن هذه الميزانية',
      }
    }

    // Sort by priority
    let sortedProducts = [...results]
    if (priority === 'quality') {
      sortedProducts.sort((a, b) => (b.product.price || 0) - (a.product.price || 0))
    } else if (priority === 'budget') {
      sortedProducts.sort((a, b) => (a.product.price || 0) - (b.product.price || 0))
    } else {
      // balanced: sort by similarity
      sortedProducts.sort((a, b) => b.similarity - a.similarity)
    }

    // Build solution within budget
    const solution: any[] = []
    let remainingBudget = budget

    for (const result of sortedProducts) {
      const product = result.product
      if (!product.price) continue

      if (product.price <= remainingBudget) {
        solution.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          totalPrice: product.price,
        })

        remainingBudget -= product.price

        if (solution.length >= 5) break // Limit to 5 products
      }
    }

    const totalCost = budget - remainingBudget

    return {
      success: true,
      solution: {
        products: solution,
        totalCost,
        remainingBudget,
        budget,
      },
      priority,
    }
  } catch (error) {
    console.error('[ProductFunctions] Calculate budget solution error:', error)
    return {
      success: false,
      error: 'فشل حساب الحل المناسب للميزانية',
    }
  }
}
