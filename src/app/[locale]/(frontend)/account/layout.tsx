'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'

interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { locale, isArabic } = useLocale()
  const { customer, logout } = useAuth()
  const pathname = usePathname()

  const breadcrumbItems = [
    { label: isArabic ? 'حسابي' : 'My Account' },
  ]

  const content = {
    ar: {
      title: 'حسابي',
      welcome: 'مرحباً',
      navigation: [
        { href: `/${locale}/account`, label: 'لوحة التحكم', icon: User },
        { href: `/${locale}/account/profile`, label: 'الملف الشخصي', icon: User },
        { href: `/${locale}/account/orders`, label: 'طلباتي', icon: Package },
        { href: `/${locale}/account/addresses`, label: 'العناوين', icon: MapPin },
        { href: `/${locale}/account/settings`, label: 'الإعدادات', icon: Settings },
      ],
      logout: 'تسجيل الخروج',
    },
    en: {
      title: 'My Account',
      welcome: 'Welcome',
      navigation: [
        { href: `/${locale}/account`, label: 'Dashboard', icon: User },
        { href: `/${locale}/account/profile`, label: 'Profile', icon: User },
        { href: `/${locale}/account/orders`, label: 'Orders', icon: Package },
        { href: `/${locale}/account/addresses`, label: 'Addresses', icon: MapPin },
        { href: `/${locale}/account/settings`, label: 'Settings', icon: Settings },
      ],
      logout: 'Sign Out',
    },
  }

  const t = content[locale]

  const isActive = (href: string) => {
    if (href === `/${locale}/account`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary-50">
        {/* Hero Header */}
        <section className="relative py-12 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <SimpleBreadcrumb
              items={breadcrumbItems}
              locale={locale}
              className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
            />

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {t.title}
                </h1>
                <p className="text-white/80 mt-1">
                  {t.welcome}, {customer?.firstName || customer?.email || ''}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:w-72 flex-shrink-0">
                <nav className="bg-white rounded-2xl shadow-lg border border-secondary-100 overflow-hidden sticky top-4">
                  <div className="p-4 space-y-1">
                    {t.navigation.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            active
                              ? 'bg-primary-600 text-white shadow-lg'
                              : 'text-secondary-600 hover:bg-secondary-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium flex-1">{item.label}</span>
                          {!active && <ChevronRight className={`w-4 h-4 text-secondary-400 ${isArabic ? 'rotate-180' : ''}`} />}
                        </Link>
                      )
                    })}
                  </div>

                  <div className="border-t border-secondary-100 p-4">
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">{t.logout}</span>
                    </button>
                  </div>
                </nav>
              </aside>

              {/* Page Content */}
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}
