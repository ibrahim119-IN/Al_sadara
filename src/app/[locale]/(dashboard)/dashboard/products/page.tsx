'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Search,
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Product {
  id: string
  name: string
  nameAr?: string
  price: number
  stock: number
  status: string
  category?: { name: string }
  image?: { url: string }
}

export default function ProductsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const t = {
    title: isRTL ? 'إدارة المنتجات' : 'Products Management',
    addProduct: isRTL ? 'إضافة منتج' : 'Add Product',
    search: isRTL ? 'البحث عن منتج...' : 'Search products...',
    name: isRTL ? 'اسم المنتج' : 'Product Name',
    price: isRTL ? 'السعر' : 'Price',
    stock: isRTL ? 'المخزون' : 'Stock',
    category: isRTL ? 'التصنيف' : 'Category',
    status: isRTL ? 'الحالة' : 'Status',
    actions: isRTL ? 'إجراءات' : 'Actions',
    noProducts: isRTL ? 'لا توجد منتجات' : 'No products found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    active: isRTL ? 'نشط' : 'Active',
    draft: isRTL ? 'مسودة' : 'Draft',
    outOfStock: isRTL ? 'نفذ المخزون' : 'Out of Stock',
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/products?page=${currentPage}&limit=10${searchQuery ? `&search=${searchQuery}` : ''}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setProducts(data.docs || [])
          setTotalPages(data.totalPages || 1)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return { label: t.outOfStock, class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    }
    if (product.status === 'draft') {
      return { label: t.draft, class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' }
    }
    return { label: t.active, class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <Link
          href={`/${locale}/admin/collections/products/create`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.addProduct}
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

      {/* Products Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noProducts}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.name}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.category}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.price}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.stock}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {products.map((product) => {
                  const status = getStatusBadge(product)
                  return (
                    <tr key={product.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
                            {product.image?.url ? (
                              <img src={product.image.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-full h-full p-2 text-secondary-400" />
                            )}
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {isRTL && product.nameAr ? product.nameAr : product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {product.category?.name || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-secondary-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {product.stock}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", status.class)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${locale}/admin/collections/products/${product.id}`}
                            className="p-1 text-secondary-500 hover:text-primary-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-secondary-200 dark:border-secondary-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
