import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Companies } from './collections/Companies'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Customers } from './collections/Customers'
import { Orders } from './collections/Orders'
import { Quotes } from './collections/Quotes'
import { CartItems } from './collections/CartItems'

// AI Collections
import { AIConversations } from './collections/AIConversations'
import { AIMessages } from './collections/AIMessages'
import { ProductEmbeddings } from './collections/ProductEmbeddings'
import { KnowledgeBase } from './collections/KnowledgeBase'

// Globals
import { GroupSettings } from './globals/GroupSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Al Sadara Admin',
    },
  },
  collections: [
    Users,
    Media,
    Companies,
    Categories,
    Products,
    Customers,
    Orders,
    Quotes,
    CartItems,
    // AI Collections
    AIConversations,
    AIMessages,
    ProductEmbeddings,
    KnowledgeBase,
  ],
  globals: [
    GroupSettings,
  ],
  editor: lexicalEditor(),
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      throw new Error('PAYLOAD_SECRET environment variable is required. Please set it in your .env file.')
    }
    if (secret.length < 32) {
      throw new Error('PAYLOAD_SECRET must be at least 32 characters long for security.')
    }
    return secret
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (() => {
        const dbUri = process.env.DATABASE_URI
        if (!dbUri) {
          throw new Error('DATABASE_URI environment variable is required. Please set it in your .env file.')
        }
        return dbUri
      })(),
      // Connection pool settings for better performance
      max: 20, // Maximum number of connections in the pool
      min: 2, // Minimum number of connections to maintain
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 10000, // Timeout for acquiring a connection (10 seconds)
      allowExitOnIdle: true, // Allow the pool to exit when idle
    },
    // Disabled push to avoid interactive prompts - use migrations instead
    push: false,
  }),
  sharp,
  plugins: [],
})
