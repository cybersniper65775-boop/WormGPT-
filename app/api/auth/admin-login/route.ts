import { cookies } from 'next/headers'

const ADMIN_CODE = 'WormGPT-ADMIN-MASTER-KEY'
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request: Request) {
  try {
    const { adminCode } = await request.json()

    if (!adminCode) {
      return Response.json(
        { error: 'Admin code is required' },
        { status: 400 }
      )
    }

    if (adminCode !== ADMIN_CODE) {
      return Response.json(
        { error: 'Invalid admin code' },
        { status: 401 }
      )
    }

    // Set admin session cookie
    const cookieStore = await cookies()
    const sessionToken = Buffer.from(
      `admin-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    ).toString('base64')

    cookieStore.set('wormgpt-admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ADMIN_SESSION_DURATION,
      path: '/',
    })

    return Response.json({
      success: true,
      message: 'Admin access granted',
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return Response.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
