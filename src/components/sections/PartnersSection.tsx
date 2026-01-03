'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface PartnersSectionProps {
  locale: 'ar' | 'en'
}

// Brand logos - using text as placeholder, can be replaced with actual logos
const brands = [
  { name: 'SABIC', logo: '/brands/sabic.png' },
  { name: 'Borouge', logo: '/brands/borouge.png' },
  { name: 'ExxonMobil', logo: '/brands/exxonmobil.png' },
  { name: 'LyondellBasell', logo: '/brands/lyondellbasell.png' },
  { name: 'BASF', logo: '/brands/basf.png' },
  { name: 'Dow', logo: '/brands/dow.png' },
  { name: 'Ineos', logo: '/brands/ineos.png' },
  { name: 'Total', logo: '/brands/total.png' },
]

export default function PartnersSection({ locale }: PartnersSectionProps) {
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
    <section ref={sectionRef} className="py-16 bg-secondary-50 border-y border-secondary-100">
      <div className="container-wide">
        {/* Title */}
        <p
          className={`text-center text-secondary-500 font-medium mb-10 text-lg transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {isRTL
            ? 'وكلاء معتمدون لأفضل العلامات التجارية العالمية'
            : 'Authorized Distributors for Leading Global Brands'}
        </p>

        {/* Brands Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className={`group relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Brand Name as Text (fallback for missing logos) */}
              <div className="text-2xl md:text-3xl font-bold text-secondary-300 group-hover:text-primary-600 transition-colors duration-300 cursor-default">
                {brand.name}
              </div>
            </div>
          ))}
        </div>

        {/* Certification Note */}
        <p
          className={`text-center text-secondary-400 text-sm mt-10 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isRTL
            ? '🏆 جميع المنتجات أصلية 100% مع ضمان الشركة المصنعة'
            : '🏆 All products are 100% genuine with manufacturer warranty'}
        </p>
      </div>
    </section>
  )
}
