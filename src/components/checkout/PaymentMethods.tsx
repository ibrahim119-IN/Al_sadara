'use client'

import { useState } from 'react'
import { CreditCard, Wallet, Truck, Building2, Phone, FileText } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

export type PaymentMethod = 'bank-transfer' | 'vodafone-cash' | 'cash-on-delivery'

interface PaymentMethodsProps {
  locale: Locale
  dict: Dictionary
  selectedMethod?: PaymentMethod
  onSelect: (method: PaymentMethod) => void
  customerNotes: string
  onNotesChange: (notes: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function PaymentMethods({
  locale,
  dict,
  selectedMethod,
  onSelect,
  customerNotes,
  onNotesChange,
  onSubmit,
  isSubmitting = false,
}: PaymentMethodsProps) {
  const isRTL = locale === 'ar'
  const [error, setError] = useState<string | null>(null)

  const paymentOptions = [
    {
      id: 'bank-transfer' as PaymentMethod,
      name: dict.checkout.bankTransfer,
      description: isRTL
        ? 'قم بتحويل المبلغ إلى حسابنا البنكي'
        : 'Transfer the amount to our bank account',
      icon: Building2,
      details: {
        title: isRTL ? 'بيانات الحساب البنكي' : 'Bank Account Details',
        lines: [
          { label: isRTL ? 'البنك' : 'Bank', value: 'CIB' },
          { label: isRTL ? 'اسم الحساب' : 'Account Name', value: 'Al Sadara Company' },
          { label: isRTL ? 'رقم الحساب' : 'Account Number', value: '1234567890' },
          { label: isRTL ? 'IBAN' : 'IBAN', value: 'EG123456789012345678901234' },
        ],
      },
    },
    {
      id: 'vodafone-cash' as PaymentMethod,
      name: dict.checkout.vodafoneCash,
      description: isRTL
        ? 'ادفع عبر محفظة فودافون كاش'
        : 'Pay via Vodafone Cash wallet',
      icon: Wallet,
      details: {
        title: isRTL ? 'بيانات فودافون كاش' : 'Vodafone Cash Details',
        lines: [
          { label: isRTL ? 'رقم المحفظة' : 'Wallet Number', value: '0101 234 5678' },
          { label: isRTL ? 'اسم المستلم' : 'Recipient Name', value: 'Al Sadara Company' },
        ],
      },
    },
    {
      id: 'cash-on-delivery' as PaymentMethod,
      name: dict.checkout.cashOnDelivery,
      description: isRTL
        ? 'ادفع نقداً عند استلام الطلب'
        : 'Pay cash when you receive your order',
      icon: Truck,
      note: isRTL
        ? 'قد تُطبق رسوم توصيل إضافية'
        : 'Additional delivery charges may apply',
    },
  ]

  const handleSubmit = () => {
    if (!selectedMethod) {
      setError(isRTL ? 'يرجى اختيار طريقة الدفع' : 'Please select a payment method')
      return
    }
    setError(null)
    onSubmit()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-secondary-900">
          {dict.checkout.paymentMethod}
        </h3>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedMethod === option.id

          return (
            <div key={option.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(option.id)
                  setError(null)
                }}
                className={`w-full p-4 border-2 rounded-xl transition-all text-start ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary-100' : 'bg-secondary-100'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isSelected ? 'text-primary-600' : 'text-secondary-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-secondary-900">{option.name}</h4>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-primary-600 bg-primary-600'
                            : 'border-secondary-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {option.description}
                    </p>
                    {option.note && (
                      <p className="text-xs text-warning-600 mt-2">{option.note}</p>
                    )}
                  </div>
                </div>
              </button>

              {/* Payment Details */}
              {isSelected && option.details && (
                <div className="mt-3 p-4 bg-secondary-50 rounded-xl border border-secondary-200 animate-slide-down">
                  <h5 className="font-medium text-secondary-900 mb-3">
                    {option.details.title}
                  </h5>
                  <div className="space-y-2">
                    {option.details.lines.map((line, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-secondary-600">{line.label}:</span>
                        <span className="font-medium text-secondary-900 font-mono" dir="ltr">
                          {line.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-secondary-500 mt-3">
                    {isRTL
                      ? 'يرجى إرسال إيصال التحويل على الواتساب بعد إتمام عملية الدفع'
                      : 'Please send the transfer receipt via WhatsApp after completing payment'}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && <p className="text-sm text-error-500">{error}</p>}

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {dict.checkout.notes}
            <span className="text-secondary-400 font-normal">
              ({isRTL ? 'اختياري' : 'Optional'})
            </span>
          </div>
        </label>
        <textarea
          value={customerNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
          placeholder={
            isRTL
              ? 'أي ملاحظات إضافية على الطلب...'
              : 'Any additional notes about your order...'
          }
        />
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedMethod}
        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? isRTL
            ? 'جاري المعالجة...'
            : 'Processing...'
          : dict.common.next}
      </button>
    </div>
  )
}
