'use client'

import React, { useEffect, useId, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  className?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  className = '',
}: AccessibleModalProps) {
  const titleId = useId()
  const descriptionId = useId()

  const containerRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    returnFocusOnDeactivate: true,
    initialFocus: initialFocusRef,
  })

  // Handle escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose()
    }
  }, [closeOnEscape, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }, [closeOnOverlayClick, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={handleOverlayClick}
      />

      {/* Modal */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white dark:bg-secondary-800
          rounded-2xl shadow-xl
          transform transition-all
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2
            id={titleId}
            className="text-xl font-semibold text-secondary-900 dark:text-white"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="
                p-2 rounded-lg
                text-secondary-400 hover:text-secondary-600
                dark:text-secondary-500 dark:hover:text-secondary-300
                hover:bg-secondary-100 dark:hover:bg-secondary-700
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                dark:focus:ring-offset-secondary-800
              "
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Description (if provided) */}
        {description && (
          <p
            id={descriptionId}
            className="px-6 pt-4 text-sm text-secondary-600 dark:text-secondary-400"
          >
            {description}
          </p>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

// Utility for modal actions
interface ModalActionsProps {
  children: React.ReactNode
  className?: string
}

export function ModalActions({ children, className = '' }: ModalActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-4 border-t border-secondary-200 dark:border-secondary-700 ${className}`}>
      {children}
    </div>
  )
}
