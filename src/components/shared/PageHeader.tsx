'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  titleAr?: string
  subtitle?: string
  subtitleAr?: string
  breadcrumbItems?: BreadcrumbItem[]
  Icon?: LucideIcon
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'none'
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  titleAr,
  subtitle,
  subtitleAr,
  breadcrumbItems = [],
  Icon,
  backgroundPattern = 'dots',
  className = '',
  children,
}: PageHeaderProps) {
  const { isArabic } = useLocale()

  const displayTitle = isArabic && titleAr ? titleAr : title
  const displaySubtitle = isArabic && subtitleAr ? subtitleAr : subtitle

  const patternStyles = {
    dots: `bg-[radial-gradient(#0066CC10_1px,transparent_1px)] bg-[size:20px_20px]`,
    grid: `bg-[linear-gradient(to_right,#0066CC08_1px,transparent_1px),linear-gradient(to_bottom,#0066CC08_1px,transparent_1px)] bg-[size:40px_40px]`,
    waves: ``,
    none: '',
  }

  return (
    <header
      className={`relative bg-gradient-to-br from-secondary-50 via-white to-primary-50 overflow-hidden ${className}`}
    >
      {/* Background Pattern */}
      {backgroundPattern !== 'none' && (
        <div className={`absolute inset-0 ${patternStyles[backgroundPattern]}`} />
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 end-0 w-1/3 h-full bg-gradient-to-l from-primary-100/30 to-transparent" />
      <div className="absolute bottom-0 start-0 w-1/4 h-1/2 bg-gradient-to-tr from-accent-100/20 to-transparent rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-4">
              {Icon && (
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary-600" />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900">
                {displayTitle}
              </h1>
            </div>

            {/* Subtitle */}
            {displaySubtitle && (
              <p className="text-lg text-secondary-600 max-w-2xl">
                {displaySubtitle}
              </p>
            )}
          </div>

          {/* Additional Content (e.g., CTA buttons) */}
          {children && (
            <div className="shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Border Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
    </header>
  )
}

// Simpler version for internal pages
interface SimplePageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SimplePageHeader({ title, subtitle, className = '' }: SimplePageHeaderProps) {
  return (
    <div className={`py-8 border-b border-secondary-100 ${className}`}>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-secondary-600">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
