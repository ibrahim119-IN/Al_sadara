import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'
import { handlePaymentWebhook, PaymentProvider, PaymentStatus } from '@/lib/payment'

// POST /api/payments/webhook/[provider] - Handle payment webhooks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params
    const validProviders = ['paymob', 'fawry']

    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }

    // Get the raw body for signature verification
    const body = await request.json()

    console.log(`[Payment Webhook] Received ${provider} webhook:`, JSON.stringify(body, null, 2))

    // Process the webhook
    const callback = await handlePaymentWebhook(provider as PaymentProvider, body)

    console.log(`[Payment Webhook] Processed callback:`, callback)

    // Update order status based on payment status
    const payload = await getCachedPayload()

    // Find order by transaction ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        or: [
          { paymentTransactionId: { equals: callback.transactionId } },
          { paymentReferenceNumber: { equals: callback.transactionId } },
          { id: { equals: callback.orderId } },
        ],
      },
      limit: 1,
    })

    if (orders.docs.length === 0) {
      console.error(`[Payment Webhook] Order not found for transaction: ${callback.transactionId}`)
      // Still return 200 to acknowledge receipt
      return NextResponse.json({ received: true, status: 'order_not_found' })
    }

    const order = orders.docs[0]

    // Map payment status to order status
    const orderStatusMap: Record<PaymentStatus, string> = {
      completed: 'processing',
      pending: 'pending',
      processing: 'pending',
      failed: 'cancelled',
      cancelled: 'cancelled',
      refunded: 'refunded',
      expired: 'cancelled',
    }

    const newOrderStatus = orderStatusMap[callback.status] || 'pending'

    // Update order
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        paymentStatus: callback.status,
        status: newOrderStatus,
        paidAt: callback.status === 'completed' ? new Date().toISOString() : undefined,
      },
    })

    console.log(`[Payment Webhook] Updated order ${order.id} - Payment: ${callback.status}, Order: ${newOrderStatus}`)

    // Return success
    return NextResponse.json({
      received: true,
      orderId: order.id,
      status: callback.status,
    })
  } catch (error) {
    console.error('[Payment Webhook] Error processing webhook:', error)
    // Return 200 to prevent retries on our end error
    return NextResponse.json(
      { received: true, error: 'Processing error' },
      { status: 200 }
    )
  }
}

// GET endpoint for Paymob callback redirect
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params
    const { searchParams } = new URL(request.url)

    if (provider === 'paymob') {
      // Paymob sends data via query params on redirect
      const success = searchParams.get('success') === 'true'
      const orderId = searchParams.get('merchant_order_id')
      const transactionId = searchParams.get('id')

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

      if (success && orderId) {
        return NextResponse.redirect(`${baseUrl}/checkout/success?orderId=${orderId}&transactionId=${transactionId}`)
      } else {
        return NextResponse.redirect(`${baseUrl}/checkout/cancel?orderId=${orderId}&transactionId=${transactionId}`)
      }
    }

    return NextResponse.redirect('/')
  } catch (error) {
    console.error('[Payment Webhook] Error handling redirect:', error)
    return NextResponse.redirect('/')
  }
}
