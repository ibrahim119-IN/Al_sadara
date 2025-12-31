'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FileText, Plus, Edit, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PageItem {
  id: string
  title: string
  titleAr?: string
  slug: string
  status: string
  updatedAt: string
}

export default function PagesListPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [pages, setPages] = useState<PageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = {
    title: isRTL ? 'إدارة الصفحات' : 'Pages Management',
    addPage: isRTL ? 'إضافة صفحة' : 'Add Page',
    name: isRTL ? 'العنوان' : 'Title',
    slug: isRTL ? 'الرابط' : 'Slug',
    status: isRTL ? 'الحالة' : 'Status',
    lastUpdated: isRTL ? 'آخر تحديث' : 'Last Updated',
    actions: isRTL ? 'إجراءات' : 'Actions',
    noPages: isRTL ? 'لا توجد صفحات' : 'No pages found',
    published: isRTL ? 'منشور' : 'Published',
    draft: isRTL ? 'مسودة' : 'Draft',
  }

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/pages?limit=50`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setPages(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <Link
          href={`/${locale}/admin/collections/pages/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addPage}
        </Link>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noPages}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.name}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.slug}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.lastUpdated}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-secondary-400" />
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {isRTL && page.titleAr ? page.titleAr : page.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                      /{page.slug}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                        page.status === 'published'
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}>
                        {page.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {page.status === 'published' ? t.published : t.draft}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-500">
                      {formatDate(page.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/admin/collections/pages/${page.id}`}
                          className="p-1 text-secondary-500 hover:text-primary-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/${locale}/${page.slug}`}
                          target="_blank"
                          className="p-1 text-secondary-500 hover:text-primary-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
