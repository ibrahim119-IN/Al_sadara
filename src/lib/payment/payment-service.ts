// Unified Payment Service
// Abstracts different payment gateways

import {
  PaymentGateway,
  PaymentProvider,
  PaymentRequest,
  PaymentResponse,
  PaymentCallback,
  RefundRequest,
  RefundResponse,
  PaymentConfig,
  PaymentMethod,
} from './types'
import { getPaymobGateway, PaymobGateway } from './paymob'
import { getFawryGateway, FawryGateway } from './fawry'

// Payment configuration from environment
function getPaymentConfig(provider: PaymentProvider): PaymentConfig {
  switch (provider) {
    case 'paymob':
      return {
        provider: 'paymob',
        isEnabled: !!process.env.PAYMOB_API_KEY,
        isProduction: process.env.NODE_ENV === 'production',
        apiKey: process.env.PAYMOB_API_KEY || '',
        secretKey: process.env.PAYMOB_HMAC_SECRET,
        integrationIds: {
          card: process.env.PAYMOB_CARD_INTEGRATION_ID || '',
          wallet: process.env.PAYMOB_WALLET_INTEGRATION_ID || '',
          kiosk: process.env.PAYMOB_KIOSK_INTEGRATION_ID || '',
          cash: '',
          bank_transfer: '',
        },
      }
    case 'fawry':
      return {
        provider: 'fawry',
        isEnabled: !!process.env.FAWRY_MERCHANT_CODE,
        isProduction: process.env.NODE_ENV === 'production',
        apiKey: process.env.FAWRY_MERCHANT_CODE || '',
        secretKey: process.env.FAWRY_SECURITY_KEY,
        merchantId: process.env.FAWRY_MERCHANT_CODE,
      }
    case 'cash_on_delivery':
      return {
        provider: 'cash_on_delivery',
        isEnabled: process.env.ENABLE_CASH_ON_DELIVERY === 'true',
        isProduction: true,
        apiKey: '',
      }
    default:
      throw new Error(`Unknown payment provider: ${provider}`)
  }
}

// Gateway instances cache
const gateways: Map<PaymentProvider, PaymentGateway> = new Map()

async function getGateway(provider: PaymentProvider): Promise<PaymentGateway> {
  let gateway = gateways.get(provider)

  if (!gateway) {
    const config = getPaymentConfig(provider)

    if (!config.isEnabled) {
      throw new Error(`Payment provider ${provider} is not enabled`)
    }

    switch (provider) {
      case 'paymob':
        gateway = getPaymobGateway()
        break
      case 'fawry':
        gateway = getFawryGateway()
        break
      default:
        throw new Error(`Unsupported payment provider: ${provider}`)
    }

    await gateway.initialize(config)
    gateways.set(provider, gateway)
  }

  return gateway
}

// Get available payment methods
export function getAvailablePaymentMethods(): Array<{
  provider: PaymentProvider
  methods: PaymentMethod[]
  name: string
  nameAr: string
}> {
  const methods: Array<{
    provider: PaymentProvider
    methods: PaymentMethod[]
    name: string
    nameAr: string
  }> = []

  // Check Paymob
  const paymobConfig = getPaymentConfig('paymob')
  if (paymobConfig.isEnabled) {
    methods.push({
      provider: 'paymob',
      methods: ['card', 'wallet', 'kiosk'],
      name: 'Pay by Card / Mobile Wallet / Kiosk',
      nameAr: 'الدفع بالبطاقة / المحفظة / المنافذ',
    })
  }

  // Check Fawry
  const fawryConfig = getPaymentConfig('fawry')
  if (fawryConfig.isEnabled) {
    methods.push({
      provider: 'fawry',
      methods: ['card', 'kiosk'],
      name: 'Pay with Fawry',
      nameAr: 'الدفع عبر فوري',
    })
  }

  // Cash on Delivery
  const codConfig = getPaymentConfig('cash_on_delivery')
  if (codConfig.isEnabled) {
    methods.push({
      provider: 'cash_on_delivery',
      methods: ['cash'],
      name: 'Cash on Delivery',
      nameAr: 'الدفع عند الاستلام',
    })
  }

  return methods
}

// Create a payment
export async function createPayment(
  provider: PaymentProvider,
  request: PaymentRequest
): Promise<PaymentResponse> {
  // Handle Cash on Delivery separately
  if (provider === 'cash_on_delivery') {
    return {
      success: true,
      transactionId: `COD-${request.orderId}`,
      referenceNumber: request.orderId,
      status: 'pending',
      message: 'Order placed. Payment will be collected on delivery.',
    }
  }

  const gateway = await getGateway(provider)
  return gateway.createPayment(request)
}

// Verify a payment
export async function verifyPayment(
  provider: PaymentProvider,
  transactionId: string
): Promise<PaymentCallback> {
  if (provider === 'cash_on_delivery') {
    return {
      provider: 'cash_on_delivery',
      transactionId,
      orderId: transactionId.replace('COD-', ''),
      status: 'pending',
      amount: 0,
      currency: 'EGP',
      rawData: {},
    }
  }

  const gateway = await getGateway(provider)
  return gateway.verifyPayment(transactionId)
}

// Process refund
export async function processRefund(
  provider: PaymentProvider,
  request: RefundRequest
): Promise<RefundResponse> {
  if (provider === 'cash_on_delivery') {
    return {
      success: true,
      refundId: `REFUND-${request.transactionId}`,
      amount: request.amount || 0,
      status: 'completed',
      message: 'Cash on delivery refund processed',
    }
  }

  const gateway = await getGateway(provider)
  return gateway.refund(request)
}

// Handle webhook from payment provider
export async function handlePaymentWebhook(
  provider: PaymentProvider,
  data: unknown
): Promise<PaymentCallback> {
  const gateway = await getGateway(provider)
  return gateway.handleWebhook(data)
}

// Determine provider from transaction ID pattern
export function detectProviderFromTransactionId(transactionId: string): PaymentProvider {
  if (transactionId.startsWith('COD-')) {
    return 'cash_on_delivery'
  }
  // Fawry reference numbers are typically numeric and longer
  if (/^\d{10,}$/.test(transactionId)) {
    return 'fawry'
  }
  // Default to Paymob
  return 'paymob'
}
