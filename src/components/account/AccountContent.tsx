'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { User, Package, MapPin, Settings, LogOut, Loader2 } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AccountContentProps {
  locale: Locale
  dict: Dictionary
}

export function AccountContent({ locale, dict }: AccountContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, logout } = useAuth()
  const isRTL = locale === 'ar'

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}`)
    router.refresh()
  }

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const accountSections = [
    {
      href: `/${locale}/account/profile`,
      icon: User,
      title: isRTL ? 'معلوماتي الشخصية' : 'Personal Information',
      description: isRTL ? 'عرض وتعديل المعلومات' : 'View and edit your profile',
    },
    {
      href: `/${locale}/account/orders`,
      icon: Package,
      title: isRTL ? 'طلباتي' : 'My Orders',
      description: isRTL ? 'تتبع طلباتك' : 'Track your orders',
    },
    {
      href: `/${locale}/account/addresses`,
      icon: MapPin,
      title: isRTL ? 'عناويني' : 'My Addresses',
      description: isRTL ? 'إدارة عناوين الشحن' : 'Manage shipping addresses',
    },
    {
      href: `/${locale}/account/settings`,
      icon: Settings,
      title: isRTL ? 'الإعدادات' : 'Settings',
      description: isRTL ? 'كلمة المرور والخصوصية' : 'Password and privacy',
    },
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl border border-secondary-200 p-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            {isRTL ? `مرحباً، ${customer.firstName} ${customer.lastName}` : `Welcome, ${customer.firstName} ${customer.lastName}`}
          </h1>
          <p className="text-secondary-600 mb-8">{customer.email}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {accountSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="p-6 border-2 border-secondary-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-start"
                >
                  <Icon className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-bold text-secondary-900">{section.title}</h3>
                  <p className="text-sm text-secondary-600 mt-1">{section.description}</p>
                </Link>
              )
            })}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex items-center gap-2 text-error-600 hover:text-error-700 font-medium"
          >
            <LogOut className="w-5 h-5" />
            {isRTL ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}
