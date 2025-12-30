import type { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'isActive'],
    group: 'Content',
  },
  labels: {
    singular: { en: 'FAQ', ar: 'سؤال شائع' },
    plural: { en: 'FAQs', ar: 'الأسئلة الشائعة' },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: { en: 'Question (English)', ar: 'السؤال (إنجليزي)' },
        },
        {
          name: 'questionAr',
          type: 'text',
          required: true,
          label: { en: 'Question (Arabic)', ar: 'السؤال (عربي)' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'answer',
          type: 'richText',
          required: true,
          label: { en: 'Answer (English)', ar: 'الإجابة (إنجليزي)' },
        },
        {
          name: 'answerAr',
          type: 'richText',
          label: { en: 'Answer (Arabic)', ar: 'الإجابة (عربي)' },
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: { en: 'General', ar: 'عام' }, value: 'general' },
        { label: { en: 'Ordering', ar: 'الطلبات' }, value: 'ordering' },
        { label: { en: 'Shipping', ar: 'الشحن' }, value: 'shipping' },
        { label: { en: 'Payment', ar: 'الدفع' }, value: 'payment' },
        { label: { en: 'Returns', ar: 'الإرجاع' }, value: 'returns' },
        { label: { en: 'Products', ar: 'المنتجات' }, value: 'products' },
        { label: { en: 'Account', ar: 'الحساب' }, value: 'account' },
        { label: { en: 'Technical', ar: 'تقني' }, value: 'technical' },
      ],
      label: { en: 'Category', ar: 'الفئة' },
    },
    {
      name: 'relatedCompany',
      type: 'relationship',
      relationTo: 'companies',
      label: { en: 'Related Company', ar: 'الشركة ذات الصلة' },
      admin: {
        description: 'Optional: If this FAQ is specific to a company',
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
      name: 'relatedCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: { en: 'Related Categories', ar: 'الفئات ذات الصلة' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: { en: 'Display Order', ar: 'ترتيب العرض' },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: { en: 'Active', ar: 'نشط' },
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
      name: 'helpfulness',
      type: 'group',
      label: { en: 'Helpfulness Tracking', ar: 'تتبع الفائدة' },
      admin: {
        description: 'Tracks how helpful users find this FAQ',
      },
      fields: [
        {
          name: 'helpfulCount',
          type: 'number',
          defaultValue: 0,
          label: { en: 'Helpful Count', ar: 'عدد الإفادة' },
          admin: { readOnly: true },
        },
        {
          name: 'notHelpfulCount',
          type: 'number',
          defaultValue: 0,
          label: { en: 'Not Helpful Count', ar: 'عدد عدم الإفادة' },
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'keywords',
      type: 'text',
      label: { en: 'Search Keywords', ar: 'كلمات البحث' },
      admin: {
        description: 'Comma-separated keywords to help with search',
      },
    },
  ],
}
