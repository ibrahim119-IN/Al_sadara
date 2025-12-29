// Analytics Service - Data Aggregation and Metrics Calculation

import { getCachedPayload } from '@/lib/payload-client'
import {
  DashboardData,
  SalesMetrics,
  ProductMetrics,
  CustomerMetrics,
  OrderMetrics,
  TimeSeriesData,
  CategorySales,
  PaymentMethodStats,
  GeographicStats,
  DateRange,
  Period,
} from './types'

// Helper to get date range based on period
export function getDateRange(period: Period, customRange?: DateRange): DateRange {
  const now = new Date()
  const from = new Date()
  const to = new Date()

  switch (period) {
    case 'today':
      from.setHours(0, 0, 0, 0)
      break
    case 'week':
      from.setDate(now.getDate() - 7)
      break
    case 'month':
      from.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      from.setMonth(now.getMonth() - 3)
      break
    case 'year':
      from.setFullYear(now.getFullYear() - 1)
      break
    case 'custom':
      if (customRange) {
        return customRange
      }
      from.setMonth(now.getMonth() - 1)
      break
  }

  return { from, to }
}

// Get previous period for comparison
function getPreviousPeriod(range: DateRange): DateRange {
  const duration = range.to.getTime() - range.from.getTime()
  return {
    from: new Date(range.from.getTime() - duration),
    to: new Date(range.from.getTime()),
  }
}

// Calculate growth percentage
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

// Get Sales Metrics
export async function getSalesMetrics(range: DateRange): Promise<SalesMetrics> {
  const payload = await getCachedPayload()
  const previousRange = getPreviousPeriod(range)

  // Current period orders
  const currentOrders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    limit: 10000,
  })

  // Previous period orders
  const previousOrders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: previousRange.from.toISOString() },
      and: [{ createdAt: { less_than_equal: previousRange.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    limit: 10000,
  })

  const totalRevenue = currentOrders.docs.reduce((sum, order) => sum + ((order.total as number) || 0), 0)
  const previousRevenue = previousOrders.docs.reduce((sum, order) => sum + ((order.total as number) || 0), 0)

  return {
    totalRevenue,
    totalOrders: currentOrders.totalDocs,
    averageOrderValue: currentOrders.totalDocs > 0 ? totalRevenue / currentOrders.totalDocs : 0,
    revenueGrowth: calculateGrowth(totalRevenue, previousRevenue),
    ordersGrowth: calculateGrowth(currentOrders.totalDocs, previousOrders.totalDocs),
  }
}

// Get Product Metrics
export async function getProductMetrics(range: DateRange): Promise<ProductMetrics> {
  const payload = await getCachedPayload()

  // All products
  const allProducts = await payload.find({
    collection: 'products',
    limit: 10000,
  })

  const activeProducts = allProducts.docs.filter((p) => p.status === 'active').length
  const outOfStock = allProducts.docs.filter((p) => ((p.stock as number) || 0) === 0).length
  const lowStock = allProducts.docs.filter((p) => {
    const stock = (p.stock as number) || 0
    return stock > 0 && stock <= 10
  }).length

  // Get top selling products from orders in the range
  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    depth: 2,
    limit: 10000,
  })

  const productSales: Record<string, { totalSold: number; revenue: number; product: unknown }> = {}

  orders.docs.forEach((order) => {
    const items = order.items as Array<{
      product: { id: string; name?: string; nameAr?: string; images?: Array<{ image?: { url?: string } }> } | string
      quantity: number
      subtotal: number
    }>

    items?.forEach((item) => {
      const productId = typeof item.product === 'object' ? item.product.id : item.product
      if (!productSales[productId]) {
        productSales[productId] = { totalSold: 0, revenue: 0, product: item.product }
      }
      productSales[productId].totalSold += item.quantity
      productSales[productId].revenue += item.subtotal || 0
    })
  })

  const topSelling = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([id, data]) => {
      const product = data.product as { name?: string; nameAr?: string; images?: Array<{ image?: { url?: string } }> }
      return {
        id,
        name: product?.name || 'Unknown',
        nameAr: product?.nameAr,
        totalSold: data.totalSold,
        revenue: data.revenue,
        image: product?.images?.[0]?.image?.url,
      }
    })

  return {
    totalProducts: allProducts.totalDocs,
    activeProducts,
    outOfStock,
    lowStock,
    topSelling,
  }
}

