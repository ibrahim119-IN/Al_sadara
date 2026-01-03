import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/products/ProductCard'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { Grid3X3 } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

interface CategoryPageProps {
  params: Promise<{ locale: Locale; slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const isArabic = locale === 'ar'

  let categoryName = isArabic ? 'الفئة' : 'Category'
  let categoryDescription = ''

  try {
    const payload = await getPayload({ config })
    const categoryResult = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (categoryResult.docs[0]) {
      const category = categoryResult.docs[0]
      categoryName = isArabic ? (category.nameAr || category.name) : category.name
      categoryDescription = isArabic ? (category.descriptionAr || category.description || '') : (category.description || '')
    }
  } catch (error) {
    console.error('Error fetching category for metadata:', error)
  }

  return {
    title: `${categoryName} | ${isArabic ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group'}`,
    description: categoryDescription || (isArabic
      ? `تصفح منتجات ${categoryName} من مجموعة السيد شحاتة`
      : `Browse ${categoryName} products from El Sayed Shehata Group`),
    alternates: {
      canonical: `${BASE_URL}/${locale}/categories/${slug}`,
      languages: {
        'ar': `${BASE_URL}/ar/categories/${slug}`,
        'en': `${BASE_URL}/en/categories/${slug}`,
      },
    },
    openGraph: {
      title: categoryName,
      description: categoryDescription || (isArabic
        ? `تصفح منتجات ${categoryName}`
        : `Browse ${categoryName} products`),
      url: `${BASE_URL}/${locale}/categories/${slug}`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, slug } = await params
  const filters = await searchParams
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  // Get category and products from Payload
  let category: any = null
  let products: any[] = []
  let totalProducts = 0

  try {
    const payload = await getPayload({ config })

    // Get category
    const categoryResult = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })
    category = categoryResult.docs[0]

    if (category) {
      // Get products in this category
      const productsResult = await payload.find({
        collection: 'products',
        where: {
          category: { equals: category.id },
          status: { equals: 'published' },
        },
        limit: 12,
        page: parseInt(filters.page || '1'),
      })
      products = productsResult.docs
      totalProducts = productsResult.totalDocs
    }
  } catch (error) {
    console.error('Error fetching category:', error)
  }

  if (!category) {
    notFound()
  }

  const categoryName = isRTL ? category.nameAr : category.name
  const categoryDescription = isRTL ? category.descriptionAr : category.description

  const currentPage = parseInt(filters.page || '1')
  const totalPages = Math.ceil(totalProducts / 12)

  const breadcrumbItems = [
    { label: dict.common.products, href: `/${locale}/products` },
    { label: categoryName },
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Header */}
      <section className="relative py-12 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <SimpleBreadcrumb
            items={breadcrumbItems}
            locale={locale}
            className="mb-6 [&_a]:text-white/70 [&_a:hover]:text-white [&_span]:text-white [&_svg]:text-white/50"
          />

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              {category.image?.url ? (
                <img
                  src={category.image.url}
                  alt={categoryName}
                  className="w-12 h-12 object-cover rounded-xl"
                />
              ) : (
                <Grid3X3 className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {categoryName}
              </h1>
              <p className="text-white/80 mt-1">
                {categoryDescription || (isRTL
                  ? `${totalProducts} منتج في هذه الفئة`
                  : `${totalProducts} products in this category`)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  dict={dict}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale}/categories/${slug}?page=${currentPage - 1}`}
                    className="btn btn-secondary"
                  >
                    {dict.common.previous}
                  </Link>
                )}
                <span className="px-4 py-2 text-secondary-600">
                  {isRTL
                    ? `صفحة ${currentPage} من ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/${locale}/categories/${slug}?page=${currentPage + 1}`}
                    className="btn btn-secondary"
                  >
                    {dict.common.next}
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-secondary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {dict.common.noResults}
            </h3>
            <p className="text-secondary-600 mb-4">
              {isRTL
                ? 'لا توجد منتجات في هذه الفئة حالياً.'
                : 'No products in this category yet.'}
            </p>
            <Link href={`/${locale}/products`} className="btn btn-primary">
              {isRTL ? 'تصفح جميع المنتجات' : 'Browse All Products'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
