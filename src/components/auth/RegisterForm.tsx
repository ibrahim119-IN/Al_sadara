'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone as PhoneIcon, Building2, UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface RegisterFormProps {
  locale: Locale
  dict: Dictionary
}

export function RegisterForm({ locale, dict }: RegisterFormProps) {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuth()
  const isRTL = locale === 'ar'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    customerType: 'individual' as 'individual' | 'business',
    company: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName) newErrors.firstName = isRTL ? 'الاسم الأول مطلوب' : 'First name required'
    if (!formData.lastName) newErrors.lastName = isRTL ? 'اسم العائلة مطلوب' : 'Last name required'
    if (!formData.email) newErrors.email = isRTL ? 'البريد الإلكتروني مطلوب' : 'Email required'
    if (!formData.phone) newErrors.phone = isRTL ? 'رقم الهاتف مطلوب' : 'Phone required'
    if (!formData.password) newErrors.password = isRTL ? 'كلمة المرور مطلوبة' : 'Password required'
    if (formData.password.length < 8) newErrors.password = isRTL ? 'كلمة المرور قصيرة جداً' : 'Password too short'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validate()) return

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        customerType: formData.customerType,
        company: formData.company || undefined,
      })
      router.push(`/${locale}/account`)
      router.refresh()
    } catch (err) {
      // Error handled by context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {isRTL ? 'الاسم الأول' : 'First Name'} *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
          {errors.firstName && <p className="text-sm text-error-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {isRTL ? 'اسم العائلة' : 'Last Name'} *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'البريد الإلكتروني' : 'Email'} *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {isRTL ? 'رقم الهاتف' : 'Phone'} *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          dir="ltr"
          placeholder="01xxxxxxxxx"
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {isRTL ? 'كلمة المرور' : 'Password'} *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            minLength={8}
            required
          />
          {errors.password && <p className="text-sm text-error-500 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'} *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
          {errors.confirmPassword && <p className="text-sm text-error-500 mt-1">{errors.confirmPassword}</p>}
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
        <UserPlus className="w-5 h-5" />
        {dict.common.register}
      </button>

      <p className="text-center text-sm text-secondary-600">
        {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
        <Link href={`/${locale}/login`} className="text-primary-600 hover:text-primary-700 font-medium">
          {dict.common.login}
        </Link>
      </p>
    </form>
  )
}
