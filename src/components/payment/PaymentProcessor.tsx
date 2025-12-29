'use client'

import React, { useState, useCallback } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { PaymentMethodSelector } from './PaymentMethodSelector'

interface PaymentProcessorProps {
  orderId: string
  amount: number
  currency?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

type PaymentStep = 'select' | 'processing' | 'redirect' | 'kiosk' | 'success' | 'error'

export function PaymentProcessor({
  orderId,
  amount,
  currency = 'EGP',
  onSuccess,
  onError,
  onCancel,
}: PaymentProcessorProps) {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'

  const [step, setStep] = useState<PaymentStep>('select')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [kioskCode, setKioskCode] = useState<string | null>(null)
  const [expiryDate, setExpiryDate] = useState<string | null>(null)

  const texts = {
    payNow: isArabic ? 'ادفع الآن' : 'Pay Now',
    processing: isArabic ? 'جاري معالجة الدفع...' : 'Processing payment...',
    redirecting: isArabic ? 'جاري التحويل لبوابة الدفع...' : 'Redirecting to payment gateway...',
    selectMethod: isArabic ? 'اختر طريقة الدفع للمتابعة' : 'Select a payment method to continue',
    total: isArabic ? 'الإجمالي' : 'Total',
    cancel: isArabic ? 'إلغاء' : 'Cancel',
    tryAgain: isArabic ? 'حاول مرة أخرى' : 'Try Again',
    kioskTitle: isArabic ? 'كود الدفع في المنافذ' : 'Payment Reference Code',
    kioskInstructions: isArabic
      ? 'استخدم هذا الكود للدفع في أي منفذ فوري'
      : 'Use this code to pay at any Fawry outlet',
    expires: isArabic ? 'ينتهي في' : 'Expires',
    copied: isArabic ? 'تم النسخ!' : 'Copied!',
    copyCode: isArabic ? 'نسخ الكود' : 'Copy Code',
    codSuccess: isArabic ? 'تم تسجيل طلبك بنجاح' : 'Your order has been placed successfully',
    codMessage: isArabic
      ? 'سيتم الدفع عند الاستلام'
      : 'Payment will be collected on delivery',
  }

  const handleMethodSelect = useCallback((provider: string, method: string) => {
    setSelectedProvider(provider)
    setSelectedMethod(method)
    setError(null)
  }, [])

  const handlePayment = useCallback(async () => {
    if (!selectedProvider || !selectedMethod) return

    setStep('processing')
    setError(null)

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          provider: selectedProvider,
          method: selectedMethod,
          returnUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
          cancelUrl: `${window.location.origin}/checkout/cancel?orderId=${orderId}`,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || result.message || 'Payment failed')
      }

      // Handle different payment flows
      if (selectedProvider === 'cash_on_delivery') {
        setStep('success')
        onSuccess?.(result.transactionId)
        return
      }

      if (result.kioskCode || selectedMethod === 'kiosk') {
        setKioskCode(result.kioskCode || result.referenceNumber)
        setExpiryDate(result.expiryDate)
        setStep('kiosk')
        return
      }

      if (result.paymentUrl) {
        setStep('redirect')
        // Redirect to payment page
        window.location.href = result.paymentUrl
        return
      }

      // If no redirect URL, consider it success
      setStep('success')
      onSuccess?.(result.transactionId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      setStep('error')
      onError?.(errorMessage)
    }
  }, [orderId, selectedProvider, selectedMethod, onSuccess, onError])

  const handleCopyCode = useCallback(() => {
    if (kioskCode) {
      navigator.clipboard.writeText(kioskCode)
      // Could add a toast notification here
    }
  }, [kioskCode])

  const handleRetry = useCallback(() => {
    setStep('select')
    setError(null)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency,
    }).format(value)
  }

  // Select payment method step
  if (step === 'select') {
    return (
      <div className="space-y-6">
        <PaymentMethodSelector
          onSelect={handleMethodSelect}
          selectedProvider={selectedProvider || undefined}
          selectedMethod={selectedMethod || undefined}
        />

        {/* Order Summary */}
        <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-secondary-600 dark:text-secondary-400">{texts.total}</span>
            <span className="text-xl font-bold text-secondary-900 dark:text-white">
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-6 border border-secondary-300 dark:border-secondary-600 rounded-xl text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
            >
              {texts.cancel}
            </button>
          )}
          <button
            type="button"
            onClick={handlePayment}
            disabled={!selectedProvider || !selectedMethod}
            className={`
              flex-1 py-3 px-6 rounded-xl font-semibold transition-all
              ${selectedProvider && selectedMethod
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 cursor-not-allowed'
              }
            `}
          >
            {texts.payNow}
          </button>
        </div>

        {!selectedProvider && (
          <p className="text-sm text-center text-secondary-500 dark:text-secondary-400">
            {texts.selectMethod}
          </p>
        )}
      </div>
    )
  }

  // Processing step
  if (step === 'processing' || step === 'redirect') {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
        <p className="text-lg text-secondary-600 dark:text-secondary-400">
          {step === 'redirect' ? texts.redirecting : texts.processing}
        </p>
      </div>
    )
  }

  // Kiosk code step
  if (step === 'kiosk' && kioskCode) {
    return (
      <div className="text-center space-y-6">
        <div className="p-6 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            {texts.kioskTitle}
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            {texts.kioskInstructions}
          </p>
          <div className="p-4 bg-white dark:bg-secondary-900 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-700">
            <p className="text-3xl font-mono font-bold text-primary-600 dark:text-primary-400 tracking-wider">
              {kioskCode}
            </p>
          </div>
          {expiryDate && (
            <p className="mt-3 text-sm text-secondary-500 dark:text-secondary-400">
              {texts.expires}: {new Date(expiryDate).toLocaleString(isArabic ? 'ar-EG' : 'en-EG')}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
        >
          {texts.copyCode}
        </button>
      </div>
    )
  }

  // Success step (for COD)
  if (step === 'success') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
          {texts.codSuccess}
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          {texts.codMessage}
        </p>
      </div>
    )
  }

  // Error step
  if (step === 'error') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="py-2 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
        >
          {texts.tryAgain}
        </button>
      </div>
    )
  }

  return null
}
