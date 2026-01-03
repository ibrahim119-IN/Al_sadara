import { headers } from 'next/headers'

// Company type definition
export interface Company {
  id: string
  name: string
  nameAr: string
  shortName?: string
  shortNameAr?: string
  slug: string
  tagline?: string
  taglineAr?: string
  description?: string
  descriptionAr?: string
  companyType: 'plastics' | 'manufacturing' | 'recycling' | 'trading'
  foundedYear?: number
  country: 'egypt' | 'saudi' | 'uae'
  city?: string
  cityAr?: string
  address?: string
  addressAr?: string
  phones?: Array<{ number: string; label?: string; isWhatsApp?: boolean }>
  emails?: Array<{ email: string; label?: string }>
  website?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  logo?: { url: string }
  logoDark?: { url: string }
  heroImage?: { url: string }
  vision?: string
  visionAr?: string
  mission?: string
  missionAr?: string
  services?: Array<{
    name: string
    nameAr?: string
    description?: string
    descriptionAr?: string
    icon?: string
  }>
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
  businessHours?: {
    weekdays?: string
    weekends?: string
    note?: string
    noteAr?: string
  }
  active: boolean
}

// Subdomain to company slug mapping
export const SUBDOMAIN_MAP: Record<string, string> = {
  'industry': 'industry',      // الصدارة للصناعة
  'talah': 'talah',            // التالة الخضراء
  'polymers': 'polymers',      // السيد شحاتة بوليمرز
  'sam': 'sam',                // S.A.M International
  'qaysar': 'qaysar',          // القيصر
}

// Default company colors based on type
export const DEFAULT_COMPANY_COLORS: Record<string, { primary: string; secondary: string }> = {
  plastics: { primary: '#0066CC', secondary: '#004499' },
  trading: { primary: '#00A651', secondary: '#008542' },
  manufacturing: { primary: '#FF6600', secondary: '#CC5200' },
  recycling: { primary: '#4CAF50', secondary: '#388E3C' },
}

/**
 * Get the current subdomain from request headers
 */
export async function getSubdomain(): Promise<string | null> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || ''

    // Handle localhost development
    if (host.includes('localhost')) {
      // Check for x-subdomain header set by middleware
      const subdomain = headersList.get('x-subdomain')
      return subdomain || null
    }

    // Production: extract subdomain from host
    const parts = host.split('.')
    if (parts.length >= 3) {
      const subdomain = parts[0]
      // Ignore www
      if (subdomain === 'www') return null
      return subdomain
    }

    return null
  } catch {
    return null
  }
}

/**
 * Get company slug from subdomain
 */
export function getCompanySlugFromSubdomain(subdomain: string | null): string | null {
  if (!subdomain) return null
  return SUBDOMAIN_MAP[subdomain] || null
}

/**
 * Check if we're on the main domain (group portal)
 */
export async function isMainDomain(): Promise<boolean> {
  const subdomain = await getSubdomain()
  return !subdomain || subdomain === 'www'
}

/**
 * Get company context from headers (set by middleware)
 */
export async function getCompanyContext(): Promise<{ slug: string; isSubdomain: boolean } | null> {
  try {
    const headersList = await headers()
    const companySlug = headersList.get('x-company-slug')
    const isSubdomain = headersList.get('x-is-subdomain') === 'true'

    if (!companySlug) return null

    return {
      slug: companySlug,
      isSubdomain,
    }
  } catch {
    return null
  }
}

/**
 * Generate CSS variables for company theming
 */
export function generateCompanyThemeCSS(company: Company): string {
  const primary = company.primaryColor || DEFAULT_COMPANY_COLORS[company.companyType]?.primary || '#0066CC'
  const secondary = company.secondaryColor || DEFAULT_COMPANY_COLORS[company.companyType]?.secondary || '#004499'
  const accent = company.accentColor || '#FFB800'
  const background = company.backgroundColor || '#FFFFFF'

  return `
    :root {
      --company-primary: ${primary};
      --company-secondary: ${secondary};
      --company-accent: ${accent};
      --company-background: ${background};
    }
  `
}

/**
 * Get company URL (subdomain or path)
 */
export function getCompanyUrl(company: Company, locale: string = 'ar'): string {
  // In production, use subdomain
  if (process.env.NODE_ENV === 'production') {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'alsadara.org'
    return `https://${company.slug}.${domain}/${locale}`
  }

  // In development, use path-based routing
  return `/${locale}/companies/${company.slug}`
}

/**
 * Get country display name
 */
export function getCountryName(country: 'egypt' | 'saudi' | 'uae', locale: 'ar' | 'en'): string {
  const names = {
    egypt: { ar: 'مصر', en: 'Egypt' },
    saudi: { ar: 'السعودية', en: 'Saudi Arabia' },
    uae: { ar: 'الإمارات', en: 'UAE' },
  }
  return names[country]?.[locale] || country
}

/**
 * Get country flag emoji
 */
export function getCountryFlag(country: 'egypt' | 'saudi' | 'uae'): string {
  const flags = {
    egypt: '🇪🇬',
    saudi: '🇸🇦',
    uae: '🇦🇪',
  }
  return flags[country] || ''
}

/**
 * Get company type display name
 */
export function getCompanyTypeName(type: Company['companyType'], locale: 'ar' | 'en'): string {
  const names = {
    plastics: { ar: 'تجارة خامات بلاستيك', en: 'Plastics Trading' },
    trading: { ar: 'تجارة دولية', en: 'International Trading' },
    manufacturing: { ar: 'تصنيع', en: 'Manufacturing' },
    recycling: { ar: 'تدوير', en: 'Recycling' },
  }
  return names[type]?.[locale] || type
}

/**
 * Format phone number for WhatsApp link
 */
export function formatWhatsAppLink(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  return `https://wa.me/${cleaned}`
}

/**
 * Get all active companies for the group
 */
export async function getActiveCompanies(): Promise<Company[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/companies?where[active][equals]=true&sort=order`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.docs || []
  } catch {
    return []
  }
}

/**
 * Get company by slug
 */
export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || ''}/api/companies?where[slug][equals]=${slug}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.docs?.[0] || null
  } catch {
    return null
  }
}
