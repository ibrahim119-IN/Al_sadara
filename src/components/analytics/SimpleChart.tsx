'use client'

import React from 'react'

interface DataPoint {
  label: string
  value: number
}

interface SimpleChartProps {
  data: DataPoint[]
  type: 'bar' | 'line'
  height?: number
  color?: string
  showLabels?: boolean
  showValues?: boolean
  loading?: boolean
}

export function SimpleChart({
  data,
  type,
  height = 200,
  color = '#0066CC',
  showLabels = true,
  showValues = false,
  loading = false,
}: SimpleChartProps) {
  if (loading) {
    return (
      <div className="animate-pulse" style={{ height }}>
        <div className="h-full bg-secondary-200 dark:bg-secondary-700 rounded"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-secondary-400 dark:text-secondary-500"
        style={{ height }}
      >
        No data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const barWidth = 100 / data.length

  if (type === 'bar') {
    return (
      <div className="relative" style={{ height }}>
        <div className="absolute inset-0 flex items-end gap-1">
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * 100
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end"
              >
                {showValues && point.value > 0 && (
                  <span className="text-xs text-secondary-600 dark:text-secondary-400 mb-1">
                    {point.value.toLocaleString()}
                  </span>
                )}
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: color,
                    minHeight: point.value > 0 ? '4px' : '0',
                  }}
                />
                {showLabels && (
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 mt-2 truncate max-w-full">
                    {point.label}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Line chart using SVG
  const points = data.map((point, index) => ({
    x: (index / (data.length - 1 || 1)) * 100,
    y: 100 - (point.value / maxValue) * 100,
  }))

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaD = `${pathD} L 100 100 L 0 100 Z`

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d={areaD}
          fill="url(#areaGradient)"
          className="transition-all duration-300"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-300"
        />

        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="white"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="transition-all duration-300 hover:r-4"
          />
        ))}
      </svg>

      {showLabels && (
        <div className="flex justify-between mt-2">
          {data.map((point, index) => (
            <span
              key={index}
              className="text-xs text-secondary-500 dark:text-secondary-400 truncate"
              style={{ width: `${barWidth}%`, textAlign: 'center' }}
            >
              {point.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
