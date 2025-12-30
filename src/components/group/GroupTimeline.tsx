'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Calendar, Building2, TrendingUp, Award, Handshake, Flag, ChevronDown } from 'lucide-react'
import { timelineEvents, eventTypeLabels, type TimelineEvent, type TimelineEventType } from '@/data/group-history'
import { companies } from '@/data/group-data'

interface GroupTimelineProps {
  locale: 'ar' | 'en'
  className?: string
}

const eventTypeIcons: Record<TimelineEventType, React.ReactNode> = {
  founding: <Building2 className="w-5 h-5" />,
  expansion: <TrendingUp className="w-5 h-5" />,
  achievement: <Award className="w-5 h-5" />,
  partnership: <Handshake className="w-5 h-5" />,
  milestone: <Flag className="w-5 h-5" />,
}

const filterIcons: Record<TimelineEventType | 'all', React.ReactNode> = {
  all: <Calendar className="w-4 h-4" />,
  founding: <Building2 className="w-4 h-4" />,
  expansion: <TrendingUp className="w-4 h-4" />,
  achievement: <Award className="w-4 h-4" />,
  partnership: <Handshake className="w-4 h-4" />,
  milestone: <Flag className="w-4 h-4" />,
}

// Animated Counter Hook
function useCountUp(end: number, duration: number = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])

  return count
}

