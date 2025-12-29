'use client'

import { ClipboardList, MapPin, CreditCard, ShoppingBag, Edit2 } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { ShippingAddress } from './ShippingForm'
import type { PaymentMethod } from './PaymentMethods'
import type { CartItem } from '@/hooks/useCart'

interface OrderReviewProps {
  locale: Locale
  dict: Dictionary
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  customerNotes?: string
  totalPrice: number
  onEditShipping: () => void
  onEditPayment: () => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function OrderReview({
  locale,
  dict,
  items,
  shippingAddress,
  paymentMethod,
  customerNotes,
  totalPrice,
  onEditShipping,
  onEditPayment,
  onSubmit,
  isSubmitting = false,
}: OrderReviewProps) {
  const isRTL = locale === 'ar'

  const paymentMethodNames: Record<PaymentMethod, { en: string; ar: string }> = {
    'bank-transfer': { en: 'Bank Transfer', ar: 'تحويل بنكي' },
    'vodafone-cash': { en: 'Vodafone Cash', ar: 'فودافون كاش' },
    'cash-on-delivery': { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
  }

  const shippingCost = paymentMethod === 'cash-on-delivery' ? 50 : 0
  const orderTotal = totalPrice + shippingCost

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-secondary-900">
          {dict.checkout.orderSummary}
        </h3>
      </div>

      {/* Shipping Address */}
      <div className="bg-secondary-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            <h4 className="font-medium text-secondary-900">
              {dict.checkout.shippingInfo}
            </h4>
          </div>
          <button
            type="button"
            onClick={onEditShipping}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {dict.common.edit}
          </button>
        </div>
        <div className="text-secondary-600 space-y-1">
          <p className="font-medium text-secondary-900">{shippingAddress.fullName}</p>
          <p dir="ltr" className={isRTL ? 'text-end' : ''}>{shippingAddress.phone}</p>
          <p>{shippingAddress.address}</p>
          <p>
            {shippingAddress.city}، {shippingAddress.governorate}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-secondary-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary-600" />
            <h4 className="font-medium text-secondary-900">
              {dict.checkout.paymentMethod}
            </h4>
          </div>
          <button
            type="button"
            onClick={onEditPayment}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
          >
            <Edit2 className="w-4 h-4" />
            {dict.common.edit}
          </button>
        </div>
        <p className="text-secondary-900 font-medium">
          {isRTL
            ? paymentMethodNames[paymentMethod].ar
            : paymentMethodNames[paymentMethod].en}
        </p>
        {customerNotes && (
          <div className="mt-3 pt-3 border-t border-secondary-200">
            <p className="text-sm text-secondary-500">{dict.checkout.notes}:</p>
            <p className="text-secondary-700 mt-1">{customerNotes}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="bg-secondary-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-4 h-4 text-primary-600" />
          <h4 className="font-medium text-secondary-900">
            {isRTL ? 'المنتجات' : 'Products'} ({items.length})
          </h4>
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const name = isRTL ? item.product.nameAr : item.product.name
            const imageUrl = item.product.images?.[0]?.image?.url || null
            const subtotal = item.product.price * item.quantity

            return (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-300">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900 line-clamp-1">{name}</p>
                  <p className="text-sm text-secondary-500">
                    {item.quantity} × {item.product.price.toLocaleString()} {dict.common.currency}
                  </p>
                </div>
                <p className="font-bold text-secondary-900 flex-shrink-0">
                  {subtotal.toLocaleString()} {dict.common.currency}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Total */}
      <div className="bg-white border border-secondary-200 rounded-xl p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-secondary-600">
            <span>{dict.cart.subtotal}</span>
            <span>{totalPrice.toLocaleString()} {dict.common.currency}</span>
          </div>
          <div className="flex justify-between text-secondary-600">
            <span>{dict.cart.shipping}</span>
            <span>
              {shippingCost === 0
                ? isRTL
                  ? 'مجاناً'
                  : 'Free'
                : `${shippingCost.toLocaleString()} ${dict.common.currency}`}
            </span>
          </div>
          <hr className="border-secondary-200" />
          <div className="flex justify-between text-lg font-bold">
            <span>{dict.cart.orderTotal}</span>
            <span className="text-primary-600">
              {orderTotal.toLocaleString()} {dict.common.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Terms Notice */}
      <p className="text-sm text-secondary-500 text-center">
        {isRTL
          ? 'بالضغط على "تأكيد الطلب" فإنك توافق على شروط الاستخدام وسياسة الخصوصية'
          : 'By clicking "Place Order" you agree to our Terms of Service and Privacy Policy'}
      </p>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-medium"
      >
        {isSubmitting
          ? isRTL
            ? 'جاري إتمام الطلب...'
            : 'Placing Order...'
          : dict.checkout.placeOrder}
      </button>
    </div>
  )
}
