import Script from 'next/script'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

// Organization Schema
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'El Sayed Shehata Group of Companies',
    alternateName: ['مجموعة شركات السيد شحاتة', 'ITs Group', 'مجموعة السيد شحاتة'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/images/group-logo.png`,
      width: 200,
      height: 200,
    },
    description: 'El Sayed Shehata Group of Companies - Leaders in Plastic Raw Materials Trading and Polymers Supply',
    foundingDate: '2005',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 50,
      maxValue: 200,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SA',
      addressRegion: 'Jeddah',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+966554401575',
        contactType: 'customer service',
        areaServed: 'SA',
        availableLanguage: ['Arabic', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+201099853546',
        contactType: 'sales',
        areaServed: 'EG',
        availableLanguage: ['Arabic', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+971503830860',
        contactType: 'sales',
        areaServed: 'AE',
        availableLanguage: ['Arabic', 'English'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/alsadara',
      'https://www.linkedin.com/company/alsadara',
      'https://twitter.com/alsadara',
    ],
    subsidiaries: [
      {
        '@type': 'Organization',
        name: 'Al Sadara Industry',
        description: 'Plastic raw materials trading - Jeddah, Saudi Arabia',
        url: 'https://industry.alsadara.org',
      },
      {
        '@type': 'Organization',
        name: 'Al Talah Al Khadra',
        description: 'Plastic raw materials trading & recycling - 6th October, Egypt',
        url: 'https://talah.alsadara.org',
      },
      {
        '@type': 'Organization',
        name: 'S.A.M International',
        description: 'International Plastic Material Trading FZE - Sharjah, UAE',
        url: 'https://sam.alsadara.org',
      },
      {
        '@type': 'Organization',
        name: 'El Sayed Shehata Polymers',
        description: 'International polymers trading - Dubai, UAE',
        url: 'https://polymers.alsadara.org',
      },
      {
        '@type': 'Organization',
        name: 'Al Qaysar',
        description: 'Plastic raw materials trading - 6th October, Egypt',
        url: 'https://qaysar.alsadara.org',
      },
    ],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Website Schema
export function WebsiteSchema({ locale }: { locale: string }) {
  const isArabic = locale === 'ar'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
    description: isArabic
      ? 'مجموعة شركات السيد شحاتة - رائدون في تجارة خامات البلاستيك والبوليمرات'
      : 'El Sayed Shehata Group of Companies - Leaders in Plastic Raw Materials Trading and Polymers',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: isArabic ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${locale}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Product Schema
interface ProductSchemaProps {
  product: {
    name: string
    nameAr?: string
    description?: string
    descriptionAr?: string
    slug: string
    price?: number
    originalPrice?: number
    currency?: string
    image?: string
    sku?: string
    brand?: string
    category?: string
    inStock?: boolean
    rating?: number
    reviewCount?: number
  }
  locale: string
}

export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const isArabic = locale === 'ar'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE_URL}/${locale}/products/${product.slug}`,
    name: isArabic ? product.nameAr || product.name : product.name,
    description: isArabic ? product.descriptionAr || product.description : product.description,
    image: product.image || `${BASE_URL}/images/product-placeholder.jpg`,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'El Sayed Shehata Group',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/${locale}/products/${product.slug}`,
      priceCurrency: product.currency || 'EGP',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'El Sayed Shehata Group',
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  return (
    <Script
      id={`product-schema-${product.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Local Business Schema (for company pages)
interface LocalBusinessSchemaProps {
  company: {
    name: string
    nameAr?: string
    description?: string
    descriptionAr?: string
    slug: string
    address?: string
    city?: string
    country?: string
    phone?: string
    email?: string
    image?: string
    openingHours?: string[]
  }
  locale: string
}

export function LocalBusinessSchema({ company, locale }: LocalBusinessSchemaProps) {
  const isArabic = locale === 'ar'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/${locale}/companies/${company.slug}`,
    name: isArabic ? company.nameAr || company.name : company.name,
    description: isArabic ? company.descriptionAr || company.description : company.description,
    image: company.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address,
      addressLocality: company.city,
      addressCountry: company.country,
    },
    telephone: company.phone,
    email: company.email,
    url: `https://${company.slug}.alsadara.org`,
    parentOrganization: {
      '@id': `${BASE_URL}/#organization`,
    },
    ...(company.openingHours && {
      openingHoursSpecification: company.openingHours.map((hours) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours,
      })),
    }),
  }

  return (
    <Script
      id={`local-business-schema-${company.slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
