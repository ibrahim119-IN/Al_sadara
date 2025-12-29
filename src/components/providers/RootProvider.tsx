'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { CartProvider } from '@/lib/cart/CartContext'
import { AIAssistantProvider } from '@/contexts/AIAssistantContext'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { ReactNode } from 'react'

interface RootProviderProps {
  locale: Locale
  dict: Dictionary
  children: ReactNode
}

/**
 * RootProvider - Unified provider component
 *
 * Combines all context providers in the correct order:
 * 1. ThemeProvider - Must be outermost for theme to apply everywhere
 * 2. LocaleProvider - For i18n access
 * 3. AuthProvider - For authentication state
 * 4. CartProvider - For shopping cart state (may depend on auth)
 * 5. AIAssistantProvider - For AI chat functionality
 */
export function RootProvider({ locale, dict, children }: RootProviderProps) {
  return (
    <ThemeProvider>
      <LocaleProvider locale={locale} dict={dict}>
        <AuthProvider>
          <CartProvider>
            <AIAssistantProvider>
              {children}
            </AIAssistantProvider>
          </CartProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
