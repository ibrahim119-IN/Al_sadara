'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { cn } from '@/lib/utils/cn'

interface DashboardDictionary {
  title: string
  welcome: string
  stats: {
    totalRevenue: string
    totalOrders: string
    newCustomers: string
    avgOrderValue: string
    pendingOrders: string
    lowStock: string
    todaySales: string
    thisWeek: string
    thisMonth: string
    thisYear: string
    growth: string
    compared: string
  }
  orders: {
    title: string
    statuses: {
      pending: string
      confirmed: string
      processing: string
      shipped: string
      delivered: string
      cancelled: string
    }
  }
}

interface Props {
  locale: string
  dictionary: DashboardDictionary
}

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  newCustomers: number
  avgOrderValue: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    date: string
  }>
  revenueGrowth: number
  ordersGrowth: number
}

export function DashboardHome({ locale, dictionary: t }: Props) {
  const { user } = useDashboardAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/analytics?period=month', {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }

        const data = await response.json()

        // Transform analytics data to dashboard stats
        setStats({
          totalRevenue: data.salesMetrics?.totalRevenue || 0,
          totalOrders: data.salesMetrics?.totalOrders || 0,
          newCustomers: data.customerMetrics?.newCustomers || 0,
          avgOrderValue: data.salesMetrics?.averageOrderValue || 0,
          pendingOrders: data.orderMetrics?.byStatus?.pending || 0,
          lowStockProducts: data.productMetrics?.lowStockProducts || 0,
          recentOrders: data.recentOrders || [],
          revenueGrowth: data.salesMetrics?.revenueGrowth || 0,
          ordersGrowth: data.salesMetrics?.ordersGrowth || 0,
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Failed to load dashboard data')
        // Set mock data for demo
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          newCustomers: 0,
          avgOrderValue: 0,
          pendingOrders: 0,
          lowStockProducts: 0,
          recentOrders: [],
          revenueGrowth: 0,
          ordersGrowth: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG').format(num)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    return colors[status] || 'bg-secondary-100 text-secondary-800'
  }

  // Stats cards data
  const statsCards = [
    {
      title: t.stats.totalRevenue,
      value: stats ? formatCurrency(stats.totalRevenue) : '-',
      change: stats?.revenueGrowth || 0,
      icon: CreditCard,
      color: 'bg-green-500',
      href: `/${locale}/dashboard/analytics`,
    },
    {
      title: t.stats.totalOrders,
      value: stats ? formatNumber(stats.totalOrders) : '-',
      change: stats?.ordersGrowth || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: `/${locale}/dashboard/orders`,
    },
    {
      title: t.stats.newCustomers,
      value: stats ? formatNumber(stats.newCustomers) : '-',
      change: 0,
      icon: Users,
      color: 'bg-purple-500',
      href: `/${locale}/dashboard/customers`,
    },
    {
      title: t.stats.avgOrderValue,
      value: stats ? formatCurrency(stats.avgOrderValue) : '-',
      change: 0,
      icon: Package,
      color: 'bg-orange-500',
      href: `/${locale}/dashboard/analytics`,
    },
  ]

  // Alert cards
  const alertCards = [
    {
      title: t.stats.pendingOrders,
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      href: `/${locale}/dashboard/orders?status=pending`,
      show: (stats?.pendingOrders || 0) > 0,
    },
    {
      title: t.stats.lowStock,
      value: stats?.lowStockProducts || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      href: `/${locale}/dashboard/inventory?status=low`,
      show: (stats?.lowStockProducts || 0) > 0,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.welcome}, {user?.name}!
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          {t.stats.thisMonth}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {card.value}
                </p>
                {card.change !== 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {card.change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={cn(
                        'text-sm font-medium',
                        card.change > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {card.change > 0 ? '+' : ''}
                      {card.change.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              <div className={cn('p-3 rounded-lg', card.color)}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      {alertCards.some((card) => card.show) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alertCards
            .filter((card) => card.show)
            .map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-shadow',
                  card.bgColor
                )}
              >
                <div className={cn('p-3 rounded-full bg-white dark:bg-secondary-800', card.color)}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {card.title}
                  </p>
                  <p className="text-xl font-bold text-secondary-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-secondary-400" />
              </Link>
            ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="font-semibold text-secondary-900 dark:text-white">
            {t.orders.title}
          </h2>
          <Link
            href={`/${locale}/dashboard/orders`}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">
                    Order #
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">
                    Total
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">
                    Status
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/${locale}/dashboard/orders/${order.id}`}
                        className="text-sm font-medium text-primary-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(order.status)
                        )}
                      >
                        {t.orders.statuses[order.status as keyof typeof t.orders.statuses] ||
                          order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-500">
                      {new Date(order.date).toLocaleDateString(
                        locale === 'ar' ? 'ar-EG' : 'en-EG'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">
              No recent orders
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
          {error}
        </p>
      )}
    </div>
  )
}

export default DashboardHome
