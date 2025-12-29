import Link from 'next/link'
import { Home, Search, ArrowRight, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary-100 rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative">
              <span className="text-[10rem] font-bold text-primary-100 leading-none select-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg border border-primary-100">
                  <FileQuestion className="w-12 h-12 text-primary-500" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-secondary-600 mb-2">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <p className="text-sm text-secondary-500 mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl
              hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl
              hover:-translate-y-0.5 font-medium"
          >
            <Home className="w-5 h-5" />
            <span>الصفحة الرئيسية</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-3 bg-white text-secondary-700 rounded-xl
              border border-secondary-200 hover:border-primary-300 hover:text-primary-600
              transition-all duration-300 font-medium"
          >
            <Search className="w-5 h-5" />
            <span>تصفح المنتجات</span>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <p className="text-secondary-500 text-sm mb-4">
            هل تحتاج مساعدة؟
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              تواصل معنا
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <span className="text-secondary-300">|</span>
            <Link
              href="/companies"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              شركاتنا
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
