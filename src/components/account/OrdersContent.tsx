'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Package, Loader2, ArrowLeft, Calendar, DollarSign } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface OrdersContentProps {
  locale: Locale
  dict: Dictionary
}

interface Order {
  id: number
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    product: {
      id: number
      name: string
      nameAr?: string
    }
    quantity: number
  }>
  createdAt: string
}

export function OrdersContent({ locale, dict }: OrdersContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading } = useAuth()
  const isRTL = locale === 'ar'

  const [orders, setOrders] = useState<Order[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account/orders`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer) return

      setIsFetching(true)
      setError('')

      try {
        const response = await fetch(`/api/orders?customerId=${customer.id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders')
        }

        setOrders(data.orders || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders')
      } finally {
        setIsFetching(false)
      }
    }

    if (customer) {
      fetchOrders()
    }
  }, [customer])

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'shipped':
        return 'bg-teal-100 text-teal-700 border-teal-200'
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-secondary-100 text-secondary-700 border-secondary-200'
    }
  }

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      confirmed: { ar: 'مؤكد', en: 'Confirmed' },
      processing: { ar: 'قيد المعالجة', en: 'Processing' },
      shipped: { ar: 'تم الشحن', en: 'Shipped' },
      delivered: { ar: 'تم التوصيل', en: 'Delivered' },
      cancelled: { ar: 'ملغي', en: 'Cancelled' },
    }
    return isRTL ? statusMap[status].ar : statusMap[status].en
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter)

  const filterOptions = [
    { value: 'all', label: isRTL ? 'الكل' : 'All' },
    { value: 'pending', label: isRTL ? 'قيد الانتظار' : 'Pending' },
    { value: 'confirmed', label: isRTL ? 'مؤكد' : 'Confirmed' },
    { value: 'processing', label: isRTL ? 'قيد المعالجة' : 'Processing' },
    { value: 'shipped', label: isRTL ? 'تم الشحن' : 'Shipped' },
    { value: 'delivered', label: isRTL ? 'تم التوصيل' : 'Delivered' },
    { value: 'cancelled', label: isRTL ? 'ملغي' : 'Cancelled' },
  ]

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-5xl">
        <Link
          href={`/${locale}/account`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isRTL ? 'العودة إلى الحساب' : 'Back to Account'}</span>
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {isRTL ? 'طلباتي' : 'My Orders'}
              </h1>
              <p className="text-sm text-secondary-600">
                {isRTL ? 'تتبع وعرض جميع طلباتك' : 'Track and view all your orders'}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 text-sm">
              {error}
            </div>
          )}

          {isFetching ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-500">
                {filter === 'all'
                  ? isRTL
                    ? 'لا توجد طلبات'
                    : 'No orders yet'
                  : isRTL
                  ? `لا توجد طلبات ${filterOptions.find((f) => f.value === filter)?.label}`
                  : `No ${filterOptions.find((f) => f.value === filter)?.label} orders`}
              </p>
              <Link
                href={`/${locale}/products`}
                className="mt-4 inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/${locale}/account/orders/${order.orderNumber}`}
                  className="block p-6 border-2 border-secondary-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-secondary-900">
                          {isRTL ? 'طلب رقم' : 'Order'} #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-secondary-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items.length} {isRTL ? 'منتج' : 'item(s)'}
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="flex items-center gap-1 text-lg font-bold text-primary-600">
                        <DollarSign className="w-5 h-5" />
                        {order.total.toFixed(2)}
                      </div>
                      <p className="text-xs text-secondary-500">
                        {isRTL ? 'الإجمالي' : 'Total'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-secondary-200 pt-3">
                    <p className="text-sm text-secondary-700">
                      <span className="font-medium">{isRTL ? 'المنتجات: ' : 'Products: '}</span>
                      {order.items
                        .map((item) => (isRTL ? item.product.nameAr || item.product.name : item.product.name))
                        .join(', ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
