import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/products/ProductCard'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { NoProducts } from '@/components/shared/EmptyState'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Package, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

// Product type options for filters
const productTypes = [
  { value: 'cctv', labelEn: 'CCTV Cameras', labelAr: 'كاميرات المراقبة' },
  { value: 'access-control', labelEn: 'Access Control', labelAr: 'أجهزة الحضور والانصراف' },
  { value: 'intercom', labelEn: 'Intercom', labelAr: 'الإنتركم' },
  { value: 'pbx', labelEn: 'PBX Systems', labelAr: 'السنترالات' },
  { value: 'fire-alarm', labelEn: 'Fire Alarm', labelAr: 'إنذار الحريق' },
  { value: 'gps', labelEn: 'GPS Tracking', labelAr: 'تتبع GPS' },
  { value: 'raw-material', labelEn: 'Raw Materials', labelAr: 'الخامات' },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'

  return {
    title: isArabic
      ? 'المنتجات | مجموعة الصدارة القابضة'
      : 'Products | Al Sadara Holding Group',
    description: isArabic
      ? 'تصفح منتجات مجموعة الصدارة - كاميرات مراقبة، أنظمة تحكم، إنتركم، سنترالات، أجهزة إنذار الحريق وتتبع GPS. منتجات إلكترونية عالية الجودة.'
      : 'Browse Al Sadara products - CCTV cameras, access control, intercom, PBX systems, fire alarms and GPS tracking. High-quality electronic products.',
    keywords: isArabic
      ? ['منتجات الصدارة', 'كاميرات مراقبة', 'أنظمة أمان', 'إلكترونيات', 'سنترالات', 'إنتركم']
      : ['Al Sadara products', 'CCTV cameras', 'security systems', 'electronics', 'PBX', 'intercom'],
    alternates: {
      canonical: `${BASE_URL}/${locale}/products`,
      languages: {
        'ar': `${BASE_URL}/ar/products`,
        'en': `${BASE_URL}/en/products`,
      },
    },
    openGraph: {
      title: isArabic ? 'تصفح منتجاتنا' : 'Browse Our Products',
      description: isArabic
        ? 'منتجات إلكترونية عالية الجودة من مجموعة الصدارة'
        : 'High-quality electronic products from Al Sadara Group',
      url: `${BASE_URL}/${locale}/products`,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/images/og-products.jpg`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'منتجات مجموعة الصدارة' : 'Al Sadara Products',
        },
      ],
    },
  }
}

interface ProductsPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{
    category?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    page?: string
  }>
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params
  const filters = await searchParams
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  const breadcrumbItems = [
    { label: dict.common.products },
  ]

  // Get products from Payload
  let products: any[] = []
  let categories: any[] = []
  let totalProducts = 0

  try {
    const payload = await getPayload({ config })

    // Build query
    const query: any = {
      collection: 'products',
      limit: 12,
      page: parseInt(filters.page || '1'),
      where: {
        status: { equals: 'published' },
      },
    }

    // Apply filters
    if (filters.category) {
      query.where.category = { equals: filters.category }
    }
    if (filters.type) {
      query.where.productType = { equals: filters.type }
    }
    if (filters.minPrice) {
      query.where.price = { ...query.where.price, greater_than_equal: parseInt(filters.minPrice) }
    }
    if (filters.maxPrice) {
      query.where.price = { ...query.where.price, less_than_equal: parseInt(filters.maxPrice) }
    }
    if (filters.search) {
      query.where.or = [
        { name: { contains: filters.search } },
        { nameAr: { contains: filters.search } },
      ]
    }

    const result = await payload.find(query)
    products = result.docs
    totalProducts = result.totalDocs

    // Get categories for filter
    const categoriesResult = await payload.find({
      collection: 'categories',
      limit: 100,
    })
    categories = categoriesResult.docs
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  const currentPage = parseInt(filters.page || '1')
  const totalPages = Math.ceil(totalProducts / 12)

  // Generate structured data for CollectionPage
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRTL ? 'منتجات مجموعة الصدارة' : 'Al Sadara Products',
    description: isRTL
      ? 'تصفح منتجات مجموعة الصدارة الإلكترونية'
      : 'Browse Al Sadara electronic products',
    url: `${BASE_URL}/${locale}/products`,
    numberOfItems: totalProducts,
    provider: {
      '@type': 'Organization',
      name: isRTL ? 'مجموعة الصدارة القابضة' : 'Al Sadara Holding Group',
    },
  }

  const content = {
    ar: {
      title: 'منتجاتنا',
      subtitle: 'تصفح مجموعتنا المتنوعة من المنتجات الإلكترونية عالية الجودة',
      showing: `عرض ${totalProducts} منتج`,
      filter: 'تصفية النتائج',
      search: 'بحث',
      searchPlaceholder: 'ابحث في المنتجات...',
      categories: 'الفئات',
      all: 'الكل',
      productType: 'نوع المنتج',
      priceRange: 'نطاق السعر',
      minPrice: 'من',
      maxPrice: 'إلى',
      clearFilters: 'مسح الفلاتر',
      page: 'صفحة',
      of: 'من',
    },
    en: {
      title: 'Our Products',
      subtitle: 'Browse our diverse collection of high-quality electronic products',
      showing: `Showing ${totalProducts} products`,
      filter: 'Filter Results',
      search: 'Search',
      searchPlaceholder: 'Search products...',
      categories: 'Categories',
      all: 'All',
      productType: 'Product Type',
      priceRange: 'Price Range',
      minPrice: 'Min',
      maxPrice: 'Max',
      clearFilters: 'Clear Filters',
      page: 'Page',
      of: 'of',
    },
  }

  const t = content[locale]

  const hasActiveFilters = filters.category || filters.type || filters.search || filters.minPrice || filters.maxPrice

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-secondary-50">
        {/* Hero Header */}
        <section className="relative py-16 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
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

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <Package className="w-4 h-4 text-primary-400" />
                <span className="text-white/90 text-sm font-medium">{t.showing}</span>
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t.title}
              </h1>

              <p className="text-xl text-white/80">
                {t.subtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-secondary-100 sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-primary-600" />
                  <h2 className="font-bold text-lg text-secondary-900">{t.filter}</h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.search}
                  </label>
                  <form>
                    <input
                      type="text"
                      name="search"
                      defaultValue={filters.search}
                      placeholder={t.searchPlaceholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </form>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.categories}
                  </label>
                  <div className="space-y-1">
                    <Link
                      href={`/${locale}/products`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        !filters.category
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'hover:bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      {t.all}
                    </Link>
                    {categories.map((cat: any) => (
                      <Link
                        key={cat.id}
                        href={`/${locale}/products?category=${cat.id}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.category === cat.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'hover:bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {isRTL ? cat.nameAr : cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Product Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.productType}
                  </label>
                  <div className="space-y-1">
                    {productTypes.map((type) => (
                      <Link
                        key={type.value}
                        href={`/${locale}/products?type=${type.value}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          filters.type === type.value
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'hover:bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {isRTL ? type.labelAr : type.labelEn}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {t.priceRange}
                  </label>
                  <form className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={filters.minPrice}
                      placeholder={t.minPrice}
                      className="w-1/2 px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={filters.maxPrice}
                      placeholder={t.maxPrice}
                      className="w-1/2 px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </form>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Link
                    href={`/${locale}/products`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-secondary-200 text-secondary-600 hover:bg-secondary-100 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    {t.clearFilters}
                  </Link>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-center mt-12 gap-2">
                      {currentPage > 1 && (
                        <Link
                          href={`/${locale}/products?page=${currentPage - 1}`}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                        >
                          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                          {dict.common.previous}
                        </Link>
                      )}

                      <div className="flex items-center gap-1 px-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                          .map((page, idx, arr) => (
                            <span key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 text-secondary-400">...</span>
                              )}
                              <Link
                                href={`/${locale}/products?page=${page}`}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                                  page === currentPage
                                    ? 'bg-primary-600 text-white font-bold'
                                    : 'bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50'
                                }`}
                              >
                                {page}
                              </Link>
                            </span>
                          ))}
                      </div>

                      {currentPage < totalPages && (
                        <Link
                          href={`/${locale}/products?page=${currentPage + 1}`}
                          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-secondary-200 text-secondary-600 hover:bg-secondary-50 transition-colors"
                        >
                          {dict.common.next}
                          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <NoProducts />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
