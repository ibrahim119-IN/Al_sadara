import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCompanyBySlug, companies, groupInfo, countryFlags, countryNames } from '@/data/group-data'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elsayedshehatagroup.com'
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Target,
  Eye,
  ExternalLink,
  MessageCircle,
  Building2,
  Users,
  Globe,
  Award,
  TrendingUp,
  Factory,
  Recycle,
  Cpu,
  Package,
} from 'lucide-react'

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isArabic = locale === 'ar'
  const company = getCompanyBySlug(slug)

  if (!company) {
    return {
      title: isArabic ? 'الشركة غير موجودة' : 'Company Not Found',
    }
  }

  const companyName = isArabic ? company.name.ar : company.name.en
  const companyDesc = isArabic ? company.description.ar : company.description.en

  return {
    title: `${companyName} | ${isArabic ? groupInfo.name.ar : groupInfo.name.en}`,
    description: companyDesc,
    keywords: isArabic
      ? [company.name.ar, groupInfo.shortName.ar, 'خامات بلاستيك', company.location.city.ar]
      : [company.name.en, groupInfo.shortName.en, 'plastic raw materials', company.location.city.en],
    alternates: {
      canonical: `${BASE_URL}/${locale}/companies/${slug}`,
      languages: {
        'ar': `${BASE_URL}/ar/companies/${slug}`,
        'en': `${BASE_URL}/en/companies/${slug}`,
      },
    },
    openGraph: {
      title: companyName,
      description: companyDesc,
      url: `${BASE_URL}/${locale}/companies/${slug}`,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}${company.logo}`,
          width: 800,
          height: 600,
          alt: companyName,
        },
      ],
    },
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const company = getCompanyBySlug(slug)
  if (!company) {
    notFound()
  }

  const breadcrumbItems = [
    { label: isRTL ? 'شركاتنا' : 'Our Companies', href: `/${locale}/companies` },
    { label: isRTL ? company.name.ar : company.name.en },
  ]

  const content = {
    ar: {
      backToCompanies: 'العودة للشركات',
      founded: 'تأسست عام',
      aboutUs: 'من نحن',
      vision: 'رؤيتنا',
      mission: 'رسالتنا',
      services: 'خدماتنا',
      products: 'منتجاتنا',
      whyChooseUs: 'لماذا تختارنا؟',
      contact: 'تواصل معنا',
      callUs: 'اتصل بنا',
      emailUs: 'راسلنا',
      whatsapp: 'واتساب',
      viewProducts: 'عرض المنتجات',
      visitWebsite: 'زيارة الموقع',
    },
    en: {
      backToCompanies: 'Back to Companies',
      founded: 'Founded',
      aboutUs: 'About Us',
      vision: 'Our Vision',
      mission: 'Our Mission',
      services: 'Our Services',
      products: 'Our Products',
      whyChooseUs: 'Why Choose Us?',
      contact: 'Contact Us',
      callUs: 'Call Us',
      emailUs: 'Email Us',
      whatsapp: 'WhatsApp',
      viewProducts: 'View Products',
      visitWebsite: 'Visit Website',
    },
  }

  const t = content[locale]
  const countryName = countryNames[company.location.country]
  const countryFlag = countryFlags[company.location.country]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{ backgroundColor: company.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Breadcrumb */}
          <SimpleBreadcrumb
            items={breadcrumbItems}
            locale={locale}
            className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Logo */}
              <div className="relative w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl overflow-hidden mb-6">
                <Image
                  src={company.logo}
                  alt={isRTL ? company.name.ar : company.name.en}
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                  priority
                />
              </div>

              {/* Name */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {isRTL ? company.name.ar : company.name.en}
              </h1>
              <p className="text-xl text-white/80 mb-6">
                {isRTL ? company.name.en : company.name.ar}
              </p>

              {/* Description */}
              <p className="text-lg text-white/90 mb-8 max-w-xl">
                {isRTL ? company.description.ar : company.description.en}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{countryFlag}</span>
                  <MapPin className="w-5 h-5" />
                  <span>{isRTL ? company.location.city.ar : company.location.city.en}, {isRTL ? countryName.ar : countryName.en}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{t.founded} {company.founded}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="font-bold text-xl text-secondary-900 mb-6">{t.contact}</h3>

              <div className="space-y-4 mb-6">
                {company.contact.phones.map((phone, i) => (
                  <a
                    key={i}
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary-600" />
                    </div>
                    <span dir="ltr">{phone}</span>
                  </a>
                ))}
                <a
                  href={`mailto:${company.contact.email}`}
                  className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <span>{company.contact.email}</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${company.contact.phones[0]}`}
                  className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <Phone className="w-5 h-5" />
                  {t.callUs}
                </a>
                {company.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t.whatsapp}
                  </a>
                )}
              </div>

              {company.contact.website && (
                <a
                  href={`https://${company.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  {t.visitWebsite}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Founded Year */}
            <div className="text-center p-6 rounded-2xl bg-secondary-50">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${company.color}15` }}>
                <Calendar className="w-7 h-7" style={{ color: company.color }} />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-1">{company.founded}</div>
              <div className="text-secondary-600 text-sm">{isRTL ? 'سنة التأسيس' : 'Founded'}</div>
            </div>

            {/* Location */}
            <div className="text-center p-6 rounded-2xl bg-secondary-50">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${company.color}15` }}>
                <Globe className="w-7 h-7" style={{ color: company.color }} />
              </div>
              <div className="text-2xl font-bold text-secondary-900 mb-1">{countryFlag}</div>
              <div className="text-secondary-600 text-sm">{isRTL ? company.location.city.ar : company.location.city.en}</div>
            </div>

            {/* Services Count */}
            <div className="text-center p-6 rounded-2xl bg-secondary-50">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${company.color}15` }}>
                <Package className="w-7 h-7" style={{ color: company.color }} />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-1">{company.services.length}+</div>
              <div className="text-secondary-600 text-sm">{isRTL ? 'خدمة' : 'Services'}</div>
            </div>

            {/* Years Experience */}
            <div className="text-center p-6 rounded-2xl bg-secondary-50">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${company.color}15` }}>
                <Award className="w-7 h-7" style={{ color: company.color }} />
              </div>
              <div className="text-3xl font-bold text-secondary-900 mb-1">{new Date().getFullYear() - company.founded}+</div>
              <div className="text-secondary-600 text-sm">{isRTL ? 'سنة خبرة' : 'Years Experience'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Description */}
      {company.fullDescription && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${company.color}15` }}>
                  <Building2 className="w-6 h-6" style={{ color: company.color }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">{t.aboutUs}</h2>
              </div>
              <p className="text-lg text-secondary-600 leading-relaxed whitespace-pre-line">
                {isRTL ? company.fullDescription.ar : company.fullDescription.en}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Vision & Mission */}
      {(company.vision || company.mission) && (
        <section className="py-20 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vision */}
              {company.vision && (
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${company.color}15` }}
                  >
                    <Eye className="w-8 h-8" style={{ color: company.color }} />
                  </div>
                  <h3 className="font-bold text-2xl text-secondary-900 mb-4">{t.vision}</h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {isRTL ? company.vision.ar : company.vision.en}
                  </p>
                </div>
              )}

              {/* Mission */}
              {company.mission && (
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${company.color}15` }}
                  >
                    <Target className="w-8 h-8" style={{ color: company.color }} />
                  </div>
                  <h3 className="font-bold text-2xl text-secondary-900 mb-4">{t.mission}</h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {isRTL ? company.mission.ar : company.mission.en}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {company.services.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-12">{t.services}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.services.map((service, index) => (
                <div
                  key={index}
                  className="bg-secondary-50 rounded-2xl p-6 hover:bg-secondary-100 transition-colors border-r-4"
                  style={{ borderRightColor: company.color }}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: company.color }} />
                    <span className="font-semibold text-secondary-900">
                      {isRTL ? service.ar : service.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {company.products && company.products.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">{t.products}</h2>
              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t.viewProducts}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {company.products.map((product, index) => (
                <div
                  key={index}
                  className="px-6 py-4 bg-white rounded-2xl shadow-md border-t-4"
                  style={{ borderTopColor: company.color }}
                >
                  <span className="font-bold text-lg text-secondary-900">
                    {isRTL ? product.ar : product.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {company.whyChooseUs && company.whyChooseUs.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-12 text-center">{t.whyChooseUs}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {company.whyChooseUs.map((reason, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl"
                  style={{ backgroundColor: `${company.color}10` }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl"
                    style={{ backgroundColor: company.color }}
                  >
                    {index + 1}
                  </div>
                  <span className="font-semibold text-secondary-900">
                    {isRTL ? reason.ar : reason.en}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: company.color }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {isRTL ? 'هل لديك استفسار؟' : 'Have a Question?'}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {isRTL
              ? 'تواصل معنا الآن وسيقوم فريقنا بالرد عليك في أقرب وقت'
              : 'Contact us now and our team will get back to you as soon as possible'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${company.contact.phones[0]}`}
              className="inline-flex items-center gap-2 bg-white text-secondary-900 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-100 transition-all"
            >
              <Phone className="w-5 h-5" />
              {t.callUs}
            </a>
            {company.contact.whatsapp && (
              <a
                href={`https://wa.me/${company.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                {t.whatsapp}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Related Companies Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {isRTL ? 'شركات أخرى من المجموعة' : 'Other Companies in Our Group'}
            </h2>
            <p className="text-lg text-secondary-600">
              {isRTL
                ? `تعرف على شركات ${groupInfo.shortName.ar} الأخرى`
                : `Discover other ${groupInfo.shortName.en} companies`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies
              .filter(c => c.slug !== company.slug)
              .slice(0, 3)
              .map((relatedCompany) => (
                <Link
                  key={relatedCompany.slug}
                  href={`/${locale}/companies/${relatedCompany.slug}`}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group border-t-4"
                  style={{ borderTopColor: relatedCompany.color }}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Image
                        src={relatedCompany.logo}
                        alt={isRTL ? relatedCompany.name.ar : relatedCompany.name.en}
                        fill
                        sizes="64px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {isRTL ? relatedCompany.name.ar : relatedCompany.name.en}
                      </h3>
                      <div className="flex items-center gap-2 text-secondary-500 text-sm mb-2">
                        <span>{countryFlags[relatedCompany.location.country]}</span>
                        <span>{isRTL ? relatedCompany.location.city.ar : relatedCompany.location.city.en}</span>
                      </div>
                      <p className="text-secondary-600 text-sm line-clamp-2">
                        {isRTL ? relatedCompany.description.ar : relatedCompany.description.en}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/companies`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              {isRTL ? 'عرض جميع الشركات' : 'View All Companies'}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
