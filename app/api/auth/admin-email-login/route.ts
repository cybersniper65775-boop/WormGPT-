import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Default admin credentials
    const DEFAULT_ADMIN_EMAIL = 'admin@wormgpt.com'
    const DEFAULT_ADMIN_PASSWORD = 'password'

    // Check if login matches default admin credentials
    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      // Create session cookie
      const response = NextResponse.json({
        success: true,
        message: 'Admin login successful',
      })

      // Set admin session cookie (24 hour expiry)
      response.cookies.set('wormgpt-admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 24 hours
        path: '/',
      })

      return response
    }

    // Check against database for custom admin users
    const adminUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1)

    if (adminUser.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = adminUser[0]

    if (!user.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Set admin session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
    })

    response.cookies.set('wormgpt-admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[v0] Admin login error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
