import type { FunctionDeclaration } from '../types'

/**
 * Function Schemas for Gemini Function Calling
 * Defines all available functions that the AI can call
 */

// ==================== PRODUCT SEARCH ====================

export const searchProductsFunction: FunctionDeclaration = {
  name: 'search_products',
  description: 'البحث عن منتجات بناءً على وصف أو متطلبات العميل. استخدم هذه الدالة للبحث الدلالي الذكي.',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'وصف المنتج المطلوب أو احتياجات العميل بالعربية',
      },
      category: {
        type: 'string',
        description: 'فئة المنتج (اختياري): cctv, access-control, intercom, fire-alarm, etc.',
      },
      priceMin: {
        type: 'number',
        description: 'الحد الأدنى للسعر بالجنيه المصري (اختياري)',
      },
      priceMax: {
        type: 'number',
        description: 'الحد الأقصى للسعر بالجنيه المصري (اختياري)',
      },
      limit: {
        type: 'number',
        description: 'عدد النتائج المطلوبة (افتراضي: 5)',
      },
    },
    required: ['query'],
  },
}

// ==================== PRODUCT DETAILS ====================

export const getProductDetailsFunction: FunctionDeclaration = {
  name: 'get_product_details',
  description: 'الحصول على تفاصيل كاملة لمنتج معين باستخدام معرف المنتج أو رمز SKU',
  parameters: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        description: 'معرف المنتج (Product ID) أو رمز SKU',
      },
    },
    required: ['productId'],
  },
}

// ==================== STOCK CHECK ====================

export const checkStockFunction: FunctionDeclaration = {
  name: 'check_stock',
  description: 'التحقق من توفر المنتج والكمية المتاحة في المخزون',
  parameters: {
    type: 'object',
    properties: {
      productIds: {
        type: 'array',
        description: 'قائمة معرفات المنتجات للتحقق من توفرها',
        items: {
          type: 'string',
        },
      },
    },
    required: ['productIds'],
  },
}

// ==================== PRODUCT COMPARISON ====================

export const compareProductsFunction: FunctionDeclaration = {
  name: 'compare_products',
  description: 'مقارنة تفصيلية بين منتجات متعددة من حيث المواصفات والأسعار والمميزات',
  parameters: {
    type: 'object',
    properties: {
      productIds: {
        type: 'array',
        description: 'قائمة معرفات المنتجات للمقارنة (2-4 منتجات)',
        items: {
          type: 'string',
        },
      },
      aspects: {
        type: 'array',
        description: 'جوانب محددة للمقارنة (اختياري): price, specs, features, warranty',
        items: {
          type: 'string',
        },
      },
    },
    required: ['productIds'],
  },
}

// ==================== RECOMMENDATIONS ====================

export const getRecommendationsFunction: FunctionDeclaration = {
  name: 'get_recommendations',
  description: 'الحصول على توصيات منتجات مخصصة بناءً على احتياجات العميل أو سياق المحادثة',
  parameters: {
    type: 'object',
    properties: {
      context: {
        type: 'string',
        description: 'سياق التوصية أو احتياجات العميل',
      },
      category: {
        type: 'string',
        description: 'فئة المنتجات المطلوبة (اختياري)',
      },
      budget: {
        type: 'number',
        description: 'الميزانية المتاحة بالجنيه المصري (اختياري)',
      },
      limit: {
        type: 'number',
        description: 'عدد التوصيات (افتراضي: 3)',
      },
    },
    required: ['context'],
  },
}

// ==================== SIMILAR PRODUCTS ====================

export const getSimilarProductsFunction: FunctionDeclaration = {
  name: 'get_similar_products',
  description: 'الحصول على منتجات مشابهة أو بديلة لمنتج معين',
  parameters: {
    type: 'object',
    properties: {
      productId: {
        type: 'string',
        description: 'معرف المنتج الأساسي',
      },
      limit: {
        type: 'number',
        description: 'عدد المنتجات المشابهة (افتراضي: 5)',
      },
    },
    required: ['productId'],
  },
}

// ==================== BUDGET PLANNING ====================

