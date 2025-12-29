import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { AccountContent } from '@/components/account/AccountContent'

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
      ? 'حسابي | مجموعة الصدارة القابضة'
      : 'My Account | Al Sadara Holding Group',
    description: isArabic
      ? 'إدارة حسابك في مجموعة الصدارة - عرض الطلبات، العناوين، والإعدادات'
      : 'Manage your Al Sadara account - view orders, addresses, and settings',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account`,
      languages: {
        'ar': `${BASE_URL}/ar/account`,
        'en': `${BASE_URL}/en/account`,
      },
    },
  }
}

interface AccountPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <AccountContent locale={locale} dict={dict} />
}
