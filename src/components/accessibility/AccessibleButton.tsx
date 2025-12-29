'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
  className?: string
}

interface ButtonAsButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  as?: 'button'
  href?: never
}

interface ButtonAsLinkProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  as: 'link'
  href: string
  external?: boolean
}

export type AccessibleButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-primary-600 text-white
    hover:bg-primary-700
    focus:ring-primary-500
    disabled:bg-primary-300 dark:disabled:bg-primary-800
  `,
  secondary: `
    bg-secondary-100 text-secondary-900
    dark:bg-secondary-700 dark:text-white
    hover:bg-secondary-200 dark:hover:bg-secondary-600
    focus:ring-secondary-500
    disabled:bg-secondary-50 disabled:text-secondary-400
    dark:disabled:bg-secondary-800 dark:disabled:text-secondary-500
  `,
  outline: `
    border-2 border-primary-600 text-primary-600
    dark:border-primary-400 dark:text-primary-400
    hover:bg-primary-50 dark:hover:bg-primary-900/20
    focus:ring-primary-500
    disabled:border-primary-300 disabled:text-primary-300
    dark:disabled:border-primary-700 dark:disabled:text-primary-700
  `,
  ghost: `
    text-secondary-600 dark:text-secondary-400
    hover:bg-secondary-100 dark:hover:bg-secondary-800
    hover:text-secondary-900 dark:hover:text-white
    focus:ring-secondary-500
    disabled:text-secondary-300 dark:disabled:text-secondary-600
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus:ring-red-500
    disabled:bg-red-300 dark:disabled:bg-red-800
  `,
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
  xl: 'px-8 py-4 text-xl gap-3',
}

const iconSizes: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-7 h-7',
}

export const AccessibleButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AccessibleButtonProps>(
  function AccessibleButton(props, ref) {
    const {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      ...rest
    } = props

    const baseClasses = `
      inline-flex items-center justify-center
      font-medium rounded-xl
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      dark:focus:ring-offset-secondary-900
      disabled:cursor-not-allowed
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${isLoading ? 'cursor-wait' : ''}
      ${className}
    `

    const content = (
      <>
        {isLoading && (
          <svg
            className={`animate-spin ${iconSizes[size]}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className={iconSizes[size]} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && (
          <span className={iconSizes[size]} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    )

    // Render as link
    if ('as' in rest && rest.as === 'link') {
      const { as, href, external, ...linkProps } = rest as ButtonAsLinkProps

      if (external) {
        return (
          <a
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            {...linkProps}
          >
            {content}
          </a>
        )
      }

      return (
        <Link
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
          {...(linkProps as Omit<typeof linkProps, 'as'>)}
        >
          {content}
        </Link>
      )
    }

    // Render as button
    const { as, ...buttonProps } = rest as ButtonAsButtonProps

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={(buttonProps as ButtonAsButtonProps).type || 'button'}
        disabled={isLoading || (buttonProps as ButtonAsButtonProps).disabled}
        aria-busy={isLoading}
        className={baseClasses}
        {...buttonProps}
      >
        {content}
      </button>
    )
  }
)
