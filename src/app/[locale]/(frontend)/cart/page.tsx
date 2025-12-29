import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { CartContent } from '@/components/cart/CartContent'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { ShoppingCart } from 'lucide-react'

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
      ? 'سلة التسوق | مجموعة الصدارة القابضة'
      : 'Shopping Cart | Al Sadara Holding Group',
    description: isArabic
      ? 'راجع سلة التسوق الخاصة بك وأتم عملية الشراء'
      : 'Review your shopping cart and complete your purchase',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/cart`,
      languages: {
        'ar': `${BASE_URL}/ar/cart`,
        'en': `${BASE_URL}/en/cart`,
      },
    },
  }
}

interface CartPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const breadcrumbItems = [
    { label: isRTL ? 'سلة التسوق' : 'Shopping Cart' },
  ]

  const content = {
    ar: {
      title: 'سلة التسوق',
      subtitle: 'راجع منتجاتك قبل إتمام الشراء',
    },
    en: {
      title: 'Shopping Cart',
      subtitle: 'Review your items before checkout',
    },
  }

  const t = content[locale]

  return (
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
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {t.title}
              </h1>
              <p className="text-white/80 mt-1">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <CartContent locale={locale} dict={dict} />
        </div>
      </section>
    </div>
  )
}
