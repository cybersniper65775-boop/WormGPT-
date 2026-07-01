import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Basic validation - accept any email/password for now
    const user = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      subscription_tier: 'free',
    }

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Sign in successful',
      user,
    })

    // Set secure session cookie
    response.cookies.set('wormgpt-session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[v0] Sign in error:', error)
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    )
  }
}
