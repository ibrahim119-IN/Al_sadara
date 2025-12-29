'use client'

import { useEffect, useRef, useState } from 'react'
import { Award, Headphones, Truck, BadgePercent } from 'lucide-react'

interface FeaturesSectionProps {
  locale: 'ar' | 'en'
}

const features = [
  {
    titleEn: 'Premium Quality',
    titleAr: 'جودة عالية',
    descEn: 'Original products from top global brands with comprehensive warranty coverage',
    descAr: 'منتجات أصلية من أفضل العلامات التجارية العالمية مع ضمان شامل',
    icon: Award,
    gradient: 'from-blue-500 to-primary-600',
  },
  {
    titleEn: 'Expert Support',
    titleAr: 'دعم متخصص',
    descEn: 'Professional technical support team available 24/7 to assist you',
    descAr: 'فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك',
    icon: Headphones,
    gradient: 'from-green-500 to-teal-600',
  },
  {
    titleEn: 'Fast Delivery',
    titleAr: 'توصيل سريع',
    descEn: 'Quick delivery across Egypt with real-time shipment tracking',
    descAr: 'توصيل سريع لجميع أنحاء مصر مع تتبع الشحنات مباشرة',
    icon: Truck,
    gradient: 'from-orange-500 to-red-600',
  },
  {
    titleEn: 'Best Prices',
    titleAr: 'أفضل الأسعار',
    descEn: 'Competitive pricing with special discounts for bulk orders',
    descAr: 'أسعار تنافسية مع خصومات خاصة للطلبات الكبيرة',
    icon: BadgePercent,
    gradient: 'from-purple-500 to-pink-600',
  },
]

export default function FeaturesSection({ locale }: FeaturesSectionProps) {
  const isRTL = locale === 'ar'
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section bg-secondary-50">
      <div className="container-wide">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            {isRTL ? 'لماذا نحن' : 'Why Choose Us'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            {isRTL
              ? 'نقدم لكم أفضل الحلول'
              : 'We Deliver Excellence'}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {isRTL
              ? 'نحن ملتزمون بتقديم أفضل الخدمات والمنتجات لعملائنا مع ضمان الجودة والدعم المستمر'
              : 'We are committed to providing the best services and products with guaranteed quality and continuous support'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group bg-white rounded-3xl p-8 text-center transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 border border-secondary-100 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-10 h-10" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {isRTL ? feature.titleAr : feature.titleEn}
                </h3>

                {/* Description */}
                <p className="text-secondary-600 leading-relaxed">
                  {isRTL ? feature.descAr : feature.descEn}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
