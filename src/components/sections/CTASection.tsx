'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Phone, MessageCircle } from 'lucide-react'

interface CTASectionProps {
  locale: 'ar' | 'en'
  contactLabel: string
  quoteLabel: string
}

export default function CTASection({ locale, contactLabel, quoteLabel }: CTASectionProps) {
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
    <section ref={sectionRef} className="section-sm bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 end-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 start-0 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/2 start-1/4 w-40 h-40 bg-primary-400/10 rounded-full blur-2xl" aria-hidden="true" />

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="container-xl relative z-10">
        {/* Content */}
        <div className="text-center text-white max-w-3xl mx-auto py-10 md:py-16 lg:py-20">
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <Zap className="w-10 h-10 text-accent-400" />
            </div>

            {/* Heading */}
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {isRTL
                ? 'هل تحتاج مساعدة في اختيار المنتج المناسب؟'
                : 'Need Help Choosing the Right Product?'}
            </h2>

            {/* Subtitle */}
            <p
              className={`text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {isRTL
                ? 'تواصل مع فريقنا المتخصص للحصول على استشارة مجانية وعروض أسعار مخصصة تناسب احتياجاتك'
                : 'Contact our expert team for a free consultation and customized quotes tailored to your needs'}
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-center gap-3 bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Phone className="w-5 h-5" />
                {contactLabel}
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </Link>
              <Link
                href={`/${locale}/quote-request`}
                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white/30 hover:border-white/60 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                {quoteLabel}
              </Link>
            </div>

            {/* Trust Note */}
            <p
              className={`mt-8 text-primary-200 text-sm transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {isRTL
                ? '✨ استشارة مجانية • رد سريع • خبراء متخصصون'
                : '✨ Free Consultation • Quick Response • Expert Team'}
            </p>
          </div>
        </div>
    </section>
  )
}
