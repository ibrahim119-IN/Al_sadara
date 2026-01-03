import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { UserPlus, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'
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
      ? 'إنشاء حساب | مجموعة شركات السيد شحاتة'
      : 'Create Account | El Sayed Shehata Group',
    description: isArabic
      ? 'أنشئ حسابك في مجموعة السيد شحاتة للتسوق وتتبع طلباتك والاستفادة من العروض الحصرية'
      : 'Create your El Sayed Shehata account to shop, track orders, and enjoy exclusive offers',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/register`,
      languages: {
        'ar': `${BASE_URL}/ar/register`,
        'en': `${BASE_URL}/en/register`,
      },
    },
  }
}

interface RegisterPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const content = {
    ar: {
      title: 'إنشاء حساب جديد',
      subtitle: 'انضم إلى مجموعة شركات السيد شحاتة',
      haveAccount: 'لديك حساب بالفعل؟',
      signIn: 'تسجيل الدخول',
      backHome: 'العودة للرئيسية',
      benefits: [
        'تتبع طلباتك بسهولة',
        'الوصول إلى العروض الحصرية',
        'حفظ عناوين الشحن المفضلة',
        'سجل مشتريات كامل',
      ],
    },
    en: {
      title: 'Create Account',
      subtitle: 'Join El Sayed Shehata Group',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
      backHome: 'Back to Home',
      benefits: [
        'Track your orders easily',
        'Access exclusive offers',
        'Save favorite shipping addresses',
        'Complete purchase history',
      ],
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
            {isRTL ? 'انضم إلينا اليوم' : 'Join Us Today'}
          </h2>

          <p className="text-white/80 text-center max-w-md mb-8">
            {isRTL
              ? 'أنشئ حسابك واستمتع بتجربة تسوق استثنائية'
              : 'Create your account and enjoy an exceptional shopping experience'}
          </p>

          {/* Benefits */}
          <div className="space-y-4 w-full max-w-sm">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg">
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
              <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900">{t.title}</h1>
            <p className="text-secondary-600 mt-2">{t.subtitle}</p>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 p-8">
            <RegisterForm locale={locale} dict={dict} />
          </div>

          {/* Login Link */}
          <p className="text-center text-secondary-600 mt-6">
            {t.haveAccount}{' '}
            <Link
              href={`/${locale}/login`}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
