'use client'

import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: 'primary' | 'green' | 'blue' | 'orange' | 'purple' | 'red'
  loading?: boolean
}

const colorClasses = {
  primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'primary',
  loading = false,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  if (loading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-24"></div>
            <div className="h-10 w-10 bg-secondary-200 dark:bg-secondary-700 rounded-xl"></div>
          </div>
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
          {title}
        </p>
        {icon && (
          <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      <p className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className={`
            inline-flex items-center gap-0.5 text-sm font-medium
            ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}
          `}>
            {isPositive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
