'use client'

import Link from 'next/link'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface CartContentProps {
  locale: Locale
  dict: Dictionary
}

export function CartContent({ locale, dict }: CartContentProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading,
  } = useCart()
  const isRTL = locale === 'ar'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          {dict.common.emptyCart}
        </h2>
        <p className="text-secondary-600 mb-6 max-w-md">
          {isRTL
            ? 'لم تضف أي منتجات إلى السلة بعد. تصفح منتجاتنا وابدأ التسوق!'
            : "You haven't added any products to your cart yet. Browse our products and start shopping!"}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {dict.common.continueShopping}
          <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-secondary-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200">
            <h2 className="font-bold text-secondary-900">
              {dict.cart.title} ({totalItems} {totalItems === 1 ? dict.cart.item : dict.cart.items})
            </h2>
            <button
              onClick={clearCart}
              className="text-sm text-error-600 hover:text-error-700 font-medium"
            >
              {isRTL ? 'إفراغ السلة' : 'Clear Cart'}
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-secondary-200">
            {items.map((item) => {
              const name = isRTL ? item.product.nameAr : item.product.name
              const imageUrl = item.product.images?.[0]?.image?.url || null
              const subtotal = item.product.price * item.quantity

              return (
                <div key={item.id} className="p-4 sm:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link
                      href={`/${locale}/products/${item.product.slug}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-300">
                          <ShoppingBag className="w-10 h-10" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/${locale}/products/${item.product.slug}`}
                            className="font-bold text-secondary-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {name}
                          </Link>
                          {item.product.category && (
                            <p className="text-sm text-secondary-500 mt-1">
                              {isRTL ? item.product.category.nameAr : item.product.category.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="mt-2">
                        <span className="text-lg font-bold text-primary-600">
                          {item.product.price.toLocaleString()} {dict.common.currency}
                        </span>
                        {item.product.compareAtPrice && (
                          <span className="text-sm text-secondary-400 line-through ms-2">
                            {item.product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-secondary-600">{dict.common.quantity}:</span>
                          <div className="flex items-center gap-2 bg-secondary-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-secondary-600 hover:text-primary-600 transition-colors shadow-sm"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-secondary-600 hover:text-primary-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="text-sm text-secondary-500">{dict.common.total}:</span>
                          <p className="text-lg font-bold text-secondary-900">
                            {subtotal.toLocaleString()} {dict.common.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Continue Shopping */}
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-6"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          {dict.common.continueShopping}
        </Link>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl border border-secondary-200 p-6 sticky top-24">
          <h3 className="text-lg font-bold text-secondary-900 mb-6">
            {dict.checkout.orderSummary}
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-secondary-600">
              <span>{dict.cart.subtotal}</span>
              <span>{totalPrice.toLocaleString()} {dict.common.currency}</span>
            </div>
            <div className="flex justify-between text-secondary-600">
              <span>{dict.cart.shipping}</span>
              <span className="text-success-600">{isRTL ? 'سيتم حسابه' : 'Calculated at checkout'}</span>
            </div>
            <hr className="border-secondary-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>{dict.cart.orderTotal}</span>
              <span className="text-primary-600">{totalPrice.toLocaleString()} {dict.common.currency}</span>
            </div>
          </div>

          <Link
            href={`/${locale}/checkout`}
            className="w-full mt-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-center transition-colors shadow-soft hover:shadow-medium flex items-center justify-center gap-2"
          >
            {dict.cart.proceedToCheckout}
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <div className="flex flex-col gap-3 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{isRTL ? 'دفع آمن ومضمون' : 'Secure & Safe Payment'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{isRTL ? 'ضمان على جميع المنتجات' : 'Warranty on All Products'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>{isRTL ? 'دفع عند الاستلام متاح' : 'Cash on Delivery Available'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
