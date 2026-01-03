'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Building2, Globe2, Award } from 'lucide-react'
import { companies } from '@/data/group-data'

// Dynamic import for WaveBackground to avoid SSR issues with Three.js
const WaveBackground = dynamic(
  () => import('@/components/hero/WaveBackground').then(mod => mod.WaveBackground),
  { ssr: false }
)

interface GroupHeroSectionProps {
  locale: 'ar' | 'en'
}

export default function GroupHeroSection({ locale }: GroupHeroSectionProps) {
  const isRTL = locale === 'ar'
  const [isLoaded, setIsLoaded] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationReady, setAnimationReady] = useState(false)

  // Seamless infinite scroll - single track duplicated
  // Track A + Track B متطابقين - الـ animation تتحرك -50% بالضبط

  useEffect(() => {
    setIsLoaded(true)
    // تأخير صغير للتأكد من render العناصر قبل بدء الـ animation
    const timer = setTimeout(() => setAnimationReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const content = {
    ar: {
      badge: 'منذ 2005',
      title: 'مجموعة شركات السيد شحاتة',
      subtitle: 'للتجارة والصناعة',
      description: 'رواد تجارة وتوريد خامات البلاستيك والبوليمرات في الشرق الأوسط وأفريقيا',
      cta1: 'شركاتنا',
      cta2: 'تواصل معنا',
      stat1: { value: '5', label: 'شركات تابعة' },
      stat2: { value: '3', label: 'دول' },
      stat3: { value: '+21', label: 'سنة خبرة' },
    },
    en: {
      badge: 'Since 2005',
      title: 'El Sayed Shehata Group',
      subtitle: 'of Companies',
      description: 'Leaders in plastic raw materials trading and polymers supply across the Middle East and Africa',
      cta1: 'Our Companies',
      cta2: 'Contact Us',
      stat1: { value: '5', label: 'Subsidiaries' },
      stat2: { value: '3', label: 'Countries' },
      stat3: { value: '+21', label: 'Years Experience' },
    },
  }

  const t = content[locale]

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary-900">
      {/* Wave Background - Original Skal elegant black */}
      <WaveBackground
        speed={1.0}
        noiseScale={0.6}
        noiseIntensity={0.52}
        timeScale={1}
        pointSize={10}
        opacity={0.8}
        planeScale={10}
        focus={3.8}
        aperture={1.79}
        vignetteDarkness={1.5}
        vignetteOffset={0.4}
        backgroundColor="#000"
      />

      {/* Subtle Gradient Overlay - minimal to preserve wave elegance */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 container-xl py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - Enhanced with icon and gradient */}
          <div
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full
              bg-gradient-to-r from-primary-500/20 to-accent-500/20
              border border-primary-400/30 backdrop-blur-sm
              shadow-lg shadow-primary-500/10
              transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4 text-accent-400 animate-pulse" />
            <span className="text-white font-semibold tracking-wide">{t.badge}</span>
          </div>

          {/* Title - Enhanced with strong text shadow for readability */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8), 0 4px 30px rgba(0, 102, 204, 0.4)' }}
          >
            {t.title}
          </h1>

          {/* Subtitle - Gradient text with animated underline */}
          <h2
            className={`relative inline-block text-3xl md:text-4xl lg:text-5xl font-bold mb-8 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
              {t.subtitle}
            </span>
            {/* Animated underline */}
            <span
              className={`absolute -bottom-2 start-0 h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-1000 ease-out ${
                isLoaded ? 'w-full' : 'w-0'
              }`}
              style={{ transitionDelay: '0.8s' }}
            />
          </h2>

          {/* Description - Enhanced with quotation marks and shadow */}
          <p
            className={`text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto mb-12 font-light tracking-wide transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)' }}
          >
            <span className="text-primary-400 text-4xl font-serif leading-none me-1">&ldquo;</span>
            {t.description}
            <span className="text-primary-400 text-4xl font-serif leading-none ms-1">&rdquo;</span>
          </p>

          {/* CTA Buttons - Enhanced with shine and glow effects */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Primary CTA with shine effect */}
            <Link
              href={`/${locale}/companies`}
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Shine effect on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out" />
              <span className="relative">{t.cta1}</span>
              <ArrowRight className={`relative w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>

            {/* Secondary CTA with border glow */}
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/30 hover:border-primary-400/50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/20"
            >
              {t.cta2}
            </Link>
          </div>

          {/* Decorative accent lines */}
          <div
            className={`flex items-center justify-center gap-4 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '550ms' }}
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary-400/50" />
            <div className="w-2 h-2 rounded-full bg-primary-400/50" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary-400/50" />
          </div>

          {/* Quick Stats - Redesigned with icons and card */}
          <div
            className={`grid grid-cols-3 gap-0 max-w-2xl mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            {[
              { ...t.stat1, icon: <Building2 className="w-6 h-6 text-primary-400" /> },
              { ...t.stat2, icon: <Globe2 className="w-6 h-6 text-accent-400" /> },
              { ...t.stat3, icon: <Award className="w-6 h-6 text-emerald-400" /> },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center relative px-4 ${
                  index < 2 ? 'border-e border-white/10' : ''
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center">
                  {stat.icon}
                </div>
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                {/* Label */}
                <div className="text-white/70 font-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Full-Width Companies Carousel - Seamless Infinite Scroll */}
      <div
        className={`absolute bottom-16 left-0 right-0 transition-all duration-700 delay-600 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Carousel - dir=ltr عشان الـ transform يشتغل صح في RTL */}
        <div className="w-full overflow-hidden" dir="ltr" style={{ contain: 'layout' }}>
          {/* Double Track Method - Track A + Track B */}
          <div
            ref={trackRef}
            className={`flex w-max items-center hover:[animation-play-state:paused] ${animationReady ? (isRTL ? 'animate-marquee-rtl' : 'animate-marquee') : ''}`}
            style={{ willChange: 'transform', contain: 'layout' }}
          >
            {/* Track A */}
            <div className="flex items-center shrink-0">
              {companies.map((company, index) => (
                <div key={`a-${index}`} className="flex-shrink-0 px-3">
                  <Link
                    href={`/${locale}/companies/${company.slug}`}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={company.logo}
                          alt={isRTL ? company.name.ar : company.name.en}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg whitespace-nowrap">
                        {isRTL ? company.name.ar : company.name.en}
                      </span>
                      <span className="text-sm text-white/60 whitespace-nowrap">
                        {isRTL ? company.location.city.ar : company.location.city.en}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {/* Track B - نسخة طبق الأصل من Track A */}
            <div className="flex items-center shrink-0">
              {companies.map((company, index) => (
                <div key={`b-${index}`} className="flex-shrink-0 px-3">
                  <Link
                    href={`/${locale}/companies/${company.slug}`}
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={company.logo}
                          alt={isRTL ? company.name.ar : company.name.en}
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg whitespace-nowrap">
                        {isRTL ? company.name.ar : company.name.en}
                      </span>
                      <span className="text-sm text-white/60 whitespace-nowrap">
                        {isRTL ? company.location.city.ar : company.location.city.en}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
