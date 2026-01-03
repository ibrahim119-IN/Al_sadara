import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import { SimpleBreadcrumb } from '@/components/shared/Breadcrumb'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ShoppingCart, FileText, Share2, Heart, Truck, Shield, RefreshCw, CheckCircle, Minus, Plus } from 'lucide-react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsadara.org'

interface ProductPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const isArabic = locale === 'ar'

  let product: any = null

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    product = result.docs[0]
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
  }

  if (!product) {
    return {
      title: isArabic ? 'منتج غير موجود' : 'Product Not Found',
    }
  }

  const name = isArabic ? product.nameAr || product.name : product.name
  const description = isArabic
    ? product.descriptionAr?.replace(/<[^>]*>/g, '').substring(0, 160) || product.description?.replace(/<[^>]*>/g, '').substring(0, 160)
    : product.description?.replace(/<[^>]*>/g, '').substring(0, 160)
  const imageUrl = product.images?.[0]?.image?.url || `${BASE_URL}/images/og-products.jpg`

  return {
    title: isArabic
      ? `${name} | مجموعة شركات السيد شحاتة`
      : `${name} | El Sayed Shehata Group`,
    description,
    keywords: isArabic
      ? [name, 'منتجات السيد شحاتة', product.category?.nameAr, 'بوليمرات', 'بلاستيك'].filter(Boolean)
      : [name, 'El Sayed Shehata products', product.category?.name, 'polymers', 'plastics'].filter(Boolean),
    alternates: {
      canonical: `${BASE_URL}/${locale}/products/${slug}`,
      languages: {
        'ar': `${BASE_URL}/ar/products/${slug}`,
        'en': `${BASE_URL}/en/products/${slug}`,
      },
    },
    openGraph: {
      title: name,
      description,
      url: `${BASE_URL}/${locale}/products/${slug}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale)
  const isRTL = locale === 'ar'

  // Get product from Payload
  let product: any = null

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })
    product = result.docs[0]
  } catch (error) {
    console.error('Error fetching product:', error)
  }

  if (!product) {
    notFound()
  }

  const name = isRTL ? product.nameAr || product.name : product.name
  const description = isRTL ? product.descriptionAr || product.description : product.description
  const categoryName = product.category
    ? (isRTL ? product.category.nameAr : product.category.name)
    : null

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const stockStatus = product.stock <= 0
    ? 'out'
    : product.stock <= 5
      ? 'low'
      : 'in'

  const stockText = stockStatus === 'out'
    ? dict.product.outOfStock
    : stockStatus === 'low'
      ? dict.product.lowStock
      : dict.product.inStock

  const stockColor = stockStatus === 'out'
    ? 'text-red-600 bg-red-100'
    : stockStatus === 'low'
      ? 'text-orange-600 bg-orange-100'
      : 'text-green-600 bg-green-100'

  // Breadcrumb items
  const breadcrumbItems = [
    { label: dict.common.products, href: `/${locale}/products` },
    ...(categoryName ? [{ label: categoryName, href: `/${locale}/categories/${product.category?.slug}` }] : []),
    { label: name },
  ]

  // Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description?.replace(/<[^>]*>/g, ''),
    image: product.images?.map((img: any) => img.image?.url).filter(Boolean) || [],
    sku: product.sku,
    brand: {
      '@type': 'Organization',
      name: isRTL ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/${locale}/products/${slug}`,
      priceCurrency: 'EGP',
      price: product.price,
      availability: stockStatus === 'out'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: isRTL ? 'مجموعة شركات السيد شحاتة' : 'El Sayed Shehata Group',
      },
    },
    ...(product.category && {
      category: categoryName,
    }),
  }

  const content = {
    ar: {
      sku: 'رمز المنتج',
      requestQuote: 'طلب عرض سعر',
      specifications: 'المواصفات',
      downloadDatasheet: 'تحميل المواصفات الفنية',
      share: 'مشاركة',
      wishlist: 'المفضلة',
      features: [
        { icon: Truck, text: 'شحن مجاني للطلبات فوق 500 ج.م' },
        { icon: Shield, text: 'ضمان أصلي من المصنع' },
        { icon: RefreshCw, text: 'إرجاع خلال 14 يوم' },
      ],
    },
    en: {
      sku: 'SKU',
      requestQuote: 'Request Quote',
      specifications: 'Specifications',
      downloadDatasheet: 'Download Datasheet',
      share: 'Share',
      wishlist: 'Wishlist',
      features: [
        { icon: Truck, text: 'Free shipping for orders over 500 EGP' },
        { icon: Shield, text: 'Original manufacturer warranty' },
        { icon: RefreshCw, text: '14-day return policy' },
      ],
    },
  }

  const t = content[locale]

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-secondary-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-secondary-100">
          <div className="container mx-auto px-4 py-4">
            <SimpleBreadcrumb items={breadcrumbItems} locale={locale} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Images */}
              <div className="p-6 lg:p-10 bg-secondary-50">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow-sm">
                  {product.images?.[0]?.image?.url ? (
                    <Image
                      src={product.images[0].image.url}
                      alt={product.images[0].alt || name}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-300">
                      <ShoppingCart className="w-24 h-24" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img: any, index: number) => (
                      <div
                        key={index}
                        className="aspect-square bg-white rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all shadow-sm"
                      >
                        {img.image?.url && (
                          <Image
                            src={img.image.url}
                            alt={img.alt || `${name} ${index + 1}`}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 lg:p-10">
                {/* Category & Discount Badge */}
                <div className="flex items-center gap-3 mb-4">
                  {categoryName && (
                    <Link
                      href={`/${locale}/categories/${product.category?.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-3 py-1 rounded-full"
                    >
                      {categoryName}
                    </Link>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
                  {name}
                </h1>

                {/* SKU */}
                {product.sku && (
                  <p className="text-sm text-secondary-500 mb-4">
                    {t.sku}: <span className="font-mono">{product.sku}</span>
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary-600">
                    {product.price.toLocaleString()} {dict.common.currency}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl text-secondary-400 line-through">
                      {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6 ${stockColor}`}>
                  <CheckCircle className="w-4 h-4" />
                  {stockText}
                </div>

                {/* Description */}
                {description && (
                  <div className="prose prose-secondary mb-8 max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: description }} />
                  </div>
                )}

                {/* Add to Cart */}
                <div className="space-y-4 mb-8">
                  <AddToCartButton
                    product={{
                      id: String(product.id),
                      name: product.name,
                      nameAr: product.nameAr || '',
                      slug: product.slug,
                      price: product.price,
                      images: product.images?.map((img: { image: { url?: string } | number; alt?: string | null }) => ({
                        image: { url: typeof img.image === 'object' ? img.image?.url || '' : '' },
                        alt: img.alt || undefined,
                      })),
                      stock: product.stock ?? 0,
                    }}
                    label={dict.common.addToCart}
                    disabled={stockStatus === 'out'}
                    className="w-full py-4 rounded-xl font-bold text-lg"
                    showQuantity
                  />

                  {/* Secondary Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/${locale}/quote-request?product=${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-secondary-200 text-secondary-700 hover:bg-secondary-50 font-semibold transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      {t.requestQuote}
                    </Link>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-secondary-200 text-secondary-400 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-secondary-200 text-secondary-400 hover:text-primary-600 hover:border-primary-200 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-secondary-100 pt-6 space-y-3">
                  {t.features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex items-center gap-3 text-secondary-600">
                        <Icon className="w-5 h-5 text-primary-600" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-secondary-100 p-6 lg:p-10">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">{t.specifications}</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.specifications.map((spec: any, index: number) => (
                    <div key={index} className="bg-secondary-50 p-4 rounded-xl">
                      <dt className="text-sm text-secondary-500 mb-1">
                        {isRTL ? spec.keyAr || spec.key : spec.key}
                      </dt>
                      <dd className="font-semibold text-secondary-900">
                        {isRTL ? spec.valueAr || spec.value : spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Datasheet */}
            {product.datasheet?.url && (
              <div className="border-t border-secondary-100 p-6 lg:p-10">
                <a
                  href={product.datasheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-secondary-900 hover:bg-secondary-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  {t.downloadDatasheet}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
