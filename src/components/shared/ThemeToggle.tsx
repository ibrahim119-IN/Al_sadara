'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useRef, useEffect } from 'react'

interface ThemeToggleProps {
  showLabel?: boolean
  locale?: 'ar' | 'en'
}

export function ThemeToggle({ showLabel = false, locale = 'ar' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const labels = {
    ar: {
      light: 'فاتح',
      dark: 'داكن',
      system: 'تلقائي',
      toggle: 'تبديل الوضع',
    },
    en: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggle: 'Toggle theme',
    },
  }

  const t = labels[locale]

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const ThemeIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div className="relative" ref={menuRef}>
      {/* Simple Toggle Button */}
      <button
        onClick={toggleTheme}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
        className={`
          p-2 rounded-lg transition-all duration-200
          bg-secondary-100 dark:bg-secondary-800
          hover:bg-secondary-200 dark:hover:bg-secondary-700
          text-secondary-600 dark:text-secondary-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          dark:focus:ring-offset-secondary-900
        `}
        aria-label={t.toggle}
        title={`${t.toggle} (${locale === 'ar' ? 'انقر بالزر الأيمن للمزيد' : 'Right-click for more options'})`}
      >
        <ThemeIcon className="w-5 h-5" />
        {showLabel && (
          <span className="mr-2 text-sm">
            {resolvedTheme === 'dark' ? t.dark : t.light}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          className={`
            absolute top-full mt-2 py-2 w-36
            bg-white dark:bg-secondary-800
            rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700
            z-50
            ${locale === 'ar' ? 'left-0' : 'right-0'}
          `}
        >
          <button
            onClick={() => {
              setTheme('light')
              setShowMenu(false)
            }}
            className={`
              w-full flex items-center gap-2 px-4 py-2 text-sm
              ${theme === 'light' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-secondary-700 dark:text-secondary-300'}
              hover:bg-secondary-100 dark:hover:bg-secondary-700
              transition-colors
            `}
          >
            <Sun className="w-4 h-4" />
            <span>{t.light}</span>
          </button>

          <button
            onClick={() => {
              setTheme('dark')
              setShowMenu(false)
            }}
            className={`
              w-full flex items-center gap-2 px-4 py-2 text-sm
              ${theme === 'dark' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-secondary-700 dark:text-secondary-300'}
              hover:bg-secondary-100 dark:hover:bg-secondary-700
              transition-colors
            `}
          >
            <Moon className="w-4 h-4" />
            <span>{t.dark}</span>
          </button>

          <button
            onClick={() => {
              setTheme('system')
              setShowMenu(false)
            }}
            className={`
              w-full flex items-center gap-2 px-4 py-2 text-sm
              ${theme === 'system' ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'text-secondary-700 dark:text-secondary-300'}
              hover:bg-secondary-100 dark:hover:bg-secondary-700
              transition-colors
            `}
          >
            <Monitor className="w-4 h-4" />
            <span>{t.system}</span>
          </button>
        </div>
      )}
    </div>
  )
}
