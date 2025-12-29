'use client'

import { useState } from 'react'
import { Mail, Loader2, Send, CheckCircle2 } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface ForgotPasswordFormProps {
  locale: Locale
  dict: Dictionary
}

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const isRTL = locale === 'ar'
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/customers/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.message || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-xl font-bold text-secondary-900 mb-2">
          {isRTL ? 'تحقق من بريدك الإلكتروني' : 'Check Your Email'}
        </h3>
        <p className="text-secondary-600 mb-4">
          {isRTL
            ? 'إذا كان هناك حساب مرتبط بهذا البريد، ستتلقى رابط إعادة تعيين كلمة المرور قريباً'
            : "If an account exists with this email, you'll receive a password reset link shortly"}
        </p>
        <p className="text-sm text-secondary-500">
          {isRTL ? 'لم تستلم الرسالة؟ تحقق من مجلد البريد المزعج' : "Didn't receive it? Check your spam folder"}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
        {isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
      </button>
    </form>
  )
}
