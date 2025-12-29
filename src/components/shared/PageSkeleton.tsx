'use client'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: 'shimmer 1.5s infinite',
      }}
    />
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-[60vh] bg-secondary-100">
        <div className="container mx-auto px-4 py-16 h-full flex flex-col justify-center">
          <Skeleton className="h-12 w-3/4 max-w-xl mb-4" />
          <Skeleton className="h-6 w-1/2 max-w-md mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="p-5">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-secondary-100">
      <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-8 w-24 rounded-full" /></td>
    </tr>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-secondary-100">
      <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full shrink-0" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  )
}
