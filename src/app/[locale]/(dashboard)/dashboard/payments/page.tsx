'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Payment {
  id: string
  orderId: string
  orderNumber: string
  amount: number
  method: string
  status: string
  createdAt: string
}

type PaymentMethodKey = 'card' | 'wallet' | 'bank_transfer' | 'cash' | 'kiosk'
type PaymentStatusKey = 'pending' | 'completed' | 'failed' | 'refunded'

const methodConfig: Record<PaymentMethodKey, { icon: React.ComponentType<{ className?: string }>; label: string; labelAr: string }> = {
  card: { icon: CreditCard, label: 'Card', labelAr: 'بطاقة' },
  wallet: { icon: Wallet, label: 'Wallet', labelAr: 'محفظة' },
  bank_transfer: { icon: Banknote, label: 'Bank Transfer', labelAr: 'تحويل بنكي' },
  cash: { icon: Banknote, label: 'Cash', labelAr: 'نقدي' },
  kiosk: { icon: CreditCard, label: 'Kiosk', labelAr: 'كيوسك' },
}

const statusConfig: Record<PaymentStatusKey, { color: string; label: string; labelAr: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending', labelAr: 'قيد الانتظار', icon: Clock },
  completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Completed', labelAr: 'مكتمل', icon: CheckCircle },
  failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Failed', labelAr: 'فشل', icon: XCircle },
  refunded: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Refunded', labelAr: 'مسترد', icon: Banknote },
}

export default function PaymentsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const t = {
    title: isRTL ? 'إدارة المدفوعات' : 'Payments Management',
    orderNumber: isRTL ? 'رقم الطلب' : 'Order #',
    amount: isRTL ? 'المبلغ' : 'Amount',
    method: isRTL ? 'طريقة الدفع' : 'Method',
    status: isRTL ? 'الحالة' : 'Status',
    date: isRTL ? 'التاريخ' : 'Date',
    noPayments: isRTL ? 'لا توجد مدفوعات' : 'No payments found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
  }

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        // Note: You may need to create an /api/payments endpoint that lists payments
        const response = await fetch(`/api/orders?page=${currentPage}&limit=10`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          // Transform orders to payments format
          const paymentsData = (data.docs || []).map((order: any) => ({
            id: order.id,
            orderId: order.id,
            orderNumber: order.orderNumber,
            amount: order.total,
            method: order.paymentMethod || 'cash',
            status: order.paymentStatus || 'pending',
            createdAt: order.createdAt,
          }))
          setPayments(paymentsData)
          setTotalPages(data.totalPages || 1)
        }
      } catch (error) {
        console.error('Error fetching payments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [currentPage])

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
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noPayments}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.orderNumber}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.amount}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.method}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {payments.map((payment) => {
                  const methodKey = (payment.method as PaymentMethodKey) || 'cash'
                  const statusKey = (payment.status as PaymentStatusKey) || 'pending'
                  const method = methodConfig[methodKey] || methodConfig.cash
                  const status = statusConfig[statusKey] || statusConfig.pending
                  const MethodIcon = method.icon
                  const StatusIcon = status.icon
                  return (
                    <tr key={payment.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          {payment.orderNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-secondary-900 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <MethodIcon className="w-4 h-4 text-secondary-500" />
                          <span className="text-sm text-secondary-600 dark:text-secondary-400">
                            {isRTL ? method.labelAr : method.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full", status.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {isRTL ? status.labelAr : status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-500">
                        {formatDate(payment.createdAt)}
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
