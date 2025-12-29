import type { CollectionConfig } from 'payload'

export const AIConversations: CollectionConfig = {
  slug: 'ai-conversations',
  labels: {
    singular: 'AI Conversation',
    plural: 'AI Conversations',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'customer', 'status', 'messageCount', 'lastMessageAt'],
    group: 'AI System',
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, customers can only read their own
      if (user?.collection === 'users') return true
      if (user?.collection === 'customers') {
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: () => true, // Allow anyone to create conversations (for guests too)
    update: ({ req: { user } }) => {
      // Only admins can update
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique session identifier for this conversation',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      index: true,
      admin: {
        description: 'Linked customer (null for guest conversations)',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Auto-generated from first message',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
        { label: 'Deleted', value: 'deleted' },
      ],
      defaultValue: 'active',
      required: true,
      index: true,
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (locale, device, userAgent, etc.)',
      },
    },
    {
      name: 'messageCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Total number of messages in this conversation',
      },
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      index: true,
      admin: {
        description: 'Timestamp of the last message',
      },
    },
  ],
  timestamps: true,
}
