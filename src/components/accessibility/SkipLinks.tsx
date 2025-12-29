'use client'

import React from 'react'
import { useLocale } from '@/contexts/LocaleContext'

interface SkipLink {
  id: string
  labelEn: string
  labelAr: string
}

const defaultLinks: SkipLink[] = [
  { id: 'main-content', labelEn: 'Skip to main content', labelAr: 'انتقل إلى المحتوى الرئيسي' },
  { id: 'main-navigation', labelEn: 'Skip to navigation', labelAr: 'انتقل إلى القائمة' },
  { id: 'search', labelEn: 'Skip to search', labelAr: 'انتقل إلى البحث' },
  { id: 'footer', labelEn: 'Skip to footer', labelAr: 'انتقل إلى التذييل' },
]

interface SkipLinksProps {
  links?: SkipLink[]
}

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'

  return (
    <nav
      aria-label={isArabic ? 'روابط التخطي' : 'Skip links'}
      className="sr-only focus-within:not-sr-only"
    >
      <ul className="fixed top-0 left-0 right-0 z-[9999] flex flex-wrap gap-2 p-2 bg-primary-600">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className="
                sr-only focus:not-sr-only
                inline-block px-4 py-2 bg-white text-primary-700 font-medium rounded-lg
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600
                transition-transform focus:transform-none
              "
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(link.id)
                if (element) {
                  element.focus()
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {isArabic ? link.labelAr : link.labelEn}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
