'use client'

import React from 'react'

interface VisuallyHiddenProps {
  children: React.ReactNode
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  focusable?: boolean
  id?: string
  className?: string
}

/**
 * VisuallyHidden component hides content visually while keeping it accessible to screen readers.
 *
 * Use cases:
 * - Providing additional context for screen reader users
 * - Labeling icon-only buttons
 * - Skip links that become visible on focus
 * - Form field descriptions
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
  focusable = false,
  id,
  className = '',
}: VisuallyHiddenProps) {
  return (
    <Component
      id={id}
      className={`
        absolute w-px h-px p-0 -m-px overflow-hidden
        whitespace-nowrap border-0
        ${focusable ? 'focus:relative focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible' : ''}
        [clip:rect(0,0,0,0)]
        ${className}
      `}
    >
      {children}
    </Component>
  )
}

/**
 * Screen reader only text - alias for VisuallyHidden
 */
export function SrOnly({ children, ...props }: VisuallyHiddenProps) {
  return <VisuallyHidden {...props}>{children}</VisuallyHidden>
}
