'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation, Settings, ExternalLink } from 'lucide-react'

export default function NavigationPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const t = {
    title: isRTL ? 'إعدادات التنقل' : 'Navigation Settings',
    description: isRTL
      ? 'قم بتعديل قوائم التنقل من لوحة تحكم Payload'
      : 'Edit navigation menus from the Payload admin panel',
    editInPayload: isRTL ? 'تعديل في Payload' : 'Edit in Payload',
    viewSite: isRTL ? 'عرض الموقع' : 'View Site',
    mainMenu: isRTL ? 'القائمة الرئيسية' : 'Main Menu',
    mainMenuDesc: isRTL ? 'روابط القائمة العلوية' : 'Top navigation links',
    mobileMenu: isRTL ? 'قائمة الموبايل' : 'Mobile Menu',
    mobileMenuDesc: isRTL ? 'روابط قائمة الموبايل' : 'Mobile navigation links',
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
            href={`/${locale}/admin/globals/navigation`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {t.editInPayload}
          </Link>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-white">{t.mainMenu}</h3>
              <p className="text-sm text-secondary-500">{t.mainMenuDesc}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-white">{t.mobileMenu}</h3>
              <p className="text-sm text-secondary-500">{t.mobileMenuDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
