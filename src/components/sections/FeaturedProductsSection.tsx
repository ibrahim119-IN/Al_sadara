'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShoppingCart, Camera } from 'lucide-react'

interface FeaturedProductsSectionProps {
  locale: 'ar' | 'en'
  title: string
  viewAllLabel: string
  currency: string
}

// Placeholder products - in production, these would come from the database
const featuredProducts = [
  {
    id: 1,
    nameEn: '4MP IP Dome Camera',
    nameAr: 'كاميرا قبة IP 4 ميجا',
    categoryEn: 'CCTV Cameras',
    categoryAr: 'كاميرات المراقبة',
    price: 2500,
    originalPrice: 3000,
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80',
    badge: 'sale',
    slug: 'ip-dome-camera-4mp',
  },
  {
    id: 2,
    nameEn: 'Biometric Access Control',
    nameAr: 'جهاز البصمة للحضور',
    categoryEn: 'Access Control',
    categoryAr: 'أجهزة الحضور',
    price: 1800,
    originalPrice: null,
    rating: 4.9,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    badge: 'new',
    slug: 'biometric-access-control',
  },
  {
    id: 3,
    nameEn: 'IP PBX System',
    nameAr: 'سنترال IP',
    categoryEn: 'PBX Systems',
    categoryAr: 'السنترالات',
    price: 4500,
    originalPrice: 5200,
    rating: 4.7,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=400&q=80',
    badge: 'sale',
    slug: 'ip-pbx-system',
  },
  {
    id: 4,
    nameEn: 'Video Door Intercom',
    nameAr: 'انتركم فيديو',
    categoryEn: 'Intercom',
    categoryAr: 'الإنتركم',
    price: 1200,
    originalPrice: null,
    rating: 4.6,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80',
    badge: null,
    slug: 'video-door-intercom',
  },
]

export default function FeaturedProductsSection({
  locale,
  title,
  viewAllLabel,
  currency,
}: FeaturedProductsSectionProps) {
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

  const formatPrice = (price: number) => {
    return price.toLocaleString(isRTL ? 'ar-EG' : 'en-US')
  }

  const getBadgeText = (badge: string | null) => {
    if (!badge) return null
    if (badge === 'new') return isRTL ? 'جديد' : 'NEW'
    if (badge === 'sale') return isRTL ? 'خصم' : 'SALE'
    return badge
  }

  return (
    <section ref={sectionRef} className="section bg-secondary-50">
      <div className="container-wide">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
              {isRTL ? 'منتجات مميزة' : 'Featured Products'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900">
              {title}
            </h2>
            <p className="text-lg text-secondary-600 mt-3">
              {isRTL
                ? 'أفضل المنتجات المختارة خصيصاً لك'
                : 'Top products carefully selected for you'}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold text-lg group"
          >
            {viewAllLabel}
            <ArrowRight
              className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''
              }`}
            />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.slug}`}
              className={`group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-secondary-100">
                <Image
                  src={product.image}
                  alt={isRTL ? product.nameAr : product.nameEn}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-4 start-4 px-3 py-1.5 rounded-lg font-bold text-xs text-white ${
                      product.badge === 'sale' ? 'bg-red-500' : 'bg-accent-500'
                    }`}
                  >
                    {getBadgeText(product.badge)}
                  </div>
                )}

                {/* Quick Add Button */}
                <button className="absolute bottom-4 end-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-600 hover:text-white">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category */}
                <p className="text-sm text-primary-600 font-medium mb-2">
                  {isRTL ? product.categoryAr : product.categoryEn}
                </p>

                {/* Name */}
                <h3 className="font-bold text-lg text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {isRTL ? product.nameAr : product.nameEn}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-accent-400 text-accent-400'
                            : 'fill-secondary-200 text-secondary-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-secondary-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)} {currency}
                  </p>
                  {product.originalPrice && (
                    <p className="text-base text-secondary-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div
          className={`text-center mt-10 md:hidden transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 text-primary-600 font-bold text-lg"
          >
            {viewAllLabel}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  )
}
