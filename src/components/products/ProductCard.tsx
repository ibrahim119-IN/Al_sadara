import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { Eye, Heart, Image, Star, Check, AlertCircle, XCircle } from 'lucide-react'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

interface Product {
  id: string
  name: string
  nameAr: string
  slug: string
  price: number
  compareAtPrice?: number
  images?: Array<{ image: { url: string }; alt?: string }>
  stock: number
  category?: {
    name: string
    nameAr: string
    slug: string
  }
  featured?: boolean
}

interface ProductCardProps {
  product: Product
  locale: Locale
  dict: {
    common: {
      addToCart: string
      viewDetails: string
      currency: string
    }
    product: {
      inStock: string
      outOfStock: string
      lowStock: string
    }
  }
}

export function ProductCard({ product, locale, dict }: ProductCardProps) {
  const isRTL = locale === 'ar'
  const name = isRTL ? product.nameAr : product.name
  const categoryName = product.category
    ? (isRTL ? product.category.nameAr : product.category.name)
    : null

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  const stockStatus = product.stock <= 0
    ? 'out'
    : product.stock <= 5
      ? 'low'
      : 'in'

  const stockConfig = {
    out: {
      text: dict.product.outOfStock,
      icon: XCircle,
      className: 'text-error-600 bg-error-50',
    },
    low: {
      text: dict.product.lowStock,
      icon: AlertCircle,
      className: 'text-warning-600 bg-warning-50',
    },
    in: {
      text: dict.product.inStock,
      icon: Check,
      className: 'text-success-600 bg-success-50',
    },
  }

  const stock = stockConfig[stockStatus]
  const StockIcon = stock.icon
  const imageUrl = product.images?.[0]?.image?.url || null

  return (
    <div className="group bg-white rounded-3xl border border-secondary-100 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500">
      {/* Image Container */}
      <div className="relative">
        <Link href={`/${locale}/products/${product.slug}`}>
          <div className="aspect-square bg-gradient-to-br from-secondary-50 to-secondary-100 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.images?.[0]?.alt || name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary-300">
                <Image className="w-20 h-20" />
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-4 start-4 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
              {isRTL ? 'مميز' : 'Featured'}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 end-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button
            className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-secondary-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110"
            title={isRTL ? 'إضافة للمفضلة' : 'Add to wishlist'}
          >
            <Heart className="w-5 h-5" />
          </button>
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-secondary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 hover:scale-110"
            title={dict.common.viewDetails}
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {categoryName && (
          <Link
            href={`/${locale}/categories/${product.category?.slug}`}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold uppercase tracking-wider"
          >
            {categoryName}
          </Link>
        )}

        {/* Name */}
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="font-bold text-lg text-secondary-900 mt-2 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Rating Placeholder */}
        <div className="flex items-center gap-1.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < 4 ? 'fill-accent-400 text-accent-400' : 'fill-secondary-200 text-secondary-200'}`}
            />
          ))}
          <span className="text-xs text-secondary-500 ms-1">(24)</span>
        </div>

        {/* Stock Status */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl mb-4 ${stock.className}`}>
          <StockIcon className="w-3.5 h-3.5" />
          {stock.text}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl font-bold text-primary-600">
            {product.price.toLocaleString()} {dict.common.currency}
          </span>
          {hasDiscount && (
            <span className="text-sm text-secondary-400 line-through">
              {product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            slug: product.slug,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            images: product.images,
            stock: product.stock,
            category: product.category,
          }}
          disabled={stockStatus === 'out'}
          label={dict.common.addToCart}
          className="w-full py-3.5 rounded-2xl font-semibold shadow-btn hover:shadow-btn-hover transition-all"
        />
      </div>
    </div>
  )
}
