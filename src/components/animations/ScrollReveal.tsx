'use client'

import { useRef, ReactNode, useEffect, useState } from 'react'
import { motion, useInView, Variants, useReducedMotion } from 'framer-motion'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  threshold?: number
}

const animations: Record<AnimationType, Variants> = {
  'fade-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

// No-animation variants for reduced motion preference
const noAnimationVariants: Variants = {
  hidden: {},
  visible: {},
}

/**
 * ScrollReveal - Scroll-triggered animation wrapper using framer-motion
 *
 * Usage:
 * <ScrollReveal animation="fade-up" delay={0.2}>
 *   <YourComponent />
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion ? noAnimationVariants : animations[animation]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerContainer - Container for staggered children animations
 *
 * Usage:
 * <StaggerContainer>
 *   <StaggerItem>Item 1</StaggerItem>
 *   <StaggerItem>Item 2</StaggerItem>
 * </StaggerContainer>
 */
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
  once?: boolean
  threshold?: number
}

const containerVariants = (staggerDelay: number, delayChildren: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
})

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.2,
  once = true,
  threshold = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      variants={prefersReducedMotion ? noAnimationVariants : containerVariants(staggerDelay, delayChildren)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerItem - Child item for StaggerContainer
 */
interface StaggerItemProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
}

const itemVariants = (animation: AnimationType): Variants => ({
  hidden: animations[animation].hidden,
  visible: {
    ...animations[animation].visible,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
})

export function StaggerItem({
  children,
  className = '',
  animation = 'fade-up',
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      variants={prefersReducedMotion ? noAnimationVariants : itemVariants(animation)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * FadeIn - Simple fade-in animation using CSS
 * Lighter alternative to framer-motion for simple cases
 */
interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const directionStyles: Record<string, string> = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    none: '',
  }

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : undefined,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div className={`${!isVisible ? directionStyles[direction] : ''} transition-transform`} style={{ transitionDuration: `${duration}ms` }}>
        {children}
      </div>
    </div>
  )
}
