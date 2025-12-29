/**
 * Cart Functions
 * Functions for retrieving and managing shopping cart items
 */

import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Get cart items from database or localStorage
 * Fetches cart items for authenticated customers or session-based carts
 */
export async function executeGetCartItems(params: {
  sessionId?: string
  customerId?: string
  cartItems?: any[]
}): Promise<any> {
  try {
    // If cart items provided from frontend (localStorage), use them directly
    if (params.cartItems && params.cartItems.length > 0) {
      console.log('[CartFunctions] Using cart items from frontend:', params.cartItems.length)

      // Calculate totals
      let totalPrice = 0
      const items = params.cartItems.map((item) => {
        const product = item.product
        const itemTotal = product?.price ? product.price * item.quantity : 0
        totalPrice += itemTotal

        return {
          productName: product?.nameAr || product?.name || 'منتج',
          quantity: item.quantity,
          price: product?.price || 0,
          total: itemTotal,
          sku: product?.sku,
        }
      })

      return {
        success: true,
        isEmpty: false,
        message: `في السلة ${params.cartItems.length} ${params.cartItems.length === 1 ? 'منتج' : 'منتجات'} بإجمالي ${totalPrice} جنيه`,
        items,
        totalItems: params.cartItems.length,
        totalPrice,
      }
    }

    // Otherwise, try database (for authenticated users)
    const payload = await getPayload({ config })

    // Try to get cart items from database
    let cartItems: any[] = []

    // If customer is authenticated, get their cart
    if (params.customerId) {
      const result = await payload.find({
        collection: 'cart-items',
        where: {
          customer: { equals: params.customerId },
        },
        limit: 100,
      })
      cartItems = result.docs
    }
    // If session ID provided, try to get guest cart
    else if (params.sessionId) {
      const result = await payload.find({
        collection: 'cart-items',
        where: {
          sessionId: { equals: params.sessionId },
        },
        limit: 100,
      })
      cartItems = result.docs
    }

    // If cart is empty
    if (cartItems.length === 0) {
      return {
        success: true,
        isEmpty: true,
        message: 'سلة التسوق فارغة حالياً. هل تريد مساعدة في البحث عن منتجات؟',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }
    }

    // Calculate totals
    let totalPrice = 0
    const items = cartItems.map((item) => {
      const product = typeof item.product === 'object' ? item.product : null
      const itemTotal = product?.price ? product.price * item.quantity : 0
      totalPrice += itemTotal

      return {
        productName: product?.nameAr || product?.name || 'منتج',
        quantity: item.quantity,
        price: product?.price || 0,
        total: itemTotal,
        sku: product?.sku,
      }
    })

    return {
      success: true,
      isEmpty: false,
      message: `في السلة ${cartItems.length} ${cartItems.length === 1 ? 'منتج' : 'منتجات'} بإجمالي ${totalPrice} جنيه`,
      items,
      totalItems: cartItems.length,
      totalPrice,
    }
  } catch (error: any) {
    console.error('[CartFunctions] Error getting cart items:', error)

    // Return helpful message even on error
    return {
      success: false,
      isEmpty: true,
      message: 'يمكنك مشاهدة سلة التسوق من خلال النقر على أيقونة السلة في أعلى الصفحة.',
      items: [],
      totalItems: 0,
      totalPrice: 0,
      error: 'لا يمكن الوصول لسلة التسوق حالياً',
    }
  }
}
