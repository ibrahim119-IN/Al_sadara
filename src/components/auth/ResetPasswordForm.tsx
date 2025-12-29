'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, Save, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface ResetPasswordFormProps {
  locale: Locale
  dict: Dictionary
  token?: string
}

export function ResetPasswordForm({ locale, token }: ResetPasswordFormProps) {
  const router = useRouter()
  const isRTL = locale === 'ar'

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null
    if (password.length < 8) return { label: isRTL ? 'ضعيفة' : 'Weak', color: 'bg-red-500', width: '33%' }
    if (password.length < 12) return { label: isRTL ? 'متوسطة' : 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: isRTL ? 'قوية' : 'Strong', color: 'bg-green-500', width: '100%' }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!password) {
      errors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password is required'
    } else if (password.length < 8) {
      errors.password = isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      errors.confirmPassword = isRTL ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError(
        isRTL
          ? 'رمز إعادة التعيين غير صالح أو مفقود'
          : 'Reset token is missing or invalid'
      )
      return
    }

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/customers/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.errors?.[0]?.message || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/${locale}/login`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-error-600 mb-4">
          {isRTL
            ? 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية'
            : 'Invalid or expired reset link'}
        </p>
        <button
          onClick={() => router.push(`/${locale}/forgot-password`)}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
        >
          {isRTL ? 'طلب رابط جديد' : 'Request New Link'}
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-xl font-bold text-secondary-900 mb-2">
          {isRTL ? 'تم تغيير كلمة المرور' : 'Password Changed'}
        </h3>
        <p className="text-secondary-600 mb-4">
          {isRTL
            ? 'تم إعادة تعيين كلمة المرور بنجاح. جاري التحويل لتسجيل الدخول...'
            : 'Your password has been reset successfully. Redirecting to login...'}
        </p>
      </div>
    )
  }

  const strength = getPasswordStrength(password)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'كلمة المرور الجديدة' : 'New Password'} *
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full ps-10 pe-12 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder={isRTL ? '••••••••' : '••••••••'}
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {strength && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-secondary-600">
                {isRTL ? 'قوة كلمة المرور:' : 'Password strength:'}
              </span>
              <span className={`text-xs font-medium ${strength.color.replace('bg-', 'text-')}`}>
                {strength.label}
              </span>
            </div>
            <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        )}
        {validationErrors.password && (
          <p className="text-sm text-error-500 mt-1">{validationErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full ps-10 pe-12 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder={isRTL ? '••••••••' : '••••••••'}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="text-sm text-error-500 mt-1">{validationErrors.confirmPassword}</p>
        )}
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
          <Save className="w-5 h-5" />
        )}
        {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
      </button>
    </form>
  )
}
