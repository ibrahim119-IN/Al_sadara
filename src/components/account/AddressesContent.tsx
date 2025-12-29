'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { MapPin, Plus, Edit, Trash2, Loader2, ArrowLeft, Check, X } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AddressesContentProps {
  locale: Locale
  dict: Dictionary
}

interface Address {
  id?: string
  label?: string
  fullName: string
  phone: string
  address: string
  city: string
  governorate: string
  isDefault?: boolean
}

export function AddressesContent({ locale, dict }: AddressesContentProps) {
  const router = useRouter()
  const { customer, isAuthenticated, isLoading, updateProfile, error, clearError } = useAuth()
  const isRTL = locale === 'ar'

  const [addresses, setAddresses] = useState<Address[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState<Address>({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    isDefault: false,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/account/addresses`)
    }
  }, [isAuthenticated, isLoading, router, locale])

  useEffect(() => {
    if (customer?.addresses) {
      setAddresses(customer.addresses)
    }
  }, [customer])

  const resetForm = () => {
    setFormData({
      label: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      governorate: '',
      isDefault: false,
    })
    setEditingIndex(null)
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsModalOpen(true)
    clearError()
  }

  const handleOpenEdit = (index: number) => {
    setFormData({ ...addresses[index] })
    setEditingIndex(index)
    setIsModalOpen(true)
    clearError()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    resetForm()
    clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    clearError()

    try {
      let updatedAddresses: Address[]

      if (editingIndex !== null) {
        // Edit existing address
        updatedAddresses = [...addresses]
        updatedAddresses[editingIndex] = formData
      } else {
        // Add new address
        updatedAddresses = [...addresses, formData]
      }

      // If this address is set as default, remove default from others
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map((addr, idx) => ({
          ...addr,
          isDefault: editingIndex !== null ? idx === editingIndex : idx === updatedAddresses.length - 1,
        }))
      }

      await updateProfile({ addresses: updatedAddresses })
      setAddresses(updatedAddresses)
      setSuccessMessage(
        isRTL
          ? editingIndex !== null
            ? 'تم تحديث العنوان بنجاح'
            : 'تم إضافة العنوان بنجاح'
          : editingIndex !== null
          ? 'Address updated successfully'
          : 'Address added successfully'
      )
      handleCloseModal()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (index: number) => {
    setIsSaving(true)
    clearError()

    try {
      const updatedAddresses = addresses.filter((_, idx) => idx !== index)
      await updateProfile({ addresses: updatedAddresses })
      setAddresses(updatedAddresses)
      setSuccessMessage(isRTL ? 'تم حذف العنوان بنجاح' : 'Address deleted successfully')
      setDeletingIndex(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetDefault = async (index: number) => {
    setIsSaving(true)
    clearError()

    try {
      const updatedAddresses = addresses.map((addr, idx) => ({
        ...addr,
        isDefault: idx === index,
      }))
      await updateProfile({ addresses: updatedAddresses })
      setAddresses(updatedAddresses)
      setSuccessMessage(isRTL ? 'تم تعيين العنوان الافتراضي' : 'Default address set')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !customer) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        <Link
          href={`/${locale}/account`}
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{isRTL ? 'العودة إلى الحساب' : 'Back to Account'}</span>
        </Link>

        <div className="bg-white rounded-2xl border border-secondary-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">
                  {isRTL ? 'عناويني' : 'My Addresses'}
                </h1>
                <p className="text-sm text-secondary-600">
                  {isRTL ? 'إدارة عناوين الشحن الخاصة بك' : 'Manage your shipping addresses'}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              {isRTL ? 'إضافة عنوان' : 'Add Address'}
            </button>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl text-success-700 text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl text-error-700 text-sm">
              {error}
            </div>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-500">
                {isRTL ? 'لا توجد عناوين محفوظة' : 'No saved addresses'}
              </p>
              <button
                onClick={handleOpenAdd}
                className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
              >
                {isRTL ? 'إضافة عنوان جديد' : 'Add New Address'}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    address.isDefault
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {address.label && (
                        <span className="font-medium text-secondary-900">{address.label}</span>
                      )}
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                          {isRTL ? 'افتراضي' : 'Default'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(index)}
                        className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title={isRTL ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingIndex(index)}
                        className="p-2 text-secondary-600 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"
                        title={isRTL ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-secondary-700">
                    <p className="font-medium">{address.fullName}</p>
                    <p dir="ltr">{address.phone}</p>
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.governorate}
                    </p>
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(index)}
                      disabled={isSaving}
                      className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      {isRTL ? 'تعيين كافتراضي' : 'Set as Default'}
                    </button>
                  )}

                  {/* Delete Confirmation */}
                  {deletingIndex === index && (
                    <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                      <p className="text-sm text-error-700 mb-3">
                        {isRTL ? 'هل أنت متأكد من حذف هذا العنوان؟' : 'Are you sure you want to delete this address?'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(index)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white text-sm rounded-lg disabled:opacity-50"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isRTL ? (
                            'نعم، احذف'
                          ) : (
                            'Yes, Delete'
                          )}
                        </button>
                        <button
                          onClick={() => setDeletingIndex(null)}
                          disabled={isSaving}
                          className="px-4 py-2 border border-secondary-300 text-secondary-700 text-sm rounded-lg disabled:opacity-50"
                        >
                          {isRTL ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary-900">
                {editingIndex !== null
                  ? isRTL
                    ? 'تعديل العنوان'
                    : 'Edit Address'
                  : isRTL
                  ? 'إضافة عنوان جديد'
                  : 'Add New Address'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'تسمية العنوان' : 'Address Label'}{' '}
                  <span className="text-secondary-400">({isRTL ? 'اختياري' : 'optional'})</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder={isRTL ? 'مثل: المنزل، العمل، إلخ' : 'e.g., Home, Work, etc.'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'الاسم الكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'رقم الهاتف' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {isRTL ? 'العنوان بالتفصيل' : 'Detailed Address'} *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={3}
                  placeholder={
                    isRTL
                      ? 'رقم الشقة، رقم المبنى، اسم الشارع، الحي'
                      : 'Apartment number, Building number, Street name, District'
                  }
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {isRTL ? 'المدينة' : 'City'} *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    {isRTL ? 'المحافظة' : 'Governorate'} *
                  </label>
                  <input
                    type="text"
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isDefault" className="text-sm text-secondary-700">
                  {isRTL ? 'تعيين كعنوان افتراضي' : 'Set as default address'}
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {editingIndex !== null
                    ? isRTL
                      ? 'حفظ التغييرات'
                      : 'Save Changes'
                    : isRTL
                    ? 'إضافة العنوان'
                    : 'Add Address'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-6 py-3 border border-secondary-300 text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 font-medium rounded-xl transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
