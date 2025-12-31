'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Image, Plus, Edit, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Banner {
  id: string
  title: string
  titleAr?: string
  isActive: boolean
  position: string
  image?: { url: string }
}

export default function BannersPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const t = {
    title: isRTL ? 'إدارة البانرات' : 'Banners Management',
    addBanner: isRTL ? 'إضافة بانر' : 'Add Banner',
    name: isRTL ? 'العنوان' : 'Title',
    position: isRTL ? 'الموضع' : 'Position',
    status: isRTL ? 'الحالة' : 'Status',
    actions: isRTL ? 'إجراءات' : 'Actions',
    noBanners: isRTL ? 'لا توجد بانرات' : 'No banners found',
    active: isRTL ? 'نشط' : 'Active',
    inactive: isRTL ? 'غير نشط' : 'Inactive',
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/banners?limit=50`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setBanners(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <Link
          href={`/${locale}/admin/collections/banners/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addBanner}
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Image className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noBanners}</p>
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div key={banner.id} className="rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
                <div className="aspect-video bg-secondary-100 dark:bg-secondary-900 relative">
                  {banner.image?.url ? (
                    <img src={banner.image.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="w-12 h-12 text-secondary-300" />
                    </div>
                  )}
                  <span className={cn(
                    "absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                    banner.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-400"
                  )}>
                    {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {banner.isActive ? t.active : t.inactive}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-secondary-900 dark:text-white truncate">
                    {isRTL && banner.titleAr ? banner.titleAr : banner.title}
                  </h3>
                  <p className="text-xs text-secondary-500 mt-1">{banner.position}</p>
                  <div className="mt-3 flex justify-end">
                    <Link
                      href={`/${locale}/admin/collections/banners/${banner.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
