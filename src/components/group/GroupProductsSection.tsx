'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Layers, Recycle } from 'lucide-react'

interface GroupProductsSectionProps {
  locale: 'ar' | 'en'
}

const productCategories = {
  plastics: [
    {
      code: 'HDPE',
      nameEn: 'High Density PE',
      nameAr: 'بولي إيثيلين عالي الكثافة',
      descEn: 'For pipes, bottles, and industrial containers',
      descAr: 'للأنابيب والزجاجات والحاويات الصناعية',
      color: '#2196F3',
    },
    {
      code: 'LDPE',
      nameEn: 'Low Density PE',
      nameAr: 'بولي إيثيلين منخفض الكثافة',
      descEn: 'For bags, films, and flexible packaging',
      descAr: 'للأكياس والأغشية والتغليف المرن',
      color: '#03A9F4',
    },
    {
      code: 'PP',
      nameEn: 'Polypropylene',
      nameAr: 'بولي بروبلين',
      descEn: 'For packaging, textiles, and automotive parts',
      descAr: 'للتغليف والمنسوجات وقطع السيارات',
      color: '#4CAF50',
    },
    {
      code: 'PS',
      nameEn: 'Polystyrene',
      nameAr: 'بولي ستيرين',
      descEn: 'For packaging, insulation, and disposables',
      descAr: 'للتغليف والعزل والمنتجات ذات الاستخدام الواحد',
      color: '#9C27B0',
    },
    {
      code: 'PET',
      nameEn: 'PET Resin',
      nameAr: 'بولي إيثيلين تريفثالات',
      descEn: 'For bottles, containers, and fibers',
      descAr: 'للزجاجات والحاويات والألياف',
      color: '#FF5722',
    },
    {
      code: 'PVC',
      nameEn: 'Polyvinyl Chloride',
      nameAr: 'بولي فينيل كلورايد',
      descEn: 'For pipes, cables, and construction',
      descAr: 'للأنابيب والكابلات والبناء',
      color: '#607D8B',
    },
  ],
  recycled: [
    {
      code: 'rHDPE',
      nameEn: 'Recycled HDPE',
      nameAr: 'HDPE معاد تدويره',
      descEn: 'Eco-friendly recycled high-density polyethylene',
      descAr: 'بولي إيثيلين عالي الكثافة صديق للبيئة',
      color: '#4CAF50',
    },
    {
      code: 'rLDPE',
      nameEn: 'Recycled LDPE',
      nameAr: 'LDPE معاد تدويره',
      descEn: 'Recycled low-density polyethylene granules',
      descAr: 'حبيبات بولي إيثيلين منخفض الكثافة',
      color: '#8BC34A',
    },
    {
      code: 'rPP',
      nameEn: 'Recycled PP',
      nameAr: 'PP معاد تدويره',
      descEn: 'Recycled polypropylene for sustainable products',
      descAr: 'بولي بروبلين معاد تدويره للمنتجات المستدامة',
      color: '#009688',
    },
    {
      code: 'rPET',
      nameEn: 'Recycled PET',
      nameAr: 'PET معاد تدويره',
      descEn: 'Recycled PET flakes and granules',
      descAr: 'رقائق وحبيبات PET معاد تدويرها',
      color: '#00BCD4',
    },
  ],
}

export default function GroupProductsSection({ locale }: GroupProductsSectionProps) {
  const isRTL = locale === 'ar'
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'plastics' | 'recycled'>('plastics')

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
      badge: 'منتجاتنا',
      title: 'مجموعة متنوعة من المنتجات',
      subtitle: 'نقدم خامات بلاستيك عالية الجودة ومواد معاد تدويرها صديقة للبيئة',
      plastics: 'خامات البلاستيك',
      recycled: 'المواد المعاد تدويرها',
      viewAll: 'عرض جميع المنتجات',
    },
    en: {
      badge: 'Our Products',
      title: 'A Diverse Range of Products',
      subtitle: 'We offer high-quality plastic raw materials and eco-friendly recycled materials',
      plastics: 'Plastic Raw Materials',
      recycled: 'Recycled Materials',
      viewAll: 'View All Products',
    },
  }

  const t = content[locale]

  return (
    <section ref={sectionRef} className="section bg-white relative">
      <div className="container-xl">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${
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

        {/* Tabs */}
        <div
          className={`flex justify-center gap-4 mb-12 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={() => setActiveTab('plastics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'plastics'
                ? 'bg-primary-600 text-white shadow-btn'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            {t.plastics}
          </button>
          <button
            onClick={() => setActiveTab('recycled')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'recycled'
                ? 'bg-primary-600 text-white shadow-btn'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            <Recycle className="w-5 h-5" />
            {t.recycled}
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {(activeTab === 'plastics' ? productCategories.plastics : productCategories.recycled).map((product, index) => (
            <div
              key={product.code}
              className={`group relative bg-white rounded-3xl border border-secondary-100 p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Code Badge */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${product.color}15` }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: product.color }}
                >
                  {product.code}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-bold text-secondary-900 mb-2">
                {isRTL ? product.nameAr : product.nameEn}
              </h3>

              {/* Description */}
              <p className="text-sm text-secondary-500 line-clamp-2">
                {isRTL ? product.descAr : product.descEn}
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-btn hover:shadow-btn-hover transition-all duration-300 hover:-translate-y-1"
          >
            {t.viewAll}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  )
}
