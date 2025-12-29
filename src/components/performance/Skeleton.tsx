'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  animate?: boolean
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`
        bg-secondary-200 dark:bg-secondary-700
        ${animate ? 'animate-pulse' : ''}
        ${roundedClasses[rounded]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
      {/* Image */}
      <Skeleton className="w-full h-48" rounded="none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Category */}
        <Skeleton className="h-4 w-1/2" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full" rounded="lg" />
      </div>
    </div>
  )
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700 p-4 flex items-center gap-4">
      <Skeleton className="w-16 h-16" rounded="xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Article/Blog Card Skeleton
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl overflow-hidden shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
      <Skeleton className="w-full h-48" rounded="none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" rounded="full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-8" rounded="full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-secondary-100 dark:border-secondary-800">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-5 w-full max-w-[150px]" />
        </td>
      ))}
    </tr>
  )
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-secondary-100 dark:border-secondary-800">
      <Skeleton className="w-12 h-12" rounded="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

// Text Block Skeleton
export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  )
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="w-full h-[500px] bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
      <div className="max-w-xl text-center space-y-6 px-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="flex items-center justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-32" rounded="xl" />
          <Skeleton className="h-12 w-32" rounded="xl" />
        </div>
      </div>
    </div>
  )
}

// Grid Skeleton
interface GridSkeletonProps {
  count?: number
  columns?: number
  ItemComponent?: React.ComponentType
}

export function GridSkeleton({
  count = 6,
  columns = 3,
  ItemComponent = ProductCardSkeleton,
}: GridSkeletonProps) {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {[...Array(count)].map((_, i) => (
        <ItemComponent key={i} />
      ))}
    </div>
  )
}
