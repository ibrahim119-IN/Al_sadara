// Fawry Payment Gateway Integration
// Documentation: https://developer.fawrystaging.com/

import crypto from 'crypto'
import {
  PaymentGateway,
  PaymentConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentCallback,
  RefundRequest,
  RefundResponse,
  PaymentStatus,
  FawryChargeResponse,
} from './types'

const FAWRY_STAGING_URL = 'https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments'
const FAWRY_PRODUCTION_URL = 'https://www.atfawry.com/ECommerceWeb/Fawry/payments'

export class FawryGateway implements PaymentGateway {
  provider = 'fawry' as const
  private config: PaymentConfig | null = null
  private baseUrl: string = FAWRY_STAGING_URL

  async initialize(config: PaymentConfig): Promise<void> {
    this.config = config
    this.baseUrl = config.isProduction ? FAWRY_PRODUCTION_URL : FAWRY_STAGING_URL
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      if (!this.config) {
        throw new Error('Fawry gateway not initialized')
      }

      const chargeRequest = this.buildChargeRequest(request)
      const signature = this.generateSignature(chargeRequest)

      const response = await fetch(`${this.baseUrl}/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...chargeRequest,
          signature,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Fawry charge failed: ${error}`)
      }

      const data: FawryChargeResponse = await response.json()

      if (data.statusCode !== 200) {
        throw new Error(data.statusDescription || 'Payment failed')
      }

      // For pay-at-fawry (kiosk) method
      if (request.method === 'kiosk') {
        return {
          success: true,
          transactionId: data.referenceNumber,
          referenceNumber: data.referenceNumber,
          kioskCode: data.referenceNumber,
          expiryDate: this.calculateExpiry(24), // 24 hours expiry
          status: 'pending',
          message: 'Use this reference number to pay at any Fawry outlet',
          rawResponse: data,
        }
      }

      // For card payment
      const paymentUrl = this.generatePaymentUrl(data.referenceNumber, request)

