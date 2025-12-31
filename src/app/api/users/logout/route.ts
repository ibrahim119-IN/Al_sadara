import { NextRequest, NextResponse } from 'next/server'

// POST /api/users/logout - Logout admin user
export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: 'Logged out successfully',
    })

    // Clear the auth cookie
    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    })

    return response
  } catch (error) {
    console.error('[Users API] Logout error:', error)

    // Even if there's an error, try to clear the cookie
    const response = NextResponse.json(
      { message: 'Logout completed' },
      { status: 200 }
    )

    response.cookies.set('payload-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  }
}
