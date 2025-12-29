'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import {
  Package,
  Loader2,
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  FileText,
  Check,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface OrderDetailsContentProps {
  locale: Locale
  dict: Dictionary
  orderNumber: string
}

interface OrderItem {
  product: {
    id: number
    name: string
    nameAr?: string
    images?: Array<{ url: string }>
  }
  quantity: number
  priceAtTime: number
  subtotal: number
}

interface Order {
  id: number
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  items: OrderItem[]
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    governorate: string
  }
  payment: {
    method: 'bank-transfer' | 'vodafone-cash' | 'cash-on-delivery'
    status: string
  }
  customerNotes?: string
  createdAt: string
  updatedAt: string
}

export function OrderDetailsContent({ locale, dict, orderNumber }: OrderDetailsContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading } = useAuth()
  const isRTL = locale === 'ar'

  const [order, setOrder] = useState<Order | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account/orders/${orderNumber}`)
    }
  }, [isAuthenticated, isLoading, router, locale, orderNumber])

  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetching(true)
      setError('')

      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order')
        }

        setOrder(data.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setIsFetching(false)
      }
    }

    fetchOrder()
  }, [orderNumber])

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

  const getPaymentMethodText = (method: Order['payment']['method']) => {
    const methodMap = {
      'bank-transfer': { ar: 'تحويل بنكي', en: 'Bank Transfer' },
      'vodafone-cash': { ar: 'فودافون كاش', en: 'Vodafone Cash' },
      'cash-on-delivery': { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
    }
    return isRTL ? methodMap[method].ar : methodMap[method].en
  }

  const timelineSteps = [
    {
      key: 'pending',
      icon: Clock,
      label: isRTL ? 'تم الاستلام' : 'Received',
      active: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(order?.status || ''),
    },
    {
      key: 'confirmed',
      icon: Check,
      label: isRTL ? 'تم التأكيد' : 'Confirmed',
      active: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order?.status || ''),
    },
    {
      key: 'processing',
      icon: Package,
      label: isRTL ? 'قيد التحضير' : 'Processing',
      active: ['processing', 'shipped', 'delivered'].includes(order?.status || ''),
    },
    {
      key: 'shipped',
      icon: Truck,
      label: isRTL ? 'تم الشحن' : 'Shipped',
      active: ['shipped', 'delivered'].includes(order?.status || ''),
    },
    {
      key: 'delivered',
      icon: CheckCircle2,
      label: isRTL ? 'تم التوصيل' : 'Delivered',
      active: order?.status === 'delivered',
    },
  ]

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-6xl">
        <Link
          href={`/${locale}/account/orders`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isRTL ? 'العودة إلى الطلبات' : 'Back to Orders'}</span>
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 text-sm">
            {error}
          </div>
        )}

        {isFetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : !order ? (
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
            <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-500">{isRTL ? 'الطلب غير موجود' : 'Order not found'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-2xl border border-secondary-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                    {isRTL ? 'طلب رقم' : 'Order'} #{order.orderNumber}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Timeline */}
              {order.status !== 'cancelled' && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-secondary-900 mb-4">
                    {isRTL ? 'حالة الطلب' : 'Order Status'}
                  </h2>
                  <div className="relative">
                    <div className="flex justify-between items-start">
                      {timelineSteps.map((step, index) => {
                        const Icon = step.icon
                        const isLast = index === timelineSteps.length - 1
                        return (
                          <div key={step.key} className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center w-full">
                              {/* Timeline line before */}
                              {index > 0 && (
                                <div
                                  className={`flex-1 h-1 ${
                                    step.active ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                />
                              )}
                              {/* Icon circle */}
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                                  step.active
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-secondary-200 text-secondary-500'
                                }`}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              {/* Timeline line after */}
                              {!isLast && (
                                <div
                                  className={`flex-1 h-1 ${
                                    timelineSteps[index + 1].active ? 'bg-primary-600' : 'bg-secondary-200'
                                  }`}
                                />
                              )}
                            </div>
                            {/* Label */}
                            <span
                              className={`mt-3 text-xs text-center ${
                                step.active ? 'text-secondary-900 font-medium' : 'text-secondary-500'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled Notice */}
              {order.status === 'cancelled' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">{isRTL ? 'تم إلغاء الطلب' : 'Order Cancelled'}</p>
                    <p className="text-sm text-red-700">
                      {isRTL
                        ? 'تم إلغاء هذا الطلب. يرجى التواصل مع الدعم لمزيد من المعلومات.'
                        : 'This order has been cancelled. Please contact support for more information.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-secondary-200 p-8">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                {isRTL ? 'المنتجات' : 'Order Items'}
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-secondary-200 last:border-0">
                    <div className="w-20 h-20 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images && item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={isRTL ? item.product.nameAr || item.product.name : item.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-secondary-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">
                        {isRTL ? item.product.nameAr || item.product.name : item.product.name}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {isRTL ? 'الكمية:' : 'Quantity:'} {item.quantity}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-secondary-900">${item.subtotal.toFixed(2)}</p>
                      <p className="text-sm text-secondary-600">${item.priceAtTime.toFixed(2)} {isRTL ? 'لكل وحدة' : 'each'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="space-y-2 max-w-sm ms-auto">
                  <div className="flex justify-between text-secondary-700">
                    <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-700">
                    <span>{isRTL ? 'الشحن:' : 'Shipping:'}</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-success-600">
                      <span>{isRTL ? 'الخصم:' : 'Discount:'}</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-secondary-900 pt-2 border-t border-secondary-200">
                    <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                    <span className="text-primary-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-secondary-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary-600" />
                  <h2 className="text-lg font-bold text-secondary-900">
                    {isRTL ? 'عنوان الشحن' : 'Shipping Address'}
                  </h2>
                </div>
                <div className="space-y-1 text-secondary-700">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p dir="ltr">{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.governorate}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl border border-secondary-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-lg font-bold text-secondary-900">
                    {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                  </h2>
                </div>
                <div className="space-y-2 text-secondary-700">
                  <p className="font-medium">{getPaymentMethodText(order.payment.method)}</p>
                  <p className="text-sm">
                    <span className="text-secondary-600">{isRTL ? 'الحالة:' : 'Status:'} </span>
                    <span
                      className={`font-medium ${
                        order.payment.status === 'paid' ? 'text-success-600' : 'text-yellow-600'
                      }`}
                    >
                      {order.payment.status === 'paid'
                        ? isRTL
                          ? 'تم الدفع'
                          : 'Paid'
                        : isRTL
                        ? 'قيد الانتظار'
                        : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-white rounded-2xl border border-secondary-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <h2 className="text-lg font-bold text-secondary-900">
                    {isRTL ? 'ملاحظات العميل' : 'Customer Notes'}
                  </h2>
                </div>
                <p className="text-secondary-700">{order.customerNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
