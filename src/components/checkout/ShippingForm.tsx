'use client'

import { useState } from 'react'
import { MapPin, User, Phone, Home, Building2 } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  governorate: string
}

interface ShippingFormProps {
  locale: Locale
  dict: Dictionary
  initialData?: ShippingAddress
  onSubmit: (data: ShippingAddress) => void
  isSubmitting?: boolean
}

const governorates = {
  en: [
    'Cairo',
    'Giza',
    'Alexandria',
    'Dakahlia',
    'Red Sea',
    'Beheira',
    'Fayoum',
    'Gharbiya',
    'Ismailia',
    'Menofia',
    'Minya',
    'Qaliubiya',
    'New Valley',
    'Suez',
    'Aswan',
    'Assiut',
    'Beni Suef',
    'Port Said',
    'Damietta',
    'Sharkia',
    'South Sinai',
    'Kafr El Sheikh',
    'Matrouh',
    'Luxor',
    'Qena',
    'North Sinai',
    'Sohag',
  ],
  ar: [
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'البحر الأحمر',
    'البحيرة',
    'الفيوم',
    'الغربية',
    'الإسماعيلية',
    'المنوفية',
    'المنيا',
    'القليوبية',
    'الوادي الجديد',
    'السويس',
    'أسوان',
    'أسيوط',
    'بني سويف',
    'بورسعيد',
    'دمياط',
    'الشرقية',
    'جنوب سيناء',
    'كفر الشيخ',
    'مطروح',
    'الأقصر',
    'قنا',
    'شمال سيناء',
    'سوهاج',
  ],
}

export function ShippingForm({
  locale,
  dict,
  initialData,
  onSubmit,
  isSubmitting = false,
}: ShippingFormProps) {
  const isRTL = locale === 'ar'
  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      governorate: '',
    }
  )
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = isRTL ? 'الاسم مطلوب' : 'Name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isRTL ? 'رقم الهاتف مطلوب' : 'Phone is required'
    } else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = isRTL ? 'رقم هاتف غير صالح' : 'Invalid phone number'
    }

    if (!formData.address.trim()) {
      newErrors.address = isRTL ? 'العنوان مطلوب' : 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = isRTL ? 'المدينة مطلوبة' : 'City is required'
    }

    if (!formData.governorate) {
      newErrors.governorate = isRTL ? 'المحافظة مطلوبة' : 'Governorate is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const govList = isRTL ? governorates.ar : governorates.en

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-bold text-secondary-900">
          {dict.checkout.shippingInfo}
        </h3>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {dict.checkout.fullName} <span className="text-error-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute start-3 top-1/2 -translate-y-1/2 text-secondary-400">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
              errors.fullName ? 'border-error-500' : 'border-secondary-300'
            }`}
            placeholder={isRTL ? 'أدخل الاسم الكامل' : 'Enter full name'}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-error-500 mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {dict.checkout.phone} <span className="text-error-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute start-3 top-1/2 -translate-y-1/2 text-secondary-400">
            <Phone className="w-5 h-5" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            dir="ltr"
            className={`w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
              errors.phone ? 'border-error-500' : 'border-secondary-300'
            } ${isRTL ? 'text-end' : 'text-start'}`}
            placeholder="01xxxxxxxxx"
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-error-500 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {dict.checkout.address} <span className="text-error-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute start-3 top-3 text-secondary-400">
            <Home className="w-5 h-5" />
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none ${
              errors.address ? 'border-error-500' : 'border-secondary-300'
            }`}
            placeholder={isRTL ? 'أدخل العنوان بالتفصيل' : 'Enter detailed address'}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-error-500 mt-1">{errors.address}</p>
        )}
      </div>

      {/* City & Governorate */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {dict.checkout.city} <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute start-3 top-1/2 -translate-y-1/2 text-secondary-400">
              <Building2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full ps-10 pe-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                errors.city ? 'border-error-500' : 'border-secondary-300'
              }`}
              placeholder={isRTL ? 'المدينة / المنطقة' : 'City / Area'}
            />
          </div>
          {errors.city && (
            <p className="text-sm text-error-500 mt-1">{errors.city}</p>
          )}
        </div>

        {/* Governorate */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            {dict.checkout.governorate} <span className="text-error-500">*</span>
          </label>
          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors appearance-none bg-white ${
              errors.governorate ? 'border-error-500' : 'border-secondary-300'
            }`}
          >
            <option value="">{isRTL ? 'اختر المحافظة' : 'Select Governorate'}</option>
            {govList.map((gov, index) => (
              <option key={index} value={gov}>
                {gov}
              </option>
            ))}
          </select>
          {errors.governorate && (
            <p className="text-sm text-error-500 mt-1">{errors.governorate}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? isRTL ? 'جاري المعالجة...' : 'Processing...'
          : dict.common.next}
      </button>
    </form>
  )
}
