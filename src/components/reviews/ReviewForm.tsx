'use client'

import { useState } from 'react'
import { StarRating } from './StarRating'
import { Plus, X, Upload, Loader2 } from 'lucide-react'

interface ReviewFormProps {
  productId: string | number
  productName: string
  locale: 'ar' | 'en'
  onSubmit: (data: ReviewFormData) => Promise<void>
  onCancel?: () => void
}

export interface ReviewFormData {
  productId: string | number
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  images: File[]
}

export function ReviewForm({ productId, productName, locale, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pros, setPros] = useState<string[]>([''])
  const [cons, setCons] = useState<string[]>([''])
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const labels = {
    ar: {
      writeReview: 'اكتب مراجعة',
      forProduct: 'لمنتج',
      rating: 'التقييم',
      selectRating: 'اختر تقييمك',
      title: 'عنوان المراجعة',
      titlePlaceholder: 'ملخص تجربتك مع المنتج',
      content: 'تفاصيل المراجعة',
      contentPlaceholder: 'شارك تجربتك مع هذا المنتج. ما الذي أعجبك؟ ما الذي يمكن تحسينه؟',
      pros: 'المميزات',
      prosPlaceholder: 'أضف ميزة',
      cons: 'العيوب',
      consPlaceholder: 'أضف عيب',
      addMore: 'إضافة المزيد',
      images: 'صور (اختياري)',
      addImages: 'إضافة صور',
      maxImages: 'بحد أقصى 5 صور',
      submit: 'إرسال المراجعة',
      cancel: 'إلغاء',
      ratingRequired: 'يرجى اختيار تقييم',
      titleRequired: 'يرجى إدخال عنوان المراجعة',
      contentRequired: 'يرجى إدخال تفاصيل المراجعة',
      submitting: 'جاري الإرسال...',
    },
    en: {
      writeReview: 'Write a Review',
      forProduct: 'for',
      rating: 'Rating',
      selectRating: 'Select your rating',
      title: 'Review Title',
      titlePlaceholder: 'Summarize your experience',
      content: 'Review Details',
      contentPlaceholder: 'Share your experience with this product. What did you like? What could be improved?',
      pros: 'Pros',
      prosPlaceholder: 'Add a pro',
      cons: 'Cons',
      consPlaceholder: 'Add a con',
      addMore: 'Add More',
      images: 'Images (optional)',
      addImages: 'Add Images',
      maxImages: 'Max 5 images',
      submit: 'Submit Review',
      cancel: 'Cancel',
      ratingRequired: 'Please select a rating',
      titleRequired: 'Please enter a review title',
      contentRequired: 'Please enter review details',
      submitting: 'Submitting...',
    },
  }

  const t = labels[locale]

  const handleAddPro = () => {
    if (pros.length < 5) {
      setPros([...pros, ''])
    }
  }

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index))
  }

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
  }

  const handleAddCon = () => {
    if (cons.length < 5) {
      setCons([...cons, ''])
    }
  }

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index))
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length)
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (rating === 0) {
      setError(t.ratingRequired)
      return
    }
    if (!title.trim()) {
      setError(t.titleRequired)
      return
    }
    if (!content.trim()) {
      setError(t.contentRequired)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        productId,
        rating,
        title: title.trim(),
        content: content.trim(),
        pros: pros.filter((p) => p.trim()),
        cons: cons.filter((c) => c.trim()),
        images,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-white">
          {t.writeReview}
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400">
          {t.forProduct} {productName}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 text-error-600 dark:text-error-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.rating} *
        </label>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
          {rating === 0 && (
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              {t.selectRating}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.title} *
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.titlePlaceholder}
          maxLength={200}
          className="input"
          disabled={isSubmitting}
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="review-content" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.content} *
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.contentPlaceholder}
          rows={5}
          maxLength={2000}
          className="input resize-none"
          disabled={isSubmitting}
        />
        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
          {content.length}/2000
        </p>
      </div>

      {/* Pros */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.pros}
        </label>
        <div className="space-y-2">
          {pros.map((pro, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={pro}
                onChange={(e) => handleProChange(index, e.target.value)}
                placeholder={t.prosPlaceholder}
                maxLength={100}
                className="input flex-1"
                disabled={isSubmitting}
              />
              {pros.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePro(index)}
                  className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {pros.length < 5 && (
            <button
              type="button"
              onClick={handleAddPro}
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4" />
              {t.addMore}
            </button>
          )}
        </div>
      </div>

      {/* Cons */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.cons}
        </label>
        <div className="space-y-2">
          {cons.map((con, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={con}
                onChange={(e) => handleConChange(index, e.target.value)}
                placeholder={t.consPlaceholder}
                maxLength={100}
                className="input flex-1"
                disabled={isSubmitting}
              />
              {cons.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCon(index)}
                  className="p-2 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          {cons.length < 5 && (
            <button
              type="button"
              onClick={handleAddCon}
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4" />
              {t.addMore}
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          {t.images}
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-700">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 p-1 bg-error-500 text-white rounded-full"
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <Upload className="w-5 h-5 text-secondary-400" />
              <span className="text-xs text-secondary-400 mt-1">{t.addImages}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
          {t.maxImages}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? t.submitting : t.submit}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  )
}
