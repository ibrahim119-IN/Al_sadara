'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Settings, Globe, Palette, Bell, Shield, ExternalLink } from 'lucide-react'

export default function GeneralSettingsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const t = {
    title: isRTL ? 'الإعدادات العامة' : 'General Settings',
    description: isRTL
      ? 'قم بتعديل إعدادات الموقع من لوحة تحكم Payload'
      : 'Edit site settings from the Payload admin panel',
    editInPayload: isRTL ? 'تعديل في Payload' : 'Edit in Payload',
    sections: isRTL ? 'الأقسام' : 'Sections',
    siteInfo: isRTL ? 'معلومات الموقع' : 'Site Information',
    siteInfoDesc: isRTL ? 'اسم الموقع والوصف والشعار' : 'Site name, description, and logo',
    localization: isRTL ? 'اللغات' : 'Localization',
    localizationDesc: isRTL ? 'إعدادات اللغة والمنطقة' : 'Language and region settings',
    appearance: isRTL ? 'المظهر' : 'Appearance',
    appearanceDesc: isRTL ? 'الألوان والخطوط والتصميم' : 'Colors, fonts, and design',
    notifications: isRTL ? 'الإشعارات' : 'Notifications',
    notificationsDesc: isRTL ? 'إعدادات البريد والإشعارات' : 'Email and notification settings',
    security: isRTL ? 'الأمان' : 'Security',
    securityDesc: isRTL ? 'إعدادات الأمان والخصوصية' : 'Security and privacy settings',
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
        <Link
          href={`/${locale}/admin/globals/site-settings`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          {t.editInPayload}
        </Link>
      </div>

      {/* Settings Sections */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t.sections}
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.siteInfo}</h3>
                <p className="text-sm text-secondary-500">{t.siteInfoDesc}</p>
              </div>
              <Link
                href={`/${locale}/admin/globals/site-settings`}
                className="p-2 text-secondary-500 hover:text-primary-600"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.localization}</h3>
                <p className="text-sm text-secondary-500">{t.localizationDesc}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.appearance}</h3>
                <p className="text-sm text-secondary-500">{t.appearanceDesc}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.notifications}</h3>
                <p className="text-sm text-secondary-500">{t.notificationsDesc}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.security}</h3>
                <p className="text-sm text-secondary-500">{t.securityDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
