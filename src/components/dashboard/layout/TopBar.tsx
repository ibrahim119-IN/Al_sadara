'use client'

import { useState, useRef, useEffect } from 'react'
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
} from 'lucide-react'
import { useDashboardAuth } from '@/lib/dashboard/auth'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils/cn'

// Dictionary type
interface TopBarDictionary {
  search: string
  notifications: string
  profile: string
  logout: string
  viewSite: string
  noNotifications: string
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

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Search:', searchQuery)
    }
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
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-64 ps-10 pe-4 py-2 bg-secondary-100 dark:bg-secondary-700 border-0 rounded-lg text-sm text-secondary-900 dark:text-white placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>
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
                    <span>Settings</span>
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
