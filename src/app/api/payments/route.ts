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
      customerId,
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
      : await payload.findByID({ collection: 'customers', id: order.customer as string })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Build payment request
    const items = (order.items as Array<{
      product: { id: string; name?: string; nameAr?: string } | string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>).map((item, index) => {
      const product = typeof item.product === 'object' ? item.product : { id: item.product }
      return {
        id: product.id || `item-${index}`,
        name: (product as { name?: string }).name || `Product ${index + 1}`,
        nameAr: (product as { nameAr?: string }).nameAr,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const paymentResult = await createPayment(provider as PaymentProvider, {
      orderId: order.id,
      amount: order.total as number,
      currency: 'EGP',
      customer: {
        id: customer.id,
        email: customer.email as string,
        firstName: (customer.name as string)?.split(' ')[0] || 'Customer',
        lastName: (customer.name as string)?.split(' ').slice(1).join(' ') || '',
        phone: customer.phone as string || '',
        address: order.shippingAddress as {
          street: string
          building?: string
          floor?: string
          apartment?: string
          city: string
          state?: string
          country: string
          postalCode?: string
        },
      },
      items,
      method: method as PaymentMethod,
      returnUrl: returnUrl || `${baseUrl}/checkout/success?orderId=${orderId}`,
      cancelUrl: cancelUrl || `${baseUrl}/checkout/cancel?orderId=${orderId}`,
      webhookUrl: `${baseUrl}/api/payments/webhook/${provider}`,
    })

    if (paymentResult.success) {
      // Update order with payment info
      await payload.update({
        collection: 'orders',
        id: orderId,
        data: {
          paymentProvider: provider,
          paymentMethod: method,
          paymentStatus: 'pending',
          paymentTransactionId: paymentResult.transactionId,
          paymentReferenceNumber: paymentResult.referenceNumber,
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
