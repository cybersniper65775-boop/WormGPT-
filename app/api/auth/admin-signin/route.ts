import { NextRequest, NextResponse } from 'next/server'

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@wormgpt.com',
  password: 'password',
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Check admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const admin = {
        id: 'admin-001',
        email,
        name: 'WormGPT Admin',
        is_admin: true,
        subscription_tier: 'admin',
      }

      const response = NextResponse.json({
        success: true,
        message: 'Admin login successful',
        user: admin,
      })

      // Set secure session cookie
      response.cookies.set('wormgpt-session', JSON.stringify(admin), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid admin credentials' },
      { status: 401 }
    )
  } catch (error: any) {
    console.error('[v0] Admin signin error:', error)
    return NextResponse.json(
      { error: 'Admin signin failed' },
      { status: 500 }
    )
  }
}
