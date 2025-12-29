'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import type { LucideIcon } from 'lucide-react'
import { Package, ShoppingCart, Search, FileText, Users, MapPin } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  iconType?: 'products' | 'cart' | 'search' | 'orders' | 'users' | 'locations'
  title: string
  titleAr?: string
  description?: string
  descriptionAr?: string
  actionLabel?: string
  actionLabelAr?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  products: Package,
  cart: ShoppingCart,
  search: Search,
  orders: FileText,
  users: Users,
  locations: MapPin,
}

export function EmptyState({
  icon: CustomIcon,
  iconType,
  title,
  titleAr,
  description,
  descriptionAr,
  actionLabel,
  actionLabelAr,
  actionHref,
  onAction,
  className = '',
}: EmptyStateProps) {
  const { locale, isArabic } = useLocale()

  const Icon = CustomIcon || (iconType && iconMap[iconType]) || Package
  const displayTitle = isArabic && titleAr ? titleAr : title
  const displayDescription = isArabic && descriptionAr ? descriptionAr : description
  const displayAction = isArabic && actionLabelAr ? actionLabelAr : actionLabel

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-secondary-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
        {displayTitle}
      </h3>

      {/* Description */}
      {displayDescription && (
        <p className="text-secondary-600 max-w-md mb-6">
          {displayDescription}
        </p>
      )}

      {/* Action Button */}
      {displayAction && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            {displayAction}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            {displayAction}
          </button>
        )
      )}
    </div>
  )
}

// Pre-configured empty states
export function EmptyCart({ className = '' }: { className?: string }) {
  const { locale, isArabic } = useLocale()

  return (
    <EmptyState
      iconType="cart"
      title="Your cart is empty"
      titleAr="السلة فارغة"
      description="Looks like you haven't added anything to your cart yet."
      descriptionAr="يبدو أنك لم تضف أي منتجات إلى سلتك بعد."
      actionLabel="Browse Products"
      actionLabelAr="تصفح المنتجات"
      actionHref={`/${locale}/products`}
      className={className}
    />
  )
}

export function NoSearchResults({ query, className = '' }: { query: string; className?: string }) {
  const { locale, isArabic } = useLocale()

  return (
    <EmptyState
      iconType="search"
      title="No results found"
      titleAr="لا توجد نتائج"
      description={`We couldn't find any results for "${query}". Try adjusting your search.`}
      descriptionAr={`لم نتمكن من العثور على نتائج لـ "${query}". جرب تعديل البحث.`}
      actionLabel="Clear Search"
      actionLabelAr="مسح البحث"
      actionHref={`/${locale}/products`}
      className={className}
    />
  )
}

export function NoOrders({ className = '' }: { className?: string }) {
  const { locale, isArabic } = useLocale()

  return (
    <EmptyState
      iconType="orders"
      title="No orders yet"
      titleAr="لا توجد طلبات"
      description="You haven't placed any orders yet. Start shopping to see your orders here."
      descriptionAr="لم تقم بأي طلبات بعد. ابدأ التسوق لرؤية طلباتك هنا."
      actionLabel="Start Shopping"
      actionLabelAr="ابدأ التسوق"
      actionHref={`/${locale}/products`}
      className={className}
    />
  )
}

export function NoProducts({ className = '' }: { className?: string }) {
  const { locale, isArabic } = useLocale()

  return (
    <EmptyState
      iconType="products"
      title="No products found"
      titleAr="لا توجد منتجات"
      description="There are no products matching your criteria. Try adjusting your filters."
      descriptionAr="لا توجد منتجات مطابقة للمعايير. جرب تعديل الفلاتر."
      actionLabel="View All Products"
      actionLabelAr="عرض كل المنتجات"
      actionHref={`/${locale}/products`}
      className={className}
    />
  )
}
