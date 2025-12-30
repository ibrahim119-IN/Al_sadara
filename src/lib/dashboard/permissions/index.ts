/**
 * Dashboard Permissions Module
 * Exports all permission-related types and functions
 */

export {
  type UserRole,
  type PermissionCategory,
  type PermissionAction,
  type Permission,
  type RoleConfig,
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  compareRoles,
  hasHigherOrEqualRole,
} from './roles'
