'use client'

import { useEffect, useRef, useCallback } from 'react'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ')

interface UseFocusTrapOptions {
  isActive?: boolean
  returnFocusOnDeactivate?: boolean
  initialFocus?: React.RefObject<HTMLElement>
}

export function useFocusTrap<T extends HTMLElement = HTMLElement>({
  isActive = true,
  returnFocusOnDeactivate = true,
  initialFocus,
}: UseFocusTrapOptions = {}) {
  const containerRef = useRef<T>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => {
      // Ensure element is visible and not hidden
      const style = window.getComputedStyle(el)
      return style.display !== 'none' && style.visibility !== 'hidden'
    })
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Shift + Tab (backwards)
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    }
    // Tab (forwards)
    else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }, [getFocusableElements])

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the currently focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Focus the initial element or the first focusable element
    const focusableElements = getFocusableElements()
    if (initialFocus?.current) {
      initialFocus.current.focus()
    } else if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus to the previously focused element
      if (returnFocusOnDeactivate && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isActive, getFocusableElements, handleKeyDown, initialFocus, returnFocusOnDeactivate])

  return containerRef
}

// Hook for managing focus within a component
export function useFocusManager() {
  const focusFirst = useCallback((container: HTMLElement | null) => {
    if (!container) return

    const focusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTORS)
    focusable?.focus()
  }, [])

  const focusLast = useCallback((container: HTMLElement | null) => {
    if (!container) return

    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    if (focusables.length > 0) {
      focusables[focusables.length - 1].focus()
    }
  }, [])

  const focusById = useCallback((id: string) => {
    const element = document.getElementById(id)
    element?.focus()
  }, [])

  return { focusFirst, focusLast, focusById }
}
