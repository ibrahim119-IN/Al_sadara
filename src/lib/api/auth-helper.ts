/**
 * API Authentication & Authorization Helper
 *
 * Provides utilities for validating user authentication and permissions
 * in API endpoints.
 */

import { NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload/cache'
import { hasPermission, Permission, UserRole } from '@/lib/dashboard/permissions/roles'

// User type from Payload
interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role: UserRole
}

// Auth result types
interface AuthSuccess {
  success: true
  user: AuthenticatedUser
}

interface AuthError {
  success: false
  error: string
  status: 401 | 403
}

type AuthResult = AuthSuccess | AuthError

/**
 * Validate API request authentication
 * Checks if the request has a valid payload-token cookie
 */
export async function validateAuth(request: Request): Promise<AuthResult> {
  try {
    const payload = await getCachedPayload()

    // Get user from Payload auth
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized - Please login',
        status: 401,
      }
    }

    // Ensure user has a role
    const userRole = (user.role as UserRole) || 'staff'

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: userRole,
      },
    }
  } catch (error) {
    console.error('Auth validation error:', error)
    return {
      success: false,
      error: 'Authentication failed',
      status: 401,
    }
  }
}

/**
 * Validate API request has required permission
 */
export async function validatePermission(
  request: Request,
  requiredPermission: Permission
): Promise<AuthResult> {
  // First validate authentication
  const authResult = await validateAuth(request)

  if (!authResult.success) {
    return authResult
  }

  // Check permission
  if (!hasPermission(authResult.user.role, requiredPermission)) {
    return {
      success: false,
      error: `Forbidden - You don't have permission: ${requiredPermission}`,
      status: 403,
    }
  }

  return authResult
}

/**
 * Validate API request has any of the required permissions
 */
export async function validateAnyPermission(
  request: Request,
  permissions: Permission[]
): Promise<AuthResult> {
  // First validate authentication
  const authResult = await validateAuth(request)

  if (!authResult.success) {
    return authResult
  }

  // Check if user has any of the required permissions
  const hasAny = permissions.some((perm) => hasPermission(authResult.user.role, perm))

  if (!hasAny) {
    return {
      success: false,
      error: `Forbidden - Required permissions: ${permissions.join(' or ')}`,
      status: 403,
    }
  }

  return authResult
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  )
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  )
}

/**
 * Create an error response from auth result
 */
export function authErrorResponse(result: AuthError): NextResponse {
  return NextResponse.json(
    { success: false, error: result.error },
    { status: result.status }
  )
}

/**
 * Middleware-style wrapper for protected API routes
 * Usage:
 * ```ts
 * export async function GET(request: Request) {
 *   return withAuth(request, 'analytics.view', async (user) => {
 *     // Your protected logic here
 *     return NextResponse.json({ data: 'secret' })
 *   })
 * }
 * ```
 */
export async function withAuth(
  request: Request,
  permission: Permission,
  handler: (user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await validatePermission(request, permission)

  if (!authResult.success) {
    return authErrorResponse(authResult)
  }

  try {
    return await handler(authResult.user)
  } catch (error) {
    console.error('API handler error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Check if user is admin or super-admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'admin' || role === 'super-admin'
}

/**
 * Check if user is super-admin
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'super-admin'
}
