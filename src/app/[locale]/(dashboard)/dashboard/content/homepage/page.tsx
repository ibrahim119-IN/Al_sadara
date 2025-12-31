'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Home, ExternalLink, Settings } from 'lucide-react'

export default function HomepagePage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const t = {
    title: isRTL ? 'إعدادات الصفحة الرئيسية' : 'Homepage Settings',
    description: isRTL
      ? 'قم بتعديل محتوى الصفحة الرئيسية من لوحة تحكم Payload'
      : 'Edit homepage content from the Payload admin panel',
    editInPayload: isRTL ? 'تعديل في Payload' : 'Edit in Payload',
    viewSite: isRTL ? 'عرض الموقع' : 'View Site',
    sections: isRTL ? 'الأقسام' : 'Sections',
    heroSection: isRTL ? 'قسم البطل' : 'Hero Section',
    featuredProducts: isRTL ? 'المنتجات المميزة' : 'Featured Products',
    categories: isRTL ? 'التصنيفات' : 'Categories',
    testimonials: isRTL ? 'آراء العملاء' : 'Testimonials',
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-secondary-500 dark:text-secondary-400">
            {t.description}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/${locale}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t.viewSite}
          </Link>
          <Link
            href={`/${locale}/admin/globals/homepage`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {t.editInPayload}
          </Link>
        </div>
      </div>

      {/* Sections Overview */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t.sections}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.heroSection}</h3>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Home className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.featuredProducts}</h3>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.categories}</h3>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.testimonials}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
