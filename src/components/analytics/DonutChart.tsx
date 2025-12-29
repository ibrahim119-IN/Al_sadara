'use client'

import React from 'react'

interface DonutChartData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartData[]
  size?: number
  thickness?: number
  showLabels?: boolean
  centerLabel?: string
  centerValue?: string | number
  loading?: boolean
}

export function DonutChart({
  data,
  size = 200,
  thickness = 40,
  showLabels = true,
  centerLabel,
  centerValue,
  loading = false,
}: DonutChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="animate-pulse rounded-full bg-secondary-200 dark:bg-secondary-700" style={{ width: size, height: size }}></div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-secondary-400 dark:text-secondary-500"
        style={{ width: size, height: size }}
      >
        No data
      </div>
    )
  }

  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  let currentOffset = 0

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total
            const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`
            const strokeDashoffset = -currentOffset

            currentOffset += circumference * percentage

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>

        {/* Center content */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue !== undefined && (
              <span className="text-2xl font-bold text-secondary-900 dark:text-white">
                {typeof centerValue === 'number' ? centerValue.toLocaleString() : centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-sm text-secondary-500 dark:text-secondary-400">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLabels && (
        <div className="flex flex-wrap justify-center gap-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                {item.label}
              </span>
              <span className="text-sm font-medium text-secondary-900 dark:text-white">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
