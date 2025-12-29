import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'
import { verifyPayment, detectProviderFromTransactionId, PaymentProvider } from '@/lib/payment'

// GET /api/payments/[id]/verify - Verify a payment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: transactionId } = await params
    const { searchParams } = new URL(request.url)
    let provider = searchParams.get('provider') as PaymentProvider | null

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    // Detect provider if not specified
    if (!provider) {
      provider = detectProviderFromTransactionId(transactionId)
    }

    // Verify with payment provider
    const callback = await verifyPayment(provider, transactionId)

    // Update order if found
    const payload = await getCachedPayload()

    const orders = await payload.find({
      collection: 'orders',
      where: {
        or: [
          { paymentTransactionId: { equals: transactionId } },
          { paymentReferenceNumber: { equals: transactionId } },
          { id: { equals: callback.orderId } },
        ],
      },
      limit: 1,
    })

    let order = null
    if (orders.docs.length > 0) {
      order = orders.docs[0]

      // Update payment status if changed
      if (order.paymentStatus !== callback.status) {
        await payload.update({
          collection: 'orders',
          id: order.id,
          data: {
            paymentStatus: callback.status,
            paidAt: callback.status === 'completed' ? new Date().toISOString() : undefined,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      transactionId: callback.transactionId,
      orderId: order?.id || callback.orderId,
      status: callback.status,
      amount: callback.amount,
      currency: callback.currency,
      paidAt: callback.paidAt,
    })
  } catch (error) {
    console.error('[Payments API] Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
