'use client'

import { useEffect, useRef, useState } from 'react'
import { companies } from '@/data/group-data'
import { CompanyCard } from './CompanyCard'

interface CompaniesGridSectionProps {
  locale: 'ar' | 'en'
}

export default function CompaniesGridSection({ locale }: CompaniesGridSectionProps) {
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
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const content = {
    ar: {
      badge: 'شركاتنا التابعة',
      title: 'مجموعة متكاملة من الشركات',
      subtitle: 'نعمل في 3 دول مع تغطية شاملة للشرق الأوسط وأفريقيا',
    },
    en: {
      badge: 'Our Subsidiaries',
      title: 'An Integrated Group of Companies',
      subtitle: 'Operating in 3 countries with comprehensive Middle East and Africa coverage',
    },
  }

  const t = content[locale]

  return (
    <section ref={sectionRef} className="section bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <div
              key={company.slug}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <CompanyCard company={company} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
