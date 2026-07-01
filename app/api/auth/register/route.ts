import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'

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
