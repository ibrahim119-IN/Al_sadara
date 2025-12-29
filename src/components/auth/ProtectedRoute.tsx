'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackUrl?: string
  loadingMessage?: string
  loadingMessageAr?: string
}

export function ProtectedRoute({
  children,
  fallbackUrl,
  loadingMessage = 'Checking authentication...',
  loadingMessageAr = 'جاري التحقق من الهوية...',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { locale, isArabic } = useLocale()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const loginUrl = fallbackUrl || `/${locale}/login`
  const displayMessage = isArabic ? loadingMessageAr : loadingMessage

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsRedirecting(true)
      // Store the current URL for redirect after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
      }
      router.replace(loginUrl)
    }
  }, [isAuthenticated, isLoading, router, loginUrl])

  // Show loading while checking auth or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-card">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <LoadingSpinner size="lg" />
          <p className="text-secondary-600 font-medium animate-pulse">
            {displayMessage}
          </p>
        </div>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // This shouldn't be reached, but just in case
  return null
}

// Higher-order component version
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
}

// For guest-only pages (like login/register)
interface GuestOnlyRouteProps {
  children: React.ReactNode
  redirectUrl?: string
}

export function GuestOnlyRoute({
  children,
  redirectUrl,
}: GuestOnlyRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const accountUrl = redirectUrl || `/${locale}/account`

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setIsRedirecting(true)
      // Check if there's a stored redirect URL
      const redirectPath = typeof window !== 'undefined'
        ? sessionStorage.getItem('redirectAfterLogin')
        : null

      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin')
        router.replace(redirectPath)
      } else {
        router.replace(accountUrl)
      }
    }
  }, [isAuthenticated, isLoading, router, accountUrl])

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return null
}
