import type { FunctionCall, FunctionResult } from '../types'
import {
  executeSearchProducts,
  executeGetProductDetails,
  executeCheckStock,
  executeCompareProducts,
  executeGetRecommendations,
  executeGetSimilarProducts,
  executeCalculateBudgetSolution,
} from './product-functions'
import { executeGetOrderStatus, executeGetOrderHistory } from './order-functions'
import { executeGetShippingInfo, executeCalculateShipping } from './shipping-functions'
import { executeGetCartItems } from './cart-functions'

/**
 * Function Executor
 * Routes and executes function calls from the AI
 */

/**
 * Execute a single function call
 */
export async function executeFunction(
  functionCall: FunctionCall,
  context?: {
    customerId?: string
    sessionId?: string
    locale?: 'ar' | 'en'
    cartItems?: any[]
  }
): Promise<FunctionResult> {
  const { name, arguments: args } = functionCall

  console.log(`[FunctionExecutor] Executing function: ${name}`)
  console.log(`[FunctionExecutor] Arguments:`, JSON.stringify(args, null, 2))

  try {
    let result: any

    switch (name) {
      // ==================== PRODUCT FUNCTIONS ====================

      case 'search_products':
        result = await executeSearchProducts(args as any)
        break

      case 'get_product_details':
        result = await executeGetProductDetails(args as any)
        break

      case 'check_stock':
        result = await executeCheckStock(args as any)
        break

      case 'compare_products':
        result = await executeCompareProducts(args as any)
        break

      case 'get_recommendations':
        result = await executeGetRecommendations(args as any)
        break

      case 'get_similar_products':
        result = await executeGetSimilarProducts(args as any)
        break

      case 'calculate_budget_solution':
        result = await executeCalculateBudgetSolution(args as any)
        break

      // ==================== ORDER FUNCTIONS ====================

      case 'get_order_status':
        result = await executeGetOrderStatus({
          ...(args as any),
          customerId: context?.customerId,
        })
        break

      case 'get_order_history':
        if (!context?.customerId) {
          result = {
            success: false,
            error: 'يجب تسجيل الدخول لعرض سجل الطلبات',
          }
        } else {
          result = await executeGetOrderHistory({
            customerId: context.customerId,
            limit: (args as any).limit,
          })
        }
        break

      // ==================== SHIPPING FUNCTIONS ====================

      case 'get_shipping_info':
        result = await executeGetShippingInfo(args as any)
        break

      case 'calculate_shipping':
        result = await executeCalculateShipping(args as any)
        break

      // ==================== CART FUNCTIONS ====================

      case 'get_cart_items':
        result = await executeGetCartItems({
          sessionId: context?.sessionId,
          customerId: context?.customerId,
          cartItems: context?.cartItems,
        })
        break

      // ==================== UNKNOWN FUNCTION ====================

      default:
        result = {
          success: false,
          error: `وظيفة غير معروفة: ${name}`,
        }
    }

    console.log(`[FunctionExecutor] Function ${name} completed successfully`)

    return {
      name,
      result,
    }
  } catch (error: any) {
    console.error(`[FunctionExecutor] Error executing function ${name}:`, error)

    return {
      name,
      result: {
        success: false,
        error: error.message || 'حدث خطأ أثناء تنفيذ الوظيفة',
      },
      error: error.message,
    }
  }
}

/**
 * Execute multiple function calls in parallel
 */
export async function executeFunctions(
  functionCalls: FunctionCall[],
  context?: {
    customerId?: string
    locale?: 'ar' | 'en'
  }
): Promise<FunctionResult[]> {
  if (functionCalls.length === 0) {
    return []
  }

  console.log(`[FunctionExecutor] Executing ${functionCalls.length} functions in parallel`)

  // Execute all functions in parallel
  const results = await Promise.all(
    functionCalls.map((functionCall) => executeFunction(functionCall, context))
  )

  console.log(`[FunctionExecutor] Completed ${results.length} function executions`)

  return results
}

/**
 * Format function results for AI consumption
 */
export function formatFunctionResults(results: FunctionResult[]): string {
  if (results.length === 0) {
    return 'لا توجد نتائج من الوظائف'
  }

  const formatted = results
    .map((result) => {
      const resultData =
        typeof result.result === 'string'
          ? result.result
          : JSON.stringify(result.result, null, 2)

      return `### نتيجة الوظيفة: ${result.name}\n${resultData}`
    })
    .join('\n\n')

  return formatted
}

/**
 * Check if function call is authorized for the current user
 */
export function isFunctionAuthorized(
  functionName: string,
  isAuthenticated: boolean
): {
  authorized: boolean
  reason?: string
} {
  // Functions that require authentication
  const authRequiredFunctions = ['get_order_history']

  // Functions that work better with authentication but don't require it
  const authPreferredFunctions = ['get_order_status', 'get_recommendations']

  if (authRequiredFunctions.includes(functionName) && !isAuthenticated) {
    return {
      authorized: false,
      reason: 'يجب تسجيل الدخول لاستخدام هذه الوظيفة',
    }
  }

  if (authPreferredFunctions.includes(functionName) && !isAuthenticated) {
    console.warn(
      `[FunctionExecutor] Function ${functionName} works better with authentication`
    )
  }

  return {
    authorized: true,
  }
}

/**
 * Validate function arguments
 */
export function validateFunctionArguments(
  functionName: string,
  args: Record<string, any>
): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  switch (functionName) {
    case 'search_products':
      if (!args.query || typeof args.query !== 'string') {
        errors.push('query مطلوب ويجب أن يكون نص')
      }
      break

    case 'get_product_details':
      if (!args.productId || typeof args.productId !== 'string') {
        errors.push('productId مطلوب ويجب أن يكون نص')
      }
      break

    case 'compare_products':
      if (!Array.isArray(args.productIds)) {
        errors.push('productIds يجب أن يكون مصفوفة')
      } else if (args.productIds.length < 2 || args.productIds.length > 4) {
        errors.push('يجب مقارنة 2-4 منتجات')
      }
      break

    case 'calculate_budget_solution':
      if (!args.budget || typeof args.budget !== 'number') {
        errors.push('budget مطلوب ويجب أن يكون رقم')
      }
      if (!args.requirements || typeof args.requirements !== 'string') {
        errors.push('requirements مطلوب ويجب أن يكون نص')
      }
      break

    case 'get_order_status':
      if (!args.orderNumber || typeof args.orderNumber !== 'string') {
        errors.push('orderNumber مطلوب ويجب أن يكون نص')
      }
      break

    case 'calculate_shipping':
      if (!args.governorate || typeof args.governorate !== 'string') {
        errors.push('governorate مطلوب ويجب أن يكون نص')
      }
      if (!args.orderValue || typeof args.orderValue !== 'number') {
        errors.push('orderValue مطلوب ويجب أن يكون رقم')
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}
