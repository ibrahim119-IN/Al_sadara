import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Image from 'next/image'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { CompanyCard } from '@/components/group/CompanyCard'
import { companies, groupInfo, countryNames, countryFlags } from '@/data/group-data'
import { Building2, Globe, Calendar, Users } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsayedshehatagroup.com'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? `شركاتنا التابعة | ${groupInfo.name.ar}`
      : `Our Companies | ${groupInfo.name.en}`,
    description: isArabic
      ? `تعرف على شركات ${groupInfo.name.ar} - ${groupInfo.totalCompanies} شركات متخصصة في مصر والسعودية والإمارات`
      : `Discover ${groupInfo.name.en} companies - ${groupInfo.totalCompanies} specialized companies in Egypt, Saudi Arabia, and UAE`,
    keywords: isArabic
      ? ['شركات ITs', 'مجموعة السيد شحاتة', 'الصدارة للصناعة', 'التالة الخضراء', 'القيصر', 'إس.إيه.إم', 'بوليمرز', 'شركات مصر', 'شركات السعودية', 'شركات الإمارات']
      : ['ITs companies', 'El Sayed Shehata Group', 'Al Sadara Industry', 'Al Talah', 'Al Qaysar', 'S.A.M', 'Polymers', 'Egypt companies', 'Saudi companies', 'UAE companies'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/companies`,
      languages: {
        'ar': `${BASE_URL}/ar/companies`,
        'en': `${BASE_URL}/en/companies`,
      },
    },
    openGraph: {
      title: isArabic ? 'شركاتنا التابعة' : 'Our Companies',
      description: isArabic
        ? `${groupInfo.totalCompanies} شركات متخصصة في ${groupInfo.countries.ar.join(' و')}`
        : `${groupInfo.totalCompanies} specialized companies in ${groupInfo.countries.en.join(', ')}`,
      url: `${BASE_URL}/${locale}/companies`,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og-companies.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? `شركات ${groupInfo.shortName.ar}` : `${groupInfo.shortName.en} Companies`,
        },
      ],
    },
  }
}

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const breadcrumbItems = [
    { label: isRTL ? 'شركاتنا' : 'Our Companies' },
  ]

  const content = {
    ar: {
      badge: 'شركاتنا التابعة',
      title: groupInfo.name.ar,
      subtitle: groupInfo.description.ar,
      stats: {
        companies: 'شركة',
        countries: 'دول',
        years: 'سنة خبرة',
        employees: 'موظف',
      },
    },
    en: {
      badge: 'Our Subsidiaries',
      title: groupInfo.name.en,
      subtitle: groupInfo.description.en,
      stats: {
        companies: 'Companies',
        countries: 'Countries',
        years: 'Years Experience',
        employees: 'Employees',
      },
    },
  }

  const t = content[locale]

  const stats = [
    { icon: Building2, value: groupInfo.totalCompanies, label: t.stats.companies },
    { icon: Globe, value: groupInfo.countries.ar.length, label: t.stats.countries },
    { icon: Calendar, value: new Date().getFullYear() - groupInfo.founded, label: t.stats.years },
  ]

  // Group companies by country
  const companiesByCountry = {
    egypt: companies.filter(c => c.location.country === 'egypt'),
    saudi: companies.filter(c => c.location.country === 'saudi'),
    uae: companies.filter(c => c.location.country === 'uae'),
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <SimpleBreadcrumb items={breadcrumbItems} locale={locale} className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50" />

          <div className="max-w-4xl mx-auto text-center">
            {/* Group Logo */}
            <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-2">
              <Image
                src={groupInfo.logo}
                alt={isRTL ? groupInfo.name.ar : groupInfo.name.en}
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Building2 className="w-4 h-4 text-primary-400" />
              <span className="text-white/90 font-medium">{t.badge}</span>
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {groupInfo.shortName.en}
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">
              {t.subtitle}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className="w-6 h-6 text-primary-400" />
                      <span className="text-4xl font-bold text-white">{stat.value}</span>
                    </div>
                    <span className="text-white/60 text-sm">{stat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Countries Overview */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6">
            {(['egypt', 'saudi', 'uae'] as const).map((country) => {
              const count = companiesByCountry[country].length
              if (count === 0) return null
              return (
                <div
                  key={country}
                  className="flex items-center gap-3 px-6 py-3 bg-secondary-50 rounded-full"
                >
                  <span className="text-2xl">{countryFlags[country]}</span>
                  <span className="font-semibold text-secondary-900">
                    {isRTL ? countryNames[country].ar : countryNames[country].en}
                  </span>
                  <span className="bg-primary-600 text-white text-sm px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <CompanyCard
                key={company.slug}
                company={company}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
