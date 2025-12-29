import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-pulse">
            <span className="text-3xl text-white font-bold">S</span>
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary-300 animate-spin" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner size="lg" />
          <p className="text-secondary-600 font-medium animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  )
}
