'use client'

import Link from 'next/link'
import { CheckCircle2, Package, Phone, MessageCircle, ArrowRight, Home } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { PaymentMethod } from './PaymentMethods'

interface OrderConfirmationProps {
  locale: Locale
  dict: Dictionary
  orderNumber: string
  paymentMethod: PaymentMethod
  totalAmount: number
}

export function OrderConfirmation({
  locale,
  dict,
  orderNumber,
  paymentMethod,
  totalAmount,
}: OrderConfirmationProps) {
  const isRTL = locale === 'ar'

  const paymentInstructions: Record<PaymentMethod, { title: string; steps: string[] }> = {
    'bank-transfer': {
      title: isRTL ? 'خطوات إتمام الدفع' : 'Payment Steps',
      steps: isRTL
        ? [
            'قم بتحويل المبلغ إلى حسابنا البنكي',
            'أرسل إيصال التحويل على الواتساب',
            'سيتم تأكيد طلبك خلال 24 ساعة',
          ]
        : [
            'Transfer the amount to our bank account',
            'Send the transfer receipt via WhatsApp',
            'Your order will be confirmed within 24 hours',
          ],
    },
    'vodafone-cash': {
      title: isRTL ? 'خطوات إتمام الدفع' : 'Payment Steps',
      steps: isRTL
        ? [
            'أرسل المبلغ إلى محفظة فودافون كاش',
            'أرسل لقطة شاشة التحويل على الواتساب',
            'سيتم تأكيد طلبك خلال 24 ساعة',
          ]
        : [
            'Send the amount to our Vodafone Cash wallet',
            'Send a screenshot of the transfer via WhatsApp',
            'Your order will be confirmed within 24 hours',
          ],
    },
    'cash-on-delivery': {
      title: isRTL ? 'تعليمات التوصيل' : 'Delivery Instructions',
      steps: isRTL
        ? [
            'سيتم التواصل معك لتأكيد موعد التوصيل',
            'جهّز المبلغ النقدي قبل وصول المندوب',
            'استلم طلبك وادفع عند التسليم',
          ]
        : [
            'We will contact you to confirm delivery time',
            'Prepare the cash amount before delivery',
            'Receive your order and pay upon delivery',
          ],
    },
  }

  const instructions = paymentInstructions[paymentMethod]

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-success-600" />
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          {isRTL ? 'تم استلام طلبك بنجاح!' : 'Order Received Successfully!'}
        </h1>
        <p className="text-secondary-600">
          {isRTL
            ? 'شكراً لك على طلبك. سنتواصل معك قريباً.'
            : 'Thank you for your order. We will contact you soon.'}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-secondary-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary-600" />
          <span className="text-secondary-600">{dict.order.orderNumber}</span>
        </div>
        <p className="text-2xl font-bold text-primary-600 font-mono">{orderNumber}</p>
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <p className="text-secondary-600">{dict.order.total}</p>
          <p className="text-xl font-bold text-secondary-900">
            {totalAmount.toLocaleString()} {dict.common.currency}
          </p>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-white border border-secondary-200 rounded-2xl p-6 mb-8 text-start">
        <h3 className="font-bold text-secondary-900 mb-4">{instructions.title}</h3>
        <ol className="space-y-3">
          {instructions.steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {index + 1}
              </span>
              <span className="text-secondary-700">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact Options */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <a
          href="https://wa.me/201234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">
            {isRTL ? 'تواصل على واتساب' : 'Contact via WhatsApp'}
          </span>
        </a>
        <a
          href="tel:+201234567890"
          className="flex items-center justify-center gap-2 p-4 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="font-medium">
            {isRTL ? 'اتصل بنا' : 'Call Us'}
          </span>
        </a>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${locale}/orders`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
        >
          <Package className="w-5 h-5" />
          {dict.order.trackOrder}
        </Link>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-xl transition-colors"
        >
          <Home className="w-5 h-5" />
          {dict.common.home}
        </Link>
      </div>
    </div>
  )
}
