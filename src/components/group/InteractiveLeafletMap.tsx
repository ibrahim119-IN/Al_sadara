'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { companies, countryNames, countryFlags } from '@/data/group-data'
import type { Locale } from '@/lib/i18n/config'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'

interface InteractiveLeafletMapProps {
  locale: Locale
}

const texts = {
  ar: {
    badge: 'تواجدنا الإقليمي',
    title: 'انتشار عالمي في 3 دول',
    subtitle: 'شبكة قوية من الشركات تخدم أسواق الشرق الأوسط',
    viewDetails: 'عرض التفاصيل',
    founded: 'تأسست',
    contact: 'تواصل',
  },
  en: {
    badge: 'Our Regional Presence',
    title: 'Global Presence in 3 Countries',
    subtitle: 'A strong network of companies serving Middle East markets',
    viewDetails: 'View Details',
    founded: 'Founded',
    contact: 'Contact',
  },
}

export default function InteractiveLeafletMap({ locale }: InteractiveLeafletMapProps) {
  const isRTL = locale === 'ar'
  const t = texts[locale]
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<LeafletMarker[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    // تجنب التهيئة المزدوجة في Strict Mode
    if (typeof window === 'undefined' || !mapRef.current) return
    if (mapInstanceRef.current) return

    let isMounted = true

    // Dynamically import Leaflet only on client side
    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      // التأكد من أن المكون لا يزال mounted
      if (!isMounted || !mapRef.current) return

      // التحقق مرة أخرى من عدم وجود خريطة
      if (mapInstanceRef.current) return

      // Initialize the map centered on Middle East
      const map = L.map(mapRef.current, {
        center: [25, 40], // Center on Middle East/Gulf region
        zoom: 4,
        scrollWheelZoom: false,
        attributionControl: false,
      })

      mapInstanceRef.current = map

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map)

      // Custom marker icons based on country
      const createMarkerIcon = (color: string) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 40px;
              height: 40px;
              background: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 18px;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        })
      }

      // Group companies by location to avoid marker overlap
      const locationGroups: Record<string, typeof companies> = {}
      companies.forEach((company) => {
        const key = `${company.location.coordinates.lat},${company.location.coordinates.lng}`
        if (!locationGroups[key]) {
          locationGroups[key] = []
        }
        locationGroups[key].push(company)
      })

      // Add markers for each unique location
      Object.entries(locationGroups).forEach(([, companiesAtLocation]) => {
        const firstCompany = companiesAtLocation[0]
        const { lat, lng } = firstCompany.location.coordinates

        // Offset markers slightly if multiple companies at same location
        const offset = companiesAtLocation.length > 1 ? 0.05 : 0

        companiesAtLocation.forEach((company, index) => {
          const offsetLat = lat + index * offset
          const offsetLng = lng + index * offset * 0.5

          const marker = L.marker([offsetLat, offsetLng], {
            icon: createMarkerIcon(company.color),
          }).addTo(map)

          // Create popup content
          const popupContent = `
            <div style="
              min-width: 250px;
              padding: 16px;
              font-family: system-ui, -apple-system, sans-serif;
              direction: ${isRTL ? 'rtl' : 'ltr'};
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
              ">
                <div style="
                  width: 50px;
                  height: 50px;
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                ">
                  <img
                    src="${company.logo}"
                    alt="${company.name[locale]}"
                    style="width: 40px; height: 40px; object-fit: contain;"
                  />
                </div>
                <div>
                  <h3 style="
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a2e;
                  ">${company.name[locale]}</h3>
                  <p style="
                    margin: 4px 0 0;
                    font-size: 12px;
                    color: #666;
                  ">
                    ${countryFlags[company.location.country]} ${company.location.city[locale]}, ${countryNames[company.location.country][locale]}
                  </p>
                </div>
              </div>
              <p style="
                margin: 0 0 12px;
                font-size: 13px;
                color: #444;
                line-height: 1.5;
              ">${company.description[locale]}</p>
              <div style="
                display: flex;
                gap: 8px;
              ">
                <a href="/${locale}/companies/${company.slug}" style="
                  flex: 1;
                  padding: 8px 16px;
                  background: ${company.color};
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-size: 13px;
                  font-weight: 600;
                  text-align: center;
                ">${t.viewDetails}</a>
              </div>
            </div>
          `

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup',
          })

          marker.on('click', () => {
            setSelectedCompany(company.id)
          })

          markersRef.current.push(marker)
        })
      })

      setIsMapLoaded(true)
    }

    initMap()

    // Cleanup function
    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markersRef.current = []
    }
  }, [locale, isRTL, t.viewDetails])

  return (
    <section
      className="py-20 bg-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
          {/* Loading Placeholder */}
          {!isMapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">
                  {locale === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...'}
                </p>
              </div>
            </div>
          )}

          {/* Leaflet Map */}
          <div
            ref={mapRef}
            className="w-full h-[500px] md:h-[600px]"
            style={{ background: '#e8f4f8' }}
          />
        </div>

        {/* Companies Legend */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {companies.map((company) => (
            <Link
              key={company.id}
              href={`/${locale}/companies/${company.slug}`}
              className={`group flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                selectedCompany === company.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white shadow-sm"
                style={{ borderColor: company.color, borderWidth: 2 }}
              >
                <Image
                  src={company.logo}
                  alt={company.name[locale]}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                  {company.name[locale]}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {countryFlags[company.location.country]}
                  {company.location.city[locale]}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Country Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['saudi', 'egypt', 'uae'] as const).map((country) => {
            const countryCompanies = companies.filter(
              (c) => c.location.country === country
            )
            return (
              <div
                key={country}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{countryFlags[country]}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {countryNames[country][locale]}
                    </h3>
                    <p className="text-gray-600">
                      {countryCompanies.length}{' '}
                      {locale === 'ar' ? 'شركات' : 'Companies'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {countryCompanies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/${locale}/companies/${company.slug}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: company.color }}
                      />
                      {company.name[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Popup Styles */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </section>
  )
}
