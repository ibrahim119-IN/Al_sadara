'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, Globe2, Users, Award, TrendingUp, Package } from 'lucide-react'
import { AnimatedCounterCSS, parseStatValue } from '@/components/animations'

interface GroupStatsSectionProps {
  locale: 'ar' | 'en'
}

export default function GroupStatsSection({ locale }: GroupStatsSectionProps) {
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

  const stats = isRTL
    ? [
        { icon: Building2, value: '6', label: 'شركات تابعة', color: 'from-blue-500 to-blue-600' },
        { icon: Globe2, value: '3', label: 'دول', color: 'from-green-500 to-green-600' },
        { icon: Users, value: '+1000', label: 'عميل', color: 'from-purple-500 to-purple-600' },
        { icon: Award, value: '+20', label: 'سنة خبرة', color: 'from-orange-500 to-orange-600' },
        { icon: TrendingUp, value: '100%', label: 'نمو سنوي', color: 'from-pink-500 to-pink-600' },
        { icon: Package, value: '+500', label: 'منتج', color: 'from-cyan-500 to-cyan-600' },
      ]
    : [
        { icon: Building2, value: '6', label: 'Subsidiaries', color: 'from-blue-500 to-blue-600' },
        { icon: Globe2, value: '3', label: 'Countries', color: 'from-green-500 to-green-600' },
        { icon: Users, value: '+1000', label: 'Clients', color: 'from-purple-500 to-purple-600' },
        { icon: Award, value: '+20', label: 'Years Experience', color: 'from-orange-500 to-orange-600' },
        { icon: TrendingUp, value: '100%', label: 'Annual Growth', color: 'from-pink-500 to-pink-600' },
        { icon: Package, value: '+500', label: 'Products', color: 'from-cyan-500 to-cyan-600' },
      ]

  return (
    <section ref={sectionRef} className="section bg-gradient-to-br from-primary-100/80 via-white to-amber-50/60 relative overflow-hidden">
      {/* Stronger decorative elements */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-400" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400" aria-hidden="true" />

      {/* Side decorative accents */}
      <div className="absolute top-1/2 -translate-y-1/2 start-0 w-32 h-64 bg-gradient-to-r from-primary-200/50 to-transparent rounded-e-full" aria-hidden="true" />
      <div className="absolute top-1/2 -translate-y-1/2 end-0 w-32 h-64 bg-gradient-to-l from-accent-200/50 to-transparent rounded-s-full" aria-hidden="true" />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            {isRTL ? 'المجموعة بالأرقام' : 'Group in Numbers'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            {isRTL ? 'إنجازاتنا تتحدث عن نفسها' : 'Our Achievements Speak for Themselves'}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {isRTL
              ? 'منذ تأسيسنا عام 2005، حققنا نموًا مستمرًا وتوسعًا في أسواق جديدة'
              : 'Since our founding in 2005, we have achieved continuous growth and expansion into new markets'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Icon - Bigger with stronger shadow */}
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>

                {/* Value - Animated Counter */}
                <div className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
                  {(() => {
                    const parsed = parseStatValue(stat.value)
                    return (
                      <AnimatedCounterCSS
                        value={parsed.numericValue}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        duration={2000}
                      />
                    )
                  })()}
                </div>

                {/* Label */}
                <div className="text-secondary-500 font-medium">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
