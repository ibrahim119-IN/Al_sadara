'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Users, Building2, Headphones } from 'lucide-react'

interface StatsSectionProps {
  locale: 'ar' | 'en'
}

const stats = [
  {
    valueEn: '10',
    valueAr: '١٠',
    suffix: '+',
    labelEn: 'Years Experience',
    labelAr: 'سنوات خبرة',
    icon: Clock
  },
  {
    valueEn: '1000',
    valueAr: '١٠٠٠',
    suffix: '+',
    labelEn: 'Happy Clients',
    labelAr: 'عميل راضي',
    icon: Users
  },
  {
    valueEn: '5000',
    valueAr: '٥٠٠٠',
    suffix: '+',
    labelEn: 'Projects Done',
    labelAr: 'مشروع منفذ',
    icon: Building2
  },
  {
    valueEn: '24',
    valueAr: '٢٤',
    suffix: '/7',
    labelEn: 'Support',
    labelAr: 'دعم فني',
    icon: Headphones
  },
]

export default function StatsSection({ locale }: StatsSectionProps) {
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
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative z-20 -mt-20">
      <div className="container-wide">
        <div className="bg-white rounded-3xl shadow-hard p-8 md:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-5">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                    {isRTL ? stat.valueAr : stat.valueEn}
                    <span className="text-accent-500">{stat.suffix}</span>
                  </p>
                  <p className="text-secondary-600 font-medium text-lg">
                    {isRTL ? stat.labelAr : stat.labelEn}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
