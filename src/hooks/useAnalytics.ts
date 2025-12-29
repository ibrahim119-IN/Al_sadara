'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardData, Period } from '@/lib/analytics/types'

interface UseAnalyticsOptions {
  initialPeriod?: Period
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useAnalytics({
  initialPeriod = 'month',
  autoRefresh = false,
  refreshInterval = 60000,
}: UseAnalyticsOptions = {}) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string } | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let url = `/api/analytics?period=${period}`

      if (period === 'custom' && customDateRange) {
        url += `&from=${customDateRange.from}&to=${customDateRange.to}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [period, customDateRange])

  const changePeriod = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod)
    if (newPeriod !== 'custom') {
      setCustomDateRange(null)
    }
  }, [])

  const setDateRange = useCallback((from: string, to: string) => {
    setPeriod('custom')
    setCustomDateRange({ from, to })
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = setInterval(fetchData, refreshInterval)
    return () => clearInterval(intervalId)
  }, [autoRefresh, refreshInterval, fetchData])

  return {
    data,
    period,
    isLoading,
    error,
    customDateRange,
    changePeriod,
    setDateRange,
    refresh,
  }
}
