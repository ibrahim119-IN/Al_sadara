'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  status: string
  customer: { firstName: string; lastName: string }
  product: { name: string }
  createdAt: string
}

const statusConfig: Record<string, { color: string; label: string; labelAr: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending', labelAr: 'قيد المراجعة', icon: Clock },
  approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Approved', labelAr: 'معتمد', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected', labelAr: 'مرفوض', icon: XCircle },
}

export default function ReviewsPage() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'

  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const t = {
    title: isRTL ? 'إدارة المراجعات' : 'Reviews Management',
    customer: isRTL ? 'العميل' : 'Customer',
    product: isRTL ? 'المنتج' : 'Product',
    rating: isRTL ? 'التقييم' : 'Rating',
    review: isRTL ? 'المراجعة' : 'Review',
    status: isRTL ? 'الحالة' : 'Status',
    date: isRTL ? 'التاريخ' : 'Date',
    noReviews: isRTL ? 'لا توجد مراجعات' : 'No reviews found',
    loading: isRTL ? 'جاري التحميل...' : 'Loading...',
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/reviews?page=${currentPage}&limit=10`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setReviews(data.docs || [])
          setTotalPages(data.totalPages || 1)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [currentPage])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-EG' : 'en-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-secondary-300"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          {t.title}
        </h1>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Star className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mb-4" />
            <p className="text-secondary-500 dark:text-secondary-400">{t.noReviews}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-900/50">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.customer}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.product}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.rating}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.review}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.status}</th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-secondary-500 uppercase">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                {reviews.map((review) => {
                  const status = statusConfig[review.status] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <tr key={review.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-900/50">
                      <td className="px-5 py-4">
                        <span className="font-medium text-secondary-900 dark:text-white">
                          {review.customer?.firstName} {review.customer?.lastName}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-600 dark:text-secondary-400">
                        {review.product?.name || '-'}
                      </td>
                      <td className="px-5 py-4">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                            {review.title}
                          </p>
                          <p className="text-xs text-secondary-500 truncate">
                            {review.content}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full", status.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {isRTL ? status.labelAr : status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-secondary-500">
                        {formatDate(review.createdAt)}
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