// Get Customer Metrics
export async function getCustomerMetrics(range: DateRange): Promise<CustomerMetrics> {
  const payload = await getCachedPayload()
  const previousRange = getPreviousPeriod(range)

  // All customers
  const allCustomers = await payload.find({
    collection: 'customers',
    limit: 10000,
  })

  // New customers in range
  const newCustomers = await payload.find({
    collection: 'customers',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
    },
    limit: 10000,
  })

  // New customers in previous period
  const previousNewCustomers = await payload.find({
    collection: 'customers',
    where: {
      createdAt: { greater_than_equal: previousRange.from.toISOString() },
      and: [{ createdAt: { less_than_equal: previousRange.to.toISOString() } }],
    },
    limit: 10000,
  })

  // Get orders to find top customers
  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    depth: 1,
    limit: 10000,
  })

  const customerStats: Record<string, { orders: number; spent: number; customer: unknown }> = {}
  const returningCustomerIds = new Set<string>()

  orders.docs.forEach((order) => {
    const customerId = typeof order.customer === 'object'
      ? (order.customer as { id: string }).id
      : order.customer as string

    if (!customerStats[customerId]) {
      customerStats[customerId] = { orders: 0, spent: 0, customer: order.customer }
    } else {
      returningCustomerIds.add(customerId)
    }
    customerStats[customerId].orders++
    customerStats[customerId].spent += (order.total as number) || 0
  })

  const topCustomers = Object.entries(customerStats)
    .sort((a, b) => b[1].spent - a[1].spent)
    .slice(0, 10)
    .map(([id, data]) => {
      const customer = data.customer as { name?: string; email?: string }
      return {
        id,
        name: customer?.name || 'Unknown',
        email: customer?.email || '',
        totalOrders: data.orders,
        totalSpent: data.spent,
      }
    })

  return {
    totalCustomers: allCustomers.totalDocs,
    newCustomers: newCustomers.totalDocs,
    returningCustomers: returningCustomerIds.size,
    customerGrowth: calculateGrowth(newCustomers.totalDocs, previousNewCustomers.totalDocs),
    topCustomers,
  }
}

// Get Order Metrics
export async function getOrderMetrics(range: DateRange): Promise<OrderMetrics> {
  const payload = await getCachedPayload()

  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
    },
    limit: 10000,
  })

  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  let totalValue = 0

  orders.docs.forEach((order) => {
    const status = order.status as keyof typeof statusCounts
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++
    }
    if (status !== 'cancelled') {
      totalValue += (order.total as number) || 0
    }
  })

  return {
    ...statusCounts,
    totalValue,
  }
}

