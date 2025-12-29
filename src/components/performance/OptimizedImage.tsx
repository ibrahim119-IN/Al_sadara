'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallback?: string
  lowQualitySrc?: string
  aspectRatio?: string
  showSkeleton?: boolean
  fadeIn?: boolean
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/images/placeholder.png',
  lowQualitySrc,
  aspectRatio,
  showSkeleton = true,
  fadeIn = true,
  onLoad,
  onError,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    observer.observe(imageRef.current)

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    onError?.()
  }

  const imageSrc = hasError ? fallback : src

  const wrapperStyle: React.CSSProperties = aspectRatio
    ? { aspectRatio, position: 'relative' }
    : { position: 'relative' }

  return (
    <div
      ref={imageRef}
      className={`overflow-hidden ${className}`}
      style={wrapperStyle}
    >
      {/* Skeleton/Placeholder */}
      {showSkeleton && isLoading && (
        <div
          className="absolute inset-0 bg-secondary-200 dark:bg-secondary-700 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Low quality placeholder (LQIP) */}
      {lowQualitySrc && isLoading && (
        <Image
          src={lowQualitySrc}
          alt=""
          fill
          className="object-cover blur-lg scale-110"
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      {isInView && (
        <Image
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            ${fadeIn ? 'transition-opacity duration-300' : ''}
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          {...props}
        />
      )}
    </div>
  )
}

// Product Image with gallery support
interface ProductImageProps {
  images: Array<{ url: string; alt?: string }>
  productName: string
  className?: string
}

export function ProductImage({ images, productName, className = '' }: ProductImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  if (!images || images.length === 0) {
    return (
      <div className={`bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center ${className}`}>
        <svg className="w-16 h-16 text-secondary-300 dark:text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-secondary-100 dark:bg-secondary-800 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <OptimizedImage
          src={images[currentIndex].url}
          alt={images[currentIndex].alt || `${productName} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={currentIndex === 0}
        />

        {/* Zoom overlay */}
        {isZoomed && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${images[currentIndex].url})`,
              backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                ${currentIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'border-transparent hover:border-secondary-300 dark:hover:border-secondary-600'
                }
              `}
              aria-label={`View image ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
            >
              <OptimizedImage
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Avatar with fallback
interface AvatarProps {
  src?: string | null
  alt: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  if (!src || hasError) {
    return (
      <div
        className={`
          inline-flex items-center justify-center rounded-full
          bg-primary-100 dark:bg-primary-900
          text-primary-600 dark:text-primary-400
          font-semibold
          ${avatarSizes[size]}
          ${className}
        `}
        aria-label={alt}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={`relative rounded-full overflow-hidden ${avatarSizes[size]} ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
        showSkeleton={true}
      />
    </div>
  )
}
