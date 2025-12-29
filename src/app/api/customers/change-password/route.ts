import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Helper function to get authenticated customer from Payload token
async function getAuthenticatedCustomer(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (!token) return null

  try {
    const payload = await getPayload({ config })
    const result = await payload.auth({ headers: request.headers })
    // Check if user is from customers collection
    if (result.user && 'collection' in result && result.user.collection === 'customers') {
      return result.user
    }
    return null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: First verify the user is authenticated
    const authenticatedCustomer = await getAuthenticatedCustomer(request)

    if (!authenticatedCustomer) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body: ChangePasswordRequest = await request.json()
    const { currentPassword, newPassword } = body

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Verify current password by attempting login
    try {
      await payload.login({
        collection: 'customers',
        data: {
          email: authenticatedCustomer.email,
          password: currentPassword,
        },
      })
    } catch {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Update password for the AUTHENTICATED user only
    await payload.update({
      collection: 'customers',
      id: authenticatedCustomer.id,
      data: {
        password: newPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
