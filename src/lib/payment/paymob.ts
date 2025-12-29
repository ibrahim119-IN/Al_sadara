// Paymob Payment Gateway Integration
// Documentation: https://docs.paymob.com/

import {
  PaymentGateway,
  PaymentConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentCallback,
  RefundRequest,
  RefundResponse,
  PaymentStatus,
  PaymobAuthResponse,
  PaymobOrderResponse,
  PaymobPaymentKeyResponse,
} from './types'

const PAYMOB_API_URL = 'https://accept.paymob.com/api'

export class PaymobGateway implements PaymentGateway {
  provider = 'paymob' as const
  private config: PaymentConfig | null = null
  private authToken: string | null = null
  private tokenExpiry: number = 0

  async initialize(config: PaymentConfig): Promise<void> {
    this.config = config
    await this.authenticate()
  }

  private async authenticate(): Promise<string> {
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken
    }

    if (!this.config) {
      throw new Error('Paymob gateway not initialized')
    }

    const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: this.config.apiKey }),
    })

    if (!response.ok) {
      throw new Error('Failed to authenticate with Paymob')
    }

    const data: PaymobAuthResponse = await response.json()
    this.authToken = data.token
    // Token expires in 1 hour, refresh 5 minutes before
    this.tokenExpiry = Date.now() + 55 * 60 * 1000

    return this.authToken
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.authenticate()

      // Step 1: Create order
      const order = await this.createOrder(token, request)

      // Step 2: Get payment key
      const paymentKey = await this.getPaymentKey(token, order.id, request)

      // Step 3: Generate payment URL based on method
      const paymentUrl = this.generatePaymentUrl(paymentKey.token, request.method)

      return {
        success: true,
        transactionId: order.id.toString(),
        referenceNumber: order.id.toString(),
        paymentUrl,
        status: 'pending',
        message: 'Payment initiated successfully',
        rawResponse: { order, paymentKey },
      }
    } catch (error) {
      console.error('[Paymob] Payment creation failed:', error)
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }

  private async createOrder(token: string, request: PaymentRequest): Promise<PaymobOrderResponse> {
    const response = await fetch(`${PAYMOB_API_URL}/ecommerce/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: Math.round(request.amount * 100),
        currency: request.currency,
        merchant_order_id: request.orderId,
        items: request.items.map((item) => ({
          name: item.name,
          description: item.description || item.name,
          amount_cents: Math.round(item.unitPrice * 100),
          quantity: item.quantity,
        })),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create Paymob order: ${error}`)
    }

    return response.json()
  }

  private async getPaymentKey(
    token: string,
    orderId: number,
    request: PaymentRequest
  ): Promise<PaymobPaymentKeyResponse> {
    if (!this.config?.integrationIds) {
      throw new Error('Integration IDs not configured')
    }

    const integrationId = this.config.integrationIds[request.method]
    if (!integrationId) {
      throw new Error(`Integration ID not found for method: ${request.method}`)
    }

    const billingData = {
      first_name: request.customer.firstName,
      last_name: request.customer.lastName,
      email: request.customer.email,
      phone_number: request.customer.phone,
      street: request.customer.address?.street || 'N/A',
      building: request.customer.address?.building || 'N/A',
      floor: request.customer.address?.floor || 'N/A',
      apartment: request.customer.address?.apartment || 'N/A',
      city: request.customer.address?.city || 'N/A',
      state: request.customer.address?.state || 'N/A',
      country: request.customer.address?.country || 'EG',
      postal_code: request.customer.address?.postalCode || 'N/A',
    }

    const response = await fetch(`${PAYMOB_API_URL}/acceptance/payment_keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: token,
        amount_cents: Math.round(request.amount * 100),
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: billingData,
        currency: request.currency,
        integration_id: parseInt(integrationId),
        lock_order_when_paid: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get payment key: ${error}`)
    }

    return response.json()
  }

  private generatePaymentUrl(paymentToken: string, method: string): string {
    if (method === 'card') {
      return `https://accept.paymob.com/api/acceptance/iframes/${this.config?.integrationIds?.card}?payment_token=${paymentToken}`
    }
    if (method === 'wallet') {
      return `https://accept.paymob.com/api/acceptance/wallets/${paymentToken}`
    }
    if (method === 'kiosk') {
      return `https://accept.paymob.com/api/acceptance/kiosk/${paymentToken}`
    }
    return `https://accept.paymob.com/api/acceptance/iframes?payment_token=${paymentToken}`
  }

  async verifyPayment(transactionId: string): Promise<PaymentCallback> {
    const token = await this.authenticate()

    const response = await fetch(
      `${PAYMOB_API_URL}/acceptance/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const data = await response.json()

    return {
      provider: 'paymob',
      transactionId: data.id.toString(),
      orderId: data.order?.merchant_order_id || '',
      status: this.mapStatus(data.success, data.is_refunded, data.is_voided),
      amount: data.amount_cents / 100,
      currency: data.currency,
      paidAt: data.created_at,
      rawData: data,
    }
  }

  private mapStatus(success: boolean, isRefunded: boolean, isVoided: boolean): PaymentStatus {
    if (isRefunded) return 'refunded'
    if (isVoided) return 'cancelled'
    if (success) return 'completed'
    return 'failed'
  }

  async refund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const token = await this.authenticate()

      // First, get the transaction to know the amount
      const transaction = await this.verifyPayment(request.transactionId)
      const refundAmount = request.amount || transaction.amount

      const response = await fetch(`${PAYMOB_API_URL}/acceptance/void_refund/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_token: token,
          transaction_id: request.transactionId,
          amount_cents: Math.round(refundAmount * 100),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Refund failed: ${error}`)
      }

      const data = await response.json()

      return {
        success: true,
        refundId: data.id?.toString(),
        amount: refundAmount,
        status: 'completed',
        message: 'Refund processed successfully',
      }
    } catch (error) {
      return {
        success: false,
        amount: request.amount || 0,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Refund failed',
      }
    }
  }

  async handleWebhook(data: unknown): Promise<PaymentCallback> {
    const payload = data as Record<string, unknown>
    const obj = payload.obj as Record<string, unknown>

    // Verify HMAC signature if configured
    if (this.config?.secretKey && payload.hmac) {
      const isValid = this.verifyHmac(payload)
      if (!isValid) {
        throw new Error('Invalid webhook signature')
      }
    }

    return {
      provider: 'paymob',
      transactionId: (obj.id as number).toString(),
      orderId: (obj.order as Record<string, unknown>)?.merchant_order_id as string || '',
      status: this.mapStatus(
        obj.success as boolean,
        obj.is_refunded as boolean,
        obj.is_voided as boolean
      ),
      amount: (obj.amount_cents as number) / 100,
      currency: obj.currency as string,
      paidAt: obj.created_at as string,
      rawData: payload,
    }
  }

  private verifyHmac(payload: Record<string, unknown>): boolean {
    // Implement HMAC verification according to Paymob docs
    // This is a placeholder - implement based on your security requirements
    return true
  }
}

// Singleton instance
let paymobInstance: PaymobGateway | null = null

export function getPaymobGateway(): PaymobGateway {
  if (!paymobInstance) {
    paymobInstance = new PaymobGateway()
  }
  return paymobInstance
}
