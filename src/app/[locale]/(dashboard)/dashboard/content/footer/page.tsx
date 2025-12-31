'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PanelBottom, Settings, ExternalLink } from 'lucide-react'

export default function FooterPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const t = {
    title: isRTL ? 'إعدادات التذييل' : 'Footer Settings',
    description: isRTL
      ? 'قم بتعديل محتوى التذييل من لوحة تحكم Payload'
      : 'Edit footer content from the Payload admin panel',
    editInPayload: isRTL ? 'تعديل في Payload' : 'Edit in Payload',
    viewSite: isRTL ? 'عرض الموقع' : 'View Site',
    sections: isRTL ? 'الأقسام' : 'Sections',
    contactInfo: isRTL ? 'معلومات الاتصال' : 'Contact Info',
    contactInfoDesc: isRTL ? 'العنوان والهاتف والبريد' : 'Address, phone, and email',
    socialLinks: isRTL ? 'روابط التواصل' : 'Social Links',
    socialLinksDesc: isRTL ? 'روابط مواقع التواصل الاجتماعي' : 'Social media links',
    quickLinks: isRTL ? 'روابط سريعة' : 'Quick Links',
    quickLinksDesc: isRTL ? 'روابط مختصرة للصفحات' : 'Shortcut links to pages',
    copyright: isRTL ? 'حقوق النشر' : 'Copyright',
    copyrightDesc: isRTL ? 'نص حقوق النشر' : 'Copyright text',
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
            href={`/${locale}/admin/globals/footer`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            {t.editInPayload}
          </Link>
        </div>
      </div>

      {/* Footer Sections */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          {t.sections}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <PanelBottom className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.contactInfo}</h3>
                <p className="text-sm text-secondary-500">{t.contactInfoDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <PanelBottom className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.socialLinks}</h3>
                <p className="text-sm text-secondary-500">{t.socialLinksDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <PanelBottom className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.quickLinks}</h3>
                <p className="text-sm text-secondary-500">{t.quickLinksDesc}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <PanelBottom className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-secondary-900 dark:text-white">{t.copyright}</h3>
                <p className="text-sm text-secondary-500">{t.copyrightDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
