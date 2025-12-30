'use client'

import { useState, useEffect, useCallback } from 'react'

export interface PageSection {
  id: string
  label: {
    ar: string
    en: string
  }
}

interface PageProgressIndicatorProps {
  sections: PageSection[]
  locale: 'ar' | 'en'
}

export default function PageProgressIndicator({ sections, locale }: PageProgressIndicatorProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Show indicator after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track current section with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach((section, index) => {
      const element = document.getElementById(section.id)
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setCurrentSection(index)
            }
          },
          {
            threshold: 0.3,
            rootMargin: '-10% 0px -60% 0px'
          }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sections])

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div
      className={`fixed start-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
      }`}
    >
      {sections.map((section, index) => (
        <div key={section.id} className="group relative">
          {/* Dot */}
          <button
            onClick={() => scrollToSection(section.id)}
            aria-label={section.label[locale]}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-primary-600 scale-125 shadow-lg shadow-primary-400/50'
                : 'bg-gray-300 hover:bg-gray-500 hover:scale-110'
            }`}
          />

          {/* Connecting line (except last item) */}
          {index < sections.length - 1 && (
            <div
              className={`absolute start-1/2 -translate-x-1/2 top-full w-0.5 h-3 transition-colors duration-300 ${
                currentSection > index ? 'bg-primary-400' : 'bg-gray-200'
              }`}
            />
          )}

          {/* Tooltip */}
          <span
            className="absolute start-full ms-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl"
          >
            {section.label[locale]}
            {/* Arrow */}
            <span className="absolute end-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-e-gray-900" />
          </span>
        </div>
      ))}
    </div>
  )
}
