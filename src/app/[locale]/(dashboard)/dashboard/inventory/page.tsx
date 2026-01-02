'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  Download,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Product {
  id: string
  name: string
  nameAr: string
  sku: string
  stock: number
  price: number
  status: string
  category?: {
    name: string
    nameAr: string
  }
  images?: Array<{ image?: { url?: string } }>
}

type StockStatusKey = 'inStock' | 'lowStock' | 'outOfStock'

const stockStatusConfig: Record<StockStatusKey, { label: string; labelAr: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  inStock: { label: 'In Stock', labelAr: 'متوفر', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  lowStock: { label: 'Low Stock', labelAr: 'مخزون منخفض', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: AlertTriangle },
  outOfStock: { label: 'Out of Stock', labelAr: 'غير متوفر', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
}

export default function InventoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState(searchParams.get('status') || 'all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  })

  const t = {
    title: isRTL ? 'إدارة المخزون' : 'Inventory Management',
    search: isRTL ? 'البحث عن منتج...' : 'Search products...',
    filter: isRTL ? 'تصفية' : 'Filter',
    export: isRTL ? 'تصدير' : 'Export',
    allStatuses: isRTL ? 'جميع الحالات' : 'All Statuses',
    product: isRTL ? 'المنتج' : 'Product',
    sku: isRTL ? 'رمز المنتج' : 'SKU',
    category: isRTL ? 'الفئة' : 'Category',
    stock: isRTL ? 'المخزون' : 'Stock',
    price: isRTL ? 'السعر' : 'Price',
    status: isRTL ? 'الحالة' : 'Status',
    actions: isRTL ? 'إجراءات' : 'Actions',
    edit: isRTL ? 'تعديل' : 'Edit',
    noProducts: isRTL ? 'لا توجد منتجات' : 'No products found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
    totalProducts: isRTL ? 'إجمالي المنتجات' : 'Total Products',
    inStock: isRTL ? 'متوفر' : 'In Stock',
    lowStock: isRTL ? 'مخزون منخفض' : 'Low Stock',
    outOfStock: isRTL ? 'غير متوفر' : 'Out of Stock',
    updateStock: isRTL ? 'تحديث المخزون' : 'Update Stock',
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          ...(stockFilter === 'low' && { 'where[stock][less_than_equal]': '10', 'where[stock][greater_than]': '0' }),
          ...(stockFilter === 'out' && { 'where[stock][equals]': '0' }),
          ...(searchQuery && { 'where[name][contains]': searchQuery }),
        })

        const response = await fetch(`/api/products?${queryParams}`, {
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
  }, [currentPage, stockFilter, searchQuery])

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics?period=month', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setStats({
            totalProducts: data.productMetrics?.totalProducts || 0,
            inStock: data.productMetrics?.activeProducts || 0,
            lowStock: data.productMetrics?.lowStockProducts || 0,
            outOfStock: data.productMetrics?.outOfStock || 0,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStockStatus = (stock: number): StockStatusKey => {
    if (stock === 0) return 'outOfStock'
    if (stock <= 10) return 'lowStock'
    return 'inStock'
  }

  const statsCards = [
    {
      title: t.totalProducts,
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: t.inStock,
      value: stats.inStock,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: t.lowStock,
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: t.outOfStock,
      value: stats.outOfStock,
      icon: XCircle,
      color: 'bg-red-500',
    },
  ]

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Download className="w-4 h-4" />
          {t.export}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-secondary-800 rounded-xl p-5 border border-secondary-200 dark:border-secondary-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {card.value.toLocaleString(isRTL ? 'ar-EG' : 'en-EG')}
                </p>
              </div>
              <div className={cn("p-3 rounded-lg", card.color)}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-secondary-400" />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="py-2 px-4 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="low">{t.lowStock}</option>
            <option value="out">{t.outOfStock}</option>
          </select>
        </div>
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
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.product}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.sku}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.category}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.stock}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.price}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  const StatusIcon = stockStatusConfig[stockStatus].icon
                  const productName = isRTL ? product.nameAr : product.name
                  const categoryName = product.category
                    ? isRTL ? product.category.nameAr : product.category.name
                    : '-'

                  return (
                    <tr key={product.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-lg overflow-hidden">
                            {product.images?.[0]?.image?.url ? (
                              <img
                                src={product.images[0].image.url}
                                alt={productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-secondary-400" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-secondary-900 dark:text-white">
                            {productName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {product.sku || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {categoryName}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-medium",
                            stockStatus === 'outOfStock' && "text-red-600",
                            stockStatus === 'lowStock' && "text-yellow-600",
                            stockStatus === 'inStock' && "text-secondary-900 dark:text-white"
                          )}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-secondary-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                          stockStatusConfig[stockStatus].color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {isRTL ? stockStatusConfig[stockStatus].labelAr : stockStatusConfig[stockStatus].label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
                            title={t.updateStock}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
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
