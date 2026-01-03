/**
 * User-Friendly Error Messages
 * Clear, helpful messages in Arabic for end users
 */

export const USER_FRIENDLY_ERRORS = {
  // Search errors
  NO_PRODUCTS_FOUND: 'لم أجد منتجات بهذا الاسم. جرب البحث بكلمات مثل "HDPE" أو "PP" أو "خامات معاد تدويرها"',
  EMPTY_QUERY: 'يرجى كتابة اسم المنتج أو الفئة التي تبحث عنها',
  SEARCH_FAILED: 'حدث خطأ في البحث. يرجى المحاولة مرة أخرى',

  // Network errors
  NETWORK_ERROR: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وأعد المحاولة',
  TIMEOUT: 'استغرق الطلب وقتاً طويلاً. يرجى المحاولة مرة أخرى',

  // Rate limiting
  RATE_LIMIT: 'تم إرسال عدد كبير من الطلبات. انتظر قليلاً ثم أعد المحاولة',
  SERVICE_BUSY: 'الخدمة مشغولة حالياً. يرجى المحاولة بعد قليل',

  // Authentication
  API_KEY_INVALID: 'خطأ في إعدادات النظام. يرجى التواصل مع الدعم الفني',
  UNAUTHORIZED: 'غير مصرح لك بهذا الإجراء',

  // General
  UNKNOWN_ERROR: 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً',
  FUNCTION_NOT_FOUND: 'هذه الخدمة غير متاحة حالياً',

  // Product specific
  PRODUCT_NOT_FOUND: 'المنتج غير موجود. تأكد من اسم أو رقم المنتج',
  OUT_OF_STOCK: 'المنتج غير متوفر حالياً',
  INVALID_PRICE_RANGE: 'نطاق السعر غير صحيح',

  // Order specific
  ORDER_NOT_FOUND: 'لم يتم العثور على الطلب. تأكد من رقم الطلب',
  INVALID_ORDER_ID: 'رقم الطلب غير صحيح',

  // Cart specific
  CART_EMPTY: 'سلة التسوق فارغة',
  CART_ERROR: 'حدث خطأ في سلة التسوق',
} as const

/**
 * Get user-friendly error message from error object
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return USER_FRIENDLY_ERRORS.RATE_LIMIT
    }

    // Service busy
    if (message.includes('503') || message.includes('overloaded')) {
      return USER_FRIENDLY_ERRORS.SERVICE_BUSY
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return USER_FRIENDLY_ERRORS.NETWORK_ERROR
    }

    // Timeout
    if (message.includes('timeout') || message.includes('timed out')) {
      return USER_FRIENDLY_ERRORS.TIMEOUT
    }

    // API key
    if (message.includes('api key') || message.includes('401')) {
      return USER_FRIENDLY_ERRORS.API_KEY_INVALID
    }

    // Product not found
    if (message.includes('not found') || message.includes('غير موجود')) {
      return USER_FRIENDLY_ERRORS.PRODUCT_NOT_FOUND
    }
  }

  return USER_FRIENDLY_ERRORS.UNKNOWN_ERROR
}

/**
 * Create a helpful response when no products are found
 */
export function getNoResultsMessage(query: string): string {
  return `لم أجد منتجات تطابق "${query}".

يمكنك تجربة:
- البحث باسم المادة: HDPE، LDPE، PP، PVC
- البحث بالاستخدام: أنابيب، أفلام، حقن
- البحث بالنوع: خامات معاد تدويرها، ماستر باتش

هل تريد مساعدة في إيجاد خامة معينة؟`
}

/**
 * Create suggestions for common queries
 */
export function getSuggestions(): string[] {
  return [
    'ما هي خامات HDPE المتاحة؟',
    'أريد PP لصناعة العبوات',
    'ما أسعار خامات SABIC؟',
    'خامات معاد تدويرها',
    'ماستر باتش أسود',
  ]
}
