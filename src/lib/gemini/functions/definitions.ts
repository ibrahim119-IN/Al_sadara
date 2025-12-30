/**
 * Function Calling Definitions for Gemini AI
 * These functions are available for the AI to call
 */
import { FunctionDeclaration } from '../types'

/**
 * All available functions for the shopping assistant
 */
export const shoppingFunctions: FunctionDeclaration[] = [
  // ===== Product Search & Discovery =====
  {
    name: 'search_products',
    description: 'البحث في المنتجات بالاسم أو الوصف أو الفئة. استخدم هذه الدالة عندما يريد المستخدم البحث عن منتج معين.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'كلمات البحث التي يريدها المستخدم',
        },
        category: {
          type: 'STRING',
          description: 'الفئة المحددة للبحث (اختياري)',
        },
        minPrice: {
          type: 'NUMBER',
          description: 'الحد الأدنى للسعر بالجنيه المصري',
        },
        maxPrice: {
          type: 'NUMBER',
          description: 'الحد الأقصى للسعر بالجنيه المصري',
        },
        inStock: {
          type: 'BOOLEAN',
          description: 'فقط المنتجات المتوفرة',
        },
        limit: {
          type: 'NUMBER',
          description: 'عدد النتائج المطلوبة (الافتراضي 10)',
        },
      },
      required: ['query'],
    },
  },

  {
    name: 'get_product_details',
    description: 'الحصول على تفاصيل منتج معين بما في ذلك السعر والمواصفات والتقييمات',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: {
          type: 'STRING',
          description: 'معرف المنتج',
        },
        productName: {
          type: 'STRING',
          description: 'اسم المنتج للبحث عنه',
        },
      },
      required: [],
    },
  },

  {
    name: 'get_recommendations',
    description: 'الحصول على توصيات منتجات مخصصة بناءً على المنتج الحالي أو تفضيلات المستخدم',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: {
          type: 'STRING',
          description: 'معرف المنتج للحصول على منتجات مشابهة',
        },
        category: {
          type: 'STRING',
          description: 'الفئة للحصول على أفضل المنتجات فيها',
        },
        priceRange: {
          type: 'STRING',
          description: 'نطاق السعر (low, medium, high)',
        },
        limit: {
          type: 'NUMBER',
          description: 'عدد التوصيات المطلوبة',
        },
      },
      required: [],
    },
  },

  // ===== Product Comparison =====
  {
    name: 'compare_products',
    description: 'مقارنة منتجين أو أكثر وإظهار الفروقات في المواصفات والأسعار',
    parameters: {
      type: 'OBJECT',
      properties: {
        productIds: {
          type: 'STRING',
          description: 'قائمة معرفات المنتجات مفصولة بفواصل',
        },
        productNames: {
          type: 'STRING',
          description: 'أسماء المنتجات للمقارنة مفصولة بفواصل',
        },
      },
      required: [],
    },
  },

  // ===== Inventory & Stock =====
  {
    name: 'check_stock',
    description: 'فحص توفر منتج معين في المخزون',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: {
          type: 'STRING',
          description: 'معرف المنتج',
        },
        productName: {
          type: 'STRING',
          description: 'اسم المنتج',
        },
      },
      required: [],
    },
  },

  // ===== Categories =====
  {
    name: 'get_categories',
    description: 'الحصول على قائمة الفئات المتاحة في المتجر',
    parameters: {
      type: 'OBJECT',
      properties: {
        parentCategory: {
          type: 'STRING',
          description: 'الفئة الرئيسية للحصول على الفئات الفرعية',
        },
      },
      required: [],
    },
  },

  // ===== Cart Operations =====
  {
    name: 'add_to_cart',
    description: 'إضافة منتج إلى سلة التسوق',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: {
          type: 'STRING',
          description: 'معرف المنتج',
        },
        quantity: {
          type: 'NUMBER',
          description: 'الكمية المطلوبة',
        },
      },
      required: ['productId'],
    },
  },

  {
    name: 'get_cart',
    description: 'الحصول على محتويات سلة التسوق الحالية',
    parameters: {
      type: 'OBJECT',
      properties: {},
      required: [],
    },
  },

  // ===== Orders =====
  {
    name: 'get_order_status',
    description: 'تتبع حالة طلب معين',
    parameters: {
      type: 'OBJECT',
      properties: {
        orderId: {
          type: 'STRING',
          description: 'رقم الطلب',
        },
        email: {
          type: 'STRING',
          description: 'البريد الإلكتروني للتحقق',
        },
        phone: {
          type: 'STRING',
          description: 'رقم الهاتف للتحقق',
        },
      },
      required: ['orderId'],
    },
  },

  // ===== Shipping =====
  {
    name: 'calculate_shipping',
    description: 'حساب تكلفة الشحن بناءً على الموقع والطلب',
    parameters: {
      type: 'OBJECT',
      properties: {
        governorate: {
          type: 'STRING',
          description: 'المحافظة (مثل: القاهرة، الجيزة، الإسكندرية)',
        },
        weight: {
          type: 'NUMBER',
          description: 'الوزن الإجمالي بالكيلوجرام',
        },
        orderTotal: {
          type: 'NUMBER',
          description: 'إجمالي قيمة الطلب',
        },
      },
      required: ['governorate'],
    },
  },

  // ===== Deals & Offers =====
  {
    name: 'get_deals',
    description: 'الحصول على العروض والخصومات الحالية',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: {
          type: 'STRING',
          description: 'الفئة للبحث عن العروض فيها',
        },
        minDiscount: {
          type: 'NUMBER',
          description: 'الحد الأدنى لنسبة الخصم',
        },
      },
      required: [],
    },
  },

  // ===== Budget Planning =====
  {
    name: 'plan_budget',
    description: 'التخطيط للميزانية واقتراح منتجات ضمن ميزانية محددة',
    parameters: {
      type: 'OBJECT',
      properties: {
        budget: {
          type: 'NUMBER',
          description: 'الميزانية المتاحة بالجنيه المصري',
        },
        categories: {
          type: 'STRING',
          description: 'الفئات المطلوبة مفصولة بفواصل',
        },
        priorities: {
          type: 'STRING',
          description: 'الأولويات (quality, price, variety)',
        },
      },
      required: ['budget'],
    },
  },

  // ===== Knowledge Base & Policies =====
  {
    name: 'search_knowledge',
    description: 'البحث في قاعدة المعرفة عن السياسات والأسئلة الشائعة والأدلة. استخدم هذه الدالة عند السؤال عن: سياسة الشحن، الإرجاع، الضمان، طرق الدفع، التركيب، أو أي أسئلة متكررة.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'سؤال المستخدم أو الموضوع المطلوب البحث عنه',
        },
        type: {
          type: 'STRING',
          description: 'نوع المحتوى: policy (سياسة)، faq (سؤال شائع)، guide (دليل)',
        },
        category: {
          type: 'STRING',
          description: 'الفئة: shipping، return، warranty، payment، installation',
        },
      },
      required: ['query'],
    },
  },
]

/**
 * Get function declarations in Gemini API format
 */
export function getFunctionDeclarations() {
  return shoppingFunctions.map((fn) => ({
    name: fn.name,
    description: fn.description,
    parameters: fn.parameters,
  }))
}

/**
 * Get function by name
 */
export function getFunctionByName(name: string): FunctionDeclaration | undefined {
  return shoppingFunctions.find((fn) => fn.name === name)
}

/**
 * Validate function arguments
 */
export function validateFunctionArgs(
  functionName: string,
  args: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const fn = getFunctionByName(functionName)
  if (!fn) {
    return { valid: false, errors: [`Function ${functionName} not found`] }
  }

  const errors: string[] = []
  const required = fn.parameters.required || []

  for (const param of required) {
    if (args[param] === undefined || args[param] === null) {
      errors.push(`Missing required parameter: ${param}`)
    }
  }

  return { valid: errors.length === 0, errors }
}
