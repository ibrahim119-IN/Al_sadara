'use client'

import { type ReactNode } from 'react'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { type UserRole, type Permission, hasPermission, hasAnyPermission } from '@/lib/dashboard/permissions'

interface RoleGuardProps {
  children: ReactNode
  /**
   * Required role(s) - user must have one of these roles
   */
  roles?: UserRole | UserRole[]
  /**
   * Required permission(s) - user must have one of these permissions
   */
  permissions?: Permission | Permission[]
  /**
   * If true, user must have ALL permissions (not just one)
   */
  requireAll?: boolean
  /**
   * Fallback content to show if access is denied
   */
  fallback?: ReactNode
  /**
   * If true, shows nothing instead of fallback (useful for hiding UI elements)
   */
  hideIfDenied?: boolean
}

/**
 * RoleGuard Component
 *
 * Guards content based on user role and/or permissions.
 * Use this to conditionally show UI elements based on access level.
 *
 * @example
 * // Only show for admins
 * <RoleGuard roles="admin">
 *   <AdminPanel />
 * </RoleGuard>
 *
 * @example
 * // Show for users with orders.edit permission
 * <RoleGuard permissions="orders.edit">
 *   <EditOrderButton />
 * </RoleGuard>
 *
 * @example
 * // Hide element completely if not authorized
 * <RoleGuard permissions="orders.delete" hideIfDenied>
 *   <DeleteButton />
 * </RoleGuard>
 */
export function RoleGuard({
  children,
  roles,
  permissions,
  requireAll = false,
  fallback,
  hideIfDenied = false,
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useDashboardAuth()

  // Still loading
  if (isLoading) {
    return null
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (hideIfDenied) return null
    return fallback ?? <AccessDenied />
  }

  // Check roles
  if (roles) {
    const roleArray = Array.isArray(roles) ? roles : [roles]
    const hasRole = roleArray.includes(user.role)
    if (!hasRole) {
      if (hideIfDenied) return null
      return fallback ?? <AccessDenied />
    }
  }

  // Check permissions
  if (permissions) {
    const permArray = Array.isArray(permissions) ? permissions : [permissions]

    let hasAccess: boolean
    if (requireAll) {
      hasAccess = permArray.every((perm) => hasPermission(user.role, perm))
    } else {
      hasAccess = hasAnyPermission(user.role, permArray)
    }

    if (!hasAccess) {
      if (hideIfDenied) return null
      return fallback ?? <AccessDenied />
    }
  }

  // Access granted
  return <>{children}</>
}

/**
 * Default Access Denied component
 */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
        Access Denied
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400">
        You don&apos;t have permission to view this content.
      </p>
    </div>
  )
}

export default RoleGuard
