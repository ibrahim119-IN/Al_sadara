'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Cylinder,
  Box,
  Layers,
  Recycle,
  Beaker,
  Factory,
  ArrowRight,
} from 'lucide-react'

interface CategoriesSectionProps {
  locale: 'ar' | 'en'
  title: string
}

const categories = [
  {
    slug: 'hdpe',
    nameEn: 'HDPE',
    nameAr: 'بولي إيثيلين عالي الكثافة',
    descEn: 'High Density Polyethylene for pipes and containers',
    descAr: 'للأنابيب والحاويات والتطبيقات الصناعية',
    icon: Cylinder,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    color: 'from-blue-600 to-blue-800',
  },
  {
    slug: 'ldpe',
    nameEn: 'LDPE',
    nameAr: 'بولي إيثيلين منخفض الكثافة',
    descEn: 'Low Density Polyethylene for bags and films',
    descAr: 'للأكياس والأغشية والتغليف المرن',
    icon: Box,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80',
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    slug: 'pp',
    nameEn: 'Polypropylene',
    nameAr: 'بولي بروبلين',
    descEn: 'PP for packaging, textiles, and automotive',
    descAr: 'للتغليف والمنسوجات وقطع السيارات',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=600&q=80',
    color: 'from-green-600 to-green-800',
  },
  {
    slug: 'recycled',
    nameEn: 'Recycled Plastics',
    nameAr: 'بلاستيك معاد التدوير',
    descEn: 'Eco-friendly recycled plastic materials',
    descAr: 'خامات بلاستيكية صديقة للبيئة',
    icon: Recycle,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    slug: 'polymers',
    nameEn: 'Polymers',
    nameAr: 'البوليمرات',
    descEn: 'Various polymer types for industrial use',
    descAr: 'أنواع البوليمرات للاستخدام الصناعي',
    icon: Beaker,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    color: 'from-purple-600 to-purple-800',
  },
  {
    slug: 'masterbatch',
    nameEn: 'Masterbatch',
    nameAr: 'ماستر باتش',
    descEn: 'Color and additive concentrates',
    descAr: 'ملونات ومضافات مركزة للبلاستيك',
    icon: Factory,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
    color: 'from-orange-600 to-orange-800',
  },
]

export default function CategoriesSection({ locale, title }: CategoriesSectionProps) {
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
            {isRTL ? 'منتجاتنا' : 'Our Products'}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
            {title}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {isRTL
              ? 'اكتشف مجموعتنا الواسعة من خامات البلاستيك والبوليمرات عالية الجودة'
              : 'Discover our wide range of high-quality plastic raw materials and polymers'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/${locale}/categories/${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={isRTL ? category.nameAr : category.nameEn}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {isRTL ? category.nameAr : category.nameEn}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                    {isRTL ? category.descAr : category.descEn}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span>{isRTL ? 'تصفح المنتجات' : 'Browse Products'}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href={`/${locale}/categories`}
            className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-btn hover:shadow-btn-hover hover:-translate-y-1"
          >
            {isRTL ? 'عرض جميع الفئات' : 'View All Categories'}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  )
}
