// Payment Types and Interfaces

export type PaymentProvider = 'paymob' | 'fawry' | 'cash_on_delivery'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'expired'

export type PaymentMethod =
  | 'card'
  | 'wallet'
  | 'kiosk'
  | 'cash'
  | 'bank_transfer'

export interface PaymentConfig {
  provider: PaymentProvider
  isEnabled: boolean
  isProduction: boolean
  apiKey: string
  secretKey?: string
  merchantId?: string
  integrationIds?: Record<PaymentMethod, string>
}

export interface PaymentCustomer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  address?: {
    street: string
    building?: string
    floor?: string
    apartment?: string
    city: string
    state?: string
    country: string
    postalCode?: string
  }
}

export interface PaymentItem {
  id: string
  name: string
  nameAr?: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface PaymentRequest {
  orderId: string
  amount: number
  currency: 'EGP' | 'SAR' | 'USD'
  customer: PaymentCustomer
  items: PaymentItem[]
  method: PaymentMethod
  returnUrl?: string
  cancelUrl?: string
  webhookUrl?: string
  metadata?: Record<string, unknown>
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  referenceNumber?: string
  paymentUrl?: string
  qrCode?: string
  kioskCode?: string
  expiryDate?: string
  status: PaymentStatus
  message?: string
  rawResponse?: unknown
}

export interface PaymentCallback {
  provider: PaymentProvider
  transactionId: string
  orderId: string
  status: PaymentStatus
  amount: number
  currency: string
  paidAt?: string
  rawData: unknown
}

export interface RefundRequest {
  transactionId: string
  amount?: number // Partial refund amount, full refund if not specified
  reason?: string
}

export interface RefundResponse {
  success: boolean
  refundId?: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  message?: string
}

// Provider-specific types
export interface PaymobAuthResponse {
  token: string
  profile: {
    id: number
    username: string
    email: string
  }
}

export interface PaymobOrderResponse {
  id: number
  created_at: string
  delivery_needed: boolean
  merchant: {
    id: number
    created_at: string
  }
  amount_cents: number
  currency: string
}

export interface PaymobPaymentKeyResponse {
  token: string
}

export interface FawryChargeResponse {
  type: string
  referenceNumber: string
  merchantRefNumber: string
  orderAmount: number
  paymentAmount: number
  fawryFees: number
  paymentMethod: string
  orderStatus: string
  paymentTime: number
  customerMobile: string
  customerMail: string
  customerProfileId: string
  signature: string
  statusCode: number
  statusDescription: string
}

// Payment Gateway Interface
export interface PaymentGateway {
  provider: PaymentProvider
  initialize(config: PaymentConfig): Promise<void>
  createPayment(request: PaymentRequest): Promise<PaymentResponse>
  verifyPayment(transactionId: string): Promise<PaymentCallback>
  refund(request: RefundRequest): Promise<RefundResponse>
  handleWebhook(data: unknown): Promise<PaymentCallback>
}
