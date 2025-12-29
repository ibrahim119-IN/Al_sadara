'use client'

import React, { useState, useEffect } from 'react'
import { useLocale } from '@/contexts/LocaleContext'

interface PaymentMethodOption {
  provider: string
  methods: string[]
  name: string
  nameAr: string
}

interface PaymentMethodSelectorProps {
  onSelect: (provider: string, method: string) => void
  selectedProvider?: string
  selectedMethod?: string
  disabled?: boolean
}

const methodIcons: Record<string, React.ReactNode> = {
  card: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  wallet: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  kiosk: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  cash: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
}

const methodLabels: Record<string, { en: string; ar: string }> = {
  card: { en: 'Credit/Debit Card', ar: 'بطاقة ائتمان/خصم' },
  wallet: { en: 'Mobile Wallet', ar: 'المحفظة الإلكترونية' },
  kiosk: { en: 'Pay at Outlet', ar: 'الدفع في المنافذ' },
  cash: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
}

export function PaymentMethodSelector({
  onSelect,
  selectedProvider,
  selectedMethod,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethodOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const response = await fetch('/api/payments')
        if (!response.ok) throw new Error('Failed to fetch payment methods')
        const data = await response.json()
        setPaymentOptions(data.methods)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment methods')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPaymentMethods()
  }, [])

  const texts = {
    title: isArabic ? 'اختر طريقة الدفع' : 'Select Payment Method',
    loading: isArabic ? 'جاري التحميل...' : 'Loading...',
    error: isArabic ? 'حدث خطأ في تحميل طرق الدفع' : 'Error loading payment methods',
    noMethods: isArabic ? 'لا توجد طرق دفع متاحة' : 'No payment methods available',
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-40"></div>
        <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-red-600 dark:text-red-400">{texts.error}</p>
      </div>
    )
  }

  if (paymentOptions.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <p className="text-yellow-600 dark:text-yellow-400">{texts.noMethods}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
        {texts.title}
      </h3>

      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <div key={option.provider} className="space-y-2">
            <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              {isArabic ? option.nameAr : option.name}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {option.methods.map((method) => {
                const isSelected = selectedProvider === option.provider && selectedMethod === method
                const label = methodLabels[method]

                return (
                  <button
                    key={`${option.provider}-${method}`}
                    type="button"
                    onClick={() => onSelect(option.provider, method)}
                    disabled={disabled}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected
                        ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400'
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400'
                      }
                    `}>
                      {methodIcons[method]}
                    </div>
                    <div className="flex-1 text-start">
                      <p className={`
                        font-medium
                        ${isSelected
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-secondary-900 dark:text-white'
                        }
                      `}>
                        {isArabic ? label?.ar : label?.en}
                      </p>
                    </div>
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-secondary-300 dark:border-secondary-600'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
