import { NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload-client'
import { withAuth } from '@/lib/api/auth-helper'

export async function GET(request: NextRequest) {
  return withAuth(request, 'dashboard.view', async () => {
    try {
      const searchParams = request.nextUrl.searchParams
      const query = searchParams.get('q')?.trim()

      if (!query || query.length < 2) {
        return NextResponse.json({ results: [] })
      }

      const payload = await getCachedPayload()

    // Search in parallel for better performance
    const [orders, products, customers] = await Promise.all([
      // Search Orders by orderNumber
      payload.find({
        collection: 'orders',
        where: {
          or: [
            { orderNumber: { contains: query } },
          ],
        },
        limit: 5,
        depth: 0,
      }),
      // Search Products by name
      payload.find({
        collection: 'products',
        where: {
          or: [
            { name: { contains: query } },
            { nameAr: { contains: query } },
            { sku: { contains: query } },
          ],
        },
        limit: 5,
        depth: 0,
      }),
      // Search Customers by name or email
      payload.find({
        collection: 'customers',
        where: {
          or: [
            { name: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
          ],
        },
        limit: 5,
        depth: 0,
      }),
    ])

    const results = {
      orders: orders.docs.map((order) => ({
        id: order.id,
        type: 'order' as const,
        title: (order.orderNumber as string) || `#${String(order.id).slice(-6)}`,
        subtitle: `${(order.total as number)?.toLocaleString() || 0} EGP`,
        status: order.status as string,
        href: `/dashboard/orders/${order.id}`,
      })),
      products: products.docs.map((product) => ({
        id: product.id,
        type: 'product' as const,
        title: (product.name as string) || 'Unnamed Product',
        titleAr: product.nameAr as string | undefined,
        subtitle: `${(product.price as number)?.toLocaleString() || 0} EGP`,
        status: product.status as string,
        href: `/dashboard/products/${product.id}`,
      })),
      customers: customers.docs.map((customer) => ({
        id: customer.id,
        type: 'customer' as const,
        title: (customer.name as string) || 'Unknown',
        subtitle: customer.email as string,
        href: `/dashboard/customers/${customer.id}`,
      })),
    }

    return NextResponse.json({
      results,
      total: orders.totalDocs + products.totalDocs + customers.totalDocs,
    })
    } catch (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }
  })
}
