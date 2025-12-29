'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import type { Product } from '@/payload-types'

/**
 * AI Product Card Component
 * Displays product information in chat messages
 */

interface AIProductCardProps {
  product: Product
  locale: 'ar' | 'en'
  onAddToCart?: (product: Product) => void
  similarity?: number // Relevance score from RAG
}

export function AIProductCard({ product, locale, onAddToCart, similarity }: AIProductCardProps) {
  const name = locale === 'ar' ? product.nameAr : product.name
  const description = locale === 'ar' ? product.descriptionAr : product.description

  // Get first image
  const imageUrl =
    typeof product.images?.[0] === 'object' && product.images[0]?.url
      ? product.images[0].url
      : '/placeholder-product.jpg'

  // Format price
  const price = product.price?.toLocaleString('ar-EG') || '0'

  // Stock status
  const inStock = product.stock && product.stock > 0
  const stockText = inStock
    ? locale === 'ar'
      ? `متوفر (${product.stock})`
      : `In Stock (${product.stock})`
    : locale === 'ar'
      ? 'غير متوفر'
      : 'Out of Stock'

  return (
    <div
      className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Product Image */}
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden bg-gray-100"
      >
        <Image
          src={imageUrl}
          alt={name || 'Product'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="font-semibold text-sm text-gray-900 hover:text-primary-600 line-clamp-2"
        >
          {name}
        </Link>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-500 mt-0.5">
            {locale === 'ar' ? 'رقم المنتج' : 'SKU'}: {product.sku}
          </p>
        )}

        {/* Price & Stock */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-primary-600">{price} جنيه</span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {stockText}
          </span>
        </div>

        {/* Similarity Score (if available) */}
        {similarity && similarity > 0.7 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">
              {locale === 'ar' ? 'توصية قوية' : 'Highly Recommended'}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded transition-colors"
          >
            <Eye className="w-3 h-3" />
            {locale === 'ar' ? 'التفاصيل' : 'Details'}
          </Link>

          {inStock && onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              {locale === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
