'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  itemsCount: number
}

const statusConfig: Record<string, { label: string; labelAr: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', labelAr: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
  processing: { label: 'Processing', labelAr: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: RefreshCw },
  shipped: { label: 'Shipped', labelAr: 'تم الشحن', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Delivered', labelAr: 'تم التوصيل', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', labelAr: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
}

export default function OrdersPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const t = {
    title: isRTL ? 'إدارة الطلبات' : 'Orders Management',
    search: isRTL ? 'البحث عن طلب...' : 'Search orders...',
    filter: isRTL ? 'تصفية' : 'Filter',
    export: isRTL ? 'تصدير' : 'Export',
    allStatuses: isRTL ? 'جميع الحالات' : 'All Statuses',
    orderNumber: isRTL ? 'رقم الطلب' : 'Order #',
    customer: isRTL ? 'العميل' : 'Customer',
    total: isRTL ? 'الإجمالي' : 'Total',
    status: isRTL ? 'الحالة' : 'Status',
    date: isRTL ? 'التاريخ' : 'Date',
    items: isRTL ? 'المنتجات' : 'Items',
    actions: isRTL ? 'إجراءات' : 'Actions',
    view: isRTL ? 'عرض' : 'View',
    noOrders: isRTL ? 'لا توجد طلبات' : 'No orders found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(searchQuery && { search: searchQuery }),
        })

        const response = await fetch(`/api/orders?${queryParams}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setOrders(data.docs || [])
          setTotalPages(data.totalPages || 1)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage, statusFilter, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="w-4 h-4" />
          {t.export}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400", isRTL ? "right-3" : "left-3")} />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full py-2 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-4 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t.allStatuses}</option>
            {Object.entries(statusConfig).map(([value, config]) => (
              <option key={value} value={value}>
                {isRTL ? config.labelAr : config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noOrders}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.orderNumber}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.customer}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.items}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.total}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.date}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {orders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock
                  return (
                    <tr key={order.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {order.customer?.name || 'Guest'}
                          </p>
                          <p className="text-xs text-secondary-500">{order.customer?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-900 dark:text-white">
                        {order.itemsCount || 0}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-secondary-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                          statusConfig[order.status]?.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {isRTL ? statusConfig[order.status]?.labelAr : statusConfig[order.status]?.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/${locale}/dashboard/orders/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                        >
                          <Eye className="w-4 h-4" />
                          {t.view}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
