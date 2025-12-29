import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find order by order number
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: orderNumber },
      },
      limit: 1,
      depth: 3, // Include product and customer details
    })

    if (orders.docs.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: orders.docs[0],
    })
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
