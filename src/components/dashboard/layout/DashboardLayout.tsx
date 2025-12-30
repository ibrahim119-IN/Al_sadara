'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { cn } from '@/lib/utils/cn'

// Dictionary types
interface DashboardLayoutDictionary {
  sidebar: {
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
  }
  topbar: {
    search: string
    notifications: string
    profile: string
    logout: string
    viewSite: string
    noNotifications: string
  }
}

interface DashboardLayoutProps {
  children: ReactNode
  locale: string
  dictionary: DashboardLayoutDictionary
}

const SIDEBAR_COLLAPSED_KEY = 'dashboard_sidebar_collapsed'

export function DashboardLayout({ children, locale, dictionary }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (stored !== null) {
        setIsSidebarCollapsed(stored === 'true')
      }
    }
  }, [])

  // Save sidebar collapsed state to localStorage
  const handleToggleCollapse = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newState))
    }
  }

  // Close mobile sidebar on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar */}
      <Sidebar
        locale={locale}
        dictionary={dictionary.sidebar}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          // Margin for sidebar
          isSidebarCollapsed ? 'lg:ms-[72px]' : 'lg:ms-64'
        )}
      >
        {/* Top bar */}
        <TopBar
          locale={locale}
          dictionary={dictionary.topbar}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-secondary-500 dark:text-secondary-400 border-t border-secondary-200 dark:border-secondary-700">
          <p>
            © {new Date().getFullYear()} Al Sadara. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
