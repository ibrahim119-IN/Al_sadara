import type { CollectionConfig } from 'payload'

// Helper function to generate order number
const generateOrderNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${year}${month}${day}-${random}`
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
    group: 'Shop',
  },
  labels: {
    singular: {
      en: 'Order',
      ar: 'طلب',
    },
    plural: {
      en: 'Orders',
      ar: 'الطلبات',
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admin can read all
      if (user.collection === 'users') return true
      // Customer can only read their own
      return { customer: { equals: user.id } }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      return user?.collection === 'users' && user.role === 'super-admin'
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = generateOrderNumber()
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: {
        en: 'Order Number',
        ar: 'رقم الطلب',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: {
        en: 'Customer',
        ar: 'العميل',
      },
    },

    // Items
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: {
        en: 'Order Items',
        ar: 'عناصر الطلب',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
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
          name: 'priceAtTime',
          type: 'number',
          required: true,
          label: { en: 'Unit Price', ar: 'سعر الوحدة' },
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          label: { en: 'Subtotal', ar: 'المجموع الفرعي' },
        },
      ],
    },

    // Totals
    {
      type: 'row',
      fields: [
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          label: { en: 'Subtotal', ar: 'المجموع الفرعي' },
        },
        {
          name: 'shippingCost',
          type: 'number',
          defaultValue: 0,
          label: { en: 'Shipping Cost', ar: 'تكلفة الشحن' },
        },
        {
          name: 'discount',
          type: 'number',
          defaultValue: 0,
          label: { en: 'Discount', ar: 'الخصم' },
        },
        {
          name: 'total',
          type: 'number',
          required: true,
          label: { en: 'Total', ar: 'الإجمالي' },
        },
      ],
    },

    // Shipping Address
    {
      name: 'shippingAddress',
      type: 'group',
      label: {
        en: 'Shipping Address',
        ar: 'عنوان الشحن',
      },
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
          label: { en: 'Full Name', ar: 'الاسم الكامل' },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: { en: 'Phone', ar: 'الهاتف' },
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          label: { en: 'Address', ar: 'العنوان' },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: { en: 'City', ar: 'المدينة' },
        },
        {
          name: 'governorate',
          type: 'text',
          required: true,
          label: { en: 'Governorate', ar: 'المحافظة' },
        },
      ],
    },

    // Payment
    {
      name: 'payment',
      type: 'group',
      label: {
        en: 'Payment Info',
        ar: 'معلومات الدفع',
      },
      fields: [
        {
          name: 'method',
          type: 'select',
          options: [
            { label: 'Bank Transfer', value: 'bank-transfer' },
            { label: 'Vodafone Cash', value: 'vodafone-cash' },
            { label: 'Card', value: 'card' },
            { label: 'Cash on Delivery', value: 'cash-on-delivery' },
          ],
          label: { en: 'Payment Method', ar: 'طريقة الدفع' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Paid', value: 'paid' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' },
          ],
          label: { en: 'Payment Status', ar: 'حالة الدفع' },
        },
        {
          name: 'transactionId',
          type: 'text',
          label: { en: 'Transaction ID', ar: 'رقم العملية' },
        },
        {
          name: 'paidAt',
          type: 'date',
          label: { en: 'Paid At', ar: 'تاريخ الدفع' },
        },
      ],
    },

    // Order Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: {
        en: 'Order Status',
        ar: 'حالة الطلب',
      },
      admin: {
        position: 'sidebar',
      },
    },

    // Notes
    {
      name: 'customerNotes',
      type: 'textarea',
      label: {
        en: 'Customer Notes',
        ar: 'ملاحظات العميل',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: {
        en: 'Admin Notes',
        ar: 'ملاحظات الإدارة',
      },
      access: {
        read: ({ req: { user } }) => user?.collection === 'users',
      },
    },
  ],
}