export const calculateBudgetSolutionFunction: FunctionDeclaration = {
  name: 'calculate_budget_solution',
  description: 'تخطيط حل متكامل ضمن ميزانية محددة - يقترح مجموعة منتجات تلبي الاحتياجات ضمن الميزانية',
  parameters: {
    type: 'object',
    properties: {
      budget: {
        type: 'number',
        description: 'الميزانية الإجمالية بالجنيه المصري',
      },
      requirements: {
        type: 'string',
        description: 'وصف تفصيلي للاحتياجات (مثال: نظام كامل لفيلا، كاميرات خارجية وداخلية، الخ)',
      },
      priority: {
        type: 'string',
        description: 'الأولوية: quality (جودة عالية), balanced (متوازن), budget (توفير)',
      },
    },
    required: ['budget', 'requirements'],
  },
}

// ==================== ORDER STATUS ====================

export const getOrderStatusFunction: FunctionDeclaration = {
  name: 'get_order_status',
  description: 'الحصول على حالة طلب معين باستخدام رقم الطلب (للعملاء المسجلين فقط)',
  parameters: {
    type: 'object',
    properties: {
      orderNumber: {
        type: 'string',
        description: 'رقم الطلب',
      },
    },
    required: ['orderNumber'],
  },
}

// ==================== ORDER HISTORY ====================

export const getOrderHistoryFunction: FunctionDeclaration = {
  name: 'get_order_history',
  description: 'الحصول على سجل طلبات العميل (للعملاء المسجلين فقط)',
  parameters: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'عدد الطلبات (افتراضي: 5)',
      },
    },
  },
}

// ==================== SHIPPING INFO ====================

export const getShippingInfoFunction: FunctionDeclaration = {
  name: 'get_shipping_info',
  description: 'الحصول على معلومات الشحن والتوصيل لمحافظة معينة',
  parameters: {
    type: 'object',
    properties: {
      governorate: {
        type: 'string',
        description: 'اسم المحافظة (مثال: القاهرة، الجيزة، الإسكندرية)',
      },
    },
    required: ['governorate'],
  },
}

// ==================== CALCULATE SHIPPING ====================

export const calculateShippingFunction: FunctionDeclaration = {
  name: 'calculate_shipping',
  description: 'حساب تكلفة الشحن بناءً على العنوان وقيمة الطلب',
  parameters: {
    type: 'object',
    properties: {
      governorate: {
        type: 'string',
        description: 'المحافظة',
      },
      orderValue: {
        type: 'number',
        description: 'قيمة الطلب بالجنيه المصري',
      },
    },
    required: ['governorate', 'orderValue'],
  },
}

// ==================== CART ====================

export const getCartItemsFunction: FunctionDeclaration = {
  name: 'get_cart_items',
  description: 'الحصول على محتويات سلة التسوق الحالية للعميل. استخدم هذه الدالة عندما يسأل العميل "السلة فيها إيه؟" أو "إيه اللي في العربية؟"',
  parameters: {
    type: 'object',
    properties: {
      sessionId: {
        type: 'string',
        description: 'معرف الجلسة (سيتم تمريره تلقائياً)',
      },
    },
  },
}

// ==================== ALL FUNCTIONS ====================

/**
 * Array of all available functions
 */
export const ALL_FUNCTIONS: FunctionDeclaration[] = [
  searchProductsFunction,
  getProductDetailsFunction,
  checkStockFunction,
  compareProductsFunction,
  getRecommendationsFunction,
  getSimilarProductsFunction,
  calculateBudgetSolutionFunction,
  getOrderStatusFunction,
  getOrderHistoryFunction,
  getShippingInfoFunction,
  calculateShippingFunction,
  getCartItemsFunction,
]

/**
 * Get functions by category
 */
export function getFunctionsByCategory(category: 'product' | 'order' | 'shipping' | 'all' = 'all'): FunctionDeclaration[] {
  switch (category) {
    case 'product':
      return [
        searchProductsFunction,
        getProductDetailsFunction,
        checkStockFunction,
        compareProductsFunction,
        getRecommendationsFunction,
        getSimilarProductsFunction,
        calculateBudgetSolutionFunction,
      ]
    case 'order':
      return [getOrderStatusFunction, getOrderHistoryFunction]
    case 'shipping':
      return [getShippingInfoFunction, calculateShippingFunction]
    case 'all':
    default:
      return ALL_FUNCTIONS
  }
}
