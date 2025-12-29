import type { CollectionConfig } from 'payload'

export const AIMessages: CollectionConfig = {
  slug: 'ai-messages',
  labels: {
    singular: 'AI Message',
    plural: 'AI Messages',
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['conversation', 'role', 'content', 'createdAt'],
    group: 'AI System',
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all, customers can only read their own conversation messages
      if (user?.collection === 'users') return true
      // For customers, need to check if they own the conversation
      if (user?.collection === 'customers') {
        return {
          'conversation.customer': {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: () => true, // Allow message creation (handled by API)
    update: ({ req: { user } }) => {
      // Only admins can update messages
      return user?.collection === 'users'
    },
    delete: ({ req: { user } }) => {
      // Only admins can delete messages
      return user?.collection === 'users'
    },
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'ai-conversations',
      required: true,
      index: true,
      admin: {
        description: 'The conversation this message belongs to',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Assistant', value: 'assistant' },
        { label: 'System', value: 'system' },
      ],
      required: true,
      index: true,
      admin: {
        description: 'Who sent this message',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The message content',
      },
    },
    {
      name: 'functionCalls',
      type: 'json',
      admin: {
        description: 'Function calls made by the AI in this message',
      },
    },
    {
      name: 'functionResults',
      type: 'json',
      admin: {
        description: 'Results from function calls',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (model, temperature, etc.)',
      },
    },
    {
      name: 'tokensUsed',
      type: 'number',
      admin: {
        description: 'Number of tokens used for this message',
      },
    },
  ],
  timestamps: true,
}
