'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import type { Locale } from '@/lib/i18n/config'

interface CartBadgeProps {
  locale: Locale
}

export function CartBadge({ locale }: CartBadgeProps) {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      className="p-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-0 -end-0 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
