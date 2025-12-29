import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Order Functions
 * Implementation of order-related AI functions
 */

// ==================== GET ORDER STATUS ====================

export async function executeGetOrderStatus(params: {
  orderNumber: string
  customerId?: string
}): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const { orderNumber, customerId } = params

    // Find order by order number
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: orderNumber },
      },
      limit: 1,
    })

    if (orders.docs.length === 0) {
      return {
        success: false,
        error: 'الطلب غير موجود. تأكد من رقم الطلب.',
      }
    }

    const order = orders.docs[0]

    // Verify customer ownership (if customerId provided)
    if (customerId) {
      const orderCustomerId =
        typeof order.customer === 'object' && order.customer !== null
          ? order.customer.id
          : order.customer

      if (orderCustomerId !== customerId) {
        return {
          success: false,
          error: 'هذا الطلب لا ينتمي لحسابك',
        }
      }
    }

    // Format order status
    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        total: order.total,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        itemsCount: order.items?.length || 0,
      },
    }
  } catch (error) {
    console.error('[OrderFunctions] Get order status error:', error)
    return {
      success: false,
      error: 'فشل الحصول على حالة الطلب',
    }
  }
}

// ==================== GET ORDER HISTORY ====================

export async function executeGetOrderHistory(params: {
  customerId: string
  limit?: number
}): Promise<any> {
  try {
    const payload = await getPayload({ config })
    const { customerId, limit = 5 } = params

    if (!customerId) {
      return {
        success: false,
        error: 'يجب تسجيل الدخول لعرض سجل الطلبات',
      }
    }

    const orders = await payload.find({
      collection: 'orders',
      where: {
        customer: { equals: customerId },
      },
      limit,
      sort: '-createdAt',
    })

    const orderHistory = orders.docs.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      total: order.total,
      paymentStatus: order.paymentStatus,
      itemsCount: order.items?.length || 0,
    }))

    return {
      success: true,
      orders: orderHistory,
      count: orderHistory.length,
    }
  } catch (error) {
    console.error('[OrderFunctions] Get order history error:', error)
    return {
      success: false,
      error: 'فشل الحصول على سجل الطلبات',
    }
  }
}
