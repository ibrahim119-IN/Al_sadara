'use client'

import React, { useState, useEffect } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { usePWA } from '@/hooks/usePWA'

interface InstallPromptProps {
  showOnMobileOnly?: boolean
  delay?: number
}

export function InstallPrompt({ showOnMobileOnly = true, delay = 5000 }: InstallPromptProps) {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'
  const { isInstallable, isInstalled, install } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true)
        return
      }
    }

    // Check if should show on mobile only
    if (showOnMobileOnly && window.innerWidth > 768) {
      return
    }

    // Show after delay
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled) {
        setIsVisible(true)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, showOnMobileOnly, delay])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  if (!isVisible || isDismissed || isInstalled) {
    return null
  }

  const texts = {
    title: isArabic ? 'تثبيت التطبيق' : 'Install App',
    description: isArabic
      ? 'ثبّت تطبيق الصدارة للوصول السريع وتجربة أفضل'
      : 'Install Al Sadara app for quick access and better experience',
    install: isArabic ? 'تثبيت' : 'Install',
    notNow: isArabic ? 'ليس الآن' : 'Not Now',
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-700 p-4 flex gap-4 items-start animate-slide-up">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white text-xl font-bold">ص</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
            {texts.title}
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
            {texts.description}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {texts.install}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 text-sm font-medium rounded-lg transition-colors"
            >
              {texts.notNow}
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
