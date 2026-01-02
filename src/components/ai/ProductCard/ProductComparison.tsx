'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, X, ExternalLink } from 'lucide-react'
import type { Product } from '@/payload-types'

/**
 * Product Comparison Component
 * Shows side-by-side comparison of products in chat
 */

interface ProductComparisonProps {
  products: Product[]
  locale: 'ar' | 'en'
  comparisonAspects?: string[] // Specific aspects to highlight
}

export function ProductComparison({ products, locale, comparisonAspects }: ProductComparisonProps) {
  if (products.length < 2) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        {locale === 'ar'
          ? 'يجب تحديد منتجين على الأقل للمقارنة'
          : 'At least 2 products required for comparison'}
      </div>
    )
  }

  // Limit to 4 products max
  const displayProducts = products.slice(0, 4)

  return (
    <div className="overflow-x-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Header with product images and names */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === 'ar' ? 'المواصفة' : 'Specification'}
                </th>
                {displayProducts.map((product) => {
                  const name = locale === 'ar' ? product.nameAr : product.name
                  const firstImage = product.images?.[0]
                  const imageUrl =
                    typeof firstImage === 'object' && typeof firstImage?.image === 'object' && firstImage?.image?.url
                      ? firstImage.image.url
                      : '/placeholder-product.jpg'

                  return (
                    <th
                      key={product.id}
                      className="px-4 py-3 text-center text-xs font-medium text-gray-700"
                    >
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={imageUrl}
                            alt={name || 'Product'}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <span className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {name}
                        </span>
                      </Link>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {/* Price Row */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'السعر' : 'Price'}
                </td>
                {displayProducts.map((product) => {
                  const price = product.price?.toLocaleString('ar-EG') || '0'
                  return (
                    <td key={product.id} className="px-4 py-3 text-center">
                      <span className="text-lg font-bold text-primary-600">{price} جنيه</span>
                    </td>
                  )
                })}
              </tr>

              {/* Stock Row */}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'التوافر' : 'Availability'}
                </td>
                {displayProducts.map((product) => {
                  const inStock = product.stock && product.stock > 0
                  return (
                    <td key={product.id} className="px-4 py-3 text-center">
                      {inStock ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-700">
                          <Check className="w-4 h-4" />
                          {locale === 'ar' ? 'متوفر' : 'In Stock'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-700">
                          <X className="w-4 h-4" />
                          {locale === 'ar' ? 'غير متوفر' : 'Out of Stock'}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Brand Row */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'العلامة التجارية' : 'Brand'}
                </td>
                {displayProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-sm text-gray-700">
                    {product.brand || '-'}
                  </td>
                ))}
              </tr>

              {/* Model Row */}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'الموديل' : 'Model'}
                </td>
                {displayProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-sm text-gray-700">
                    {(product as unknown as { model?: string }).model || '-'}
                  </td>
                ))}
              </tr>

              {/* SKU Row */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'رقم المنتج' : 'SKU'}
                </td>
                {displayProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center text-sm text-gray-700">
                    {product.sku || '-'}
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {locale === 'ar' ? 'الإجراء' : 'Action'}
                </td>
                {displayProducts.map((product) => (
                  <td key={product.id} className="px-4 py-3 text-center">
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors"
                    >
                      {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary/Recommendation */}
      {products.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>{locale === 'ar' ? '💡 توصية:' : '💡 Recommendation:'}</strong>{' '}
            {locale === 'ar'
              ? 'اختر المنتج الأنسب لاحتياجاتك وميزانيتك. يمكنني مساعدتك في الاختيار!'
              : 'Choose the product that best fits your needs and budget. I can help you decide!'}
          </p>
        </div>
      )}
    </div>
  )
}
