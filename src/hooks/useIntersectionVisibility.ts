'use client'

import { useState, useEffect, useRef, type RefObject } from 'react'

interface UseIntersectionVisibilityOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
  enabled?: boolean
}

interface UseIntersectionVisibilityReturn<T extends HTMLElement> {
  ref: RefObject<T>
  isVisible: boolean
  hasBeenVisible: boolean
}

export function useIntersectionVisibility<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionVisibilityOptions = {}
): UseIntersectionVisibilityReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    enabled = true,
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    if (!enabled || (triggerOnce && hasBeenVisible)) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)

        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true)

          // Disconnect if we only need to trigger once
          if (triggerOnce) {
            observer.disconnect()
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, enabled, hasBeenVisible])

  return { ref: ref as RefObject<T>, isVisible, hasBeenVisible }
}

// Multiple elements visibility tracking
interface UseMultipleIntersectionVisibilityOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useMultipleIntersectionVisibility(
  count: number,
  options: UseMultipleIntersectionVisibilityOptions = {}
): {
  refs: RefObject<HTMLDivElement>[]
  visibleItems: Set<number>
  isAllVisible: boolean
} {
  const { threshold = 0.2, rootMargin = '50px', triggerOnce = true } = options

  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const refsArray = useRef<(HTMLDivElement | null)[]>([])

  // Initialize refs array
  const refs = Array.from({ length: count }, (_, i) => {
    const refObj = {
      get current() {
        return refsArray.current[i] || null
      },
      set current(el: HTMLDivElement | null) {
        refsArray.current[i] = el
      },
    }
    return refObj as RefObject<HTMLDivElement>
  })

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    refsArray.current.forEach((element, index) => {
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))

            if (triggerOnce) {
              observer.disconnect()
            }
          } else if (!triggerOnce) {
            setVisibleItems((prev) => {
              const next = new Set(prev)
              next.delete(index)
              return next
            })
          }
        },
        { threshold, rootMargin }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [count, threshold, rootMargin, triggerOnce])

  return {
    refs,
    visibleItems,
    isAllVisible: visibleItems.size === count,
  }
}

// Simple hook for animation delays
export function useAnimationDelay(isVisible: boolean, baseDelay: number = 0) {
  return {
    className: `transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`,
    style: { transitionDelay: `${baseDelay}ms` },
  }
}
