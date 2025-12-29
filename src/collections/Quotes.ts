import type { CollectionConfig } from 'payload'

// Helper function to generate quote number
const generateQuoteNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `QT-${year}${month}${day}-${random}`
}

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'quoteNumber',
    defaultColumns: ['quoteNumber', 'contactName', 'companyName', 'status', 'createdAt'],
    group: 'Shop',
  },
  labels: {
    singular: {
      en: 'Quote Request',
      ar: 'طلب عرض سعر',
    },
    plural: {
      en: 'Quote Requests',
      ar: 'طلبات عروض الأسعار',
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { customer: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users' && user.role === 'super-admin',
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.quoteNumber) {
          data.quoteNumber = generateQuoteNumber()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'quoteNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: {
        en: 'Quote Number',
        ar: 'رقم عرض السعر',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: {
        en: 'Customer Account',
        ar: 'حساب العميل',
      },
    },

    // Contact Info (for non-registered users)
    {
      type: 'row',
      fields: [
        {
          name: 'contactName',
          type: 'text',
          label: { en: 'Contact Name', ar: 'اسم جهة الاتصال' },
        },
        {
          name: 'contactEmail',
          type: 'email',
          label: { en: 'Email', ar: 'البريد الإلكتروني' },
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: { en: 'Phone', ar: 'الهاتف' },
        },
      ],
    },
    {
      name: 'companyName',
      type: 'text',
      label: {
        en: 'Company Name',
        ar: 'اسم الشركة',
      },
    },

    // Request Details
    {
      name: 'items',
      type: 'array',
      label: {
        en: 'Requested Items',
        ar: 'العناصر المطلوبة',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: { en: 'Product', ar: 'المنتج' },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: { en: 'Quantity', ar: 'الكمية' },
        },
        {
          name: 'customRequest',
          type: 'textarea',
          label: { en: 'Custom Requirements', ar: 'متطلبات خاصة' },
        },
      ],
    },

    {
      name: 'message',
      type: 'textarea',
      label: {
        en: 'Additional Message',
        ar: 'رسالة إضافية',
      },
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
      ],
      label: {
        en: 'Status',
        ar: 'الحالة',
      },
      admin: {
        position: 'sidebar',
      },
    },

    // Admin Response
    {
      name: 'quotedPrice',
      type: 'number',
      label: {
        en: 'Quoted Price',
        ar: 'السعر المعروض',
      },
      access: {
        read: ({ req: { user } }) => !!user,
      },
    },
    {
      name: 'adminResponse',
      type: 'textarea',
      label: {
        en: 'Response to Customer',
        ar: 'الرد على العميل',
      },
    },
    {
      name: 'validUntil',
      type: 'date',
      label: {
        en: 'Valid Until',
        ar: 'صالح حتى',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
