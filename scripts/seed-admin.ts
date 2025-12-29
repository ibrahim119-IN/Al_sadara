import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Seed Admin User
 * Run with: npx tsx scripts/seed-admin.ts
 *
 * Creates a super-admin user for accessing the admin panel
 */

const ADMIN_USER = {
  email: 'admin@alsadara.com',
  password: 'Admin@123!',
  name: 'مدير النظام',
  role: 'super-admin' as const,
}

async function seedAdmin() {
  try {
    const payload = await getPayload({ config })

    console.log('\n🔐 Creating Admin User...\n')

    // Check if admin already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: ADMIN_USER.email },
      },
      limit: 1,
    })

    if (existingUser.docs.length > 0) {
      console.log('⚠️  Admin user already exists!')
      console.log(`📧 Email: ${ADMIN_USER.email}`)
      console.log('\n💡 If you forgot the password, you can reset it using:')
      console.log('   npx payload admin-reset-password')
      process.exit(0)
    }

    // Create the admin user
    const admin = await payload.create({
      collection: 'users',
      data: ADMIN_USER,
    })

    console.log('✅ Admin user created successfully!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:    ', ADMIN_USER.email)
    console.log('🔑 Password: ', ADMIN_USER.password)
    console.log('👤 Name:     ', ADMIN_USER.name)
    console.log('🛡️  Role:     ', ADMIN_USER.role)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('⚠️  IMPORTANT: Change the password immediately after first login!\n')
    console.log('🔗 Admin Panel: http://localhost:3000/admin')
    console.log('\n🎉 Done!')

    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Failed to create admin user:', error.message)

    if (error.message.includes('duplicate')) {
      console.log('\n💡 The admin user might already exist.')
    }

    process.exit(1)
  }
}

seedAdmin()
