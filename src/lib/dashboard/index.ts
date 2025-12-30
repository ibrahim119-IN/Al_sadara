/**
 * Dashboard Module
 * Central export for all dashboard-related utilities
 */

// Auth
export {
  DashboardAuthProvider,
  useDashboardAuth,
  type DashboardUser,
} from './auth'

// Permissions
export {
  type UserRole,
  type Permission,
  type PermissionCategory,
  type PermissionAction,
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  compareRoles,
  hasHigherOrEqualRole,
} from './permissions'
