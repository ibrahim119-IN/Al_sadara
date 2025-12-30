import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n/config'

// Valid subdomains (company slugs)
const VALID_SUBDOMAINS = ['industry', 'talah', 'polymers', 'sam', 'qaysar', 'coderatech']

// ============================================
// Rate Limiting Configuration
// ============================================
interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limiter (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limit configurations by route type
const RATE_LIMITS = {
  api: { requests: 100, windowMs: 60 * 1000 }, // 100 requests per minute for API
  auth: { requests: 5, windowMs: 60 * 1000 },  // 5 requests per minute for auth
  ai: { requests: 20, windowMs: 60 * 1000 },   // 20 requests per minute for AI
  default: { requests: 200, windowMs: 60 * 1000 }, // 200 requests per minute default
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return 'unknown'
}

/**
 * Check rate limit for a given key
 */
function checkRateLimit(key: string, limit: { requests: number; windowMs: number }): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + limit.windowMs,
    }
    rateLimitStore.set(key, newEntry)
    return { allowed: true, remaining: limit.requests - 1, resetTime: newEntry.resetTime }
  }

  if (entry.count >= limit.requests) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: limit.requests - entry.count, resetTime: entry.resetTime }
}

/**
 * Get rate limit config based on path
 */
function getRateLimitConfig(pathname: string): { requests: number; windowMs: number } {
  if (pathname.startsWith('/api/ai/')) {
    return RATE_LIMITS.ai
  }
  if (pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password')) {
    return RATE_LIMITS.auth
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMITS.api
  }
  return RATE_LIMITS.default
}

// Main domain (without subdomain)
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'alsadara.org'

// Paths that should not be localized
const publicPaths = [
  '/api',
  '/admin',
  '/_next',
  '/images',
  '/icons',
  '/fonts',
  '/uploads',
  '/favicon.ico',
]

// Protected routes that require authentication
const protectedRoutes = ['/account']

// Dashboard routes that require admin authentication
const dashboardRoutes = ['/dashboard']

// Auth routes that should redirect authenticated users
const authRoutes = ['/login', '/register']

/**
 * Extract subdomain from host
 */
function getSubdomain(host: string): string | null {
  // Remove port if present
  const hostname = host.split(':')[0]

  // Handle localhost development with custom subdomain header
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null // Use query param or header in development
  }

  // Production: extract subdomain
  const parts = hostname.split('.')

  // Need at least subdomain.domain.tld (3 parts)
  if (parts.length >= 3) {
    const subdomain = parts[0]

    // Ignore www
    if (subdomain === 'www') return null

    // Check if it's a valid company subdomain
    if (VALID_SUBDOMAINS.includes(subdomain)) {
      return subdomain
    }
  }

  return null
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]

  if (isValidLocale(potentialLocale)) {
    return potentialLocale
  }
  return null
}

function getLocaleFromHeaders(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang as (typeof locales)[number]))

    if (preferredLocale) {
      return preferredLocale
    }
  }

  return defaultLocale
}

// Add rate limit headers to response
function addRateLimitHeaders(
  response: NextResponse,
  config: { requests: number; windowMs: number },
  remaining: number,
  resetTime: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(config.requests))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(resetTime))
  return response
}

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Enable XSS filter in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Prevent browsers from DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'off')

  // Only allow HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  // Content Security Policy (basic - customize as needed)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

/**
 * Add company context headers
 */
function addCompanyHeaders(response: NextResponse, subdomain: string | null): NextResponse {
  if (subdomain) {
    response.headers.set('x-subdomain', subdomain)
    response.headers.set('x-company-slug', subdomain)
    response.headers.set('x-is-subdomain', 'true')
  } else {
    response.headers.set('x-is-subdomain', 'false')
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // ============================================
  // Rate Limiting Check
  // ============================================
  const clientIP = getClientIP(request)
  const rateLimitConfig = getRateLimitConfig(pathname)
  const rateLimitKey = `${clientIP}:${pathname.split('/').slice(0, 3).join('/')}`
  const rateLimit = checkRateLimit(rateLimitKey, rateLimitConfig)

  if (!rateLimit.allowed) {
    // Rate limit exceeded - return 429 Too Many Requests
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(rateLimitConfig.requests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        },
      }
    )
  }

  // Extract subdomain
  const subdomain = getSubdomain(host)

  // For development, also check for a subdomain query parameter
  let devSubdomain: string | null = null
  if (process.env.NODE_ENV === 'development') {
    const subdomainParam = request.nextUrl.searchParams.get('subdomain')
    if (subdomainParam && VALID_SUBDOMAINS.includes(subdomainParam)) {
      devSubdomain = subdomainParam
    }
  }

  const activeSubdomain = subdomain || devSubdomain

  // Check if path should be skipped
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    let response = NextResponse.next()
    response = addSecurityHeaders(response)
    response = addCompanyHeaders(response, activeSubdomain)
    response = addRateLimitHeaders(response, rateLimitConfig, rateLimit.remaining, rateLimit.resetTime)
    return response
  }

  // Check if locale is already in path
  const localeFromPath = getLocaleFromPath(pathname)
  const locale = localeFromPath || getLocaleFromHeaders(request)

  // If no locale in path, redirect to localized path
  if (!localeFromPath) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url)

    // Preserve subdomain query param in development
    if (devSubdomain) {
      newUrl.searchParams.set('subdomain', devSubdomain)
    }

    return NextResponse.redirect(newUrl)
  }

  // Check for authentication (Payload CMS uses httpOnly cookies)
  const authToken = request.cookies.get('payload-token')
  const isAuthenticated = !!authToken

  // Get the path without locale (e.g., /ar/account -> /account)
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))

  // Check if this is an auth route
  const isAuthRoute = authRoutes.some((route) => pathWithoutLocale.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    if (devSubdomain) {
      loginUrl.searchParams.set('subdomain', devSubdomain)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to account
  if (isAuthRoute && isAuthenticated) {
    const accountUrl = new URL(`/${locale}/account`, request.url)
    if (devSubdomain) {
      accountUrl.searchParams.set('subdomain', devSubdomain)
    }
    return NextResponse.redirect(accountUrl)
  }

  // Dashboard route protection
  const isDashboardRoute = dashboardRoutes.some((route) => pathWithoutLocale.startsWith(route))

  // If it's a dashboard route, check authentication
  // User will be redirected to unified /login page
  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    if (devSubdomain) {
      loginUrl.searchParams.set('subdomain', devSubdomain)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Create response with headers
  let response = NextResponse.next()
  response = addSecurityHeaders(response)
  response = addCompanyHeaders(response, activeSubdomain)
  response = addRateLimitHeaders(response, rateLimitConfig, rateLimit.remaining, rateLimit.resetTime)

  return response
}

export const config = {
  // Match all paths except static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
