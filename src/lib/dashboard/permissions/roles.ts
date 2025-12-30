/**
 * Dashboard Role-Based Access Control (RBAC)
 *
 * Defines roles, permissions, and helper functions for access control
 * in the admin dashboard.
 */

// User roles from Users collection
export type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff'

// Permission categories
export type PermissionCategory =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'customers'
  | 'content'
  | 'payments'
  | 'inventory'
  | 'analytics'
  | 'reviews'
  | 'settings'
  | 'users'

// Permission actions
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'bulk' | 'export'

// Full permission string format: "category.action" or "category.*" for all
export type Permission = `${PermissionCategory}.${PermissionAction}` | `${PermissionCategory}.*` | '*'

// Role configuration
export interface RoleConfig {
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  permissions: Permission[]
  level: number // Higher level = more access
}

// Role definitions
export const ROLES: Record<UserRole, RoleConfig> = {
  'super-admin': {
    name: {
      en: 'Super Admin',
      ar: 'مدير عام',
    },
    description: {
      en: 'Full system access with user management',
      ar: 'وصول كامل للنظام مع إدارة المستخدمين',
    },
    permissions: ['*'],
    level: 100,
  },
  'admin': {
    name: {
      en: 'Admin',
      ar: 'مدير',
    },
    description: {
      en: 'Full access except user management',
      ar: 'وصول كامل ماعدا إدارة المستخدمين',
    },
    permissions: [
      'dashboard.*',
      'orders.*',
      'products.*',
      'categories.*',
      'customers.*',
      'content.*',
      'payments.*',
      'inventory.*',
      'analytics.*',
      'reviews.*',
      'settings.view',
      'settings.edit',
    ],
    level: 80,
  },
  'manager': {
    name: {
      en: 'Manager',
      ar: 'مشرف',
    },
    description: {
      en: 'Can manage orders, inventory, and view analytics',
      ar: 'يمكنه إدارة الطلبات والمخزون وعرض التحليلات',
    },
    permissions: [
      'dashboard.view',
      'orders.*',
      'products.view',
      'products.edit',
      'categories.view',
      'customers.view',
      'inventory.*',
      'analytics.view',
      'analytics.export',
      'reviews.view',
      'reviews.edit',
    ],
    level: 60,
  },
  'staff': {
    name: {
      en: 'Staff',
      ar: 'موظف',
    },
    description: {
      en: 'Basic access to view and update orders',
      ar: 'صلاحيات أساسية لعرض وتحديث الطلبات',
    },
    permissions: [
      'dashboard.view',
      'orders.view',
      'orders.edit',
      'products.view',
      'categories.view',
      'customers.view',
      'inventory.view',
    ],
    level: 40,
  },
}

// All available permissions with descriptions
export const PERMISSIONS: Record<Permission, { en: string; ar: string }> = {
  // Wildcard
  '*': { en: 'Full Access', ar: 'وصول كامل' },

  // Dashboard
  'dashboard.*': { en: 'Dashboard - Full', ar: 'لوحة التحكم - كامل' },
  'dashboard.view': { en: 'View Dashboard', ar: 'عرض لوحة التحكم' },
  'dashboard.create': { en: 'Create Dashboard', ar: 'إنشاء لوحة التحكم' },
  'dashboard.edit': { en: 'Edit Dashboard', ar: 'تعديل لوحة التحكم' },
  'dashboard.delete': { en: 'Delete Dashboard', ar: 'حذف لوحة التحكم' },
  'dashboard.bulk': { en: 'Dashboard Bulk Actions', ar: 'إجراءات جماعية للوحة التحكم' },
  'dashboard.export': { en: 'Export Dashboard', ar: 'تصدير لوحة التحكم' },

  // Orders
  'orders.*': { en: 'Orders - Full', ar: 'الطلبات - كامل' },
  'orders.view': { en: 'View Orders', ar: 'عرض الطلبات' },
  'orders.create': { en: 'Create Orders', ar: 'إنشاء طلبات' },
  'orders.edit': { en: 'Edit Orders', ar: 'تعديل الطلبات' },
  'orders.delete': { en: 'Delete Orders', ar: 'حذف الطلبات' },
  'orders.bulk': { en: 'Bulk Order Actions', ar: 'إجراءات جماعية للطلبات' },
  'orders.export': { en: 'Export Orders', ar: 'تصدير الطلبات' },

  // Products
  'products.*': { en: 'Products - Full', ar: 'المنتجات - كامل' },
  'products.view': { en: 'View Products', ar: 'عرض المنتجات' },
  'products.create': { en: 'Create Products', ar: 'إضافة منتجات' },
  'products.edit': { en: 'Edit Products', ar: 'تعديل المنتجات' },
  'products.delete': { en: 'Delete Products', ar: 'حذف المنتجات' },
  'products.bulk': { en: 'Bulk Product Actions', ar: 'إجراءات جماعية للمنتجات' },
  'products.export': { en: 'Export Products', ar: 'تصدير المنتجات' },

  // Categories
  'categories.*': { en: 'Categories - Full', ar: 'الفئات - كامل' },
  'categories.view': { en: 'View Categories', ar: 'عرض الفئات' },
  'categories.create': { en: 'Create Categories', ar: 'إنشاء فئات' },
  'categories.edit': { en: 'Edit Categories', ar: 'تعديل الفئات' },
  'categories.delete': { en: 'Delete Categories', ar: 'حذف الفئات' },
  'categories.bulk': { en: 'Bulk Category Actions', ar: 'إجراءات جماعية للفئات' },
  'categories.export': { en: 'Export Categories', ar: 'تصدير الفئات' },

  // Customers
  'customers.*': { en: 'Customers - Full', ar: 'العملاء - كامل' },
  'customers.view': { en: 'View Customers', ar: 'عرض العملاء' },
  'customers.create': { en: 'Create Customers', ar: 'إنشاء عملاء' },
  'customers.edit': { en: 'Edit Customers', ar: 'تعديل العملاء' },
  'customers.delete': { en: 'Delete Customers', ar: 'حذف العملاء' },
  'customers.bulk': { en: 'Bulk Customer Actions', ar: 'إجراءات جماعية للعملاء' },
  'customers.export': { en: 'Export Customers', ar: 'تصدير العملاء' },

  // Content
  'content.*': { en: 'Content - Full', ar: 'المحتوى - كامل' },
  'content.view': { en: 'View Content', ar: 'عرض المحتوى' },
  'content.create': { en: 'Create Content', ar: 'إنشاء محتوى' },
  'content.edit': { en: 'Edit Content', ar: 'تعديل المحتوى' },
  'content.delete': { en: 'Delete Content', ar: 'حذف المحتوى' },
  'content.bulk': { en: 'Bulk Content Actions', ar: 'إجراءات جماعية للمحتوى' },
  'content.export': { en: 'Export Content', ar: 'تصدير المحتوى' },

  // Payments
  'payments.*': { en: 'Payments - Full', ar: 'المدفوعات - كامل' },
  'payments.view': { en: 'View Payments', ar: 'عرض المدفوعات' },
  'payments.create': { en: 'Create Payments', ar: 'إنشاء مدفوعات' },
  'payments.edit': { en: 'Edit Payments', ar: 'تعديل المدفوعات' },
  'payments.delete': { en: 'Delete Payments', ar: 'حذف المدفوعات' },
  'payments.bulk': { en: 'Bulk Payment Actions', ar: 'إجراءات جماعية للمدفوعات' },
  'payments.export': { en: 'Export Payments', ar: 'تصدير المدفوعات' },

  // Inventory
  'inventory.*': { en: 'Inventory - Full', ar: 'المخزون - كامل' },
  'inventory.view': { en: 'View Inventory', ar: 'عرض المخزون' },
  'inventory.create': { en: 'Create Inventory', ar: 'إنشاء مخزون' },
  'inventory.edit': { en: 'Edit Inventory', ar: 'تعديل المخزون' },
  'inventory.delete': { en: 'Delete Inventory', ar: 'حذف المخزون' },
  'inventory.bulk': { en: 'Bulk Inventory Actions', ar: 'إجراءات جماعية للمخزون' },
  'inventory.export': { en: 'Export Inventory', ar: 'تصدير المخزون' },

  // Analytics
  'analytics.*': { en: 'Analytics - Full', ar: 'التحليلات - كامل' },
  'analytics.view': { en: 'View Analytics', ar: 'عرض التحليلات' },
  'analytics.create': { en: 'Create Analytics', ar: 'إنشاء تحليلات' },
  'analytics.edit': { en: 'Edit Analytics', ar: 'تعديل التحليلات' },
  'analytics.delete': { en: 'Delete Analytics', ar: 'حذف التحليلات' },
  'analytics.bulk': { en: 'Bulk Analytics Actions', ar: 'إجراءات جماعية للتحليلات' },
  'analytics.export': { en: 'Export Analytics', ar: 'تصدير التحليلات' },

  // Reviews
  'reviews.*': { en: 'Reviews - Full', ar: 'التقييمات - كامل' },
  'reviews.view': { en: 'View Reviews', ar: 'عرض التقييمات' },
  'reviews.create': { en: 'Create Reviews', ar: 'إنشاء تقييمات' },
  'reviews.edit': { en: 'Edit Reviews', ar: 'تعديل التقييمات' },
  'reviews.delete': { en: 'Delete Reviews', ar: 'حذف التقييمات' },
  'reviews.bulk': { en: 'Bulk Review Actions', ar: 'إجراءات جماعية للتقييمات' },
  'reviews.export': { en: 'Export Reviews', ar: 'تصدير التقييمات' },

  // Settings
  'settings.*': { en: 'Settings - Full', ar: 'الإعدادات - كامل' },
  'settings.view': { en: 'View Settings', ar: 'عرض الإعدادات' },
  'settings.create': { en: 'Create Settings', ar: 'إنشاء إعدادات' },
  'settings.edit': { en: 'Edit Settings', ar: 'تعديل الإعدادات' },
  'settings.delete': { en: 'Delete Settings', ar: 'حذف الإعدادات' },
  'settings.bulk': { en: 'Bulk Settings Actions', ar: 'إجراءات جماعية للإعدادات' },
  'settings.export': { en: 'Export Settings', ar: 'تصدير الإعدادات' },

  // Users
  'users.*': { en: 'Users - Full', ar: 'المستخدمين - كامل' },
  'users.view': { en: 'View Users', ar: 'عرض المستخدمين' },
  'users.create': { en: 'Create Users', ar: 'إنشاء مستخدمين' },
  'users.edit': { en: 'Edit Users', ar: 'تعديل المستخدمين' },
  'users.delete': { en: 'Delete Users', ar: 'حذف المستخدمين' },
  'users.bulk': { en: 'Bulk User Actions', ar: 'إجراءات جماعية للمستخدمين' },
  'users.export': { en: 'Export Users', ar: 'تصدير المستخدمين' },
}

/**
 * Check if a user with the given role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const roleConfig = ROLES[role]
  if (!roleConfig) return false

  // Super admin has all permissions
  if (roleConfig.permissions.includes('*')) return true

  // Check for exact permission match
  if (roleConfig.permissions.includes(permission)) return true

  // Check for wildcard permission (e.g., "orders.*" matches "orders.view")
  const [category] = permission.split('.') as [PermissionCategory, PermissionAction]
  const wildcardPermission = `${category}.*` as Permission
  if (roleConfig.permissions.includes(wildcardPermission)) return true

  return false
}

/**
 * Check if a user has any of the given permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

/**
 * Check if a user has all of the given permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  const roleConfig = ROLES[role]
  if (!roleConfig) return []

  // If has wildcard, return all permissions
  if (roleConfig.permissions.includes('*')) {
    return Object.keys(PERMISSIONS) as Permission[]
  }

  // Expand wildcard permissions
  const expandedPermissions: Permission[] = []
  for (const permission of roleConfig.permissions) {
    if (permission.endsWith('.*')) {
      const category = permission.replace('.*', '') as PermissionCategory
      const categoryPermissions = Object.keys(PERMISSIONS).filter(
        (p) => p.startsWith(`${category}.`)
      ) as Permission[]
      expandedPermissions.push(...categoryPermissions)
    } else {
      expandedPermissions.push(permission)
    }
  }

  return [...new Set(expandedPermissions)]
}

/**
 * Check if a user can access a specific route
 */
export function canAccessRoute(role: UserRole, route: string): boolean {
  // Map routes to required permissions
  const routePermissions: Record<string, Permission> = {
    '/dashboard': 'dashboard.view',
    '/dashboard/orders': 'orders.view',
    '/dashboard/products': 'products.view',
    '/dashboard/categories': 'categories.view',
    '/dashboard/customers': 'customers.view',
    '/dashboard/content': 'content.view',
    '/dashboard/payments': 'payments.view',
    '/dashboard/inventory': 'inventory.view',
    '/dashboard/analytics': 'analytics.view',
    '/dashboard/reviews': 'reviews.view',
    '/dashboard/settings': 'settings.view',
    '/dashboard/settings/users': 'users.view',
  }

  // Find matching route (handle dynamic routes)
  const matchedRoute = Object.keys(routePermissions).find((r) => {
    if (route === r) return true
    if (route.startsWith(r + '/')) return true
    return false
  })

  if (!matchedRoute) return true // Allow if no specific permission required

  const requiredPermission = routePermissions[matchedRoute]
  return hasPermission(role, requiredPermission)
}

/**
 * Compare two roles and return which has higher access
 */
export function compareRoles(roleA: UserRole, roleB: UserRole): number {
  const levelA = ROLES[roleA]?.level ?? 0
  const levelB = ROLES[roleB]?.level ?? 0
  return levelA - levelB
}

/**
 * Check if roleA has higher or equal access than roleB
 */
export function hasHigherOrEqualRole(roleA: UserRole, roleB: UserRole): boolean {
  return compareRoles(roleA, roleB) >= 0
}
