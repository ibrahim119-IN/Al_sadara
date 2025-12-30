import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'
import {
  createPayment,
  getAvailablePaymentMethods,
  PaymentProvider,
  PaymentMethod,
} from '@/lib/payment'

// GET /api/payments - Get available payment methods
export async function GET() {
  try {
    const methods = getAvailablePaymentMethods()

    return NextResponse.json({
      success: true,
      methods,
    })
  } catch (error) {
    console.error('[Payments API] Error getting methods:', error)
    return NextResponse.json(
      { error: 'Failed to get payment methods' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderId,
      provider,
      method,
      returnUrl,
      cancelUrl,
    } = body

    if (!orderId || !provider || !method) {
      return NextResponse.json(
        { error: 'Order ID, provider, and method are required' },
        { status: 400 }
      )
    }

    const payload = await getCachedPayload()

    // Get order details
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 2,
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get customer details
    const customer = typeof order.customer === 'object'
      ? order.customer
      : await payload.findByID({ collection: 'customers', id: order.customer as number })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Build payment request items
    const items = order.items.map((item, index) => {
      const product = typeof item.product === 'object' ? item.product : null
      return {
        id: String(product?.id || `item-${index}`),
        name: product?.name || `Product ${index + 1}`,
        nameAr: product?.nameAr,
        quantity: item.quantity,
        unitPrice: item.priceAtTime,
        totalPrice: item.subtotal,
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Build address from shipping address
    const shippingAddr = order.shippingAddress
    const paymentAddress = {
      street: shippingAddr?.address || '',
      city: shippingAddr?.city || '',
      state: shippingAddr?.governorate,
      country: 'Egypt',
    }

    const paymentResult = await createPayment(provider as PaymentProvider, {
      orderId: String(order.id),
      amount: order.total,
      currency: 'EGP',
      customer: {
        id: String(customer.id),
        email: customer.email,
        firstName: customer.firstName || 'Customer',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        address: paymentAddress,
      },
      items,
      method: method as PaymentMethod,
      returnUrl: returnUrl || `${baseUrl}/checkout/success?orderId=${orderId}`,
      cancelUrl: cancelUrl || `${baseUrl}/checkout/cancel?orderId=${orderId}`,
      webhookUrl: `${baseUrl}/api/payments/webhook/${provider}`,
    })

    if (paymentResult.success) {
      // Update order with payment info (using nested payment group)
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          payment: {
            provider: provider as 'paymob' | 'fawry' | 'cash_on_delivery',
            method: method as 'card' | 'wallet' | 'kiosk' | 'bank_transfer' | 'cash',
            status: 'pending',
            transactionId: paymentResult.transactionId,
            referenceNumber: paymentResult.referenceNumber,
          },
        },
      })
    }

    return NextResponse.json(paymentResult)
  } catch (error) {
    console.error('[Payments API] Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
