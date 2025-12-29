'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

export interface BreadcrumbItem {
  label: string
  labelAr?: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  includeSchema?: boolean
}

export function Breadcrumb({
  items,
  className = '',
  showHome = true,
  includeSchema = true,
}: BreadcrumbProps) {
  const { locale, isArabic, isRTL } = useLocale()

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', labelAr: 'الرئيسية', href: `/${locale}` }, ...items]
    : items

  // Prepare schema items
  const schemaItems = allItems.map((item) => ({
    name: isArabic && item.labelAr ? item.labelAr : item.label,
    url: item.href ? `${baseUrl}${item.href}` : '',
  }))

  return (
    <>
      {includeSchema && <BreadcrumbSchema items={schemaItems} />}

      <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const displayLabel = isArabic && item.labelAr ? item.labelAr : item.label
            const isHome = index === 0 && showHome

            return (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronIcon className="w-4 h-4 text-secondary-400 shrink-0" />
                )}

                {isLast ? (
                  <span className="text-secondary-600 font-medium" aria-current="page">
                    {displayLabel}
                  </span>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="text-primary-600 hover:text-primary-700 hover:underline transition-colors flex items-center gap-1"
                  >
                    {isHome && <Home className="w-4 h-4" />}
                    {!isHome && displayLabel}
                    {isHome && <span className="sr-only">{displayLabel}</span>}
                  </Link>
                ) : (
                  <span className="text-secondary-500">{displayLabel}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// Simple breadcrumb without context (for server components)
interface SimpleBreadcrumbProps {
  items: { label: string; href?: string }[]
  locale: 'ar' | 'en'
  className?: string
}

export function SimpleBreadcrumb({ items, locale, className = '' }: SimpleBreadcrumbProps) {
  const isRTL = locale === 'ar'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        <li className="flex items-center gap-2">
          <Link
            href={`/${locale}`}
            className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">{isRTL ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronIcon className="w-4 h-4 text-secondary-400 shrink-0" />
              {isLast || !item.href ? (
                <span
                  className={isLast ? 'text-secondary-600 font-medium' : 'text-secondary-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