function TimelineItem({
  event,
  index,
  locale,
  isVisible,
  totalItems,
}: {
  event: TimelineEvent
  index: number
  locale: 'ar' | 'en'
  isVisible: boolean
  totalItems: number
}) {
  const isEven = index % 2 === 0
  const isArabic = locale === 'ar'
  const [isHovered, setIsHovered] = useState(false)

  // Get company logo if event has companySlug
  const company = event.companySlug
    ? companies.find((c) => c.slug === event.companySlug)
    : null

  // Directional animations - left cards slide from left, right from right
  const getSlideClass = () => {
    if (!isVisible) {
      return isEven ? '-translate-x-16 opacity-0 scale-95' : 'translate-x-16 opacity-0 scale-95'
    }
    return 'translate-x-0 opacity-100 scale-100'
  }

  return (
    <div
      className="flex items-center w-full"
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Left Content (Desktop) */}
      <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pe-10' : 'justify-end pe-10 invisible'}`}>
        {isEven && (
          <div
            className={`max-w-md text-end transition-all duration-700 ease-out ${getSlideClass()}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <TimelineCard
              event={event}
              locale={locale}
              alignment="end"
              isHovered={isHovered}
              setIsHovered={setIsHovered}
            />
          </div>
        )}
      </div>

      {/* Center Line & Node */}
      <div className="relative flex flex-col items-center">
        {/* Vertical Line Segment */}
        <div
          className={`absolute h-full w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-400 shadow-lg shadow-emerald-300/30 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          }`}
          style={{ transformOrigin: 'top', transitionDelay: `${index * 100}ms` }}
        />

        {/* Year Node - Enhanced */}
        <div
          className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl transition-all duration-500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          } ${isHovered ? 'scale-110' : ''}`}
          style={{
            borderWidth: '5px',
            borderColor: event.color,
            transitionDelay: `${index * 150 + 100}ms`
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Pulse Ring Animation */}
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: event.color }}
          />
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-10"
            style={{ backgroundColor: event.color }}
          />

          {/* Icon or Company Logo */}
          {company ? (
            <div className={`relative w-12 h-12 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
              <Image
                src={company.logo}
                alt={company.name[locale]}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <span className={`text-3xl transition-transform duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
              {event.icon}
            </span>
          )}
        </div>

        {/* Year Label */}
        <div
          className={`absolute -bottom-10 bg-white px-4 py-1.5 rounded-full shadow-lg text-sm font-bold transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{
            color: event.color,
            boxShadow: `0 4px 20px ${event.color}30`,
            transitionDelay: `${index * 150 + 200}ms`
          }}
        >
          {event.year}
        </div>
      </div>

      {/* Right Content (Desktop) */}
      <div className={`hidden md:flex w-1/2 ${!isEven ? 'justify-start ps-10' : 'justify-start ps-10 invisible'}`}>
        {!isEven && (
          <div
            className={`max-w-md text-start transition-all duration-700 ease-out ${getSlideClass()}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <TimelineCard
              event={event}
              locale={locale}
              alignment="start"
              isHovered={isHovered}
              setIsHovered={setIsHovered}
            />
          </div>
        )}
      </div>

      {/* Mobile Content */}
      <div className={`md:hidden flex-1 ps-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}>
        <TimelineCard
          event={event}
          locale={locale}
          alignment="start"
          isHovered={isHovered}
          setIsHovered={setIsHovered}
        />
      </div>
    </div>
  )
}

function TimelineCard({
  event,
  locale,
  alignment,
  isHovered,
  setIsHovered,
}: {
  event: TimelineEvent
  locale: 'ar' | 'en'
  alignment: 'start' | 'end'
  isHovered: boolean
  setIsHovered: (value: boolean) => void
}) {
  const isArabic = locale === 'ar'

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className={`group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg transition-all duration-500
          border-2 border-secondary-100 ${
            alignment === 'end' ? 'text-end' : 'text-start'
          } ${isHovered ? 'shadow-2xl border-emerald-200' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? alignment === 'end'
              ? 'rotateY(-5deg) rotateX(3deg) translateY(-4px)'
              : 'rotateY(5deg) rotateX(3deg) translateY(-4px)'
            : 'rotateY(0) rotateX(0) translateY(0)',
          boxShadow: isHovered ? `0 25px 50px -12px ${event.color}25` : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Event Type Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white mb-4 shadow-md"
          style={{ backgroundColor: event.color }}
        >
          {eventTypeIcons[event.type]}
          <span>{eventTypeLabels[event.type][locale]}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-emerald-600 transition-colors">
          {event.title[locale]}
        </h3>

        {/* Description */}
        <p className="text-secondary-600 leading-relaxed">
          {event.description[locale]}
        </p>

        {/* Company Link (if applicable) */}
        {event.companySlug && (
          <a
            href={`/${locale}/companies/${event.companySlug}`}
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold transition-all hover:gap-2.5"
            style={{ color: event.color }}
          >
            {isArabic ? 'عرض الشركة' : 'View Company'}
            <ChevronDown className="w-4 h-4 -rotate-90 rtl:rotate-90" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function GroupTimeline({ locale, className = '' }: GroupTimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<TimelineEventType | 'all'>('all')
  const [statsVisible, setStatsVisible] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const statsRef = useRef<HTMLDivElement>(null)

  const isArabic = locale === 'ar'

  const filteredEvents = filter === 'all'
    ? timelineEvents
    : timelineEvents.filter((event) => event.type === filter)

  // Stats values
  const foundingCount = timelineEvents.filter((e) => e.type === 'founding').length
  const achievementCount = timelineEvents.filter((e) => e.type === 'achievement').length
  const expansionCount = timelineEvents.filter((e) => e.type === 'expansion').length
  const yearsCount = new Date().getFullYear() - 2008

  // Animated counters
  const animatedFounding = useCountUp(foundingCount, 1500, statsVisible)
  const animatedAchievement = useCountUp(achievementCount, 1500, statsVisible)
  const animatedExpansion = useCountUp(expansionCount, 1500, statsVisible)
  const animatedYears = useCountUp(yearsCount, 2000, statsVisible)

  // Intersection Observer for timeline items
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => new Set([...prev, index]))
            }
          },
          { threshold: 0.3, rootMargin: '0px' }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [filteredEvents])

  // Intersection Observer for stats
  useEffect(() => {
    if (!statsRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const filterOptions: { value: TimelineEventType | 'all'; label: { ar: string; en: string } }[] = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'founding', label: { ar: 'تأسيس', en: 'Founding' } },
    { value: 'expansion', label: { ar: 'توسع', en: 'Expansion' } },
    { value: 'achievement', label: { ar: 'إنجازات', en: 'Achievements' } },
    { value: 'milestone', label: { ar: 'معالم', en: 'Milestones' } },
  ]

  return (
    <section
      className={`section bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 relative overflow-hidden ${className}`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 start-0 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container-xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-emerald-300/30">
            <Calendar className="w-5 h-5" />
            {isArabic ? 'رحلتنا' : 'Our Journey'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
            {isArabic ? 'مسيرة النجاح والإنجازات' : 'Journey of Success & Achievements'}
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-10">
            {isArabic
              ? 'رحلة ممتدة منذ 2008 نحو الريادة، مليئة بالإنجازات والتوسعات والنجاحات'
              : 'An extended journey since 2008 towards leadership, filled with achievements, expansions, and successes'}
          </p>

          {/* Filter Buttons - Enhanced */}
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value)
                  setVisibleItems(new Set())
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  filter === option.value
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-300/30 scale-105'
                    : 'bg-white text-secondary-600 hover:bg-emerald-50 hover:text-emerald-600 border-2 border-secondary-200 hover:border-emerald-300 hover:scale-105'
                }`}
              >
                {filterIcons[option.value]}
                {option.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Continuous Background Line */}
          <div className="absolute start-1/2 md:start-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 via-teal-200 to-emerald-200 rounded-full hidden md:block" />

          {/* Start Marker */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-xl shadow-emerald-300/30 animate-pulse">
              <span className="text-2xl">🌟</span>
              <span className="font-bold text-lg">{isArabic ? 'بداية الرحلة' : 'The Beginning'}</span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-24">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                ref={(el) => { itemRefs.current[index] = el }}
              >
                <TimelineItem
                  event={event}
                  index={index}
                  locale={locale}
                  isVisible={visibleItems.has(index)}
                  totalItems={filteredEvents.length}
                />
              </div>
            ))}
          </div>

          {/* End Marker */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white rounded-full shadow-xl shadow-teal-300/30">
              <span className="text-2xl">🚀</span>
              <span className="font-bold text-lg">{isArabic ? 'المستقبل' : 'The Future'}</span>
            </div>
          </div>
        </div>

        {/* Stats Summary - Enhanced */}
        <div
          ref={statsRef}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          <div className={`group text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '0ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-300/30 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-5xl font-bold text-emerald-600 mb-2">
              {animatedFounding}
            </p>
            <p className="text-secondary-600 font-medium">{isArabic ? 'شركات مؤسسة' : 'Companies Founded'}</p>
          </div>

          <div className={`group text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-green-100 hover:border-green-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '100ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-300/30 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-5xl font-bold text-green-600 mb-2">
              {animatedAchievement}
            </p>
            <p className="text-secondary-600 font-medium">{isArabic ? 'إنجازات' : 'Achievements'}</p>
          </div>

          <div className={`group text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-amber-100 hover:border-amber-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '200ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-300/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-5xl font-bold text-amber-600 mb-2">
              {animatedExpansion}
            </p>
            <p className="text-secondary-600 font-medium">{isArabic ? 'توسعات' : 'Expansions'}</p>
          </div>

          <div className={`group text-center p-8 bg-white rounded-3xl shadow-lg border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-300/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-5xl font-bold text-purple-600 mb-2">
              {animatedYears}+
            </p>
            <p className="text-secondary-600 font-medium">{isArabic ? 'سنة من النجاح' : 'Years of Success'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
