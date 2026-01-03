import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

// Group components
import GroupHeroSection from '@/components/group/GroupHeroSection'
import CompaniesGridSection from '@/components/group/CompaniesGridSection'
import GroupStatsSection from '@/components/group/GroupStatsSection'
import GroupProductsSection from '@/components/group/GroupProductsSection'
import WhyUsSection from '@/components/group/WhyUsSection'
import InteractiveLeafletMap from '@/components/group/InteractiveLeafletMap'
import GroupTimeline from '@/components/group/GroupTimeline'
import PageProgressIndicator, { type PageSection } from '@/components/layout/PageProgressIndicator'

// Company-specific components (for subdomains)
import HeroSection from '@/components/layout/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import CTASection from '@/components/sections/CTASection'
import PartnersSection from '@/components/sections/PartnersSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'

// Page sections for progress indicator
const pageSections: PageSection[] = [
  { id: 'hero', label: { ar: 'الرئيسية', en: 'Home' } },
  { id: 'companies', label: { ar: 'شركاتنا', en: 'Our Companies' } },
  { id: 'stats', label: { ar: 'إحصائيات', en: 'Statistics' } },
  { id: 'why-us', label: { ar: 'لماذا نحن', en: 'Why Us' } },
  { id: 'map', label: { ar: 'تواجدنا', en: 'Our Presence' } },
  { id: 'products', label: { ar: 'منتجاتنا', en: 'Products' } },
  { id: 'timeline', label: { ar: 'رحلتنا', en: 'Our Journey' } },
  { id: 'testimonials', label: { ar: 'آراء العملاء', en: 'Testimonials' } },
  { id: 'cta', label: { ar: 'تواصل معنا', en: 'Contact Us' } },
]

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
      ? 'مجموعة شركات السيد شحاتة | رواد تجارة خامات البلاستيك والبوليمرات'
      : 'El Sayed Shehata Group | Leaders in Plastic Raw Materials & Polymers Trading',
    description: isArabic
      ? 'مجموعة شركات السيد شحاتة - رواد تجارة وتوريد خامات البلاستيك والبوليمرات في مصر والسعودية والإمارات. HDPE، LDPE، PP، إعادة التدوير.'
      : 'El Sayed Shehata Group of Companies - Leaders in plastic raw materials trading and polymers supply in Egypt, Saudi Arabia, and UAE. HDPE, LDPE, PP, Recycling.',
    keywords: isArabic
      ? ['مجموعة السيد شحاتة', 'خامات بلاستيك', 'بوليمرات', 'HDPE', 'LDPE', 'PP', 'إعادة تدوير', 'مصر', 'السعودية', 'الإمارات']
      : ['El Sayed Shehata Group', 'plastic raw materials', 'polymers', 'HDPE', 'LDPE', 'PP', 'recycling', 'Egypt', 'Saudi Arabia', 'UAE'],
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'ar': `${BASE_URL}/ar`,
        'en': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: isArabic
        ? 'مجموعة شركات السيد شحاتة'
        : 'El Sayed Shehata Group',
      description: isArabic
        ? 'رواد تجارة خامات البلاستيك والبوليمرات'
        : 'Leaders in Plastic Raw Materials & Polymers Trading',
      url: `${BASE_URL}/${locale}`,
      siteName: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group of Companies',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
      description: isArabic
        ? 'رواد تجارة خامات البلاستيك والبوليمرات'
        : 'Leaders in Plastic Raw Materials & Polymers Trading',
      images: [`${BASE_URL}/images/og-home.jpg`],
    },
  }
}

async function getCompanyContext() {
  const headersList = await headers()
  const isSubdomain = headersList.get('x-is-subdomain') === 'true'
  const companySlug = headersList.get('x-company-slug')

  return { isSubdomain, companySlug }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const { isSubdomain, companySlug } = await getCompanyContext()

  // If we're on a subdomain, show company-specific content
  if (isSubdomain && companySlug) {
    return (
      <div className="overflow-hidden">
        {/* Company-specific Hero */}
        <HeroSection
          locale={locale}
          title={dict.home.hero.title}
          subtitle={dict.home.hero.subtitle}
          ctaPrimary={dict.home.hero.cta}
          ctaSecondary={dict.common.contact}
        />

        {/* Stats Section */}
        <StatsSection locale={locale} />

        {/* Features Section */}
        <FeaturesSection locale={locale} />

        {/* Categories Section */}
        <CategoriesSection
          locale={locale}
          title={dict.home.shopByCategory}
        />

        {/* Featured Products Section */}
        <FeaturedProductsSection
          locale={locale}
          title={dict.home.featuredProducts}
          viewAllLabel={dict.common.all}
          currency={dict.common.currency}
        />

        {/* Partners Section */}
        <PartnersSection locale={locale} />

        {/* Testimonials Section */}
        <TestimonialsSection locale={locale} />

        {/* CTA Section */}
        <CTASection
          locale={locale}
          contactLabel={dict.common.contact}
          quoteLabel={dict.quote.title}
        />
      </div>
    )
  }

  // Main domain (alsadara.org) - show group portal
  return (
    <div className="overflow-hidden">
      {/* Page Progress Indicator */}
      <PageProgressIndicator sections={pageSections} locale={locale} />

      {/* Group Hero Section */}
      <div id="hero">
        <GroupHeroSection locale={locale} />
      </div>

      {/* Companies Grid Section */}
      <div id="companies">
        <CompaniesGridSection locale={locale} />
      </div>

      {/* Group Stats Section */}
      <div id="stats">
        <GroupStatsSection locale={locale} />
      </div>

      {/* Why Us Section */}
      <div id="why-us">
        <WhyUsSection locale={locale} />
      </div>

      {/* Interactive Map Section */}
      <div id="map">
        <InteractiveLeafletMap locale={locale} />
      </div>

      {/* Products Overview Section */}
      <div id="products">
        <GroupProductsSection locale={locale} />
      </div>

      {/* Group Timeline */}
      <div id="timeline">
        <GroupTimeline locale={locale} />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection locale={locale} />
      </div>

      {/* CTA Section */}
      <div id="cta">
        <CTASection
          locale={locale}
          contactLabel={dict.common.contact}
          quoteLabel={dict.quote.title}
        />
      </div>
    </div>
  )
}
