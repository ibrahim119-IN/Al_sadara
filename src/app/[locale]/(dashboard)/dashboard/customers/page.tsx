'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Search,
  Download,
  Users,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Calendar,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  ordersCount: number
  totalSpent: number
  createdAt: string
  lastOrderDate?: string
}

export default function CustomersPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    returningCustomers: 0,
  })

  const t = {
    title: isRTL ? 'إدارة العملاء' : 'Customers Management',
    search: isRTL ? 'البحث عن عميل...' : 'Search customers...',
    export: isRTL ? 'تصدير' : 'Export',
    name: isRTL ? 'الاسم' : 'Name',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    phone: isRTL ? 'الهاتف' : 'Phone',
    orders: isRTL ? 'الطلبات' : 'Orders',
    totalSpent: isRTL ? 'إجمالي المشتريات' : 'Total Spent',
    joined: isRTL ? 'تاريخ الانضمام' : 'Joined',
    lastOrder: isRTL ? 'آخر طلب' : 'Last Order',
    actions: isRTL ? 'إجراءات' : 'Actions',
    view: isRTL ? 'عرض' : 'View',
    noCustomers: isRTL ? 'لا يوجد عملاء' : 'No customers found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    totalCustomers: isRTL ? 'إجمالي العملاء' : 'Total Customers',
    newThisMonth: isRTL ? 'جدد هذا الشهر' : 'New This Month',
    returningCustomers: isRTL ? 'عملاء متكررون' : 'Returning Customers',
  }

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          ...(searchQuery && { search: searchQuery }),
        })

        const response = await fetch(`/api/customers?${queryParams}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setCustomers(data.docs || [])
          setTotalPages(data.totalPages || 1)

          // Set stats from analytics if available
          if (data.stats) {
            setStats(data.stats)
          }
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [currentPage, searchQuery])

  // Fetch stats separately
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics?period=month', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setStats({
            totalCustomers: data.customerMetrics?.totalCustomers || 0,
            newThisMonth: data.customerMetrics?.newCustomers || 0,
            returningCustomers: data.customerMetrics?.returningCustomers || 0,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statsCards = [
    {
      title: t.totalCustomers,
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: t.newThisMonth,
      value: stats.newThisMonth,
      icon: User,
      color: 'bg-green-500',
    },
    {
      title: t.returningCustomers,
      value: stats.returningCustomers,
      icon: ShoppingBag,
      color: 'bg-purple-500',
    },
  ]

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {card.value.toLocaleString(isRTL ? 'ar-EG' : 'en-EG')}
                </p>
              </div>
              <div className={cn("p-3 rounded-lg", card.color)}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
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

      {/* Customers Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noCustomers}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.name}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.email}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.phone}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.orders}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.totalSpent}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.joined}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {customer.name || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-secondary-600 dark:text-secondary-400">
                          {customer.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-secondary-400" />
                          <span className="text-sm text-secondary-600 dark:text-secondary-400">
                            {customer.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-secondary-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm font-medium text-secondary-900 dark:text-white">
                          {customer.ordersCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-secondary-900 dark:text-white">
                      {formatCurrency(customer.totalSpent || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-secondary-500">
                          {formatDate(customer.createdAt)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
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
