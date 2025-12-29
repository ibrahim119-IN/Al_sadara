'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useCart, type CartProduct } from '@/hooks/useCart'

interface AddToCartButtonProps {
  product: CartProduct
  disabled?: boolean
  label: string
  className?: string
  showQuantity?: boolean
}

export function AddToCartButton({
  product,
  disabled = false,
  label,
  className = '',
  showQuantity = false,
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity, openCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const quantityInCart = getItemQuantity(product.id)
  const isOutOfStock = product.stock <= 0
  const isMaxedOut = quantityInCart >= product.stock

  const handleAddToCart = async () => {
    if (isOutOfStock || isMaxedOut || disabled) return

    setIsAdding(true)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200))

    addItem(product, 1)
    setIsAdding(false)
    setJustAdded(true)

    // Show success state for 1.5 seconds
    setTimeout(() => {
      setJustAdded(false)
    }, 1500)

    // Open cart drawer
    openCart()
  }

  const buttonDisabled = isOutOfStock || isMaxedOut || disabled || isAdding

  return (
    <button
      onClick={handleAddToCart}
      disabled={buttonDisabled}
      className={`flex items-center justify-center gap-2 transition-all ${
        isOutOfStock || isMaxedOut
          ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
          : justAdded
            ? 'bg-success-600 text-white'
            : 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-medium'
      } ${className}`}
    >
      {isAdding ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : justAdded ? (
        <Check className="w-5 h-5" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}

      {showQuantity && quantityInCart > 0 && !justAdded ? (
        <span>
          {label} ({quantityInCart})
        </span>
      ) : (
        <span>{justAdded ? 'Added!' : label}</span>
      )}
    </button>
  )
}
