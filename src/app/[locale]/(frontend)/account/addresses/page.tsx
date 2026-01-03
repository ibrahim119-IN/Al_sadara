import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { AddressesContent } from '@/components/account/AddressesContent'

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
      ? 'العناوين | مجموعة شركات السيد شحاتة'
      : 'Addresses | El Sayed Shehata Group',
    description: isArabic
      ? 'إدارة عناوين الشحن والتوصيل الخاصة بك'
      : 'Manage your shipping and delivery addresses',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/account/addresses`,
      languages: {
        'ar': `${BASE_URL}/ar/account/addresses`,
        'en': `${BASE_URL}/en/account/addresses`,
      },
    },
  }
}

interface AddressesPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AddressesPage({ params }: AddressesPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <AddressesContent locale={locale} dict={dict} />
}