// Get Time Series Data
export async function getTimeSeriesData(range: DateRange): Promise<TimeSeriesData[]> {
  const payload = await getCachedPayload()

  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    limit: 10000,
  })

  // Group by date
  const dailyData: Record<string, { revenue: number; orders: number }> = {}

  orders.docs.forEach((order) => {
    const date = new Date(order.createdAt as string).toISOString().split('T')[0]
    if (!dailyData[date]) {
      dailyData[date] = { revenue: 0, orders: 0 }
    }
    dailyData[date].revenue += (order.total as number) || 0
    dailyData[date].orders++
  })

  // Fill in missing dates
  const result: TimeSeriesData[] = []
  const currentDate = new Date(range.from)

  while (currentDate <= range.to) {
    const dateStr = currentDate.toISOString().split('T')[0]
    result.push({
      date: dateStr,
      revenue: dailyData[dateStr]?.revenue || 0,
      orders: dailyData[dateStr]?.orders || 0,
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

// Get Category Sales
export async function getCategorySales(range: DateRange): Promise<CategorySales[]> {
  const payload = await getCachedPayload()

  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    depth: 3,
    limit: 10000,
  })

  const categorySales: Record<string, { name: string; nameAr?: string; revenue: number; orders: Set<string> }> = {}
  let totalRevenue = 0

  orders.docs.forEach((order) => {
    const items = order.items as Array<{
      product: { category?: { id: string; name?: string; nameAr?: string } | string } | string
      subtotal: number
    }>

    items?.forEach((item) => {
      const product = typeof item.product === 'object' ? item.product : null
      const category = product?.category
      const categoryId = typeof category === 'object' ? category?.id : category || 'uncategorized'
      const categoryName = typeof category === 'object' ? category?.name : 'Uncategorized'
      const categoryNameAr = typeof category === 'object' ? category?.nameAr : undefined

      if (!categorySales[categoryId]) {
        categorySales[categoryId] = {
          name: categoryName || 'Uncategorized',
          nameAr: categoryNameAr,
          revenue: 0,
          orders: new Set(),
        }
      }
      categorySales[categoryId].revenue += item.subtotal || 0
      categorySales[categoryId].orders.add(order.id)
      totalRevenue += item.subtotal || 0
    })
  })

  return Object.entries(categorySales)
    .map(([id, data]) => ({
      id,
      name: data.name,
      nameAr: data.nameAr,
      revenue: data.revenue,
      orderCount: data.orders.size,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

// Get Payment Method Stats
export async function getPaymentStats(range: DateRange): Promise<PaymentMethodStats[]> {
  const payload = await getCachedPayload()

  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    limit: 10000,
  })

  const paymentStats: Record<string, { count: number; amount: number }> = {}
  let totalAmount = 0

  orders.docs.forEach((order) => {
    const payment = order.payment as { method?: string }
    const method = payment?.method || 'unknown'

    if (!paymentStats[method]) {
      paymentStats[method] = { count: 0, amount: 0 }
    }
    paymentStats[method].count++
    paymentStats[method].amount += (order.total as number) || 0
    totalAmount += (order.total as number) || 0
  })

  return Object.entries(paymentStats)
    .map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
      percentage: totalAmount > 0 ? Math.round((data.amount / totalAmount) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

// Get Geographic Stats
export async function getGeographicStats(range: DateRange): Promise<GeographicStats[]> {
  const payload = await getCachedPayload()

  const orders = await payload.find({
    collection: 'orders',
    where: {
      createdAt: { greater_than_equal: range.from.toISOString() },
      and: [{ createdAt: { less_than_equal: range.to.toISOString() } }],
      status: { not_equals: 'cancelled' },
    },
    limit: 10000,
  })

  const geoStats: Record<string, { orderCount: number; revenue: number }> = {}

  orders.docs.forEach((order) => {
    const address = order.shippingAddress as { governorate?: string }
    const governorate = address?.governorate || 'Unknown'

    if (!geoStats[governorate]) {
      geoStats[governorate] = { orderCount: 0, revenue: 0 }
    }
    geoStats[governorate].orderCount++
    geoStats[governorate].revenue += (order.total as number) || 0
  })

  return Object.entries(geoStats)
    .map(([governorate, data]) => ({
      governorate,
      orderCount: data.orderCount,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

// Get Full Dashboard Data
export async function getDashboardData(period: Period, customRange?: DateRange): Promise<DashboardData> {
  const range = getDateRange(period, customRange)

  const [
    sales,
    products,
    customers,
    orders,
    timeSeries,
    categorySales,
    paymentStats,
    geographicStats,
  ] = await Promise.all([
    getSalesMetrics(range),
    getProductMetrics(range),
    getCustomerMetrics(range),
    getOrderMetrics(range),
    getTimeSeriesData(range),
    getCategorySales(range),
    getPaymentStats(range),
    getGeographicStats(range),
  ])

  return {
    sales,
    products,
    customers,
    orders,
    timeSeries,
    categorySales,
    paymentStats,
    geographicStats,
    lastUpdated: new Date().toISOString(),
  }
}
