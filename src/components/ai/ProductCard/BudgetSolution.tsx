'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, AlertCircle, TrendingUp, Package } from 'lucide-react'
import type { Product } from '@/payload-types'

/**
 * Budget Solution Component
 * Displays complete budget-constrained product recommendations
 */

interface BudgetItem {
  product: Product
  quantity: number
  subtotal: number
}

interface BudgetSolutionProps {
  budget: number
  items: BudgetItem[]
  totalCost: number
  locale: 'ar' | 'en'
  alternatives?: BudgetItem[][] // Alternative solutions if available
  notes?: string // Additional recommendations or notes
}

export function BudgetSolution({
  budget,
  items,
  totalCost,
  locale,
  alternatives,
  notes,
}: BudgetSolutionProps) {
  const remainingBudget = budget - totalCost
  const budgetPercentage = (totalCost / budget) * 100
  const isWithinBudget = totalCost <= budget

  // Budget status color
  const getBudgetStatusColor = () => {
    if (budgetPercentage <= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (budgetPercentage <= 100) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  // Progress bar color
  const getProgressBarColor = () => {
    if (budgetPercentage <= 80) return 'bg-green-500'
    if (budgetPercentage <= 100) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-4xl mx-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Budget Summary Card */}
      <div className={`border rounded-lg p-4 mb-4 ${getBudgetStatusColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isWithinBudget ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <h3 className="font-bold text-lg">
              {locale === 'ar' ? 'ملخص الميزانية' : 'Budget Summary'}
            </h3>
          </div>
          <div className="text-sm font-medium">
            {locale === 'ar'
              ? `${items.length} منتجات`
              : `${items.length} Products`}
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>{locale === 'ar' ? 'الميزانية المستخدمة' : 'Budget Used'}</span>
            <span className="font-bold">{budgetPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getProgressBarColor()}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Budget Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs opacity-80">
              {locale === 'ar' ? 'الميزانية الكلية' : 'Total Budget'}
            </div>
            <div className="text-lg font-bold">{budget.toLocaleString('ar-EG')} جنيه</div>
          </div>
          <div>
            <div className="text-xs opacity-80">
              {locale === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}
            </div>
            <div className="text-lg font-bold">{totalCost.toLocaleString('ar-EG')} جنيه</div>
          </div>
          <div>
            <div className="text-xs opacity-80">
              {locale === 'ar' ? 'المتبقي' : 'Remaining'}
            </div>
            <div
              className={`text-lg font-bold ${
                remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {remainingBudget >= 0 ? '+' : ''}
              {remainingBudget.toLocaleString('ar-EG')} جنيه
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            {locale === 'ar' ? 'المنتجات المقترحة' : 'Recommended Products'}
          </h4>
        </div>

        <div className="divide-y divide-gray-200">
          {items.map((item, index) => {
            const name = locale === 'ar' ? item.product.nameAr : item.product.name
            const imageUrl =
              typeof item.product.images?.[0] === 'object' && item.product.images[0]?.url
                ? item.product.images[0].url
                : '/placeholder-product.jpg'

            return (
              <div key={item.product.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/${locale}/products/${item.product.slug}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={imageUrl}
                        alt={name || 'Product'}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${locale}/products/${item.product.slug}`}
                      className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                    >
                      {name}
                    </Link>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        {locale === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity}
                      </span>
                      <span>
                        {locale === 'ar' ? 'السعر:' : 'Price:'}{' '}
                        {item.product.price?.toLocaleString('ar-EG')} جنيه
                      </span>
                      {item.product.brand && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.product.brand}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex-shrink-0 text-left">
                    <div className="text-xs text-gray-500">
                      {locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                    </div>
                    <div className="text-lg font-bold text-primary-600">
                      {item.subtotal.toLocaleString('ar-EG')} جنيه
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Total Row */}
        <div className="bg-gray-50 px-4 py-3 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">
              {locale === 'ar' ? 'الإجمالي' : 'Total'}
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {totalCost.toLocaleString('ar-EG')} جنيه
            </span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      {notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-900 mb-1">
                {locale === 'ar' ? '💡 توصيات إضافية' : '💡 Additional Recommendations'}
              </h5>
              <p className="text-sm text-blue-800">{notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Solutions */}
      {alternatives && alternatives.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-3">
            {locale === 'ar' ? '🔄 حلول بديلة' : '🔄 Alternative Solutions'}
          </h5>
          <div className="space-y-3">
            {alternatives.map((altSolution, index) => {
              const altTotal = altSolution.reduce((sum, item) => sum + item.subtotal, 0)
              return (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {locale === 'ar' ? `الخيار ${index + 1}` : `Option ${index + 1}`}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {altTotal.toLocaleString('ar-EG')} جنيه
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {altSolution.map((item) => {
                      const name = locale === 'ar' ? item.product.nameAr : item.product.name
                      return (
                        <div key={item.product.id}>
                          • {name} ({item.quantity}×)
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Warning if over budget */}
      {!isWithinBudget && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-red-900 mb-1">
                {locale === 'ar' ? '⚠️ تنبيه: تجاوز الميزانية' : '⚠️ Warning: Over Budget'}
              </h5>
              <p className="text-sm text-red-800">
                {locale === 'ar'
                  ? `الحل المقترح يتجاوز ميزانيتك بمقدار ${Math.abs(remainingBudget).toLocaleString('ar-EG')} جنيه. يمكنك تقليل الكميات أو اختيار منتجات أقل سعراً.`
                  : `The recommended solution exceeds your budget by ${Math.abs(remainingBudget).toLocaleString('ar-EG')} EGP. Consider reducing quantities or choosing lower-priced alternatives.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
