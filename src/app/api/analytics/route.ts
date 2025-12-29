import { NextRequest, NextResponse } from 'next/server'
import { getDashboardData, Period } from '@/lib/analytics'

// GET /api/analytics - Get dashboard analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') || 'month') as Period
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    // Validate period
    const validPeriods: Period[] = ['today', 'week', 'month', 'quarter', 'year', 'custom']
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be one of: today, week, month, quarter, year, custom' },
        { status: 400 }
      )
    }

    // Custom date range
    let customRange
    if (period === 'custom') {
      if (!fromDate || !toDate) {
        return NextResponse.json(
          { error: 'Custom period requires from and to dates' },
          { status: 400 }
        )
      }
      customRange = {
        from: new Date(fromDate),
        to: new Date(toDate),
      }
    }

    const data = await getDashboardData(period, customRange)

    return NextResponse.json({
      success: true,
      period,
      data,
    })
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
