import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { chats, userKeys } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getTierCapabilities, getTierFromKey } from '@/lib/tier-system'

export async function POST(req: NextRequest) {
  try {
    const { chatId, filename, content, format } = await req.json()

    if (!chatId || !filename || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from chat
    const chat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1)

    if (!chat.length) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      )
    }

    const userId = chat[0].user_id

    // Get user tier
    const userKey = await db
      .select()
      .from(userKeys)
      .where(eq(userKeys.user_id, userId))
      .limit(1)

    const tier = userKey.length
      ? getTierFromKey(userKey[0].chat_limit, userKey[0].is_lifetime)
      : 'free'

    const capabilities = getTierCapabilities(tier)

    // Check if user can download
    if (!capabilities.allowFileDownload) {
      return NextResponse.json(
        { error: 'Your tier does not allow file downloads' },
        { status: 403 }
      )
    }

    // Check file size
    const sizeInMB = Buffer.byteLength(content) / (1024 * 1024)
    if (sizeInMB > capabilities.maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${capabilities.maxFileSize}MB for your tier` },
        { status: 413 }
      )
    }

    // Check format support
    if (
      !capabilities.supportedFormats.includes('*') &&
      !capabilities.supportedFormats.includes(format)
    ) {
      return NextResponse.json(
        { error: `Format ${format} not supported for your tier` },
        { status: 400 }
      )
    }

    // Return file download
    const buffer = Buffer.from(content)

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('[v0] Download error:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}
