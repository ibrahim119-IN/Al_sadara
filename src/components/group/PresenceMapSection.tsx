'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Building2, Phone, Mail } from 'lucide-react'

interface PresenceMapSectionProps {
  locale: 'ar' | 'en'
}

const locations = [
  {
    country: 'saudi',
    flagEmoji: '🇸🇦',
    nameEn: 'Saudi Arabia',
    nameAr: 'السعودية',
    cityEn: 'Jeddah',
    cityAr: 'جدة',
    companies: [
      { nameEn: 'Al-Sadara Industry Co.', nameAr: 'شركة الصدارة للصناعة' },
    ],
    phones: ['+966554401575', '+966553335462'],
    color: '#43A047',
  },
  {
    country: 'egypt',
    flagEmoji: '🇪🇬',
    nameEn: 'Egypt',
    nameAr: 'مصر',
    cityEn: '6th of October City, Giza',
    cityAr: '6 أكتوبر، الجيزة',
    companies: [
      { nameEn: 'El Talah Al Khadra', nameAr: 'التالة الخضراء' },
      { nameEn: 'Al Qaysar', nameAr: 'القيصر' },
    ],
    phones: ['+201099853546', '+201050464424'],
    color: '#E53935',
  },
  {
    country: 'uae',
    flagEmoji: '🇦🇪',
    nameEn: 'UAE',
    nameAr: 'الإمارات',
    cityEn: 'Sharjah & Dubai',
    cityAr: 'الشارقة ودبي',
    companies: [
      { nameEn: 'S.A.M International', nameAr: 'S.A.M' },
      { nameEn: 'El Sayed Shehata Polymers', nameAr: 'السيد شحاتة بوليمرز' },
    ],
    phones: ['+971503830860', '+971522097468'],
    color: '#1E88E5',
  },
]

export default function PresenceMapSection({ locale }: PresenceMapSectionProps) {
  const isRTL = locale === 'ar'
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeLocation, setActiveLocation] = useState(0)

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

  const content = {
    ar: {
      badge: 'تواجدنا الجغرافي',
      title: 'نصل إليك أينما كنت',
      subtitle: 'تغطية شاملة للشرق الأوسط وأفريقيا',
      companies: 'الشركات',
      contact: 'التواصل',
    },
    en: {
      badge: 'Our Presence',
      title: 'We Reach You Wherever You Are',
      subtitle: 'Comprehensive coverage across the Middle East and Africa',
      companies: 'Companies',
      contact: 'Contact',
    },
  }

  const t = content[locale]

  return (
    <section ref={sectionRef} className="section bg-secondary-900 text-white overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block text-primary-400 font-semibold text-sm uppercase tracking-wider mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.title}
          </h2>
          <p className="text-lg text-secondary-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Map & Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Location Cards */}
          <div className="space-y-4">
            {locations.map((location, index) => (
              <button
                key={location.country}
                onClick={() => setActiveLocation(index)}
                className={`w-full text-start p-6 rounded-2xl border-2 transition-all duration-300 ${
                  activeLocation === index
                    ? 'bg-white/10 border-primary-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                } ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Flag & Name */}
                  <div className="text-4xl">{location.flagEmoji}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white mb-1">
                      {isRTL ? location.nameAr : location.nameEn}
                    </h3>
                    <p className="text-secondary-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {isRTL ? location.cityAr : location.cityEn}
                    </p>
                  </div>
                  {/* Companies Count */}
                  <div
                    className="px-3 py-1 rounded-lg text-white text-sm font-bold"
                    style={{ backgroundColor: location.color }}
                  >
                    {location.companies.length} {isRTL ? 'شركات' : 'Companies'}
                  </div>
                </div>

                {/* Expanded Content */}
                {activeLocation === index && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
                    {/* Companies List */}
                    <div className="mb-4">
                      <h4 className="text-secondary-400 text-sm font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {t.companies}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {location.companies.map((company, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white"
                          >
                            {isRTL ? company.nameAr : company.nameEn}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <h4 className="text-secondary-400 text-sm font-semibold mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {t.contact}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {location.phones.map((phone, i) => (
                          <a
                            key={i}
                            href={`tel:${phone}`}
                            className="text-primary-400 hover:text-primary-300 text-sm"
                            dir="ltr"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Visual Map */}
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative bg-gradient-to-br from-primary-900/50 to-secondary-800/50 rounded-3xl p-8 border border-white/10">
              {/* Stylized Map Background */}
              <div className="aspect-square relative">
                {/* Map Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="200" cy="200" r="50" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                    <line x1="50" y1="200" x2="350" y2="200" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                    <line x1="200" y1="50" x2="200" y2="350" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                  </svg>
                </div>

                {/* Location Markers */}
                {locations.map((location, index) => {
                  // Position markers in a triangular pattern
                  const positions = [
                    { top: '45%', left: '65%' }, // Saudi (Jeddah)
                    { top: '25%', left: '35%' }, // Egypt (6 October)
                    { top: '35%', left: '75%' }, // UAE (Sharjah/Dubai)
                  ]
                  return (
                    <button
                      key={location.country}
                      onClick={() => setActiveLocation(index)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                        activeLocation === index ? 'scale-125 z-10' : 'scale-100'
                      }`}
                      style={{
                        top: positions[index].top,
                        left: positions[index].left,
                      }}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all ${
                          activeLocation === index
                            ? 'ring-4 ring-primary-400/50'
                            : ''
                        }`}
                        style={{ backgroundColor: location.color }}
                      >
                        {location.flagEmoji}
                      </div>
                      {/* Pulse Effect */}
                      {activeLocation === index && (
                        <div
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ backgroundColor: location.color, opacity: 0.3 }}
                        />
                      )}
                      {/* Label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-white/80">
                          {isRTL ? location.nameAr : location.nameEn}
                        </span>
                      </div>
                    </button>
                  )
                })}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <path
                    d="M35 25 L65 45 L75 35 L35 25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary-500/30"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
