'use client'

import { useLocale } from '@/contexts/LocaleContext'
import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  titleAr?: string
  subtitle?: string
  subtitleAr?: string
  badge?: string
  badgeAr?: string
  BadgeIcon?: LucideIcon
  alignment?: 'left' | 'center' | 'right'
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export function SectionHeader({
  title,
  titleAr,
  subtitle,
  subtitleAr,
  badge,
  badgeAr,
  BadgeIcon,
  alignment = 'center',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}: SectionHeaderProps) {
  const { isArabic } = useLocale()

  const displayTitle = isArabic && titleAr ? titleAr : title
  const displaySubtitle = isArabic && subtitleAr ? subtitleAr : subtitle
  const displayBadge = isArabic && badgeAr ? badgeAr : badge

  const alignmentClasses = {
    left: 'text-start',
    center: 'text-center',
    right: 'text-end',
  }

  return (
    <div className={`mb-12 ${alignmentClasses[alignment]} ${className}`}>
      {displayBadge && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
          {displayBadge}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold text-secondary-900 mb-4 ${titleClassName}`}
      >
        {displayTitle}
      </h2>
      {displaySubtitle && (
        <p
          className={`text-secondary-600 max-w-2xl ${
            alignment === 'center' ? 'mx-auto' : ''
          } ${subtitleClassName}`}
        >
          {displaySubtitle}
        </p>
      )}
    </div>
  )
}

interface SectionHeaderSimpleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className = '' }: SectionHeaderSimpleProps) {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold text-secondary-900 ${className}`}>
      {children}
    </h2>
  )
}

export function SectionSubtitle({ children, className = '' }: SectionHeaderSimpleProps) {
  return (
    <p className={`text-secondary-600 ${className}`}>
      {children}
    </p>
  )
}

export function SectionBadge({ children, className = '' }: SectionHeaderSimpleProps) {
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium ${className}`}>
      {children}
    </span>
  )
}
