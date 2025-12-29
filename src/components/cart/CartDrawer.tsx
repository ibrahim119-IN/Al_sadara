'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface CartDrawerProps {
  locale: Locale
  dict: Dictionary
}

export function CartDrawer({ locale, dict }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
    isLoading,
  } = useCart()
  const isRTL = locale === 'ar'
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`absolute top-0 ${isRTL ? 'start-0' : 'end-0'} h-full w-full max-w-md bg-white shadow-hard animate-slide-in-right flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-secondary-900">
              {dict.cart.title}
            </h2>
            {totalItems > 0 && (
              <span className="text-sm text-secondary-500">
                ({totalItems} {totalItems === 1 ? dict.cart.item : dict.cart.items})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-secondary-300 mb-4" />
              <p className="text-secondary-600 mb-4">{dict.common.emptyCart}</p>
              <Link
                href={`/${locale}/products`}
                onClick={closeCart}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                {dict.common.continueShopping}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const name = isRTL ? item.product.nameAr : item.product.name
                const imageUrl = item.product.images?.[0]?.image?.url || null

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-secondary-50 rounded-xl"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-300">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/${locale}/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-medium text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2"
                      >
                        {name}
                      </Link>

                      <p className="text-primary-600 font-bold mt-1">
                        {item.product.price.toLocaleString()} {dict.common.currency}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-secondary-200 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-secondary-600">{dict.cart.subtotal}</span>
              <span className="text-xl font-bold text-secondary-900">
                {totalPrice.toLocaleString()} {dict.common.currency}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Link
                href={`/${locale}/checkout`}
                onClick={closeCart}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-center transition-colors shadow-soft hover:shadow-medium"
              >
                {dict.cart.proceedToCheckout}
              </Link>
              <Link
                href={`/${locale}/cart`}
                onClick={closeCart}
                className="w-full py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-xl text-center transition-colors"
              >
                {dict.common.cart}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
