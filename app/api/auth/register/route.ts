import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// Store users in memory for now (will be replaced with database)
const users: Map<string, any> = new Map()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    const userId = `user-${nanoid()}`
    
    // Create user object
    const newUser = {
      id: userId,
      name,
      email,
      password, // In production, hash this
      subscription_tier: 'free',
      credits: 100,
      created_at: new Date().toISOString(),
    }

    // Store user
    users.set(userId, newUser)

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: userId,
          email,
          name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    )
  }
}

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const userId = `user-${nanoid()}`
    const now = new Date()

    try {
      // Insert user directly
      await db.insert(userTable).values({
        id: userId,
        name,
        email,
        email_verified: true,
        createdAt: now,
        updatedAt: now,
        subscription_tier: 'free',
        credits: 100,
        is_admin: false,
      })
    } catch (dbError: any) {
      console.error('[v0] DB insert error:', dbError.message)
      if (dbError.message.includes('unique') || dbError.message.includes('email')) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 409 }
        )
      }
      throw dbError
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: { id: userId, email, name },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