      return {
        success: true,
        transactionId: data.referenceNumber,
        referenceNumber: data.referenceNumber,
        paymentUrl,
        status: 'pending',
        message: 'Payment initiated successfully',
        rawResponse: data,
      }
    } catch (error) {
      console.error('[Fawry] Payment creation failed:', error)
      return {
        success: false,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Payment failed',
      }
    }
  }

  private buildChargeRequest(request: PaymentRequest): Record<string, unknown> {
    if (!this.config) {
      throw new Error('Fawry gateway not initialized')
    }

    const paymentMethod = request.method === 'kiosk' ? 'PAYATFAWRY' : 'CARD'
    const paymentExpiry = request.method === 'kiosk'
      ? Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
      : Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour

    return {
      merchantCode: this.config.merchantId,
      merchantRefNum: request.orderId,
      customerProfileId: request.customer.id,
      customerName: `${request.customer.firstName} ${request.customer.lastName}`,
      customerMobile: request.customer.phone,
      customerEmail: request.customer.email,
      paymentMethod,
      amount: request.amount.toFixed(2),
      currencyCode: request.currency,
      chargeItems: request.items.map((item) => ({
        itemId: item.id,
        description: item.name,
        price: item.unitPrice.toFixed(2),
        quantity: item.quantity,
      })),
      returnUrl: request.returnUrl,
      paymentExpiry,
    }
  }

  private generateSignature(chargeRequest: Record<string, unknown>): string {
    if (!this.config?.secretKey) {
      throw new Error('Fawry secret key not configured')
    }

    // Build signature string according to Fawry documentation
    const items = chargeRequest.chargeItems as Array<{ itemId: string; price: string; quantity: number }>
    const itemsString = items
      .map((item) => `${item.itemId}${item.quantity}${item.price}`)
      .join('')

    const signatureString = [
      this.config.merchantId,
      chargeRequest.merchantRefNum,
      chargeRequest.customerProfileId,
      chargeRequest.returnUrl || '',
      itemsString,
      this.config.secretKey,
    ].join('')

    return crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex')
  }

  private generatePaymentUrl(referenceNumber: string, request: PaymentRequest): string {
    const params = new URLSearchParams({
      referenceNumber,
      returnUrl: request.returnUrl || '',
    })
    return `${this.baseUrl}/fawrypay-payment?${params.toString()}`
  }

  private calculateExpiry(hours: number): string {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    return date.toISOString()
  }

  async verifyPayment(referenceNumber: string): Promise<PaymentCallback> {
    if (!this.config) {
      throw new Error('Fawry gateway not initialized')
    }

    const signature = this.generateStatusSignature(referenceNumber)

    const response = await fetch(
      `${this.baseUrl}/status?` +
        new URLSearchParams({
          merchantCode: this.config.merchantId || '',
          merchantRefNumber: referenceNumber,
          signature,
        })
    )

    if (!response.ok) {
      throw new Error('Failed to verify payment')
    }

    const data = await response.json()

    return {
      provider: 'fawry',
      transactionId: data.referenceNumber,
      orderId: data.merchantRefNumber,
      status: this.mapStatus(data.orderStatus),
      amount: parseFloat(data.paymentAmount),
      currency: 'EGP',
      paidAt: data.paymentTime ? new Date(data.paymentTime).toISOString() : undefined,
      rawData: data,
    }
  }

  private generateStatusSignature(referenceNumber: string): string {
    if (!this.config?.secretKey) {
      throw new Error('Fawry secret key not configured')
    }

    const signatureString = `${this.config.merchantId}${referenceNumber}${this.config.secretKey}`
    return crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex')
  }

  private mapStatus(fawryStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      PAID: 'completed',
      NEW: 'pending',
      UNPAID: 'pending',
      CANCELED: 'cancelled',
      EXPIRED: 'expired',
      REFUNDED: 'refunded',
      FAILED: 'failed',
    }
    return statusMap[fawryStatus] || 'pending'
  }

  async refund(request: RefundRequest): Promise<RefundResponse> {
    try {
      if (!this.config) {
        throw new Error('Fawry gateway not initialized')
      }

      // First, get the transaction to know the amount
      const transaction = await this.verifyPayment(request.transactionId)
      const refundAmount = request.amount || transaction.amount

      const signature = this.generateRefundSignature(request.transactionId, refundAmount)

      const response = await fetch(`${this.baseUrl}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantCode: this.config.merchantId,
          referenceNumber: request.transactionId,
          refundAmount: refundAmount.toFixed(2),
          reason: request.reason || 'Customer request',
          signature,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Refund failed: ${error}`)
      }

      const data = await response.json()

      if (data.statusCode !== 200) {
        throw new Error(data.statusDescription || 'Refund failed')
      }

      return {
        success: true,
        refundId: data.referenceNumber,
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

  private generateRefundSignature(referenceNumber: string, amount: number): string {
    if (!this.config?.secretKey) {
      throw new Error('Fawry secret key not configured')
    }

    const signatureString = `${this.config.merchantId}${referenceNumber}${amount.toFixed(2)}${this.config.secretKey}`
    return crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex')
  }

  async handleWebhook(data: unknown): Promise<PaymentCallback> {
    const payload = data as FawryChargeResponse

    // Verify webhook signature
    if (this.config?.secretKey) {
      const isValid = this.verifyWebhookSignature(payload)
      if (!isValid) {
        throw new Error('Invalid webhook signature')
      }
    }

    return {
      provider: 'fawry',
      transactionId: payload.referenceNumber,
      orderId: payload.merchantRefNumber,
      status: this.mapStatus(payload.orderStatus),
      amount: payload.paymentAmount,
      currency: 'EGP',
      paidAt: payload.paymentTime ? new Date(payload.paymentTime).toISOString() : undefined,
      rawData: payload,
    }
  }

  private verifyWebhookSignature(payload: FawryChargeResponse): boolean {
    if (!this.config?.secretKey) return true

    const signatureString = [
      payload.referenceNumber,
      payload.merchantRefNumber,
      payload.paymentAmount.toFixed(2),
      payload.orderAmount.toFixed(2),
      payload.orderStatus,
      payload.paymentMethod,
      payload.fawryFees?.toFixed(2) || '',
      this.config.secretKey,
    ].join('')

    const expectedSignature = crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex')

    return expectedSignature === payload.signature
  }
}

// Singleton instance
let fawryInstance: FawryGateway | null = null

export function getFawryGateway(): FawryGateway {
  if (!fawryInstance) {
    fawryInstance = new FawryGateway()
  }
  return fawryInstance
}
