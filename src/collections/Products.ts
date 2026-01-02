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
        { label: 'CCTV Camera', value: 'cctv' },
        { label: 'Access Control', value: 'access-control' },
        { label: 'Intercom', value: 'intercom' },
        { label: 'PBX System', value: 'pbx' },
        { label: 'Nurse Call', value: 'nurse-call' },
        { label: 'Fire Alarm', value: 'fire-alarm' },
        { label: 'GPS Tracker', value: 'gps' },
        { label: 'Raw Material', value: 'raw-material' },
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

    // CCTV-specific fields
    {
      name: 'cctvSpecs',
      type: 'group',
      label: {
        en: 'CCTV Specifications',
        ar: 'مواصفات الكاميرا',
      },
      admin: {
        condition: (data) => data.productType === 'cctv',
      },
      fields: [
        {
          name: 'resolution',
          type: 'text',
          label: { en: 'Resolution', ar: 'الدقة' },
        },
        {
          name: 'cameraType',
          type: 'select',
          options: ['IP', 'AHD', 'TVI', 'CVI'],
          label: { en: 'Camera Type', ar: 'نوع الكاميرا' },
        },
        {
          name: 'nightVision',
          type: 'text',
          label: { en: 'Night Vision Range', ar: 'مدى الرؤية الليلية' },
        },
        {
          name: 'indoorOutdoor',
          type: 'select',
          options: [
            { label: 'Indoor', value: 'indoor' },
            { label: 'Outdoor', value: 'outdoor' },
            { label: 'Both', value: 'both' },
          ],
          label: { en: 'Indoor/Outdoor', ar: 'داخلي/خارجي' },
        },
        {
          name: 'poe',
          type: 'checkbox',
          label: { en: 'PoE Support', ar: 'دعم PoE' },
        },
        {
          name: 'audioSupport',
          type: 'checkbox',
          label: { en: 'Audio Support', ar: 'دعم الصوت' },
        },
      ],
    },

    // Access Control specific
    {
      name: 'accessControlSpecs',
      type: 'group',
      label: {
        en: 'Access Control Specifications',
        ar: 'مواصفات جهاز الحضور',
      },
      admin: {
        condition: (data) => data.productType === 'access-control',
      },
      fields: [
        {
          name: 'maxUsers',
          type: 'number',
          label: { en: 'Max Users', ar: 'أقصى عدد مستخدمين' },
        },
        {
          name: 'fingerprintCapacity',
          type: 'number',
          label: { en: 'Fingerprint Capacity', ar: 'سعة البصمات' },
        },
        {
          name: 'faceCapacity',
          type: 'number',
          label: { en: 'Face Capacity', ar: 'سعة الوجوه' },
        },
        {
          name: 'cardSupport',
          type: 'checkbox',
          label: { en: 'Card Support', ar: 'دعم الكارت' },
        },
        {
          name: 'wifiSupport',
          type: 'checkbox',
          label: { en: 'WiFi Support', ar: 'دعم WiFi' },
        },
        {
          name: 'attendanceReport',
          type: 'checkbox',
          label: { en: 'Attendance Report', ar: 'تقرير الحضور' },
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
