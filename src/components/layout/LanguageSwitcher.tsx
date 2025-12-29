'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/lib/i18n/config'

interface LanguageSwitcherProps {
  locale: Locale
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: Locale) => {
    // Replace the locale in the current path
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  const otherLocale = locale === 'ar' ? 'en' : 'ar'

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-secondary-600 hover:text-primary-600 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
      aria-label={`Switch to ${localeNames[otherLocale]}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span>{localeNames[otherLocale]}</span>
    </button>
  )
}
