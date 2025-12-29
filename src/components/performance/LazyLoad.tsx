'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Skeleton } from './Skeleton'

interface LazyLoadProps {
  children: React.ReactNode
  placeholder?: React.ReactNode
  rootMargin?: string
  threshold?: number
  onVisible?: () => void
  className?: string
}

export function LazyLoad({
  children,
  placeholder,
  rootMargin = '100px',
  threshold = 0.1,
  onVisible,
  className = '',
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          onVisible?.()
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [rootMargin, threshold, onVisible])

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? children : (placeholder || <Skeleton className="w-full h-32" />)}
    </div>
  )
}

// Lazy load with fade in animation
interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeIn({ children, delay = 0, duration = 300, className = '' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(elementRef.current)

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={elementRef}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'ease-out',
      }}
    >
      {children}
    </div>
  )
}

// Stagger children animation
interface StaggerProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export function Stagger({ children, staggerDelay = 100, className = '' }: StaggerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

// Infinite scroll component
interface InfiniteScrollProps {
  children: React.ReactNode
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  loadingComponent?: React.ReactNode
  endMessage?: React.ReactNode
  rootMargin?: string
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  loadingComponent,
  endMessage,
  rootMargin = '200px',
}: InfiniteScrollProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!triggerRef.current || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin }
    )

    observer.observe(triggerRef.current)

    return () => observer.disconnect()
  }, [onLoadMore, hasMore, isLoading, rootMargin])

  return (
    <div>
      {children}

      {/* Loading trigger */}
      <div ref={triggerRef} className="h-px" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="py-8 flex justify-center">
          {loadingComponent || (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600" />
          )}
        </div>
      )}

      {/* End message */}
      {!hasMore && !isLoading && endMessage && (
        <div className="py-8 text-center text-secondary-500 dark:text-secondary-400">
          {endMessage}
        </div>
      )}
    </div>
  )
}

// Dynamic import with loading state
interface DynamicLoadProps {
  loader: () => Promise<{ default: React.ComponentType<unknown> }>
  loading?: React.ReactNode
  error?: React.ReactNode
  componentProps?: Record<string, unknown>
}

export function DynamicLoad({
  loader,
  loading,
  error,
  componentProps = {},
}: DynamicLoadProps) {
  const [Component, setComponent] = useState<React.ComponentType<unknown> | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    loader()
      .then((module) => setComponent(() => module.default))
      .catch(() => setHasError(true))
  }, [loader])

  if (hasError) {
    return <>{error || <div className="text-red-500">Failed to load component</div>}</>
  }

  if (!Component) {
    return <>{loading || <Skeleton className="w-full h-32" />}</>
  }

  return <Component {...componentProps} />
}

// Virtualized list for large datasets
interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight
  const totalHeight = items.length * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
