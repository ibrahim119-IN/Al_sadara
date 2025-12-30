'use client'

import { ReactNode } from 'react'

/**
 * FloatingBlob - Subtle blurred circle for section backgrounds
 * Creates depth and visual interest without distraction
 */
export function FloatingBlob({
  className = '',
  color = 'primary',
  size = 'md',
  position = 'top-right',
  animate = false,
}: {
  className?: string
  color?: 'primary' | 'accent' | 'secondary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  animate?: boolean
}) {
  const colorMap = {
    primary: 'bg-primary-500/5',
    accent: 'bg-accent-500/5',
    secondary: 'bg-secondary-500/5',
  }

  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
  }

  const positionMap = {
    'top-right': 'top-0 end-0 -translate-y-1/2 translate-x-1/2',
    'top-left': 'top-0 start-0 -translate-y-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 end-0 translate-y-1/2 translate-x-1/2',
    'bottom-left': 'bottom-0 start-0 translate-y-1/2 -translate-x-1/2',
    'center': 'top-1/2 start-1/2 -translate-y-1/2 -translate-x-1/2',
  }

  return (
    <div
      className={`absolute ${positionMap[position]} ${sizeMap[size]} ${colorMap[color]} rounded-full blur-3xl pointer-events-none ${animate ? 'animate-pulse-glow' : ''} ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * CornerAccent - Decorative corner element for cards and sections
 */
export function CornerAccent({
  position = 'top-right',
  color = 'primary',
  className = '',
}: {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  color?: 'primary' | 'accent'
  className?: string
}) {
  const colorMap = {
    primary: '#0066CC',
    accent: '#D97706',
  }

  const rotationMap = {
    'top-right': 'rotate-0',
    'top-left': 'rotate-90',
    'bottom-left': 'rotate-180',
    'bottom-right': '-rotate-90',
  }

  const positionMap = {
    'top-right': 'top-0 end-0',
    'top-left': 'top-0 start-0',
    'bottom-right': 'bottom-0 end-0',
    'bottom-left': 'bottom-0 start-0',
  }

  return (
    <svg
      className={`absolute ${positionMap[position]} ${rotationMap[position]} w-24 h-24 pointer-events-none opacity-10 ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M0 0 L100 0 L100 20 Q50 20 20 50 L20 100 L0 100 Z"
        fill={colorMap[color]}
      />
    </svg>
  )
}

/**
 * GeometricDecor - Floating geometric shapes for visual interest
 */
export function GeometricDecor({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Circle */}
      <div className="absolute top-1/4 end-10 w-4 h-4 rounded-full border-2 border-primary-200 opacity-30 animate-float-gentle" />
      {/* Square */}
      <div className="absolute top-1/2 start-16 w-3 h-3 border-2 border-accent-300 opacity-20 rotate-45 animate-float-reverse" />
      {/* Ring */}
      <div className="absolute bottom-1/4 end-1/4 w-8 h-8 rounded-full border-2 border-secondary-200 opacity-20 animate-float-gentle" style={{ animationDelay: '1s' }} />
      {/* Small dots */}
      <div className="absolute top-1/3 start-1/3 w-2 h-2 bg-primary-300 rounded-full opacity-20" />
      <div className="absolute bottom-1/3 end-1/3 w-2 h-2 bg-accent-300 rounded-full opacity-20" />
    </div>
  )
}

/**
 * GradientMesh - Gradient mesh background for premium sections
 */
export function GradientMesh({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div className="absolute top-0 start-0 w-1/2 h-1/2 bg-gradient-radial from-primary-100/30 to-transparent" />
      <div className="absolute bottom-0 end-0 w-1/2 h-1/2 bg-gradient-radial from-accent-100/20 to-transparent" />
    </div>
  )
}

/**
 * WaveDivider - SVG wave divider between sections
 */
export function WaveDivider({
  className = '',
  color = '#f8fafc',
  flip = false,
}: {
  className?: string
  color?: string
  flip?: boolean
}) {
  return (
    <div
      className={`absolute left-0 right-0 w-full overflow-hidden ${flip ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}
      style={{ height: '60px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

/**
 * SectionBorderLine - Subtle gradient border line
 */
export function SectionBorderLine({
  position = 'top',
  className = '',
}: {
  position?: 'top' | 'bottom'
  className?: string
}) {
  return (
    <div
      className={`absolute inset-x-0 ${position}-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent ${className}`}
      aria-hidden="true"
    />
  )
}

/**
 * QuoteDecoration - Large decorative quote marks for testimonials
 */
export function QuoteDecoration({
  position = 'start',
  className = '',
}: {
  position?: 'start' | 'end'
  className?: string
}) {
  const positionClasses = position === 'start'
    ? 'top-20 start-10'
    : 'bottom-20 end-10 rotate-180'

  return (
    <div
      className={`absolute ${positionClasses} text-[200px] font-serif text-primary-100/20 leading-none select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      &ldquo;
    </div>
  )
}

/**
 * BackgroundWrapper - Wrapper component that applies decorative patterns
 */
export function BackgroundWrapper({
  children,
  pattern = 'none',
  showBlobs = false,
  className = '',
}: {
  children: ReactNode
  pattern?: 'none' | 'dots' | 'grid' | 'diagonal'
  showBlobs?: boolean
  className?: string
}) {
  const patternClasses = {
    none: '',
    dots: 'bg-pattern-dots',
    grid: 'bg-pattern-grid',
    diagonal: 'bg-pattern-diagonal',
  }

  return (
    <div className={`relative overflow-hidden ${patternClasses[pattern]} ${className}`}>
      {showBlobs && (
        <>
          <FloatingBlob position="top-right" color="primary" size="lg" />
          <FloatingBlob position="bottom-left" color="accent" size="md" />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
