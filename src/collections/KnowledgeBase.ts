import type { CollectionConfig } from 'payload'

export const KnowledgeBase: CollectionConfig = {
  slug: 'knowledge-base',
  labels: {
    singular: 'Knowledge Base Entry',
    plural: 'Knowledge Base',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'category', 'locale', 'updatedAt'],
    group: 'AI System',
    description: 'Company policies, FAQs, and guides used by the AI assistant',
  },
  access: {
    read: () => true, // Everyone can read knowledge base (needed for AI)
    create: ({ req: { user } }) => {
      // Only admins can create knowledge base entries
      return user?.collection === 'users'
    },
    update: ({ req: { user } }) => {
      // Only admins can update knowledge base entries
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete knowledge base entries
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title of the knowledge base entry',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique slug for this entry (e.g., shipping-policy, faq-returns)',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The content in markdown format',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Policy', value: 'policy' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Guide', value: 'guide' },
      ],
      required: true,
      index: true,
      admin: {
        description: 'Type of knowledge base entry',
      },
    },
    {
      name: 'category',
      type: 'text',
      index: true,
      admin: {
        description: 'Category (shipping, return, warranty, payment, installation, etc.)',
      },
    },
    {
      name: 'embedding',
      type: 'json',
      admin: {
        description: 'Vector embedding for semantic search (array of numbers)',
        readOnly: true,
      },
    },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Arabic', value: 'ar' },
        { label: 'English', value: 'en' },
      ],
      required: true,
      index: true,
      defaultValue: 'ar',
      admin: {
        description: 'Language of this entry',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        description: 'Whether this entry is active and should be used by the AI',
      },
    },
  ],
  timestamps: true,
}
