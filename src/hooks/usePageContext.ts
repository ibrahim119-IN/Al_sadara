'use client'

import { useEffect } from 'react'
import { useAIAssistant, PageContext } from '@/contexts/AIAssistantContext'

/**
 * Hook to set AI page context
 * Call this in each page to tell the AI where the user is
 *
 * @example
 * // In a company page:
 * usePageContext('company', 'ar', { companySlug: 'sadara' })
 *
 * // In the home page:
 * usePageContext('home', 'ar')
 *
 * // In a product page:
 * usePageContext('product', 'ar', { productId: '123' })
 */
export function usePageContext(
  pageName: PageContext['pageName'],
  locale: 'ar' | 'en',
  options?: {
    companySlug?: string
    productId?: string
  }
) {
  const { setPageContext } = useAIAssistant()

  useEffect(() => {
    setPageContext({
      pageName,
      locale,
      companySlug: options?.companySlug,
      productId: options?.productId,
    })
  }, [pageName, locale, options?.companySlug, options?.productId, setPageContext])
}

export default usePageContext
