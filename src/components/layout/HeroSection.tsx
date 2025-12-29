'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Shield, Award, Headphones } from 'lucide-react'

interface HeroSectionProps {
  locale: 'ar' | 'en'
  title: string
  subtitle: string
  ctaPrimary: string
  ctaSecondary: string
}

export default function HeroSection({
  locale,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HeroSectionProps) {
  const isRTL = locale === 'ar'
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* Background Image - Professional security/technology imagery */}
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Al Sadara - Smart Building Solutions"
          fill
          priority
          className="object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/90 via-primary-800/85 to-primary-900/95" />

        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container-wide relative z-10 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          {/* Trust Badge */}
          <div
            className={`inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Shield className="w-5 h-5 text-accent-400" />
            <span className="text-sm md:text-base font-medium">
              {isRTL ? 'الشريك الأول للحلول الأمنية والذكية' : 'Your #1 Partner for Smart Security Solutions'}
            </span>
          </div>

          {/* Main Heading - Display Size */}
          <h1
            className={`text-display-sm md:text-display-md lg:text-display-lg font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl lg:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href={`/${locale}/products`}
              className="group inline-flex items-center justify-center gap-3 bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-btn hover:shadow-btn-hover hover:-translate-y-1"
            >
              {ctaPrimary}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/60 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
            >
              {ctaSecondary}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            className={`flex flex-wrap justify-center items-center gap-6 md:gap-10 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2 text-primary-200">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-sm font-medium">
                {isRTL ? 'منتجات أصلية 100%' : '100% Genuine Products'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-sm font-medium">
                {isRTL ? 'ضمان شامل' : 'Full Warranty'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary-200">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-sm font-medium">
                {isRTL ? 'دعم 24/7' : '24/7 Support'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-all duration-500 cursor-pointer group ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Scroll to content"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">
            {isRTL ? 'استكشف المزيد' : 'Explore More'}
          </span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </button>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
