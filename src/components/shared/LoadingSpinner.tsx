'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'white' | 'secondary'
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
}

const colorClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  white: 'border-white/30 border-t-white',
  secondary: 'border-secondary-200 border-t-secondary-600',
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  color = 'primary',
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full
        animate-spin
        ${className}
      `}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
  className?: string
}

export function LoadingOverlay({ message, className = '' }: LoadingOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm ${className}`}
      role="alert"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        {message && (
          <p className="text-secondary-600 font-medium animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`} role="status" aria-label="Loading">
      <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
