import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET /api/users/me - Get current authenticated admin user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('payload-token')?.value
    if (!token) {
      return NextResponse.json(
        { user: null, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config })

    // Use Payload's built-in auth verification
    const result = await payload.auth({ headers: request.headers })

    // Check if user is from users collection (admin users)
    if (result.user && 'collection' in result && result.user.collection === 'users') {
      const user = result.user as {
        id: number
        email: string
        name?: string
        role?: string
        createdAt: string
        updatedAt: string
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role || 'staff',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    }

    // Not an admin user
    return NextResponse.json(
      { user: null, message: 'Not authorized as admin' },
      { status: 403 }
    )
  } catch (error) {
    console.error('[Users API] Error getting current user:', error)
    return NextResponse.json(
      { user: null, message: 'Authentication failed' },
      { status: 401 }
    )
  }
}
