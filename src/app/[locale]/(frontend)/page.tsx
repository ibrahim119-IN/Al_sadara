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

// Company-specific components (for subdomains)
import HeroSection from '@/components/layout/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import CTASection from '@/components/sections/CTASection'
import PartnersSection from '@/components/sections/PartnersSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'

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
      ? 'مجموعة الصدارة القابضة | رواد الإلكترونيات وأنظمة المباني الذكية'
      : 'Al Sadara Holding Group | Leaders in Electronics & Smart Building Systems',
    description: isArabic
      ? 'مجموعة الصدارة القابضة - رواد صناعة الإلكترونيات وأنظمة المباني الذكية في مصر والسعودية. كاميرات مراقبة، أنظمة حضور وانصراف، سنترالات، وأنظمة إنذار الحريق.'
      : 'Al Sadara Holding Group - Leaders in electronics and smart building systems in Egypt and Saudi Arabia. CCTV cameras, access control, PBX systems, and fire alarm systems.',
    keywords: isArabic
      ? ['مجموعة الصدارة', 'كاميرات مراقبة', 'أنظمة أمان', 'سنترالات', 'حضور وانصراف', 'إنذار حريق', 'مصر', 'السعودية']
      : ['Al Sadara Group', 'CCTV cameras', 'security systems', 'PBX', 'access control', 'fire alarm', 'Egypt', 'Saudi Arabia'],
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'ar': `${BASE_URL}/ar`,
        'en': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: isArabic
        ? 'مجموعة الصدارة القابضة'
        : 'Al Sadara Holding Group',
      description: isArabic
        ? 'رواد صناعة الإلكترونيات وأنظمة المباني الذكية'
        : 'Leaders in Electronics & Smart Building Systems',
      url: `${BASE_URL}/${locale}`,
      siteName: isArabic ? 'مجموعة الصدارة' : 'Al Sadara Group',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'مجموعة الصدارة القابضة' : 'Al Sadara Holding Group',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic ? 'مجموعة الصدارة القابضة' : 'Al Sadara Holding Group',
      description: isArabic
        ? 'رواد صناعة الإلكترونيات وأنظمة المباني الذكية'
        : 'Leaders in Electronics & Smart Building Systems',
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
      {/* Group Hero Section */}
      <GroupHeroSection locale={locale} />

      {/* Companies Grid Section */}
      <CompaniesGridSection locale={locale} />

      {/* Group Stats Section */}
      <GroupStatsSection locale={locale} />

      {/* Why Us Section */}
      <WhyUsSection locale={locale} />

      {/* Interactive Map Section */}
      <InteractiveLeafletMap locale={locale} />

      {/* Products Overview Section */}
      <GroupProductsSection locale={locale} />

      {/* Group Timeline */}
      <GroupTimeline locale={locale} />

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
