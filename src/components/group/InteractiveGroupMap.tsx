'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Building2, Calendar, ExternalLink, X } from 'lucide-react'
import { companiesLocations, groupInfo, type CompanyLocation } from '@/data/companies-locations'

interface InteractiveGroupMapProps {
  locale: 'ar' | 'en'
  className?: string
}

export default function InteractiveGroupMap({ locale, className = '' }: InteractiveGroupMapProps) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyLocation | null>(null)
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const isArabic = locale === 'ar'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleCompanyClick = (company: CompanyLocation) => {
    setSelectedCompany(company)
  }

  const closePopup = () => {
    setSelectedCompany(null)
  }

  return (
    <section
      ref={sectionRef}
      className={`py-20 bg-gradient-to-br from-secondary-50 via-white to-primary-50 overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            {isArabic ? 'تواجدنا' : 'Our Presence'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            {isArabic ? 'خريطة انتشار المجموعة' : 'Group Presence Map'}
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            {isArabic
              ? `نفخر بتواجدنا في ${groupInfo.countries.join(' و ')} من خلال ${groupInfo.totalCompanies} شركات متخصصة`
              : `We are proud of our presence in ${groupInfo.countriesEn.join(' and ')} through ${groupInfo.totalCompanies} specialized companies`}
          </p>
        </div>

        {/* Interactive Map Container */}
        <div
          className={`relative max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Map Background */}
          <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 shadow-xl border border-primary-100">
            {/* SVG Map */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-auto"
              style={{ minHeight: '400px' }}
            >
              {/* Background Gradient */}
              <defs>
                <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eff6ff" />
                  <stop offset="100%" stopColor="#f0fdf4" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Map Base */}
              <rect x="0" y="0" width="100" height="80" fill="url(#mapGradient)" rx="2" />

              {/* Simplified Middle East Region Shapes */}
              {/* Egypt */}
              <path
                d="M45 35 L55 35 L58 45 L55 55 L50 60 L45 55 L42 45 Z"
                fill="#e0f2fe"
                stroke="#0066CC"
                strokeWidth="0.3"
                opacity="0.6"
              />
              <text x="50" y="48" fontSize="3" fill="#0066CC" textAnchor="middle" fontWeight="bold">
                {isArabic ? 'مصر' : 'Egypt'}
              </text>

              {/* Saudi Arabia */}
              <path
                d="M58 45 L80 40 L85 55 L75 70 L60 65 L55 55 Z"
                fill="#fef3c7"
                stroke="#f59e0b"
                strokeWidth="0.3"
                opacity="0.6"
              />
              <text x="70" y="55" fontSize="3" fill="#d97706" textAnchor="middle" fontWeight="bold">
                {isArabic ? 'السعودية' : 'KSA'}
              </text>

              {/* UAE */}
              <path
                d="M80 40 L90 38 L92 48 L85 55 Z"
                fill="#dbeafe"
                stroke="#3b82f6"
                strokeWidth="0.3"
                opacity="0.6"
              />
              <text x="86" y="46" fontSize="2.5" fill="#2563eb" textAnchor="middle" fontWeight="bold">
                {isArabic ? 'الإمارات' : 'UAE'}
              </text>

              {/* Mediterranean Sea */}
              <ellipse cx="40" cy="30" rx="15" ry="8" fill="#bfdbfe" opacity="0.4" />
              <text x="40" y="30" fontSize="2" fill="#3b82f6" textAnchor="middle" opacity="0.7">
                {isArabic ? 'البحر المتوسط' : 'Mediterranean'}
              </text>

              {/* Red Sea */}
              <path
                d="M55 55 Q58 60 60 70"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="2"
                opacity="0.5"
              />

              {/* Connection Lines between companies */}
              {companiesLocations.map((company, index) => {
                const nextCompany = companiesLocations[(index + 1) % companiesLocations.length]
                return (
                  <line
                    key={`line-${company.id}`}
                    x1={company.location.mapPosition.x}
                    y1={company.location.mapPosition.y}
                    x2={nextCompany.location.mapPosition.x}
                    y2={nextCompany.location.mapPosition.y}
                    stroke={company.color}
                    strokeWidth="0.2"
                    strokeDasharray="1,1"
                    opacity="0.3"
                    className="animate-pulse"
                  />
                )
              })}

              {/* Company Markers */}
              {companiesLocations.map((company, index) => {
                const isHovered = hoveredCompany === company.id
                const isSelected = selectedCompany?.id === company.id

                return (
                  <g
                    key={company.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleCompanyClick(company)}
                    onMouseEnter={() => setHoveredCompany(company.id)}
                    onMouseLeave={() => setHoveredCompany(null)}
                    style={{
                      transform: `translate(${company.location.mapPosition.x}px, ${company.location.mapPosition.y}px)`,
                      animation: isVisible ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none',
                    }}
                  >
                    {/* Pulse Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered || isSelected ? '4' : '3'}
                      fill={company.color}
                      opacity="0.2"
                      className="animate-ping"
                    />

                    {/* Outer Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered || isSelected ? '3.5' : '2.5'}
                      fill="white"
                      stroke={company.color}
                      strokeWidth="0.5"
                      filter="url(#shadow)"
                      className="transition-all duration-300"
                    />

                    {/* Inner Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isHovered || isSelected ? '2.5' : '1.5'}
                      fill={company.color}
                      filter={isHovered || isSelected ? 'url(#glow)' : ''}
                      className="transition-all duration-300"
                    />

                    {/* Company Icon */}
                    <text
                      x="0"
                      y="0.5"
                      fontSize={isHovered || isSelected ? '3' : '2'}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="transition-all duration-300 pointer-events-none"
                    >
                      {company.icon}
                    </text>

                    {/* Company Name Label */}
                    {(isHovered || isSelected) && (
                      <g className="animate-fade-in">
                        <rect
                          x="-12"
                          y="5"
                          width="24"
                          height="5"
                          rx="1"
                          fill="white"
                          stroke={company.color}
                          strokeWidth="0.3"
                          filter="url(#shadow)"
                        />
                        <text
                          x="0"
                          y="8"
                          fontSize="2"
                          fill={company.color}
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {company.name[locale]}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {companiesLocations.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                    ${selectedCompany?.id === company.id
                      ? 'bg-white shadow-lg scale-105'
                      : 'hover:bg-white/50'
                    }`}
                  style={{
                    borderColor: company.color,
                    borderWidth: selectedCompany?.id === company.id ? '2px' : '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <span className="text-lg">{company.icon}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: company.color }}
                  >
                    {company.name[locale]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Detail Popup */}
          {selectedCompany && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-3xl z-10 animate-fade-in"
              onClick={closePopup}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${selectedCompany.color}20` }}
                    >
                      {selectedCompany.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary-900">
                        {selectedCompany.name[locale]}
                      </h3>
                      <p className="text-sm text-secondary-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedCompany.location.city[locale]}, {selectedCompany.location.country[locale]}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closePopup}
                    className="p-1 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-secondary-500" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-secondary-600 mb-4">
                  {selectedCompany.description[locale]}
                </p>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span className="text-secondary-600">
                      {isArabic ? 'تأسست عام' : 'Founded in'} {selectedCompany.foundedYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-primary-500" />
                    <span className="text-secondary-600">
                      {selectedCompany.specialties[locale].join(' • ')}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                  style={{ backgroundColor: selectedCompany.color }}
                >
                  {isArabic ? 'زيارة الموقع' : 'Visit Website'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div
          className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center p-4 bg-white rounded-xl shadow-soft">
            <p className="text-3xl font-bold text-primary-600">{groupInfo.totalCompanies}</p>
            <p className="text-sm text-secondary-600">{isArabic ? 'شركات' : 'Companies'}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-soft">
            <p className="text-3xl font-bold text-primary-600">{groupInfo.countries.length}</p>
            <p className="text-sm text-secondary-600">{isArabic ? 'دول' : 'Countries'}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-soft">
            <p className="text-3xl font-bold text-primary-600">{new Date().getFullYear() - groupInfo.foundedYear}+</p>
            <p className="text-sm text-secondary-600">{isArabic ? 'سنوات خبرة' : 'Years Experience'}</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-soft">
            <p className="text-3xl font-bold text-primary-600">500+</p>
            <p className="text-sm text-secondary-600">{isArabic ? 'موظف' : 'Employees'}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
