import type { CollectionConfig } from 'payload'
import { afterProductChange, afterProductDelete } from './hooks/product-indexing-hooks'

// Helper to check user role permissions
type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff'

const canManageProducts = (role?: UserRole): boolean => {
  return ['super-admin', 'admin'].includes(role || '')
}

const canEditProducts = (role?: UserRole): boolean => {
  return ['super-admin', 'admin', 'manager'].includes(role || '')
}

const canDeleteProducts = (role?: UserRole): boolean => {
  return ['super-admin', 'admin'].includes(role || '')
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'stock', 'status'],
    group: 'Shop',
  },
  labels: {
    singular: {
      en: 'Product',
      ar: 'منتج',
    },
    plural: {
      en: 'Products',
      ar: 'المنتجات',
    },
  },
  access: {
    // Anyone can read products (public catalog)
    read: () => true,
    // Only admins can create products
    create: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canManageProducts(user.role as UserRole)
    },
    // Admins and managers can edit
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canEditProducts(user.role as UserRole)
    },
    // Only admins can delete
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canDeleteProducts(user.role as UserRole)
    },
  },
  hooks: {
    afterChange: [afterProductChange],
    afterDelete: [afterProductDelete],
  },
  fields: [
    // Basic Info
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Name (English)',
        ar: 'الاسم (إنجليزي)',
      },
    },
    {
      name: 'nameAr',
      type: 'text',
      required: true,
      label: {
        en: 'Name (Arabic)',
        ar: 'الاسم (عربي)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'Slug',
        ar: 'المعرف',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'SKU',
        ar: 'رمز المنتج',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: {
        en: 'Description (English)',
        ar: 'الوصف (إنجليزي)',
      },
    },
    {
      name: 'descriptionAr',
      type: 'richText',
      label: {
        en: 'Description (Arabic)',
        ar: 'الوصف (عربي)',
      },
    },

    // Pricing
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: {
            en: 'Price (EGP)',
            ar: 'السعر (جنيه)',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          label: {
            en: 'Compare at Price',
            ar: 'السعر قبل الخصم',
          },
          admin: {
            description: 'Original price for showing discounts',
          },
        },
        {
          name: 'costPrice',
          type: 'number',
          min: 0,
          label: {
            en: 'Cost Price',
            ar: 'سعر التكلفة',
          },
          access: {
            read: ({ req: { user } }) => {
              if (!user || user.collection !== 'users') return false
              return user.role === 'super-admin' || user.role === 'admin' || user.role === 'manager'
            },
          },
        },
      ],
    },

    // Inventory
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          min: 0,
          label: {
            en: 'Stock',
            ar: 'المخزون',
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          min: 0,
          label: {
            en: 'Low Stock Alert',
            ar: 'تنبيه انخفاض المخزون',
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          label: {
            en: 'Track Inventory',
            ar: 'تتبع المخزون',
          },
        },
      ],
    },

    // Categorization (company field removed - column doesn't exist in database)
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: {
        en: 'Category',
        ar: 'الفئة',
      },
    },
    {
      name: 'brand',
      type: 'text',
      label: {
        en: 'Brand',
        ar: 'العلامة التجارية',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: {
        en: 'Tags',
        ar: 'الوسوم',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // Media
    {
      name: 'images',
      type: 'array',
      label: {
        en: 'Images',
        ar: 'الصور',
      },
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'datasheet',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Datasheet (PDF)',
        ar: 'ورقة البيانات',
      },
    },

    // Product Type
    {
      name: 'productType',
      type: 'select',
      required: true,
      label: {
        en: 'Product Type',
        ar: 'نوع المنتج',
      },
      options: [
        { label: 'HDPE', value: 'hdpe' },
        { label: 'LDPE', value: 'ldpe' },
        { label: 'Polypropylene (PP)', value: 'pp' },
        { label: 'PVC', value: 'pvc' },
        { label: 'PET', value: 'pet' },
        { label: 'Polystyrene (PS)', value: 'ps' },
        { label: 'Recycled Materials', value: 'recycled' },
        { label: 'Raw Material', value: 'raw-material' },
        { label: 'Masterbatch', value: 'masterbatch' },
        { label: 'Additives', value: 'additives' },
      ],
    },

    // Technical Specs (Dynamic)
    {
      name: 'specifications',
      type: 'array',
      label: {
        en: 'Technical Specifications',
        ar: 'المواصفات التقنية',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: { en: 'Specification', ar: 'المواصفة' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: { en: 'Value', ar: 'القيمة' },
        },
        {
          name: 'keyAr',
          type: 'text',
          label: { en: 'Specification (Arabic)', ar: 'المواصفة (عربي)' },
        },
        {
          name: 'valueAr',
          type: 'text',
          label: { en: 'Value (Arabic)', ar: 'القيمة (عربي)' },
        },
      ],
    },

    // Polymer specifications
    {
      name: 'polymerSpecs',
      type: 'group',
      label: {
        en: 'Polymer Specifications',
        ar: 'مواصفات البوليمر',
      },
      admin: {
        condition: (data) => ['hdpe', 'ldpe', 'pp', 'pvc', 'pet', 'ps'].includes(data.productType),
      },
      fields: [
        {
          name: 'density',
          type: 'text',
          label: { en: 'Density (g/cm³)', ar: 'الكثافة (جم/سم³)' },
        },
        {
          name: 'meltFlowRate',
          type: 'text',
          label: { en: 'Melt Flow Rate (g/10min)', ar: 'معدل التدفق (جم/10دقائق)' },
        },
        {
          name: 'tensileStrength',
          type: 'text',
          label: { en: 'Tensile Strength (MPa)', ar: 'قوة الشد (ميجا باسكال)' },
        },
        {
          name: 'meltingPoint',
          type: 'text',
          label: { en: 'Melting Point (°C)', ar: 'نقطة الانصهار (°م)' },
        },
        {
          name: 'applications',
          type: 'textarea',
          label: { en: 'Applications', ar: 'التطبيقات' },
        },
        {
          name: 'applicationsAr',
          type: 'textarea',
          label: { en: 'Applications (Arabic)', ar: 'التطبيقات (عربي)' },
        },
      ],
    },

    // Masterbatch specifications
    {
      name: 'masterbatchSpecs',
      type: 'group',
      label: {
        en: 'Masterbatch Specifications',
        ar: 'مواصفات الماستر باتش',
      },
      admin: {
        condition: (data) => data.productType === 'masterbatch',
      },
      fields: [
        {
          name: 'colorCode',
          type: 'text',
          label: { en: 'Color Code', ar: 'كود اللون' },
        },
        {
          name: 'pigmentContent',
          type: 'text',
          label: { en: 'Pigment Content (%)', ar: 'نسبة الصبغة (%)' },
        },
        {
          name: 'carrierResin',
          type: 'text',
          label: { en: 'Carrier Resin', ar: 'الراتنج الحامل' },
        },
        {
          name: 'recommendedDosage',
          type: 'text',
          label: { en: 'Recommended Dosage (%)', ar: 'الجرعة الموصى بها (%)' },
        },
      ],
    },

    // Raw Materials specific
    {
      name: 'rawMaterialSpecs',
      type: 'group',
      label: {
        en: 'Raw Material Specifications',
        ar: 'مواصفات الخامة',
      },
      admin: {
        condition: (data) => data.productType === 'raw-material',
      },
      fields: [
        {
          name: 'materialType',
          type: 'select',
          options: ['PP', 'PE', 'HDPE', 'LDPE', 'PVC', 'Other'],
          label: { en: 'Material Type', ar: 'نوع المادة' },
        },
        {
          name: 'grade',
          type: 'text',
          label: { en: 'Grade', ar: 'الدرجة' },
        },
        {
          name: 'mfi',
          type: 'text',
          label: { en: 'Melt Flow Index', ar: 'معدل التدفق' },
        },
        {
          name: 'minOrderQuantity',
          type: 'number',
          label: { en: 'Min Order Quantity', ar: 'أقل كمية طلب' },
        },
        {
          name: 'unitOfMeasure',
          type: 'select',
          options: ['kg', 'ton', 'bag'],
          label: { en: 'Unit of Measure', ar: 'وحدة القياس' },
        },
      ],
    },

    // SEO
    {
      name: 'metaTitle',
      type: 'text',
      label: {
        en: 'Meta Title',
        ar: 'عنوان السيو',
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: {
        en: 'Meta Description',
        ar: 'وصف السيو',
      },
      admin: {
        position: 'sidebar',
      },
    },

    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      label: {
        en: 'Status',
        ar: 'الحالة',
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Featured',
        ar: 'مميز',
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
