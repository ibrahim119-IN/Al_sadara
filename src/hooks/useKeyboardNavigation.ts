'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseKeyboardNavigationOptions<T> {
  items: T[]
  onSelect?: (item: T, index: number) => void
  onEscape?: () => void
  loop?: boolean
  orientation?: 'vertical' | 'horizontal' | 'both'
  initialIndex?: number
  typeahead?: boolean
  getItemLabel?: (item: T) => string
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  onEscape,
  loop = true,
  orientation = 'vertical',
  initialIndex = -1,
  typeahead = false,
  getItemLabel,
}: UseKeyboardNavigationOptions<T>) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const containerRef = useRef<HTMLElement>(null)
  const typeaheadBufferRef = useRef('')
  const typeaheadTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const moveTo = useCallback((index: number) => {
    if (items.length === 0) return

    let newIndex = index

    if (loop) {
      if (newIndex < 0) newIndex = items.length - 1
      if (newIndex >= items.length) newIndex = 0
    } else {
      newIndex = Math.max(0, Math.min(items.length - 1, newIndex))
    }

    setActiveIndex(newIndex)
    return newIndex
  }, [items.length, loop])

  const moveUp = useCallback(() => moveTo(activeIndex - 1), [activeIndex, moveTo])
  const moveDown = useCallback(() => moveTo(activeIndex + 1), [activeIndex, moveTo])
  const moveToFirst = useCallback(() => moveTo(0), [moveTo])
  const moveToLast = useCallback(() => moveTo(items.length - 1), [items.length, moveTo])

  const handleTypeahead = useCallback((key: string) => {
    if (!typeahead || !getItemLabel || key.length !== 1) return false

    // Clear previous timeout
    if (typeaheadTimeoutRef.current) {
      clearTimeout(typeaheadTimeoutRef.current)
    }

    // Add to buffer
    typeaheadBufferRef.current += key.toLowerCase()

    // Find matching item
    const matchIndex = items.findIndex((item) =>
      getItemLabel(item).toLowerCase().startsWith(typeaheadBufferRef.current)
    )

    if (matchIndex !== -1) {
      moveTo(matchIndex)
    }

    // Clear buffer after delay
    typeaheadTimeoutRef.current = setTimeout(() => {
      typeaheadBufferRef.current = ''
    }, 500)

    return true
  }, [typeahead, getItemLabel, items, moveTo])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key } = event

    // Handle typeahead first
    if (handleTypeahead(key)) {
      return
    }

    let handled = false

    switch (key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          moveUp()
          handled = true
        }
        break

      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          moveDown()
          handled = true
        }
        break

      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          moveUp()
          handled = true
        }
        break

      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          moveDown()
          handled = true
        }
        break

      case 'Home':
        event.preventDefault()
        moveToFirst()
        handled = true
        break

      case 'End':
        event.preventDefault()
        moveToLast()
        handled = true
        break

      case 'Enter':
      case ' ':
        if (activeIndex >= 0 && onSelect) {
          event.preventDefault()
          onSelect(items[activeIndex], activeIndex)
          handled = true
        }
        break

      case 'Escape':
        if (onEscape) {
          event.preventDefault()
          onEscape()
          handled = true
        }
        break
    }

    return handled
  }, [orientation, activeIndex, items, onSelect, onEscape, moveUp, moveDown, moveToFirst, moveToLast, handleTypeahead])

  // Cleanup
  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current)
      }
    }
  }, [])

  // Reset active index when items change
  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(items.length > 0 ? items.length - 1 : -1)
    }
  }, [items.length, activeIndex])

  return {
    activeIndex,
    setActiveIndex: moveTo,
    handleKeyDown,
    containerRef,
    isActive: (index: number) => index === activeIndex,
    getItemProps: (index: number) => ({
      'aria-selected': index === activeIndex,
      tabIndex: index === activeIndex ? 0 : -1,
      onClick: () => {
        moveTo(index)
        if (onSelect) onSelect(items[index], index)
      },
    }),
  }
}

// Hook for keyboard shortcuts
interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey)
        const shiftMatch = !!shortcut.shift === event.shiftKey
        const altMatch = !!shortcut.alt === event.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          shortcut.handler()
          return
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])

  return shortcuts.map((s) => ({
    key: s.key,
    modifiers: [
      s.ctrl && 'Ctrl',
      s.shift && 'Shift',
      s.alt && 'Alt',
      s.meta && 'Meta',
    ].filter(Boolean).join('+'),
    description: s.description,
  }))
}
