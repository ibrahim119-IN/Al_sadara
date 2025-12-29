'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Settings, Lock, Loader2, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface SettingsContentProps {
  locale: Locale
  dict: Dictionary
}

export function SettingsContent({ locale, dict }: SettingsContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading } = useAuth()
  const isRTL = locale === 'ar'

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account/settings`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.currentPassword) {
      errors.currentPassword = isRTL ? 'كلمة المرور الحالية مطلوبة' : 'Current password is required'
    }

    if (!formData.newPassword) {
      errors.newPassword = isRTL ? 'كلمة المرور الجديدة مطلوبة' : 'New password is required'
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = isRTL ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = isRTL ? 'تأكيد كلمة المرور مطلوب' : 'Confirm password is required'
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
    }

    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      errors.newPassword = isRTL
        ? 'كلمة المرور الجديدة يجب أن تختلف عن الحالية'
        : 'New password must be different from current password'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null
    if (password.length < 8) return { label: isRTL ? 'ضعيفة' : 'Weak', color: 'bg-red-500', width: '33%' }
    if (password.length < 12) return { label: isRTL ? 'متوسطة' : 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: isRTL ? 'قوية' : 'Strong', color: 'bg-green-500', width: '100%' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!validateForm()) return

    if (!customer) return

    setIsSaving(true)

    try {
      const response = await fetch('/api/customers/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setSuccessMessage(isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  const strength = getPasswordStrength(formData.newPassword)

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-3xl">
        <Link
          href={`/${locale}/account`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isRTL ? 'العودة إلى الحساب' : 'Back to Account'}</span>
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {isRTL ? 'الإعدادات' : 'Settings'}
              </h1>
              <p className="text-sm text-secondary-600">
                {isRTL ? 'إدارة إعدادات الحساب والأمان' : 'Manage your account and security settings'}
              </p>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="border-t border-secondary-200 pt-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-secondary-900">
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </h2>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl text-success-700 text-sm">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'كلمة المرور الحالية' : 'Current Password'} *
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full ps-10 pe-12 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder={isRTL ? '••••••••' : '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.currentPassword && (
                  <p className="text-sm text-error-500 mt-1">{validationErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'} *
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full ps-10 pe-12 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder={isRTL ? '••••••••' : '••••••••'}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                {validationErrors.newPassword && (
                  <p className="text-sm text-error-500 mt-1">{validationErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} *
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isRTL ? 'حفظ كلمة المرور الجديدة' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
