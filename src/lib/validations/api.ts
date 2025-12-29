import { z } from 'zod'

// Egyptian phone number validation (01XXXXXXXXX format)
const egyptianPhoneRegex = /^01[0125][0-9]{8}$/

// ==================== Chat API Schemas ====================

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  sessionId: z.string().optional(),
  customerId: z.union([z.string(), z.number(), z.null()]).optional(),
  locale: z.enum(['ar', 'en']).default('ar'),
  cartItems: z
    .array(
      z.object({
        productId: z.union([z.string(), z.number()]),
        quantity: z.number().positive(),
        name: z.string().optional(),
      })
    )
    .optional(),
  pageContext: z.object({
    pageName: z.enum(['home', 'company', 'product', 'products', 'contact', 'about', 'other']),
    companySlug: z.string().optional(),
    productId: z.string().optional(),
    locale: z.enum(['ar', 'en']),
  }).nullable().optional(),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>

// ==================== Order API Schemas ====================

export const ShippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(egyptianPhoneRegex, 'Invalid Egyptian phone number (format: 01XXXXXXXXX)'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address must be less than 500 characters')
    .trim(),
  city: z
    .string()
    .min(2, 'City is required')
    .max(100, 'City name too long')
    .trim(),
  governorate: z
    .string()
    .min(2, 'Governorate is required')
    .max(100, 'Governorate name too long')
    .trim(),
})

export const OrderItemSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
})

export const CreateOrderRequestSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['bank-transfer', 'vodafone-cash', 'cash-on-delivery']),
  customerNotes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  customerId: z.number().optional(),
})

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>

// ==================== Customer API Schemas ====================

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'Password too long'),
})

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>

export const CustomerRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(egyptianPhoneRegex, 'Invalid Egyptian phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
  customerType: z.enum(['individual', 'company']).default('individual'),
})

export type CustomerRegistration = z.infer<typeof CustomerRegistrationSchema>

// ==================== Validation Helper ====================

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: { field: string; message: string }[]
}

/**
 * Validate data against a Zod schema
 * Returns a structured result with success status and either data or errors
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  }

  // Get issues from Zod error
  const zodError = result.error as { issues?: Array<{ path: (string | number)[]; message: string }> }
  const issues = zodError.issues || []
  const errors = issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }))

  return {
    success: false,
    errors,
  }
}
