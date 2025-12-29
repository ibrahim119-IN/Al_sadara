'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface LocaleContextValue {
  locale: Locale
  dict: Dictionary
  isArabic: boolean
  isRTL: boolean
  direction: 'rtl' | 'ltr'
  t: (path: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

interface LocaleProviderProps {
  locale: Locale
  dict: Dictionary
  children: ReactNode
}

export function LocaleProvider({ locale, dict, children }: LocaleProviderProps) {
  const value = useMemo<LocaleContextValue>(() => {
    const isArabic = locale === 'ar'
    const isRTL = locale === 'ar'
    const direction = isRTL ? 'rtl' : 'ltr'

    // Translation function with dot notation support
    const t = (path: string): string => {
      const keys = path.split('.')
      let result: unknown = dict

      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = (result as Record<string, unknown>)[key]
        } else {
          console.warn(`Translation key not found: ${path}`)
          return path
        }
      }

      return typeof result === 'string' ? result : path
    }

    return {
      locale,
      dict,
      isArabic,
      isRTL,
      direction,
      t,
    }
  }, [locale, dict])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }

  return context
}

// Safe version that doesn't throw - useful for optional locale access
export function useLocaleOptional(): LocaleContextValue | null {
  return useContext(LocaleContext)
}

export { LocaleContext }
