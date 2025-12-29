'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Phone as PhoneIcon, Building2, Loader2, Save, ArrowLeft, Edit } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface ProfileContentProps {
  locale: Locale
  dict: Dictionary
}

export function ProfileContent({ locale, dict }: ProfileContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, updateProfile, error, clearError } = useAuth()
  const isRTL = locale === 'ar'

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account/profile`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        company: customer.company || '',
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setSuccessMessage('')
    setIsSaving(true)

    try {
      await updateProfile(formData)
      setSuccessMessage(isRTL ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully')
      setIsEditing(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phone: customer.phone || '',
        company: customer.company || '',
      })
    }
    setIsEditing(false)
    clearError()
  }

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  {isRTL ? 'معلوماتي الشخصية' : 'Personal Information'}
                </h1>
                <p className="text-sm text-secondary-600">
                  {isRTL ? 'عرض وتعديل بياناتك الشخصية' : 'View and edit your personal data'}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all font-medium"
              >
                <Edit className="w-4 h-4" />
                {isRTL ? 'تعديل' : 'Edit'}
              </button>
            )}
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'الاسم الأول' : 'First Name'} *
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-secondary-50 disabled:text-secondary-500"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'اسم العائلة' : 'Last Name'} *
                </label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-secondary-50 disabled:text-secondary-500"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="email"
                  value={customer.email}
                  className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl bg-secondary-50 text-secondary-500 cursor-not-allowed"
                  disabled
                />
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {isRTL ? 'لتغيير البريد الإلكتروني، يرجى التواصل مع الدعم' : 'To change email, please contact support'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <div className="relative">
                <PhoneIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-secondary-50 disabled:text-secondary-500"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {customer.customerType === 'business' && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'اسم الشركة' : 'Company Name'}
                </label>
                <div className="relative">
                  <Building2 className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full ps-10 pe-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-secondary-50 disabled:text-secondary-500"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {isRTL ? 'نوع العميل' : 'Customer Type'}
              </label>
              <div className="px-4 py-3 border border-secondary-300 rounded-xl bg-secondary-50 text-secondary-700">
                {customer.customerType === 'business'
                  ? isRTL
                    ? 'شركة'
                    : 'Business'
                  : isRTL
                  ? 'فرد'
                  : 'Individual'}
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                {isRTL ? 'لا يمكن تغيير نوع العميل' : 'Customer type cannot be changed'}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
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
                  {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-3 border border-secondary-300 text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 font-medium rounded-xl transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
