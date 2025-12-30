import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'isApproved', 'isFeatured'],
    group: 'Content',
  },
  labels: {
    singular: { en: 'Testimonial', ar: 'رأي عميل' },
    plural: { en: 'Testimonials', ar: 'آراء العملاء' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: { en: 'Customer Name', ar: 'اسم العميل' },
        },
        {
          name: 'company',
          type: 'text',
          label: { en: 'Company', ar: 'الشركة' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'position',
          type: 'text',
          label: { en: 'Position (English)', ar: 'المنصب (إنجليزي)' },
        },
        {
          name: 'positionAr',
          type: 'text',
          label: { en: 'Position (Arabic)', ar: 'المنصب (عربي)' },
        },
      ],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: { en: 'Avatar/Photo', ar: 'الصورة الشخصية' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      label: { en: 'Rating (1-5)', ar: 'التقييم (1-5)' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'content',
          type: 'textarea',
          required: true,
          label: { en: 'Testimonial (English)', ar: 'الرأي (إنجليزي)' },
        },
        {
          name: 'contentAr',
          type: 'textarea',
          label: { en: 'Testimonial (Arabic)', ar: 'الرأي (عربي)' },
        },
      ],
    },
    {
      name: 'relatedCompany',
      type: 'relationship',
      relationTo: 'companies',
      label: { en: 'Related Company', ar: 'الشركة ذات الصلة' },
      admin: {
        description: 'Optional: Link to a specific company in the group',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: { en: 'Related Products', ar: 'المنتجات ذات الصلة' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isApproved',
          type: 'checkbox',
          defaultValue: true,
          label: { en: 'Approved', ar: 'معتمد' },
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Featured', ar: 'مميز' },
        },
      ],
    },
    {
      name: 'sourceType',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: { en: 'Manual Entry', ar: 'إدخال يدوي' }, value: 'manual' },
        { label: { en: 'Google Reviews', ar: 'تقييمات جوجل' }, value: 'google' },
        { label: { en: 'Facebook', ar: 'فيسبوك' }, value: 'facebook' },
        { label: { en: 'Other', ar: 'أخرى' }, value: 'other' },
      ],
      label: { en: 'Source', ar: 'المصدر' },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: { en: 'Source URL', ar: 'رابط المصدر' },
      admin: {
        condition: (_, siblingData) => siblingData?.sourceType !== 'manual',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: { en: 'Testimonial Date', ar: 'تاريخ الرأي' },
    },
  ],
}
