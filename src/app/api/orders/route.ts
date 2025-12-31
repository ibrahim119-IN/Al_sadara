import { NextRequest, NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'

interface OrderItem {
  productId: string
  quantity: number
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  governorate: string
}

interface CreateOrderRequest {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: 'bank-transfer' | 'vodafone-cash' | 'cash-on-delivery'
  customerNotes?: string
  customerId?: number
}

// Map incoming payment methods to database values
const paymentMethodMap: Record<string, 'card' | 'wallet' | 'kiosk' | 'bank_transfer' | 'cash'> = {
  'bank-transfer': 'bank_transfer',
  'vodafone-cash': 'wallet',
  'cash-on-delivery': 'cash',
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()
    const { items, shippingAddress, paymentMethod, customerNotes, customerId } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    // Fetch products to get current prices and validate stock
    const productIds = items.map((item) => item.productId)
    const products = await payload.find({
      collection: 'products',
      where: {
        id: { in: productIds },
      },
      limit: 100,
    })

    // Validate all products exist
    if (products.docs.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 400 }
      )
    }

    // Build order items with current prices
    const orderItems = items.map((item) => {
      const product = products.docs.find((p) => String(p.id) === String(item.productId))
      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      const productStock = product.stock ?? 0

      // Check stock
      if (productStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }

      const priceAtTime = product.price
      const subtotal = priceAtTime * item.quantity

      return {
        product: product.id,
        quantity: item.quantity,
        priceAtTime,
        subtotal,
      }
    })

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    const shippingCost = paymentMethod === 'cash-on-delivery' ? 50 : 0
    const total = subtotal + shippingCost

    // Use provided customer ID or create/find guest customer
    let finalCustomerId: number

    if (customerId) {
      // Use authenticated customer ID
      finalCustomerId = customerId
    } else {
      // Check if customer already exists by phone (for guest checkout)
      const existingCustomer = await payload.find({
        collection: 'customers',
        where: {
          phone: { equals: shippingAddress.phone },
        },
        limit: 1,
      })

      if (existingCustomer.docs.length > 0) {
        finalCustomerId = existingCustomer.docs[0].id
      } else {
        // Create new guest customer
        const newCustomer = await payload.create({
          collection: 'customers',
          data: {
            firstName: shippingAddress.fullName.split(' ')[0] || 'Guest',
            lastName: shippingAddress.fullName.split(' ').slice(1).join(' ') || 'Customer',
            phone: shippingAddress.phone,
            email: `guest_${Date.now()}@alsadara.com`, // Placeholder email
            password: Math.random().toString(36).slice(-12), // Random password
            customerType: 'individual',
            addresses: [
              {
                label: 'Primary',
                ...shippingAddress,
                isDefault: true,
              },
            ],
          },
        })
        finalCustomerId = newCustomer.id
      }
    }

    // Create the order
    const order = await payload.create({
      collection: 'orders',
      data: {
        customer: finalCustomerId,
        items: orderItems,
        subtotal,
        shippingCost,
        discount: 0,
        total,
        shippingAddress,
        payment: {
          method: paymentMethodMap[paymentMethod] || 'cash',
          status: 'pending',
        },
        status: 'pending',
        customerNotes: customerNotes || '',
      },
    })

    // Update product stock
    for (const item of items) {
      const product = products.docs.find((p) => String(p.id) === String(item.productId))
      if (product) {
        const currentStock = product.stock ?? 0
        await payload.update({
          collection: 'products',
          id: product.id,
          data: {
            stock: currentStock - item.quantity,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}

// Helper function to get authenticated customer from Payload token
async function getAuthenticatedCustomer(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config })
    // Use Payload's built-in auth verification
    const result = await payload.auth({ headers: request.headers })
    // Check if user is from customers collection
    if (result.user && 'collection' in result && result.user.collection === 'customers') {
      return result.user
    }
    return null
  } catch {
    return null
  }
}

// Helper function to get authenticated admin user from Payload token
async function getAuthenticatedAdmin(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config })
    // Use Payload's built-in auth verification
    const result = await payload.auth({ headers: request.headers })
    // Check if user is from users collection (admin users)
    if (result.user && 'collection' in result && result.user.collection === 'users') {
      return result.user as { id: number; email: string; role?: string }
    }
    return null
  } catch {
    return null
  }
}

// Get orders - supports both admin (all orders) and customer (own orders)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const payload = await getPayload({ config })

    // Check for admin user first
    const authenticatedAdmin = await getAuthenticatedAdmin(request)

    // If admin user, return all orders with pagination and filters
    if (authenticatedAdmin) {
      // Build where clause for filtering
      const whereClause: Record<string, unknown> = {}

      if (status && status !== 'all') {
        whereClause.status = { equals: status }
      }

      if (search) {
        whereClause.or = [
          { orderNumber: { contains: search } },
          { 'shippingAddress.fullName': { contains: search } },
          { 'shippingAddress.phone': { contains: search } },
        ]
      }

      const orders = await payload.find({
        collection: 'orders',
        where: Object.keys(whereClause).length > 0 ? (whereClause as Where) : undefined,
        sort: '-createdAt',
        page,
        limit,
        depth: 2,
      })

      // Transform orders for dashboard display
      const transformedOrders = orders.docs.map((order) => {
        const customer = typeof order.customer === 'object' && order.customer
          ? order.customer
          : null

        return {
          id: String(order.id),
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          customer: customer ? {
            name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest',
            email: customer.email || '',
          } : {
            name: order.shippingAddress?.fullName || 'Guest',
            email: '',
          },
          total: order.total || 0,
          status: order.status || 'pending',
          paymentStatus: order.payment?.status || 'pending',
          createdAt: order.createdAt,
          itemsCount: order.items?.length || 0,
        }
      })

      return NextResponse.json({
        docs: transformedOrders,
        totalDocs: orders.totalDocs,
        totalPages: orders.totalPages,
        page: orders.page,
        hasNextPage: orders.hasNextPage,
        hasPrevPage: orders.hasPrevPage,
      })
    }

    // Try to get authenticated customer
    const authenticatedCustomer = await getAuthenticatedCustomer(request)

    // If customer authenticated, return only their orders
    if (authenticatedCustomer) {
      const orders = await payload.find({
        collection: 'orders',
        where: {
          customer: { equals: authenticatedCustomer.id },
        },
        sort: '-createdAt',
        limit: 50,
        depth: 2,
      })

      return NextResponse.json({
        orders: orders.docs,
      })
    }

    // If not authenticated, only allow lookup by specific order number
    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Authentication required or provide order number' },
        { status: 401 }
      )
    }

    // Find specific order by order number (limited info for guests)
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: orderNumber },
      },
      limit: 1,
      depth: 1,
    })

    if (orders.docs.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Return limited order info for guests (hide sensitive customer data)
    const order = orders.docs[0]
    return NextResponse.json({
      orders: [{
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items,
        // Don't expose full customer data to guests
      }],
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
