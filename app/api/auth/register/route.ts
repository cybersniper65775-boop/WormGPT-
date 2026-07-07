import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory user store (replace with database in production)
const users = new Map()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validation
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

    // Check if user exists
    const existingUser = Array.from(users.values()).find((u: any) => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newUser = {
      id: userId,
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    }

    users.set(userId, newUser)

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
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
