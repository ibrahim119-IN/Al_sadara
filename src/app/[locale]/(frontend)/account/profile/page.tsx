import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { ProfileContent } from '@/components/account/ProfileContent'

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
      ? 'الملف الشخصي | مجموعة الصدارة القابضة'
      : 'Profile | Al Sadara Holding Group',
    description: isArabic
      ? 'تعديل معلوماتك الشخصية وإعدادات الحساب'
      : 'Edit your personal information and account settings',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account/profile`,
      languages: {
        'ar': `${BASE_URL}/ar/account/profile`,
        'en': `${BASE_URL}/en/account/profile`,
      },
    },
  }
}

interface ProfilePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <ProfileContent locale={locale} dict={dict} />
}
