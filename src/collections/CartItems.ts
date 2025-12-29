import type { CollectionConfig } from 'payload'

export const CartItems: CollectionConfig = {
  slug: 'cart-items',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'product', 'quantity', 'createdAt'],
    group: 'Shop',
  },
  labels: {
    singular: {
      en: 'Cart Item',
      ar: 'عنصر السلة',
    },
    plural: {
      en: 'Cart Items',
      ar: 'عناصر السلة',
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { customer: { equals: user.id } }
    },
    create: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { customer: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { customer: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: {
        en: 'Customer',
        ar: 'العميل',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: {
        en: 'Session ID',
        ar: 'معرف الجلسة',
      },
      admin: {
        description: 'For guest carts before login',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: {
        en: 'Product',
        ar: 'المنتج',
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
      label: {
        en: 'Quantity',
        ar: 'الكمية',
      },
    },
  ],
}
