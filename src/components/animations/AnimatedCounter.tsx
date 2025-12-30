'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useSpring, useTransform, motion, useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  className?: string
}

/**
 * AnimatedCounter - Smooth number counter animation using framer-motion
 *
 * Usage:
 * <AnimatedCounter value={1000} prefix="+" suffix="+" duration={2} />
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReducedMotion = useReducedMotion()

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: prefersReducedMotion ? 0 : duration * 1000,
  })

  const display = useTransform(spring, (latest) => {
    const formatted = decimals > 0
      ? latest.toFixed(decimals)
      : Math.floor(latest).toLocaleString()
    return prefix + formatted + suffix
  })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  // For reduced motion, just show the final value
  if (prefersReducedMotion) {
    const formatted = decimals > 0
      ? value.toFixed(decimals)
      : value.toLocaleString()
    return (
      <span ref={ref} className={className}>
        {prefix}{formatted}{suffix}
      </span>
    )
  }

  return <motion.span ref={ref} className={className}>{display}</motion.span>
}

/**
 * AnimatedCounterCSS - Lightweight CSS-only counter (no framer-motion)
 * Better performance for simple use cases
 */
export function AnimatedCounterCSS({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDisplayValue(value)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = performance.now()
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Ease out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(eased * value))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setDisplayValue(value)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}

/**
 * parseStatValue - Helper to parse stat values like "+1000" or "100%"
 */
export function parseStatValue(value: string): {
  numericValue: number
  prefix: string
  suffix: string
} {
  const match = value.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/)
  if (match) {
    return {
      prefix: match[1] || '',
      numericValue: parseFloat(match[2]),
      suffix: match[3] || '',
    }
  }
  return { prefix: '', numericValue: 0, suffix: '' }
}
