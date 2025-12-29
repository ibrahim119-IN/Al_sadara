import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { OrdersContent } from '@/components/account/OrdersContent'

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
      ? 'طلباتي | مجموعة الصدارة القابضة'
      : 'My Orders | Al Sadara Holding Group',
    description: isArabic
      ? 'عرض وتتبع طلباتك من مجموعة الصدارة'
      : 'View and track your orders from Al Sadara Group',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account/orders`,
      languages: {
        'ar': `${BASE_URL}/ar/account/orders`,
        'en': `${BASE_URL}/en/account/orders`,
      },
    },
  }
}

interface OrdersPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <OrdersContent locale={locale} dict={dict} />
}
