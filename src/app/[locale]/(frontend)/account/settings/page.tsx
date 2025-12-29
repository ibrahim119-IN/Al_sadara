import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { SettingsContent } from '@/components/account/SettingsContent'

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
      ? 'الإعدادات | مجموعة الصدارة القابضة'
      : 'Settings | Al Sadara Holding Group',
    description: isArabic
      ? 'إدارة إعدادات حسابك والتفضيلات'
      : 'Manage your account settings and preferences',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account/settings`,
      languages: {
        'ar': `${BASE_URL}/ar/account/settings`,
        'en': `${BASE_URL}/en/account/settings`,
      },
    },
  }
}

interface SettingsPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <SettingsContent locale={locale} dict={dict} />
}
