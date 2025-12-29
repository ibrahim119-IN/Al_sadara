'use client'

import React from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { usePWA } from '@/hooks/usePWA'

export function UpdatePrompt() {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'
  const { isUpdateAvailable, update } = usePWA()

  if (!isUpdateAvailable) {
    return null
  }

  const texts = {
    message: isArabic
      ? 'يتوفر إصدار جديد من التطبيق'
      : 'A new version of the app is available',
    update: isArabic ? 'تحديث الآن' : 'Update Now',
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-primary-600 text-white rounded-xl shadow-xl p-4 flex items-center gap-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p className="flex-1 text-sm font-medium">{texts.message}</p>
        <button
          onClick={update}
          className="flex-shrink-0 px-4 py-2 bg-white text-primary-600 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-colors"
        >
          {texts.update}
        </button>
      </div>
    </div>
  )
}
