import type { CollectionConfig } from 'payload'

// Helper to check user role permissions
type UserRole = 'super-admin' | 'admin' | 'manager' | 'staff'

const canManageCategories = (role?: UserRole): boolean => {
  return ['super-admin', 'admin'].includes(role || '')
}

const canDeleteCategories = (role?: UserRole): boolean => {
  return ['super-admin', 'admin'].includes(role || '')
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'nameAr', 'company', 'order'],
    group: 'Content',
  },
  labels: {
    singular: {
      en: 'Category',
      ar: 'فئة',
    },
    plural: {
      en: 'Categories',
      ar: 'الفئات',
    },
  },
  access: {
    // Anyone can read categories (public catalog)
    read: () => true,
    // Only admins can create categories
    create: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canManageCategories(user.role as UserRole)
    },
    // Only admins can edit categories
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canManageCategories(user.role as UserRole)
    },
    // Only admins can delete categories
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection !== 'users') return false
      return canDeleteCategories(user.role as UserRole)
    },
  },
  fields: [
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
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Description (English)',
        ar: 'الوصف (إنجليزي)',
      },
    },
    {
      name: 'descriptionAr',
      type: 'textarea',
      label: {
        en: 'Description (Arabic)',
        ar: 'الوصف (عربي)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Image',
        ar: 'الصورة',
      },
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      label: {
        en: 'Company',
        ar: 'الشركة',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: {
        en: 'Parent Category',
        ar: 'الفئة الأصلية',
      },
      filterOptions: ({ id }) => {
        return { id: { not_equals: id } }
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
      label: {
        en: 'Display Order',
        ar: 'ترتيب العرض',
      },
    },
  ],
}
