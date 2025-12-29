'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, Building2, TrendingUp, Award, Handshake, Flag, ChevronDown } from 'lucide-react'
import { timelineEvents, eventTypeLabels, type TimelineEvent, type TimelineEventType } from '@/data/group-history'

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

function TimelineItem({
  event,
  index,
  locale,
  isVisible,
}: {
  event: TimelineEvent
  index: number
  locale: 'ar' | 'en'
  isVisible: boolean
}) {
  const isEven = index % 2 === 0
  const isArabic = locale === 'ar'

  return (
    <div
      className={`flex items-center w-full transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Left Content (Desktop) */}
      <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pe-8' : 'justify-end pe-8 invisible'}`}>
        {isEven && (
          <div className="max-w-md text-end">
            <TimelineCard event={event} locale={locale} alignment="end" />
          </div>
        )}
      </div>

      {/* Center Line & Dot */}
      <div className="relative flex flex-col items-center">
        {/* Vertical Line */}
        <div className="absolute h-full w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200" />

        {/* Year Badge */}
        <div
          className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-4 transition-all duration-300 hover:scale-110"
          style={{ borderColor: event.color }}
        >
          <span className="text-2xl">{event.icon}</span>
        </div>

        {/* Year Label */}
        <div
          className="absolute -bottom-8 bg-white px-3 py-1 rounded-full shadow-md text-sm font-bold"
          style={{ color: event.color }}
        >
          {event.year}
        </div>
      </div>

      {/* Right Content (Desktop) */}
      <div className={`hidden md:flex w-1/2 ${!isEven ? 'justify-start ps-8' : 'justify-start ps-8 invisible'}`}>
        {!isEven && (
          <div className="max-w-md text-start">
            <TimelineCard event={event} locale={locale} alignment="start" />
          </div>
        )}
      </div>

      {/* Mobile Content */}
      <div className="md:hidden flex-1 ps-6">
        <TimelineCard event={event} locale={locale} alignment="start" />
      </div>
    </div>
  )
}

function TimelineCard({
  event,
  locale,
  alignment,
}: {
  event: TimelineEvent
  locale: 'ar' | 'en'
  alignment: 'start' | 'end'
}) {
  const isArabic = locale === 'ar'

  return (
    <div
      className={`group bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-500
        border border-secondary-100 hover:-translate-y-1 ${
          alignment === 'end' ? 'text-end' : 'text-start'
        }`}
    >
      {/* Event Type Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white mb-3`}
        style={{ backgroundColor: event.color }}
      >
        {eventTypeIcons[event.type]}
        <span>{eventTypeLabels[event.type][locale]}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
        {event.title[locale]}
      </h3>

      {/* Description */}
      <p className="text-secondary-600 text-sm leading-relaxed">
        {event.description[locale]}
      </p>

      {/* Company Link (if applicable) */}
      {event.companySlug && (
        <a
          href={`/${locale}/companies/${event.companySlug}`}
          className="inline-flex items-center gap-1 mt-3 text-sm font-medium transition-colors"
          style={{ color: event.color }}
        >
          {isArabic ? 'عرض الشركة' : 'View Company'}
          <ChevronDown className="w-4 h-4 -rotate-90 rtl:rotate-90" />
        </a>
      )}
    </div>
  )
}

export default function GroupTimeline({ locale, className = '' }: GroupTimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<TimelineEventType | 'all'>('all')
  const sectionRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const isArabic = locale === 'ar'

  const filteredEvents = filter === 'all'
    ? timelineEvents
    : timelineEvents.filter((event) => event.type === filter)

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
          { threshold: 0.2, rootMargin: '50px' }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [filteredEvents])

  const filterOptions: { value: TimelineEventType | 'all'; label: { ar: string; en: string } }[] = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'founding', label: { ar: 'تأسيس', en: 'Founding' } },
    { value: 'expansion', label: { ar: 'توسع', en: 'Expansion' } },
    { value: 'achievement', label: { ar: 'إنجازات', en: 'Achievements' } },
    { value: 'milestone', label: { ar: 'معالم', en: 'Milestones' } },
  ]

  return (
    <section ref={sectionRef} className={`py-20 bg-gradient-to-b from-white to-secondary-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            {isArabic ? 'رحلتنا' : 'Our Journey'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            {isArabic ? 'مسيرة النجاح والإنجازات' : 'Journey of Success & Achievements'}
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto mb-8">
            {isArabic
              ? 'رحلة ممتدة منذ 2008 نحو الريادة، مليئة بالإنجازات والتوسعات والنجاحات'
              : 'An extended journey since 2008 towards leadership, filled with achievements, expansions, and successes'}
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter(option.value)
                  setVisibleItems(new Set())
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === option.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-secondary-200'
                }`}
              >
                {option.label[locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Start Marker */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full shadow-lg">
              <span className="text-lg">🌟</span>
              <span className="font-medium">{isArabic ? 'بداية الرحلة' : 'The Beginning'}</span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-20">
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
                />
              </div>
            ))}
          </div>

          {/* End Marker */}
          <div className="flex justify-center mt-16">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-full shadow-lg">
              <span className="text-lg">🚀</span>
              <span className="font-medium">{isArabic ? 'المستقبل' : 'The Future'}</span>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-secondary-100">
            <p className="text-4xl font-bold text-primary-600 mb-2">
              {timelineEvents.filter((e) => e.type === 'founding').length}
            </p>
            <p className="text-secondary-600">{isArabic ? 'شركات مؤسسة' : 'Companies Founded'}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-secondary-100">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {timelineEvents.filter((e) => e.type === 'achievement').length}
            </p>
            <p className="text-secondary-600">{isArabic ? 'إنجازات' : 'Achievements'}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-secondary-100">
            <p className="text-4xl font-bold text-amber-600 mb-2">
              {timelineEvents.filter((e) => e.type === 'expansion').length}
            </p>
            <p className="text-secondary-600">{isArabic ? 'توسعات' : 'Expansions'}</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-card border border-secondary-100">
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {new Date().getFullYear() - 2008}+
            </p>
            <p className="text-secondary-600">{isArabic ? 'سنة من النجاح' : 'Years of Success'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
