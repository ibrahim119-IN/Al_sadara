'use client'

import { CartProvider } from '@/lib/cart/CartContext'
import type { ReactNode } from 'react'

interface CartProviderWrapperProps {
  children: ReactNode
}

export function CartProviderWrapper({ children }: CartProviderWrapperProps) {
  return <CartProvider>{children}</CartProvider>
}
