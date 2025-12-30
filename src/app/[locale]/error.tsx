'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowRight } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error)
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    // reportError(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-error-100 dark:bg-error-900/30 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white dark:bg-secondary-800 rounded-full p-6 shadow-lg border border-error-100 dark:border-error-800">
              <AlertTriangle className="w-16 h-16 text-error-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
          عذراً! حدث خطأ غير متوقع
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-2">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-500 mb-8">
          Sorry! An unexpected error occurred. Please try again.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 p-4 bg-error-50 dark:bg-error-900/20 rounded-xl border border-error-200 dark:border-error-800 text-start">
            <p className="text-sm font-mono text-error-700 dark:text-error-400 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-error-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl
              hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl
              hover:-translate-y-0.5 font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            <span>حاول مرة أخرى</span>
          </button>

          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-xl
              border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 hover:text-primary-600
              transition-all duration-300 font-medium"
          >
            <Home className="w-5 h-5" />
            <span>الصفحة الرئيسية</span>
          </a>
        </div>

        {/* Support Link */}
        <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            إذا استمرت المشكلة، يرجى{' '}
            <a
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              التواصل معنا
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
