import type { CollectionConfig } from 'payload'

export const ProductEmbeddings: CollectionConfig = {
  slug: 'product-embeddings',
  labels: {
    singular: 'Product Embedding',
    plural: 'Product Embeddings',
  },
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['product', 'locale', 'createdAt'],
    group: 'AI System',
    description: 'Vector embeddings for products used in AI-powered search and recommendations',
  },
  access: {
    read: () => true, // Everyone can read embeddings (needed for AI queries)
    create: ({ req: { user } }) => {
      // Only admins and API can create embeddings
      return user?.collection === 'users'
    },
    update: ({ req: { user } }) => {
      // Only admins can update embeddings
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete embeddings
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
      admin: {
        description: 'The product this embedding represents',
      },
    },
    {
      name: 'embedding',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'number',
        },
      ],
      admin: {
        description: 'Vector embedding (768 dimensions for text-embedding-004)',
        readOnly: true,
      },
    },
    {
      name: 'text',
      type: 'textarea',
      admin: {
        description: 'The original text that was embedded (name + description + specs)',
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
        description: 'Language of the embedded text',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (category, brand, price_range, etc.)',
      },
    },
  ],
  timestamps: true,
}
