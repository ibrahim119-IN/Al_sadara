'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface LoginFormProps {
  locale: Locale
  dict: Dictionary
  redirectTo?: string
}

export function LoginForm({ locale, dict, redirectTo }: LoginFormProps) {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()
  const isRTL = locale === 'ar'

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      // Login returns the appropriate redirect path based on user type
      const result = await login(formData.email, formData.password)

      // Use provided redirectTo if specified, otherwise use the auto-determined path
      // For customers: /account, for admins: /dashboard
      const finalRedirect = redirectTo || `/${locale}${result.redirectTo}`

      router.push(finalRedirect)
      router.refresh()
    } catch {
      // Error handled by context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'البريد الإلكتروني' : 'Email'}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder={isRTL ? 'example@email.com' : 'example@email.com'}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'كلمة المرور' : 'Password'}
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder={isRTL ? '••••••••' : '••••••••'}
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-secondary-700">
            {isRTL ? 'تذكرني' : 'Remember me'}
          </span>
        </label>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
        </Link>
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
          <LogIn className="w-5 h-5" />
        )}
        {dict.common.login}
      </button>

      <p className="text-center text-sm text-secondary-600">
        {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
        <Link href={`/${locale}/register`} className="text-primary-600 hover:text-primary-700 font-medium">
          {dict.common.register}
        </Link>
      </p>
    </form>
  )
}
