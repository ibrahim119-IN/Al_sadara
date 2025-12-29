import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'phone', 'customerType'],
    group: 'Shop',
  },
  labels: {
    singular: {
      en: 'Customer',
      ar: 'عميل',
    },
    plural: {
      en: 'Customers',
      ar: 'العملاء',
    },
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admin can read all
      if (user.collection === 'users') return true
      // Customer can only read their own
      return { id: { equals: user.id } }
    },
    create: () => true, // Allow registration
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'users') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      return user?.collection === 'users' && (user.role === 'super-admin' || user.role === 'admin')
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: {
            en: 'First Name',
            ar: 'الاسم الأول',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: {
            en: 'Last Name',
            ar: 'اسم العائلة',
          },
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: {
        en: 'Phone',
        ar: 'الهاتف',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: {
        en: 'Company Name',
        ar: 'اسم الشركة',
      },
    },
    {
      name: 'customerType',
      type: 'select',
      defaultValue: 'individual',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Business', value: 'business' },
      ],
      label: {
        en: 'Customer Type',
        ar: 'نوع العميل',
      },
    },
    {
      name: 'addresses',
      type: 'array',
      label: {
        en: 'Saved Addresses',
        ar: 'العناوين المحفوظة',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: { en: 'Label', ar: 'التسمية' },
          admin: {
            description: 'e.g., Home, Office',
          },
        },
        {
          name: 'fullName',
          type: 'text',
          label: { en: 'Full Name', ar: 'الاسم الكامل' },
        },
        {
          name: 'phone',
          type: 'text',
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
        {
          name: 'isDefault',
          type: 'checkbox',
          label: { en: 'Default Address', ar: 'العنوان الافتراضي' },
        },
      ],
    },
  ],
}
