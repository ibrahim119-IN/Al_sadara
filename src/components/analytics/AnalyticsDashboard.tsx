'use client'

import React from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useAnalytics } from '@/hooks/useAnalytics'
import { StatCard } from './StatCard'
import { SimpleChart } from './SimpleChart'
import { DonutChart } from './DonutChart'
import { DataTable } from './DataTable'
import { Period } from '@/lib/analytics/types'

const periodOptions: { value: Period; labelEn: string; labelAr: string }[] = [
  { value: 'today', labelEn: 'Today', labelAr: 'اليوم' },
  { value: 'week', labelEn: 'This Week', labelAr: 'هذا الأسبوع' },
  { value: 'month', labelEn: 'This Month', labelAr: 'هذا الشهر' },
  { value: 'quarter', labelEn: 'This Quarter', labelAr: 'هذا الربع' },
  { value: 'year', labelEn: 'This Year', labelAr: 'هذا العام' },
]

const chartColors = {
  primary: '#0066CC',
  green: '#22C55E',
  orange: '#F59E0B',
  purple: '#8B5CF6',
  red: '#EF4444',
}

export function AnalyticsDashboard() {
  const { locale } = useLocale()
  const isArabic = locale === 'ar'

  const {
    data,
    period,
    isLoading,
    error,
    changePeriod,
    refresh,
  } = useAnalytics({ initialPeriod: 'month' })

  const texts = {
    dashboard: isArabic ? 'لوحة التحليلات' : 'Analytics Dashboard',
    refresh: isArabic ? 'تحديث' : 'Refresh',
    lastUpdated: isArabic ? 'آخر تحديث' : 'Last updated',
    totalRevenue: isArabic ? 'إجمالي الإيرادات' : 'Total Revenue',
    totalOrders: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
    avgOrderValue: isArabic ? 'متوسط قيمة الطلب' : 'Average Order Value',
    totalCustomers: isArabic ? 'إجمالي العملاء' : 'Total Customers',
    newCustomers: isArabic ? 'عملاء جدد' : 'New Customers',
    comparedToPrevious: isArabic ? 'مقارنة بالفترة السابقة' : 'vs previous period',
    salesOverTime: isArabic ? 'المبيعات على مدار الوقت' : 'Sales Over Time',
    orderStatus: isArabic ? 'حالة الطلبات' : 'Order Status',
    categorySales: isArabic ? 'المبيعات حسب الفئة' : 'Sales by Category',
    topProducts: isArabic ? 'أفضل المنتجات' : 'Top Products',
    topCustomers: isArabic ? 'أفضل العملاء' : 'Top Customers',
    paymentMethods: isArabic ? 'طرق الدفع' : 'Payment Methods',
    productName: isArabic ? 'المنتج' : 'Product',
    unitsSold: isArabic ? 'الوحدات المباعة' : 'Units Sold',
    revenue: isArabic ? 'الإيرادات' : 'Revenue',
    customerName: isArabic ? 'العميل' : 'Customer',
    orders: isArabic ? 'الطلبات' : 'Orders',
    totalSpent: isArabic ? 'إجمالي الإنفاق' : 'Total Spent',
    pending: isArabic ? 'قيد الانتظار' : 'Pending',
    processing: isArabic ? 'قيد المعالجة' : 'Processing',
    shipped: isArabic ? 'تم الشحن' : 'Shipped',
    delivered: isArabic ? 'تم التوصيل' : 'Delivered',
    cancelled: isArabic ? 'ملغي' : 'Cancelled',
    productInventory: isArabic ? 'مخزون المنتجات' : 'Product Inventory',
    activeProducts: isArabic ? 'منتجات نشطة' : 'Active Products',
    outOfStock: isArabic ? 'نفذ المخزون' : 'Out of Stock',
    lowStock: isArabic ? 'مخزون منخفض' : 'Low Stock',
    errorLoading: isArabic ? 'حدث خطأ في تحميل البيانات' : 'Error loading data',
    tryAgain: isArabic ? 'حاول مرة أخرى' : 'Try Again',
    currency: isArabic ? 'ج.م' : 'EGP',
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-4">{texts.errorLoading}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {texts.tryAgain}
        </button>
      </div>
    )
  }

  const timeSeriesData = data?.timeSeries.map((item) => ({
    label: new Date(item.date).toLocaleDateString(isArabic ? 'ar-EG' : 'en-EG', { day: 'numeric', month: 'short' }),
    value: item.revenue,
  })) || []

  const orderStatusData = data ? [
    { label: texts.pending, value: data.orders.pending, color: '#F59E0B' },
    { label: texts.processing, value: data.orders.processing, color: '#3B82F6' },
    { label: texts.shipped, value: data.orders.shipped, color: '#8B5CF6' },
    { label: texts.delivered, value: data.orders.delivered, color: '#22C55E' },
    { label: texts.cancelled, value: data.orders.cancelled, color: '#EF4444' },
  ] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white">
          {texts.dashboard}
        </h1>

        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <select
            value={period}
            onChange={(e) => changePeriod(e.target.value as Period)}
            className="px-4 py-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {isArabic ? option.labelAr : option.labelEn}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={isLoading}
            className="p-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Last Updated */}
      {data?.lastUpdated && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          {texts.lastUpdated}: {new Date(data.lastUpdated).toLocaleString(isArabic ? 'ar-EG' : 'en-EG')}
        </p>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title={texts.totalRevenue}
          value={formatCurrency(data?.sales.totalRevenue || 0)}
          change={data?.sales.revenueGrowth}
          changeLabel={texts.comparedToPrevious}
          color="green"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title={texts.totalOrders}
          value={data?.sales.totalOrders || 0}
          change={data?.sales.ordersGrowth}
          changeLabel={texts.comparedToPrevious}
          color="blue"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <StatCard
          title={texts.avgOrderValue}
          value={formatCurrency(data?.sales.averageOrderValue || 0)}
          color="orange"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatCard
          title={texts.newCustomers}
          value={data?.customers.newCustomers || 0}
          change={data?.customers.customerGrowth}
          changeLabel={texts.comparedToPrevious}
          color="purple"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
            {texts.salesOverTime}
          </h3>
          <SimpleChart
            data={timeSeriesData.slice(-14)}
            type="line"
            height={250}
            color={chartColors.primary}
            loading={isLoading}
          />
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
            {texts.orderStatus}
          </h3>
          <DonutChart
            data={orderStatusData}
            size={180}
            thickness={30}
            centerValue={data?.sales.totalOrders || 0}
            centerLabel={texts.orders}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Product Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title={texts.activeProducts}
          value={data?.products.activeProducts || 0}
          color="green"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />

        <StatCard
          title={texts.lowStock}
          value={data?.products.lowStock || 0}
          color="orange"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />

        <StatCard
          title={texts.outOfStock}
          value={data?.products.outOfStock || 0}
          color="red"
          loading={isLoading}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          }
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
            {texts.topProducts}
          </h3>
          <DataTable
            data={data?.products.topSelling || []}
            loading={isLoading}
            columns={[
              {
                key: 'name',
                header: texts.productName,
                render: (item) => (
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <span className="font-medium">
                      {isArabic ? item.nameAr || item.name : item.name}
                    </span>
                  </div>
                ),
              },
              {
                key: 'totalSold',
                header: texts.unitsSold,
                align: 'center',
              },
              {
                key: 'revenue',
                header: texts.revenue,
                align: 'right',
                render: (item) => formatCurrency(item.revenue),
              },
            ]}
          />
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-card dark:shadow-none border border-secondary-100 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
            {texts.topCustomers}
          </h3>
          <DataTable
            data={data?.customers.topCustomers || []}
            loading={isLoading}
            columns={[
              {
                key: 'name',
                header: texts.customerName,
                render: (item) => (
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{item.email}</p>
                  </div>
                ),
              },
              {
                key: 'totalOrders',
                header: texts.orders,
                align: 'center',
              },
              {
                key: 'totalSpent',
                header: texts.totalSpent,
                align: 'right',
                render: (item) => formatCurrency(item.totalSpent),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
