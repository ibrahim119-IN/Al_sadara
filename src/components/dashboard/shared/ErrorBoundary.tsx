'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  locale?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    const locale = this.props.locale || 'en'
    window.location.href = `/${locale}/dashboard`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const locale = this.props.locale || 'en'
      const isArabic = locale === 'ar'

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              {isArabic ? 'حدث خطأ غير متوقع' : 'Something went wrong'}
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              {isArabic
                ? 'نأسف، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.'
                : 'Sorry, an error occurred while loading this page. Please try again.'}
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-start overflow-auto">
                <p className="text-xs font-mono text-red-600 dark:text-red-400">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isArabic ? 'حاول مرة أخرى' : 'Try Again'}</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>{isArabic ? 'الرئيسية' : 'Dashboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
