import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import InteractiveGroupMap from '@/components/group/InteractiveGroupMap'
import GroupTimeline from '@/components/group/GroupTimeline'
import {
  Award,
  Handshake,
  Lightbulb,
  HeadphonesIcon,
  Clock,
  Users,
  Building2,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

interface AboutPageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'من نحن | مجموعة الصدارة القابضة'
      : 'About Us | Al Sadara Holding Group',
    description: isArabic
      ? 'تعرف على مجموعة الصدارة القابضة - رحلة تمتد منذ 2005 في مجال تجارة خامات البلاستيك. نخدم الشرق الأوسط وأفريقيا بـ 5 شركات متخصصة.'
      : 'Learn about Al Sadara Holding Group - A journey since 2005 in plastic raw materials trading. Serving Middle East and Africa with 5 specialized companies.',
    keywords: isArabic
      ? ['من نحن', 'مجموعة الصدارة', 'تاريخ الشركة', 'رؤيتنا', 'قيمنا', 'خامات البلاستيك', 'تجارة البلاستيك']
      : ['about us', 'Al Sadara Group', 'company history', 'our vision', 'our values', 'plastic raw materials', 'plastics trading'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        'ar': `${BASE_URL}/ar/about`,
        'en': `${BASE_URL}/en/about`,
      },
    },
    openGraph: {
      title: isArabic ? 'من نحن - مجموعة الصدارة' : 'About Us - Al Sadara Group',
      description: isArabic
        ? 'تعرف على قصة نجاح مجموعة الصدارة في تجارة خامات البلاستيك منذ 2005'
        : 'Discover the Al Sadara Group success story in plastic raw materials trading since 2005',
      url: `${BASE_URL}/${locale}/about`,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og-about.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'من نحن - مجموعة الصدارة' : 'About Us - Al Sadara Group',
        },
      ],
    },
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const breadcrumbItems = [
    { label: isRTL ? 'من نحن' : 'About Us' },
  ]

  const content = {
    title: isRTL ? 'من نحن' : 'About Us',
    subtitle: isRTL
      ? 'مجموعة الصدارة القابضة - رائدون في تجارة خامات البلاستيك'
      : 'Al Sadara Holding Group - Leaders in Plastic Raw Materials Trading',
    description: isRTL
      ? 'نحن مجموعة شركات رائدة في مجال تجارة وتوزيع خامات البلاستيك في الشرق الأوسط وأفريقيا. نوفر مواد أولية عالية الجودة (HDPE, LDPE, PP, PVC, PS, PET) من أفضل المصادر العالمية لتلبية احتياجات مصانع البلاستيك.'
      : 'We are a leading group of companies in plastic raw materials trading and distribution across the Middle East and Africa. We supply high-quality raw materials (HDPE, LDPE, PP, PVC, PS, PET) from the best global sources to meet the needs of plastic manufacturers.',
    mission: {
      title: isRTL ? 'مهمتنا' : 'Our Mission',
      text: isRTL
        ? 'توفير خامات بلاستيكية عالية الجودة بأسعار تنافسية، مع ضمان التوصيل السريع والدعم الفني المتميز لعملائنا في جميع أنحاء الشرق الأوسط وأفريقيا.'
        : 'To provide high-quality plastic raw materials at competitive prices, with guaranteed fast delivery and excellent technical support for our clients across the Middle East and Africa.',
      icon: Target,
    },
    vision: {
      title: isRTL ? 'رؤيتنا' : 'Our Vision',
      text: isRTL
        ? 'أن نكون المورد الرئيسي لخامات البلاستيك في الشرق الأوسط وأفريقيا، مع الحفاظ على أعلى معايير الجودة وبناء شراكات طويلة الأمد مع عملائنا.'
        : 'To be the leading supplier of plastic raw materials in the Middle East and Africa, while maintaining the highest quality standards and building long-term partnerships with our clients.',
      icon: Eye,
    },
    values: [
      {
        title: isRTL ? 'الجودة' : 'Quality',
        description: isRTL
          ? 'نوفر خامات بلاستيكية عالية الجودة من أفضل المصادر العالمية'
          : 'We supply high-quality plastic raw materials from the best global sources',
        icon: Award,
      },
      {
        title: isRTL ? 'الأمانة' : 'Integrity',
        description: isRTL
          ? 'نلتزم بالشفافية في الأسعار والمواصفات مع جميع عملائنا'
          : 'We maintain transparency in pricing and specifications with all our clients',
        icon: Handshake,
      },
      {
        title: isRTL ? 'الابتكار' : 'Innovation',
        description: isRTL
          ? 'نواكب أحدث تقنيات الصناعة وإعادة التدوير والحلول البيئية'
          : 'We keep up with the latest industry technologies, recycling, and eco-friendly solutions',
        icon: Lightbulb,
      },
      {
        title: isRTL ? 'خدمة العملاء' : 'Customer Service',
        description: isRTL
          ? 'نقدم دعماً فنياً ولوجستياً متميزاً لضمان رضا عملائنا'
          : 'We provide excellent technical and logistics support to ensure customer satisfaction',
        icon: HeadphonesIcon,
      },
    ],
    stats: [
      { value: '20+', label: isRTL ? 'سنة خبرة' : 'Years Experience', icon: Clock },
      { value: '1000+', label: isRTL ? 'عميل راضي' : 'Happy Clients', icon: Users },
      { value: '5', label: isRTL ? 'شركات تابعة' : 'Subsidiaries', icon: Building2 },
      { value: '24/7', label: isRTL ? 'دعم فني' : 'Technical Support', icon: HeadphonesIcon },
    ],
    whyUs: [
      isRTL ? 'خبرة 20+ سنة في تجارة البلاستيك' : 'Over 20 years experience in plastics trading',
      isRTL ? 'خامات أصلية من مصادر موثوقة عالمياً' : 'Genuine materials from globally trusted sources',
      isRTL ? 'أسعار تنافسية وشحن سريع' : 'Competitive prices and fast shipping',
      isRTL ? 'توصيل لجميع دول الشرق الأوسط وأفريقيا' : 'Delivery to all Middle East and African countries',
      isRTL ? 'دعم فني ولوجستي متخصص' : 'Specialized technical and logistics support',
      isRTL ? '5 شركات في 3 دول (السعودية، مصر، الإمارات)' : '5 companies across 3 countries (Saudi, Egypt, UAE)',
    ],
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          {/* Breadcrumb */}
          <SimpleBreadcrumb items={breadcrumbItems} locale={locale} className="mb-8 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-accent-400" />
              <span className="text-sm font-medium">
                {isRTL ? 'شريكك الموثوق منذ 2005' : 'Your Trusted Partner Since 2005'}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {content.subtitle}
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl -mt-16 p-8 border border-secondary-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {content.stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-secondary-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-8 rounded-2xl border border-primary-200">
              <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                {content.mission.title}
              </h2>
              <p className="text-secondary-600 leading-relaxed">
                {content.mission.text}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 p-8 rounded-2xl border border-accent-200">
              <div className="w-16 h-16 bg-accent-500 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                {content.vision.title}
              </h2>
              <p className="text-secondary-600 leading-relaxed">
                {content.vision.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <InteractiveGroupMap locale={locale} />

      {/* Values */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              <Info className="w-4 h-4" />
              {isRTL ? 'مبادئنا' : 'Our Principles'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {isRTL ? 'قيمنا' : 'Our Values'}
            </h2>
            <p className="text-secondary-600">
              {isRTL
                ? 'القيم التي نؤمن بها وتوجه عملنا كل يوم'
                : 'The values we believe in and that guide our work every day'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-secondary-100 text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Group Timeline */}
      <GroupTimeline locale={locale} />

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                {isRTL ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
              </h2>
              <p className="text-secondary-600 mb-8 leading-relaxed">
                {isRTL
                  ? 'نحن نفخر بتقديم أفضل الحلول لعملائنا مع الحفاظ على أعلى معايير الجودة والخدمة.'
                  : 'We pride ourselves on delivering the best solutions to our clients while maintaining the highest standards of quality and service.'}
              </p>

              <div className="space-y-4">
                {content.whyUs.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 end-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <Zap className="w-12 h-12 text-accent-400 mb-6" />
                <h3 className="text-2xl font-bold mb-4">
                  {isRTL ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
                </h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  {isRTL
                    ? 'تواصل معنا اليوم للحصول على استشارة مجانية وعرض سعر مخصص.'
                    : 'Contact us today for a free consultation and customized quote.'}
                </p>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  {dict.common.contact}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isRTL ? 'هل تحتاج مساعدة؟' : 'Need Help?'}
          </h2>
          <p className="text-secondary-300 mb-8 max-w-2xl mx-auto">
            {isRTL
              ? 'فريقنا المتخصص جاهز لمساعدتك في اختيار الحل المناسب لاحتياجاتك.'
              : 'Our expert team is ready to help you choose the right solution for your needs.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              {dict.common.contact}
            </Link>
            <Link
              href={`/${locale}/quote-request`}
              className="inline-flex items-center gap-2 bg-white text-secondary-900 hover:bg-secondary-100 px-6 py-3.5 rounded-xl font-semibold transition-colors"
            >
              {dict.quote.title}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
