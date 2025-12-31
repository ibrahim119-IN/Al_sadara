'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Search,
  Plus,
  FolderTree,
  Edit,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Category {
  id: string
  name: string
  nameAr?: string
  slug: string
  description?: string
  parent?: { name: string }
  productsCount?: number
}

export default function CategoriesPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const t = {
    title: isRTL ? 'إدارة التصنيفات' : 'Categories Management',
    addCategory: isRTL ? 'إضافة تصنيف' : 'Add Category',
    search: isRTL ? 'البحث عن تصنيف...' : 'Search categories...',
    name: isRTL ? 'اسم التصنيف' : 'Category Name',
    slug: isRTL ? 'الرابط' : 'Slug',
    parent: isRTL ? 'التصنيف الأب' : 'Parent',
    products: isRTL ? 'المنتجات' : 'Products',
    actions: isRTL ? 'إجراءات' : 'Actions',
    noCategories: isRTL ? 'لا توجد تصنيفات' : 'No categories found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    root: isRTL ? 'رئيسي' : 'Root',
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/categories?limit=50${searchQuery ? `&search=${searchQuery}` : ''}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setCategories(data.docs || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [searchQuery])

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <Link
          href={`/${locale}/admin/collections/categories/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addCategory}
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400", isRTL ? "right-3" : "left-3")} />
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full py-2 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
          )}
        />
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FolderTree className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noCategories}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.name}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.slug}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.parent}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.products}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <FolderTree className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {isRTL && category.nameAr ? category.nameAr : category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                      {category.slug}
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                      {category.parent?.name || t.root}
                    </td>
                    <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                      {category.productsCount || 0}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/${locale}/admin/collections/categories/${category.id}`}
                        className="p-1 text-secondary-500 hover:text-primary-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
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
