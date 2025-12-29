/**
 * Shipping Functions
 * Implementation of shipping and delivery-related functions
 */

// Shipping rates by governorate (in EGP)
const SHIPPING_RATES: Record<string, number> = {
  القاهرة: 50,
  الجيزة: 50,
  الإسكندرية: 70,
  'القليوبية': 60,
  'الشرقية': 70,
  'الدقهلية': 80,
  'الغربية': 80,
  'المنوفية': 70,
  'البحيرة': 80,
  'كفر الشيخ': 90,
  'دمياط': 90,
  'بورسعيد': 90,
  'الإسماعيلية': 90,
  'السويس': 90,
  'شمال سيناء': 120,
  'جنوب سيناء': 120,
  'المنيا': 100,
  'بني سويف': 90,
  'الفيوم': 80,
  'أسيوط': 110,
  'سوهاج': 120,
  'قنا': 130,
  'الأقصر': 130,
  'أسوان': 140,
  'البحر الأحمر': 150,
  'الوادي الجديد': 160,
  'مطروح': 150,
}

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 5000

// Delivery times (in days)
const DELIVERY_TIMES: Record<string, string> = {
  القاهرة: '1-2 يوم',
  الجيزة: '1-2 يوم',
  الإسكندرية: '2-3 أيام',
  'القليوبية': '2-3 أيام',
  default: '3-5 أيام',
}

// ==================== GET SHIPPING INFO ====================

export async function executeGetShippingInfo(params: { governorate: string }): Promise<any> {
  try {
    const { governorate } = params

    const normalizedGovernorate = governorate.trim()

    const shippingCost = SHIPPING_RATES[normalizedGovernorate] || SHIPPING_RATES['القاهرة']
    const deliveryTime = DELIVERY_TIMES[normalizedGovernorate] || DELIVERY_TIMES['default']

    return {
      success: true,
      shippingInfo: {
        governorate: normalizedGovernorate,
        shippingCost,
        deliveryTime,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        availableShippingMethods: [
          {
            name: 'توصيل عادي',
            cost: shippingCost,
            time: deliveryTime,
          },
          {
            name: 'توصيل سريع',
            cost: shippingCost * 1.5,
            time: '1-2 يوم',
            available: ['القاهرة', 'الجيزة', 'الإسكندرية'].includes(normalizedGovernorate),
          },
        ],
      },
    }
  } catch (error) {
    console.error('[ShippingFunctions] Get shipping info error:', error)
    return {
      success: false,
      error: 'فشل الحصول على معلومات الشحن',
    }
  }
}

// ==================== CALCULATE SHIPPING ====================

export async function executeCalculateShipping(params: {
  governorate: string
  orderValue: number
}): Promise<any> {
  try {
    const { governorate, orderValue } = params

    const normalizedGovernorate = governorate.trim()

    const baseShippingCost = SHIPPING_RATES[normalizedGovernorate] || SHIPPING_RATES['القاهرة']

    // Apply free shipping if order value exceeds threshold
    const shippingCost = orderValue >= FREE_SHIPPING_THRESHOLD ? 0 : baseShippingCost

    const deliveryTime = DELIVERY_TIMES[normalizedGovernorate] || DELIVERY_TIMES['default']

    return {
      success: true,
      calculation: {
        governorate: normalizedGovernorate,
        orderValue,
        shippingCost,
        isFreeShipping: orderValue >= FREE_SHIPPING_THRESHOLD,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping:
          orderValue < FREE_SHIPPING_THRESHOLD ? FREE_SHIPPING_THRESHOLD - orderValue : 0,
        total: orderValue + shippingCost,
        deliveryTime,
      },
    }
  } catch (error) {
    console.error('[ShippingFunctions] Calculate shipping error:', error)
    return {
      success: false,
      error: 'فشل حساب تكلفة الشحن',
    }
  }
}

/**
 * Get all available governorates
 */
export function getAvailableGovernorates(): string[] {
  return Object.keys(SHIPPING_RATES)
}

/**
 * Check if governorate is available for shipping
 */
export function isGovernorateAvailable(governorate: string): boolean {
  return governorate in SHIPPING_RATES
}
