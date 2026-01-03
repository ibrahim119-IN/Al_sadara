import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { OrderDetailsContent } from '@/components/account/OrderDetailsContent'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; orderNumber: string }>
}): Promise<Metadata> {
  const { locale, orderNumber } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? `طلب رقم ${orderNumber} | مجموعة شركات السيد شحاتة`
      : `Order ${orderNumber} | El Sayed Shehata Group`,
    description: isArabic
      ? `عرض تفاصيل الطلب رقم ${orderNumber}`
      : `View details for order ${orderNumber}`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account/orders/${orderNumber}`,
      languages: {
        'ar': `${BASE_URL}/ar/account/orders/${orderNumber}`,
        'en': `${BASE_URL}/en/account/orders/${orderNumber}`,
      },
    },
  }
}

interface OrderDetailsPageProps {
  params: Promise<{ locale: Locale; orderNumber: string }>
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { locale, orderNumber } = await params
  const dict = await getDictionary(locale)

  return <OrderDetailsContent locale={locale} dict={dict} orderNumber={orderNumber} />
}
