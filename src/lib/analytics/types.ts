// Analytics Types

export interface DateRange {
  from: Date
  to: Date
}

export interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
}

export interface ProductMetrics {
  totalProducts: number
  activeProducts: number
  outOfStock: number
  lowStock: number
  topSelling: Array<{
    id: string
    name: string
    nameAr?: string
    totalSold: number
    revenue: number
    image?: string
  }>
}

export interface CustomerMetrics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  customerGrowth: number
  topCustomers: Array<{
    id: string
    name: string
    email: string
    totalOrders: number
    totalSpent: number
  }>
}

export interface OrderMetrics {
  pending: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  totalValue: number
}

export interface TimeSeriesData {
  date: string
  revenue: number
  orders: number
}

export interface CategorySales {
  id: string
  name: string
  nameAr?: string
  revenue: number
  orderCount: number
  percentage: number
}

export interface PaymentMethodStats {
  method: string
  count: number
  amount: number
  percentage: number
}

export interface GeographicStats {
  governorate: string
  orderCount: number
  revenue: number
}

export interface DashboardData {
  sales: SalesMetrics
  products: ProductMetrics
  customers: CustomerMetrics
  orders: OrderMetrics
  timeSeries: TimeSeriesData[]
  categorySales: CategorySales[]
  paymentStats: PaymentMethodStats[]
  geographicStats: GeographicStats[]
  lastUpdated: string
}

export type Period = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
