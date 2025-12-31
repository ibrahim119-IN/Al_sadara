'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  ExternalLink,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Package,
  ShoppingCart,
  Users,
  Loader2,
} from 'lucide-react'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils/cn'

// Search result types
interface SearchResult {
  id: string
  type: 'order' | 'product' | 'customer'
  title: string
  titleAr?: string
  subtitle: string
  status?: string
  href: string
}

interface SearchResults {
  orders: SearchResult[]
  products: SearchResult[]
  customers: SearchResult[]
}

// Dictionary type
interface TopBarDictionary {
  search: string
  notifications: string
  profile: string
  logout: string
  viewSite: string
  noNotifications: string
  settings?: string
}

interface TopBarProps {
  locale: string
  dictionary: TopBarDictionary
  onMenuClick: () => void
}

export function TopBar({ locale, dictionary: t, onMenuClick }: TopBarProps) {
  const router = useRouter()
  const { user, logout } = useDashboardAuth()
  const { theme, setTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults(null)
      setIsSearchOpen(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/dashboard/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results)
        setIsSearchOpen(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await logout()
    router.push(`/${locale}/dashboard/login`)
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Toggle language
  const toggleLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  // Handle search result click
  const handleResultClick = (href: string) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    setSearchResults(null)
    router.push(`/${locale}${href}`)
  }

  // Get icon for result type
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />
      case 'product':
        return <Package className="w-4 h-4" />
      case 'customer':
        return <Users className="w-4 h-4" />
      default:
        return null
    }
  }

  // Get type label
  const getTypeLabel = (type: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      order: { ar: 'طلب', en: 'Order' },
      product: { ar: 'منتج', en: 'Product' },
      customer: { ar: 'عميل', en: 'Customer' },
    }
    return labels[type]?.[locale as 'ar' | 'en'] || type
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div ref={searchRef} className="relative hidden sm:block">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 animate-spin" />
              ) : (
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults && setIsSearchOpen(true)}
                placeholder={t.search}
                className="w-64 ps-10 pe-4 py-2 bg-secondary-100 dark:bg-secondary-700 border-0 rounded-lg text-sm text-secondary-900 dark:text-white placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults && (
              <div className="absolute top-full mt-2 start-0 w-96 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden z-50">
                {searchResults.orders.length === 0 &&
                 searchResults.products.length === 0 &&
                 searchResults.customers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-secondary-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{locale === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {/* Orders */}
                    {searchResults.orders.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-secondary-500 bg-secondary-50 dark:bg-secondary-900">
                          {locale === 'ar' ? 'الطلبات' : 'Orders'}
                        </div>
                        {searchResults.orders.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result.href)}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                          >
                            <span className="text-secondary-400">{getResultIcon(result.type)}</span>
                            <div className="flex-1 text-start">
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">{result.title}</p>
                              <p className="text-xs text-secondary-500">{result.subtitle}</p>
                            </div>
                            {result.status && (
                              <span className="text-xs px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400">
                                {result.status}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Products */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-secondary-500 bg-secondary-50 dark:bg-secondary-900">
                          {locale === 'ar' ? 'المنتجات' : 'Products'}
                        </div>
                        {searchResults.products.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result.href)}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                          >
                            <span className="text-secondary-400">{getResultIcon(result.type)}</span>
                            <div className="flex-1 text-start">
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">
                                {locale === 'ar' && result.titleAr ? result.titleAr : result.title}
                              </p>
                              <p className="text-xs text-secondary-500">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Customers */}
                    {searchResults.customers.length > 0 && (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-secondary-500 bg-secondary-50 dark:bg-secondary-900">
                          {locale === 'ar' ? 'العملاء' : 'Customers'}
                        </div>
                        {searchResults.customers.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleResultClick(result.href)}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                          >
                            <span className="text-secondary-400">{getResultIcon(result.type)}</span>
                            <div className="flex-1 text-start">
                              <p className="text-sm font-medium text-secondary-900 dark:text-white">{result.title}</p>
                              <p className="text-xs text-secondary-500">{result.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* View site */}
          <Link
            href={`/${locale}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t.viewSite}</span>
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-400"
            title={locale === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-400"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-600 dark:text-secondary-400"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-1 end-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications dropdown */}
            {isNotificationsOpen && (
              <div className="absolute end-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {t.notifications}
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {/* Placeholder notifications */}
                  <div className="px-4 py-8 text-center text-secondary-500 dark:text-secondary-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t.noNotifications}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-secondary-400 transition-transform hidden sm:block',
                  isProfileOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Profile dropdown menu */}
            {isProfileOpen && (
              <div className="absolute end-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                  <p className="font-semibold text-secondary-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href={`/${locale}/dashboard/profile`}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>{t.profile}</span>
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/settings`}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t.settings || (locale === 'ar' ? 'الإعدادات' : 'Settings')}</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-secondary-200 dark:border-secondary-700 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
