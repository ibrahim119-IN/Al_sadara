'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ArrowRight, Phone, ExternalLink } from 'lucide-react'
import type { Company } from '@/data/group-data'
import { countryFlags, countryNames } from '@/data/group-data'

interface CompanyCardProps {
  company: Company
  locale: 'ar' | 'en'
}

export function CompanyCard({ company, locale }: CompanyCardProps) {
  const isRTL = locale === 'ar'

  const content = {
    ar: {
      viewDetails: 'عرض التفاصيل',
      founded: 'تأسست',
      contact: 'تواصل',
    },
    en: {
      viewDetails: 'View Details',
      founded: 'Founded',
      contact: 'Contact',
    },
  }

  const t = content[locale]
  const countryFlag = countryFlags[company.location.country]
  const countryName = countryNames[company.location.country]

  return (
    <div className="group bg-white rounded-3xl border border-secondary-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      {/* Color Bar */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: company.color }}
      />

      {/* Content */}
      <div className="p-6 lg:p-8">
        {/* Header with Logo */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="relative w-16 h-16 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden"
            style={{ backgroundColor: `${company.color}15` }}
          >
            <Image
              src={company.logo}
              alt={isRTL ? company.name.ar : company.name.en}
              fill
              className="object-contain p-2"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-xl text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
              {isRTL ? company.name.ar : company.name.en}
            </h2>
            <p className="text-sm text-secondary-500 truncate">
              {isRTL ? company.name.en : company.name.ar}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary-600 leading-relaxed mb-6 line-clamp-3">
          {isRTL ? company.description.ar : company.description.en}
        </p>

        {/* Meta Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-secondary-500">
            <span className="text-lg">{countryFlag}</span>
            <MapPin className="w-4 h-4" />
            <span>
              {isRTL ? company.location.city.ar : company.location.city.en}
              {', '}
              {isRTL ? countryName.ar : countryName.en}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-500">
            <Calendar className="w-4 h-4" />
            <span>{t.founded} {company.founded}</span>
          </div>
        </div>

        {/* Services Tags */}
        {company.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {company.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full"
              >
                {isRTL ? service.ar : service.en}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/${locale}/companies/${company.slug}`}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
          >
            {t.viewDetails}
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
          {company.contact.phones[0] && (
            <a
              href={`tel:${company.contact.phones[0]}`}
              className="flex items-center justify-center w-12 h-12 bg-secondary-100 hover:bg-green-500 hover:text-white rounded-xl transition-all"
              title={t.contact}
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          {company.contact.website && (
            <a
              href={`https://${company.contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-secondary-100 hover:bg-secondary-200 rounded-xl transition-all"
              title={isRTL ? 'زيارة الموقع' : 'Visit Website'}
            >
              <ExternalLink className="w-5 h-5 text-secondary-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact version for smaller displays
export function CompanyCardCompact({ company, locale }: CompanyCardProps) {
  const isRTL = locale === 'ar'
  const countryFlag = countryFlags[company.location.country]

  return (
    <Link
      href={`/${locale}/companies/${company.slug}`}
      className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all"
    >
      <div
        className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: `${company.color}15` }}
      >
        <Image
          src={company.logo}
          alt={isRTL ? company.name.ar : company.name.en}
          fill
          className="object-contain p-1.5"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors truncate">
          {isRTL ? company.name.ar : company.name.en}
        </h3>
        <p className="text-sm text-secondary-500 flex items-center gap-1">
          <span>{countryFlag}</span>
          <span>{isRTL ? company.location.city.ar : company.location.city.en}</span>
        </p>
      </div>
      <ArrowRight className={`w-5 h-5 text-secondary-400 group-hover:text-primary-600 transition-colors ${isRTL ? 'rotate-180' : ''}`} />
    </Link>
  )
}

// Logo only version for marquee/carousel
export function CompanyLogo({ company, locale, size = 'md' }: CompanyCardProps & { size?: 'sm' | 'md' | 'lg' }) {
  const isRTL = locale === 'ar'

  const sizeClasses = {
    sm: 'w-20 h-12',
    md: 'w-28 h-16',
    lg: 'w-36 h-20',
  }

  return (
    <Link
      href={`/${locale}/companies/${company.slug}`}
      className="group relative block"
    >
      <div className={`${sizeClasses[size]} relative grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300`}>
        <Image
          src={company.logo}
          alt={isRTL ? company.name.ar : company.name.en}
          fill
          className="object-contain"
        />
      </div>
    </Link>
  )
}
