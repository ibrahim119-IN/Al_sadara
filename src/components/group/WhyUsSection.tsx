'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Award,
  Globe,
  Zap,
  Package,
  BadgeDollarSign,
  HeadphonesIcon,
  Shield,
  TrendingUp,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'

interface WhyUsSectionProps {
  locale: Locale
}

const features = [
  {
    icon: Award,
    title: { ar: 'خبرة +21 سنة', en: '21+ Years Experience' },
    description: {
      ar: 'خبرة واسعة في مجال تجارة وتوريد خامات البلاستيك والبوليمرات',
      en: 'Extensive experience in plastic raw materials trading and polymers supply',
    },
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Globe,
    title: { ar: 'تغطية 3 دول', en: '3 Countries Coverage' },
    description: {
      ar: 'تواجد قوي في مصر والسعودية والإمارات',
      en: 'Strong presence in Egypt, Saudi Arabia, and UAE',
    },
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: { ar: 'سرعة التوريد', en: 'Fast Delivery' },
    description: {
      ar: 'توريد سريع وفعال لجميع الطلبات',
      en: 'Quick and efficient delivery for all orders',
    },
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: Package,
    title: { ar: 'تنوع المنتجات', en: 'Product Variety' },
    description: {
      ar: 'تشكيلة واسعة من خامات البلاستيك والبوليمرات المتنوعة',
      en: 'Wide range of plastic raw materials and various polymers',
    },
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: BadgeDollarSign,
    title: { ar: 'أسعار تنافسية', en: 'Competitive Prices' },
    description: {
      ar: 'أفضل الأسعار في السوق مع جودة عالية',
      en: 'Best market prices with high quality',
    },
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: HeadphonesIcon,
    title: { ar: 'خدمة ما بعد البيع', en: 'After-Sales Service' },
    description: {
      ar: 'دعم فني متواصل وخدمة عملاء متميزة',
      en: 'Continuous technical support and excellent customer service',
    },
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Shield,
    title: { ar: 'ضمان الجودة', en: 'Quality Guarantee' },
    description: {
      ar: 'منتجات مختبرة ومعتمدة بأعلى معايير الجودة',
      en: 'Tested and certified products with highest quality standards',
    },
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: TrendingUp,
    title: { ar: 'شراكات استراتيجية', en: 'Strategic Partnerships' },
    description: {
      ar: 'علاقات قوية مع كبرى الشركات العالمية',
      en: 'Strong relationships with major global companies',
    },
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
  },
]

const texts = {
  ar: {
    badge: 'لماذا نحن؟',
    title: 'شريكك الموثوق في النجاح',
    subtitle: 'نقدم لكم أفضل الخدمات والمنتجات بخبرة تمتد لأكثر من عقدين',
  },
  en: {
    badge: 'Why Choose Us?',
    title: 'Your Trusted Partner in Success',
    subtitle:
      'We provide the best services and products with over two decades of experience',
  },
}

export default function WhyUsSection({ locale }: WhyUsSectionProps) {
  const isRTL = locale === 'ar'
  const t = texts[locale]
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      className="section bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Stronger decorative elements */}
      <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-amber-300/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 start-0 w-[500px] h-[500px] bg-primary-300/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" aria-hidden="true" />

      {/* Decorative line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" aria-hidden="true" />

      <div className="container-xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className={`${feature.bgColor} rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-s-4 border-s-current shadow-md`}
                  style={{ borderColor: `var(--tw-gradient-from)` }}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {feature.title[locale]}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description[locale]}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 shadow-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/80 text-sm">
                {locale === 'ar' ? 'عميل راضٍ' : 'Happy Clients'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
              <div className="text-white/80 text-sm">
                {locale === 'ar' ? 'شركات تابعة' : 'Subsidiaries'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">3</div>
              <div className="text-white/80 text-sm">
                {locale === 'ar' ? 'دول' : 'Countries'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-white/80 text-sm">
                {locale === 'ar' ? 'سنة خبرة' : 'Years Experience'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
