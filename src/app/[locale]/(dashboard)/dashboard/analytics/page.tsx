'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AnalyticsData {
  salesMetrics: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    revenueGrowth: number
    ordersGrowth: number
  }
  customerMetrics: {
    newCustomers: number
    totalCustomers: number
    returningCustomers: number
    customerGrowth: number
  }
  orderMetrics: {
    byStatus: {
      pending: number
      processing: number
      shipped: number
      delivered: number
      cancelled: number
    }
  }
  productMetrics: {
    totalProducts: number
    activeProducts: number
    outOfStock: number
    lowStockProducts: number
    topSelling: Array<{
      id: string
      name: string
      totalSold: number
      revenue: number
    }>
  }
  categorySales: Array<{
    id: string
    name: string
    revenue: number
    percentage: number
  }>
  paymentStats: Array<{
    method: string
    count: number
    amount: number
    percentage: number
  }>
}

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year'

export default function AnalyticsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('month')

  const t = {
    title: isRTL ? 'التحليلات' : 'Analytics',
    overview: isRTL ? 'نظرة عامة' : 'Overview',
    revenue: isRTL ? 'الإيرادات' : 'Revenue',
    orders: isRTL ? 'الطلبات' : 'Orders',
    customers: isRTL ? 'العملاء' : 'Customers',
    products: isRTL ? 'المنتجات' : 'Products',
    avgOrderValue: isRTL ? 'متوسط قيمة الطلب' : 'Avg Order Value',
    newCustomers: isRTL ? 'عملاء جدد' : 'New Customers',
    totalCustomers: isRTL ? 'إجمالي العملاء' : 'Total Customers',
    topProducts: isRTL ? 'المنتجات الأكثر مبيعاً' : 'Top Selling Products',
    salesByCategory: isRTL ? 'المبيعات حسب الفئة' : 'Sales by Category',
    paymentMethods: isRTL ? 'طرق الدفع' : 'Payment Methods',
    orderStatus: isRTL ? 'حالة الطلبات' : 'Order Status',
    export: isRTL ? 'تصدير' : 'Export',
    periods: {
      today: isRTL ? 'اليوم' : 'Today',
      week: isRTL ? 'الأسبوع' : 'Week',
      month: isRTL ? 'الشهر' : 'Month',
      quarter: isRTL ? 'الربع' : 'Quarter',
      year: isRTL ? 'السنة' : 'Year',
    },
    compared: isRTL ? 'مقارنة بالفترة السابقة' : 'vs previous period',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/analytics?period=${period}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG').format(num)
  }

  const statsCards = [
    {
      title: t.revenue,
      value: data?.salesMetrics?.totalRevenue || 0,
      format: 'currency',
      growth: data?.salesMetrics?.revenueGrowth || 0,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: t.orders,
      value: data?.salesMetrics?.totalOrders || 0,
      format: 'number',
      growth: data?.salesMetrics?.ordersGrowth || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: t.newCustomers,
      value: data?.customerMetrics?.newCustomers || 0,
      format: 'number',
      growth: data?.customerMetrics?.customerGrowth || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: t.avgOrderValue,
      value: data?.salesMetrics?.averageOrderValue || 0,
      format: 'currency',
      growth: 0,
      icon: Package,
      color: 'bg-orange-500',
    },
  ]

  const orderStatusData = data?.orderMetrics?.byStatus || {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }

  const statusLabels: Record<string, { en: string; ar: string; color: string }> = {
    pending: { en: 'Pending', ar: 'قيد الانتظار', color: 'bg-yellow-500' },
    processing: { en: 'Processing', ar: 'قيد المعالجة', color: 'bg-blue-500' },
    shipped: { en: 'Shipped', ar: 'تم الشحن', color: 'bg-purple-500' },
    delivered: { en: 'Delivered', ar: 'تم التوصيل', color: 'bg-green-500' },
    cancelled: { en: 'Cancelled', ar: 'ملغي', color: 'bg-red-500' },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            {(Object.keys(t.periods) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  period === p
                    ? "bg-white dark:bg-secondary-700 text-primary-600 shadow-sm"
                    : "text-secondary-600 dark:text-secondary-400 hover:text-secondary-900"
                )}
              >
                {t.periods[p]}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            {t.export}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {card.format === 'currency'
                    ? formatCurrency(card.value)
                    : formatNumber(card.value)}
                </p>
                {card.growth !== 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {card.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        card.growth > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {card.growth > 0 ? '+' : ''}{card.growth.toFixed(1)}%
                    </span>
                    <span className="text-xs text-secondary-400">{t.compared}</span>
                  </div>
                )}
              </div>
              <div className={cn("p-3 rounded-lg", card.color)}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-secondary-400" />
            <h3 className="font-semibold text-secondary-900 dark:text-white">{t.orderStatus}</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(orderStatusData).map(([status, count]) => {
              const total = Object.values(orderStatusData).reduce((a, b) => a + b, 0)
              const percentage = total > 0 ? (count / total) * 100 : 0
              const config = statusLabels[status]
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {isRTL ? config?.ar : config?.en}
                    </span>
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", config?.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-secondary-400" />
            <h3 className="font-semibold text-secondary-900 dark:text-white">{t.topProducts}</h3>
          </div>
          {data?.productMetrics?.topSelling && data.productMetrics.topSelling.length > 0 ? (
            <div className="space-y-3">
              {data.productMetrics.topSelling.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-secondary-100 dark:bg-secondary-700 rounded-full text-xs font-medium text-secondary-600 dark:text-secondary-400">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {product.totalSold} {isRTL ? 'مباع' : 'sold'}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    {formatCurrency(product.revenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-500 py-8">
              {isRTL ? 'لا توجد بيانات' : 'No data available'}
            </p>
          )}
        </div>
      </div>

      {/* Category Sales & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-secondary-400" />
            <h3 className="font-semibold text-secondary-900 dark:text-white">{t.salesByCategory}</h3>
          </div>
          {data?.categorySales && data.categorySales.length > 0 ? (
            <div className="space-y-3">
              {data.categorySales.slice(0, 5).map((category) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {category.name}
                    </span>
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      {formatCurrency(category.revenue)} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-500 py-8">
              {isRTL ? 'لا توجد بيانات' : 'No data available'}
            </p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-secondary-400" />
            <h3 className="font-semibold text-secondary-900 dark:text-white">{t.paymentMethods}</h3>
          </div>
          {data?.paymentStats && data.paymentStats.length > 0 ? (
            <div className="space-y-3">
              {data.paymentStats.map((payment) => (
                <div key={payment.method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                      {payment.method}
                    </span>
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      {payment.count} ({payment.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${payment.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary-500 py-8">
              {isRTL ? 'لا توجد بيانات' : 'No data available'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
