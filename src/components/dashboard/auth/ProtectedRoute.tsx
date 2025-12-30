'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { canAccessRoute } from '@/lib/dashboard/permissions'

interface ProtectedRouteProps {
  children: ReactNode
  /**
   * Locale for redirects
   */
  locale?: string
}

/**
 * ProtectedRoute Component
 *
 * Wraps dashboard pages to ensure user is authenticated
 * and has access to the current route.
 *
 * Redirects to login if not authenticated.
 * Shows access denied if authenticated but no permission.
 */
export function ProtectedRoute({ children, locale = 'ar' }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useDashboardAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/${locale}/dashboard/login?returnUrl=${returnUrl}`)
    }
  }, [isLoading, isAuthenticated, pathname, router, locale])

  // Loading state
  if (isLoading) {
    return <LoadingScreen />
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return <LoadingScreen />
  }

  // Check route access
  if (user && !canAccessRoute(user.role, pathname)) {
    return <AccessDeniedPage locale={locale} />
  }

  // Authenticated and has access
  return <>{children}</>
}

/**
 * Loading Screen
 */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}

/**
 * Access Denied Page
 */
function AccessDeniedPage({ locale }: { locale: string }) {
  const router = useRouter()
  const { logout } = useDashboardAuth()

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push(`/${locale}/dashboard`)
  }

  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/dashboard/login`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">
          You don&apos;t have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-4 py-2 text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={handleGoHome}
            className="px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProtectedRoute
