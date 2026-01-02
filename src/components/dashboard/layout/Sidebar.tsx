'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  FileText,
  CreditCard,
  Boxes,
  BarChart3,
  Star,
  Settings,
  UserCog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Image,
  FileStack,
  Menu as MenuIcon,
  Navigation,
  PanelBottom,
  X,
  Database,
  ExternalLink,
  Images,
  MessageSquare,
  HelpCircle,
} from 'lucide-react'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { hasPermission, type Permission } from '@/lib/dashboard/permissions'
import { cn } from '@/lib/utils/cn'

// Dictionary type
interface SidebarDictionary {
  dashboard: string
  orders: string
  products: string
  categories: string
  customers: string
  content: string
  homepage: string
  banners: string
  pages: string
  navigation: string
  footer: string
  payments: string
  inventory: string
  analytics: string
  reviews: string
  settings: string
  users: string
  general: string
  collapse: string
  expand: string
  // Payload Admin
  payloadAdmin?: string
  manageProducts?: string
  manageOrders?: string
  manageCustomers?: string
  manageMedia?: string
  manageFaqs?: string
  manageTestimonials?: string
}

interface SidebarProps {
  locale: string
  dictionary: SidebarDictionary
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  permission?: Permission
  children?: NavItem[]
  external?: boolean // For external links like Payload Admin
}

