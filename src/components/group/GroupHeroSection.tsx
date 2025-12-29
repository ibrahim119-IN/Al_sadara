'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, Building2, Globe2, Briefcase } from 'lucide-react'
import { companies } from '@/data/group-data'

interface GroupHeroSectionProps {
  locale: 'ar' | 'en'
}

// Hero slides data - industrial/plastic images
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/plastic-factory.jpg',
    alt: { ar: 'مصنع بلاستيك حديث', en: 'Modern Plastic Factory' },
  },
  {
    id: 2,
    image: '/images/hero/plastic-materials.jpg',
    alt: { ar: 'خامات بلاستيكية متنوعة', en: 'Various Plastic Materials' },
  },
  {
    id: 3,
    image: '/images/hero/warehouse.jpg',
    alt: { ar: 'مستودع توزيع', en: 'Distribution Warehouse' },
  },
  {
    id: 4,
    image: '/images/hero/electronics.jpg',
    alt: { ar: 'أنظمة إلكترونية', en: 'Electronic Systems' },
  },
]

export default function GroupHeroSection({ locale }: GroupHeroSectionProps) {
  const isRTL = locale === 'ar'
  const [isLoaded, setIsLoaded] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const [animationReady, setAnimationReady] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // تكرار الشركات 2 مرات فقط للـ infinite loop السلس (50% animation)
  const repeatedCompanies = [...companies, ...companies]

  // Auto-play slider
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    // تأخير صغير للتأكد من render العناصر قبل بدء الـ animation
    const timer = setTimeout(() => setAnimationReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle auto-play
  useEffect(() => {
    if (isPlaying) {
      slideTimerRef.current = setInterval(nextSlide, 5000) // Change slide every 5 seconds
    }
    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current)
      }
    }
  }, [isPlaying, nextSlide])

  const content = {
    ar: {
      badge: 'منذ 2005',
      title: 'مجموعة السيد شحاتة',
      subtitle: 'للتجارة والصناعة',
      description: 'رواد صناعة وتجارة خامات البلاستيك وأنظمة المباني الذكية في الشرق الأوسط وأفريقيا',
      cta1: 'شركاتنا',
      cta2: 'تواصل معنا',
      stat1: { value: '6', label: 'شركات تابعة' },
      stat2: { value: '3', label: 'دول' },
      stat3: { value: '+20', label: 'سنة خبرة' },
    },
    en: {
      badge: 'Since 2005',
      title: 'El Sayed Shehata Group',
      subtitle: 'for Trade & Industry',
      description: 'Leaders in plastics raw materials trading and smart building systems across the Middle East and Africa',
      cta1: 'Our Companies',
      cta2: 'Contact Us',
      stat1: { value: '6', label: 'Subsidiaries' },
      stat2: { value: '3', label: 'Countries' },
      stat3: { value: '+20', label: 'Years Experience' },
    },
  }

  const t = content[locale]

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary-900">
      {/* Video Background - Primary (shows when video loads) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
        </video>
      </div>

      {/* Fallback Background Slider - Shows when video is loading or fails */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'}`}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Placeholder gradient background (replace with actual images) */}
            <div
              className="absolute inset-0"
              style={{
                background: index === 0
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                  : index === 1
                  ? 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)'
                  : index === 2
                  ? 'linear-gradient(135deg, #16213e 0%, #0f3460 50%, #1a1a2e 100%)'
                  : 'linear-gradient(135deg, #1e3a5f 0%, #1a1a2e 50%, #0f3460 100%)',
              }}
            />
            {/* Uncomment below when you have actual images */}
            {/* <Image
              src={slide.image}
              alt={slide.alt[locale]}
              fill
              className="object-cover"
              priority={index === 0}
            /> */}
          </div>
        ))}
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 start-10 animate-float-slow opacity-20">
          <Building2 className="w-24 h-24 text-white" />
        </div>
        <div className="absolute top-1/3 end-20 animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <Globe2 className="w-32 h-32 text-primary-400" />
        </div>
        <div className="absolute bottom-1/4 start-1/4 animate-float-slow opacity-20" style={{ animationDelay: '2s' }}>
          <Briefcase className="w-20 h-20 text-accent-400" />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-secondary-900/70" />

      {/* Slider Controls */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-primary-400 w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ms-0.5" />
          )}
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isRTL ? 'right-4' : 'left-4'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isRTL ? 'left-4' : 'right-4'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
      </button>

      {/* Content */}
      <div className="relative z-10 container-wide py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            <span className="text-white/90 font-medium">{t.badge}</span>
          </div>

          {/* Title */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t.title}
          </h1>
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-primary-400 mb-8 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t.subtitle}
          </h2>

          {/* Description */}
          <p
            className={`text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-12 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {t.description}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href={`/${locale}/companies`}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-btn hover:shadow-btn-hover transition-all duration-300 hover:-translate-y-1"
            >
              {t.cta1}
              <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1"
            >
              {t.cta2}
            </Link>
          </div>

          {/* Quick Stats */}
          <div
            className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {[t.stat1, t.stat2, t.stat3].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 font-medium">
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
        {/* Carousel with mask gradient for smooth fade effect */}
        <div
          className="w-full overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 128px, black calc(100% - 128px), transparent 100%)',
          }}
        >
          {/* Single track with 2x repeated items - moves 50% to loop seamlessly */}
          <div
            ref={trackRef}
            className={`flex items-center hover:[animation-play-state:paused] ${animationReady ? (isRTL ? 'animate-marquee-rtl' : 'animate-marquee') : ''}`}
            style={{ willChange: 'transform' }}
          >
            {repeatedCompanies.map((company, index) => (
              <div key={index} className="flex-shrink-0 px-2">
                <Link
                  href={`/${locale}/companies/${company.slug}`}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 group shadow-lg"
                >
                  {/* Logo with white circular background */}
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
