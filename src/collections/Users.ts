import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Name',
        ar: 'الاسم',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
      ],
      label: {
        en: 'Role',
        ar: 'الدور',
      },
      access: {
        update: ({ req: { user } }) => {
          if (!user || user.collection !== 'users') return false
          return user.role === 'super-admin'
        },
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      if (user.role === 'super-admin' || user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    create: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      return user.role === 'super-admin'
    },
    update: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      if (user.role === 'super-admin' || user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: ({ req: { user } }) => {
      if (!user || user.collection !== 'users') return false
      return user.role === 'super-admin'
    },
  },
}