export function Sidebar({
  locale,
  dictionary: t,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname()
  const { user } = useDashboardAuth()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['content', 'settings'])

  const basePath = `/${locale}/dashboard`

  // Navigation items with permissions
  const navItems: NavItem[] = [
    {
      label: t.dashboard,
      href: basePath,
      icon: LayoutDashboard,
      permission: 'dashboard.view',
    },
    {
      label: t.orders,
      href: `${basePath}/orders`,
      icon: ShoppingCart,
      permission: 'orders.view',
    },
    {
      label: t.products,
      href: `${basePath}/products`,
      icon: Package,
      permission: 'products.view',
    },
    {
      label: t.categories,
      href: `${basePath}/categories`,
      icon: FolderTree,
      permission: 'categories.view',
    },
    {
      label: t.customers,
      href: `${basePath}/customers`,
      icon: Users,
      permission: 'customers.view',
    },
    {
      label: t.content,
      href: `${basePath}/content`,
      icon: FileText,
      permission: 'content.view',
      children: [
        {
          label: t.homepage,
          href: `${basePath}/content/homepage`,
          icon: Home,
          permission: 'content.view',
        },
        {
          label: t.banners,
          href: `${basePath}/content/banners`,
          icon: Image,
          permission: 'content.view',
        },
        {
          label: t.pages,
          href: `${basePath}/content/pages`,
          icon: FileStack,
          permission: 'content.view',
        },
        {
          label: t.navigation,
          href: `${basePath}/content/navigation`,
          icon: Navigation,
          permission: 'content.view',
        },
        {
          label: t.footer,
          href: `${basePath}/content/footer`,
          icon: PanelBottom,
          permission: 'content.view',
        },
      ],
    },
    {
      label: t.payments,
      href: `${basePath}/payments`,
      icon: CreditCard,
      permission: 'payments.view',
    },
    {
      label: t.inventory,
      href: `${basePath}/inventory`,
      icon: Boxes,
      permission: 'inventory.view',
    },
    {
      label: t.analytics,
      href: `${basePath}/analytics`,
      icon: BarChart3,
      permission: 'analytics.view',
    },
    {
      label: t.reviews,
      href: `${basePath}/reviews`,
      icon: Star,
      permission: 'reviews.view',
    },
    {
      label: t.settings,
      href: `${basePath}/settings`,
      icon: Settings,
      permission: 'settings.view',
      children: [
        {
          label: t.general,
          href: `${basePath}/settings/general`,
          icon: Settings,
          permission: 'settings.view',
        },
        {
          label: t.users,
          href: `${basePath}/settings/users`,
          icon: UserCog,
          permission: 'users.view',
        },
      ],
    },
    // Payload Admin Section - External Links
    {
      label: t.payloadAdmin || (locale === 'ar' ? 'إدارة المحتوى' : 'Content Admin'),
      href: '/admin',
      icon: Database,
      permission: 'settings.view',
      external: true,
      children: [
        {
          label: t.manageProducts || (locale === 'ar' ? 'إدارة المنتجات' : 'Manage Products'),
          href: '/admin/collections/products',
          icon: Package,
          external: true,
        },
        {
          label: t.manageOrders || (locale === 'ar' ? 'إدارة الطلبات' : 'Manage Orders'),
          href: '/admin/collections/orders',
          icon: ShoppingCart,
          external: true,
        },
        {
          label: t.manageCustomers || (locale === 'ar' ? 'إدارة العملاء' : 'Manage Customers'),
          href: '/admin/collections/customers',
          icon: Users,
          external: true,
        },
        {
          label: t.manageMedia || (locale === 'ar' ? 'الوسائط' : 'Media'),
          href: '/admin/collections/media',
          icon: Images,
          external: true,
        },
        {
          label: t.manageFaqs || (locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'),
          href: '/admin/collections/faqs',
          icon: HelpCircle,
          external: true,
        },
        {
          label: t.manageTestimonials || (locale === 'ar' ? 'آراء العملاء' : 'Testimonials'),
          href: '/admin/collections/testimonials',
          icon: MessageSquare,
          external: true,
        },
      ],
    },
  ]

  // Filter items based on permissions
  const filterByPermission = (items: NavItem[]): NavItem[] => {
    if (!user) return []

    return items
      .filter((item) => {
        if (!item.permission) return true
        return hasPermission(user.role, item.permission)
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterByPermission(item.children) : undefined,
      }))
      .filter((item) => !item.children || item.children.length > 0)
  }

  const filteredNavItems = filterByPermission(navItems)

  // Check if path is active
  const isActive = (href: string) => {
    if (href === basePath) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Toggle group expansion
  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    )
  }

  // Render nav item
  const renderNavItem = (item: NavItem, isChild = false) => {
    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedGroups.includes(item.label)
    const Icon = item.icon

    if (hasChildren && !isCollapsed) {
      return (
        <div key={item.href}>
          <button
            onClick={() => toggleGroup(item.label)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50',
              active && 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-start">{item.label}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </button>
          {isExpanded && (
            <div className="mt-1 ms-4 ps-4 border-s border-secondary-200 dark:border-secondary-700 space-y-1">
              {item.children!.map((child) => renderNavItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    // For external links (like Payload Admin)
    if (item.external) {
      return (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => isOpen && onClose()}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50',
            isCollapsed && 'justify-center px-2',
            isChild && 'py-2'
          )}
          title={isCollapsed ? item.label : undefined}
        >
          <Icon className={cn('w-5 h-5 flex-shrink-0', isChild && 'w-4 h-4')} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.label}</span>
              <ExternalLink className="w-3 h-3 text-secondary-400" />
            </>
          )}
        </a>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => isOpen && onClose()}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700/50',
          active && 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
          isCollapsed && 'justify-center px-2',
          isChild && 'py-2'
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon className={cn('w-5 h-5 flex-shrink-0', isChild && 'w-4 h-4')} />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex flex-col bg-white dark:bg-secondary-800 border-e border-secondary-200 dark:border-secondary-700 transition-all duration-300',
          // Mobile
          'lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0',
          // Desktop collapsed/expanded
          isCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-200 dark:border-secondary-700">
          {!isCollapsed && (
            <Link href={basePath} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-secondary-900 dark:text-white">
                Al Sadara
              </span>
            </Link>
          )}

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              'hidden lg:flex p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700',
              isCollapsed && 'mx-auto'
            )}
            title={isCollapsed ? t.expand : t.collapse}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredNavItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Footer */}
        {!isCollapsed && user && (
          <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
