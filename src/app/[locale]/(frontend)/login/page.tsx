import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { LogIn, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'تسجيل الدخول | مجموعة الصدارة القابضة'
      : 'Login | Al Sadara Holding Group',
    description: isArabic
      ? 'سجل دخولك إلى حسابك في مجموعة الصدارة للوصول إلى طلباتك وإدارة حسابك'
      : 'Sign in to your Al Sadara account to access your orders and manage your account',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/login`,
      languages: {
        'ar': `${BASE_URL}/ar/login`,
        'en': `${BASE_URL}/en/login`,
      },
    },
  }
}

interface LoginPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale } = await params
  const { redirect } = await searchParams
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const content = {
    ar: {
      title: 'تسجيل الدخول',
      subtitle: 'مرحباً بعودتك إلى مجموعة الصدارة',
      noAccount: 'ليس لديك حساب؟',
      createAccount: 'إنشاء حساب جديد',
      backHome: 'العودة للرئيسية',
    },
    en: {
      title: 'Sign In',
      subtitle: 'Welcome back to Al Sadara Group',
      noAccount: "Don't have an account?",
      createAccount: 'Create Account',
      backHome: 'Back to Home',
    },
  }

  const t = content[locale]
  const BackArrow = isRTL ? ArrowRight : ArrowLeft

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-secondary-50 flex">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 w-full">
          <Link href={`/${locale}`} className="mb-8">
            <Image
              src="/images/logo-white.png"
              alt="Al Sadara"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>

          <h2 className="text-3xl font-bold text-white text-center mb-4">
            {isRTL ? 'مجموعة الصدارة القابضة' : 'Al Sadara Holding Group'}
          </h2>

          <p className="text-white/80 text-center max-w-md">
            {isRTL
              ? 'الرائدون في مجال الإلكترونيات وأنظمة المباني الذكية في مصر والسعودية'
              : 'Leaders in electronics and smart building systems in Egypt and Saudi Arabia'}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white">6</div>
              <div className="text-white/70 text-sm mt-1">{isRTL ? 'شركات' : 'Companies'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">2</div>
              <div className="text-white/70 text-sm mt-1">{isRTL ? 'دول' : 'Countries'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">15+</div>
              <div className="text-white/70 text-sm mt-1">{isRTL ? 'سنة خبرة' : 'Years'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-8 transition-colors"
          >
            <BackArrow className="w-4 h-4" />
            {t.backHome}
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900">{t.title}</h1>
            <p className="text-secondary-600 mt-2">{t.subtitle}</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8">
            <LoginForm locale={locale} dict={dict} redirectTo={redirect} />
          </div>

          {/* Register Link */}
          <p className="text-center text-secondary-600 mt-6">
            {t.noAccount}{' '}
            <Link
              href={`/${locale}/register`}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t.createAccount}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
