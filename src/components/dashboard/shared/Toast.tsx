'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  // Convenience methods
  success: (title: string, message?: string) => string
  error: (title: string, message?: string) => string
  warning: (title: string, message?: string) => string
  info: (title: string, message?: string) => string
}

const ToastContext = createContext<ToastContextType | null>(null)

// Generate unique ID
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Toast Provider
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId()
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true,
    }

    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: 'success', title, message })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: 'error', title, message, duration: 8000 })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: 'warning', title, message })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string) => {
      return addToast({ type: 'info', title, message })
    },
    [addToast]
  )

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearToasts,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Toast Container
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed top-4 end-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  )
}

// Single Toast Item
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Auto dismiss
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const startTime = Date.now()
      const duration = toast.duration

      // Progress animation
      progressRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
        setProgress(remaining)
      }, 50)

      // Dismiss timer
      timerRef.current = setTimeout(() => {
        handleDismiss()
      }, duration)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [toast.duration])

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 200)
  }, [toast.id, onRemove])

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (toast.duration && toast.duration > 0) {
      const remainingTime = (progress / 100) * toast.duration

      progressRef.current = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - (50 / remainingTime) * 100))
      }, 50)

      timerRef.current = setTimeout(() => {
        handleDismiss()
      }, remainingTime)
    }
  }, [toast.duration, progress, handleDismiss])

  const typeStyles = {
    success: {
      container: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
      icon: 'text-green-500',
      progress: 'bg-green-500',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
      icon: 'text-red-500',
      progress: 'bg-red-500',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-500',
      progress: 'bg-yellow-500',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500',
      progress: 'bg-blue-500',
    },
  }

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[toast.type]
  const styles = typeStyles[toast.type]

  return (
    <div
      className={cn(
        'relative pointer-events-auto w-full overflow-hidden rounded-lg border shadow-lg',
        'transform transition-all duration-200',
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0',
        styles.container
      )}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', styles.icon)} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-secondary-900 dark:text-white">
              {toast.title}
            </p>
            {toast.message && (
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                {toast.message}
              </p>
            )}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Dismiss button */}
          {toast.dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 start-0 end-0 h-1 bg-secondary-200 dark:bg-secondary-700">
          <div
            className={cn('h-full transition-all duration-50', styles.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// Export toast function for non-React contexts (will be initialized by provider)
let toastFn: ToastContextType | null = null

export const toast = {
  success: (title: string, message?: string) => toastFn?.success(title, message),
  error: (title: string, message?: string) => toastFn?.error(title, message),
  warning: (title: string, message?: string) => toastFn?.warning(title, message),
  info: (title: string, message?: string) => toastFn?.info(title, message),
  custom: (toast: Omit<Toast, 'id'>) => toastFn?.addToast(toast),
  dismiss: (id: string) => toastFn?.removeToast(id),
  dismissAll: () => toastFn?.clearToasts(),
}

// Initialize toast function (call this from provider effect)
export function initializeToast(context: ToastContextType) {
  toastFn = context
}

export default ToastProvider
