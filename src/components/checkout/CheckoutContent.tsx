'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ShoppingBag, MapPin, CreditCard, ClipboardList } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { ShippingForm, type ShippingAddress } from './ShippingForm'
import { PaymentMethods, type PaymentMethod } from './PaymentMethods'
import { OrderReview } from './OrderReview'
import { OrderConfirmation } from './OrderConfirmation'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface CheckoutContentProps {
  locale: Locale
  dict: Dictionary
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation'

export function CheckoutContent({ locale, dict }: CheckoutContentProps) {
  const { items, totalPrice, clearCart, isLoading } = useCart()
  const { customer, isAuthenticated } = useAuth()
  const isRTL = locale === 'ar'

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>()
  const [customerNotes, setCustomerNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  // Pre-fill shipping address for authenticated users
  useEffect(() => {
    if (isAuthenticated && customer?.addresses && !shippingAddress) {
      const defaultAddress = customer.addresses.find((addr) => addr.isDefault)
      if (defaultAddress) {
        setShippingAddress({
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          governorate: defaultAddress.governorate,
        })
      }
    }
  }, [isAuthenticated, customer, shippingAddress])

  const steps = [
    { id: 'shipping', label: dict.checkout.shippingInfo, icon: MapPin },
    { id: 'payment', label: dict.checkout.paymentMethod, icon: CreditCard },
    { id: 'review', label: dict.checkout.orderSummary, icon: ClipboardList },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  // Handle shipping form submission
  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingAddress(data)
    setCurrentStep('payment')
  }

  // Handle payment submission
  const handlePaymentSubmit = () => {
    setCurrentStep('review')
  }

  // Handle final order submission
  const handleOrderSubmit = async () => {
    if (!shippingAddress || !paymentMethod) return

    setIsSubmitting(true)

    try {
      const orderData: any = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        customerNotes,
      }

      // Include customer ID if authenticated
      if (isAuthenticated && customer) {
        orderData.customerId = customer.id
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      setOrderNumber(data.orderNumber)
      clearCart()
      setCurrentStep('confirmation')
    } catch (error) {
      console.error('Order submission error:', error)
      alert(isRTL ? 'حدث خطأ أثناء إتمام الطلب' : 'An error occurred while placing your order')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Empty cart
  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          {dict.common.emptyCart}
        </h2>
        <p className="text-secondary-600 mb-6">
          {isRTL
            ? 'أضف منتجات إلى السلة للمتابعة'
            : 'Add products to your cart to continue'}
        </p>
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          {dict.common.continueShopping}
        </Link>
      </div>
    )
  }

  // Order confirmation
  if (currentStep === 'confirmation' && orderNumber) {
    const shippingCost = paymentMethod === 'cash-on-delivery' ? 50 : 0
    return (
      <OrderConfirmation
        locale={locale}
        dict={dict}
        orderNumber={orderNumber}
        paymentMethod={paymentMethod!}
        totalAmount={totalPrice + shippingCost}
      />
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 start-0 end-0 h-0.5 bg-secondary-200">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index < currentStepIndex
              const isCurrent = step.id === currentStep

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-primary-600 text-white'
                        : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-200 text-secondary-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCurrent ? 'text-primary-600' : 'text-secondary-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-secondary-200 p-6">
          {currentStep === 'shipping' && (
            <ShippingForm
              locale={locale}
              dict={dict}
              initialData={shippingAddress || undefined}
              onSubmit={handleShippingSubmit}
            />
          )}

          {currentStep === 'payment' && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {dict.common.back}
              </button>
              <PaymentMethods
                locale={locale}
                dict={dict}
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
                customerNotes={customerNotes}
                onNotesChange={setCustomerNotes}
                onSubmit={handlePaymentSubmit}
              />
            </>
          )}

          {currentStep === 'review' && shippingAddress && paymentMethod && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep('payment')}
                className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {dict.common.back}
              </button>
              <OrderReview
                locale={locale}
                dict={dict}
                items={items}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                customerNotes={customerNotes}
                totalPrice={totalPrice}
                onEditShipping={() => setCurrentStep('shipping')}
                onEditPayment={() => setCurrentStep('payment')}
                onSubmit={handleOrderSubmit}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </div>

      {/* Order Summary Sidebar */}
      {currentStep !== 'review' && (
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-secondary-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
              {dict.checkout.orderSummary}
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const name = isRTL ? item.product.nameAr : item.product.name
                const imageUrl = item.product.images?.[0]?.image?.url || null

                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
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
                      <p className="text-sm font-medium text-secondary-900 line-clamp-1">
                        {name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {item.quantity} × {item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-secondary-900">
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>

            <hr className="border-secondary-200 my-4" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-secondary-600">
                <span>{dict.cart.subtotal}</span>
                <span>{totalPrice.toLocaleString()} {dict.common.currency}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>{dict.cart.shipping}</span>
                <span className="text-success-600">
                  {isRTL ? 'سيتم حسابه' : 'Calculated next'}
                </span>
              </div>
              <hr className="border-secondary-200" />
              <div className="flex justify-between font-bold text-lg">
                <span>{dict.cart.orderTotal}</span>
                <span className="text-primary-600">
                  {totalPrice.toLocaleString()} {dict.common.currency}
                </span>
              </div>
            </div>

            {/* Back to Cart */}
            <Link
              href={`/${locale}/cart`}
              className="flex items-center justify-center gap-2 mt-4 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              {isRTL ? 'العودة للسلة' : 'Back to Cart'}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
