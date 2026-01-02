import { NextRequest, NextResponse } from 'next/server'
import { getDashboardData, Period, getRecentOrders } from '@/lib/analytics'
import { withAuth } from '@/lib/api/auth-helper'

// GET /api/analytics - Get dashboard analytics data
export async function GET(request: NextRequest) {
  return withAuth(request, 'analytics.view', async () => {
    try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || 'month') as Period
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    // Validate period
    const validPeriods: Period[] = ['today', 'week', 'month', 'quarter', 'year', 'custom']
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be one of: today, week, month, quarter, year, custom' },
        { status: 400 }
      )
    }

    // Custom date range
    let customRange
    if (period === 'custom') {
      if (!fromDate || !toDate) {
        return NextResponse.json(
          { error: 'Custom period requires from and to dates' },
          { status: 400 }
        )
      }
      customRange = {
        from: new Date(fromDate),
        to: new Date(toDate),
      }
    }

    // Get dashboard data and recent orders in parallel
    const [data, recentOrders] = await Promise.all([
      getDashboardData(period, customRange),
      getRecentOrders(10),
    ])

    // Transform response to match DashboardHome expectations
    return NextResponse.json({
      success: true,
      period,
      // Sales metrics
      salesMetrics: {
        totalRevenue: data.sales.totalRevenue,
        totalOrders: data.sales.totalOrders,
        averageOrderValue: data.sales.averageOrderValue,
        revenueGrowth: data.sales.revenueGrowth,
        ordersGrowth: data.sales.ordersGrowth,
      },
      // Customer metrics
      customerMetrics: {
        newCustomers: data.customers.newCustomers,
        totalCustomers: data.customers.totalCustomers,
        returningCustomers: data.customers.returningCustomers,
        customerGrowth: data.customers.customerGrowth,
        topCustomers: data.customers.topCustomers,
      },
      // Order metrics
      orderMetrics: {
        byStatus: {
          pending: data.orders.pending,
          processing: data.orders.processing,
          shipped: data.orders.shipped,
          delivered: data.orders.delivered,
          cancelled: data.orders.cancelled,
        },
        totalValue: data.orders.totalValue,
      },
      // Product metrics
      productMetrics: {
        totalProducts: data.products.totalProducts,
        activeProducts: data.products.activeProducts,
        outOfStock: data.products.outOfStock,
        lowStockProducts: data.products.lowStock,
        topSelling: data.products.topSelling,
      },
      // Time series and charts
      timeSeries: data.timeSeries,
      categorySales: data.categorySales,
      paymentStats: data.paymentStats,
      geographicStats: data.geographicStats,
      // Recent orders
      recentOrders,
      // Metadata
      lastUpdated: data.lastUpdated,
    })
    } catch (error) {
      console.error('[Analytics API] Error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      )
    }
  })
}
