import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Force dynamic generation - don't pre-render at build time
export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

// Static pages for both languages
const staticPages = [
  '',
  '/products',
  '/companies',
  '/about',
  '/contact',
  '/login',
  '/register',
]

// Company subdomains
const companies = [
  { slug: 'industry', name: 'Al Sadara Industry' },
  { slug: 'talah', name: 'Al Talah Al Khadra' },
  { slug: 'polymers', name: 'El Sayed Shehata Polymers' },
  { slug: 'sam', name: 'S.A.M International' },
  { slug: 'qaysar', name: 'Al Qaysar' },
  { slug: 'coderatech', name: 'Coderatech' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []
  const locales = ['ar', 'en']

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : page === '/products' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      })
    }
  }

  // Add company pages
  for (const company of companies) {
    for (const locale of locales) {
      sitemap.push({
        url: `${BASE_URL}/${locale}/companies/${company.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            ar: `${BASE_URL}/ar/companies/${company.slug}`,
            en: `${BASE_URL}/en/companies/${company.slug}`,
          },
        },
      })
    }
  }

  // Try to fetch dynamic content from database
  try {
    const payload = await getPayload({ config })

    // Fetch products
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      where: {
        status: { equals: 'active' },
      },
    })

    // Add product pages
    for (const product of products.docs) {
      for (const locale of locales) {
        sitemap.push({
          url: `${BASE_URL}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              ar: `${BASE_URL}/ar/products/${product.slug}`,
              en: `${BASE_URL}/en/products/${product.slug}`,
            },
          },
        })
      }
    }

    // Fetch categories
    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
    })

    // Add category pages
    for (const category of categories.docs) {
      for (const locale of locales) {
        sitemap.push({
          url: `${BASE_URL}/${locale}/categories/${category.slug}`,
          lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              ar: `${BASE_URL}/ar/categories/${category.slug}`,
              en: `${BASE_URL}/en/categories/${category.slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    // If database is not available, continue with static pages only
    console.warn('Could not fetch dynamic content for sitemap:', error)
  }

  return sitemap
}
