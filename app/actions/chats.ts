'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chats, messages, userKeys } from '@/lib/db/schema'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createChat(title: string = 'New Chat', mode: number = 1) {
  const userId = await getUserId()

  try {
    // Check if user has an active key
    const userKey = await db
      .select()
      .from(userKeys)
      .where(eq(userKeys.user_id, userId))
      .limit(1)

    if (!userKey.length) {
      return { success: false, error: 'No active key. Please activate a license key.' }
    }

    const key = userKey[0]

    // Check if user has reached chat limit
    if (
      !key.is_lifetime &&
      key.chat_limit &&
      (key.chat_count || 0) >= key.chat_limit
    ) {
      return { success: false, error: 'Chat limit reached. Please upgrade.' }
    }

    // Check if key has expired
    if (key.expiration_date && key.expiration_date < new Date()) {
      return { success: false, error: 'Key has expired.' }
    }

    // Check if mode is accessible by this key
    if (mode > key.mode) {
      return { success: false, error: `Mode ${mode} requires a higher tier key.` }
    }

    const chatId = nanoid()
    await db.insert(chats).values({
      id: chatId,
      user_id: userId,
      title,
      mode,
      model: 'deepseek',
    })

    // Increment chat count
    await db
      .update(userKeys)
      .set({ chat_count: (key.chat_count || 0) + 1 })
      .where(eq(userKeys.id, key.id))

    revalidatePath('/dashboard')
    return { success: true, chatId }
  } catch (error) {
    console.error('Error creating chat:', error)
    return { success: false, error: 'Failed to create chat' }
  }
}

export async function getUserChats() {
  const userId = await getUserId()

  try {
    const userChats = await db
      .select()
      .from(chats)
      .where(and(eq(chats.user_id, userId), eq(chats.is_deleted, false)))
      .orderBy(desc(chats.updated_at))

    return userChats
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function getChat(chatId: string) {
  const userId = await getUserId()

  try {
    const chat = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.user_id, userId)))
      .limit(1)

    return chat[0] || null
  } catch (error) {
    console.error('Error fetching chat:', error)
    return null
  }
}

export async function getChatMessages(chatId: string) {
  const userId = await getUserId()

  try {
    // Verify chat belongs to user
    const chat = await getChat(chatId)
    if (!chat) return []

    const chatMessages = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.chat_id, chatId),
          eq(messages.user_id, userId)
        )
      )
      .orderBy(messages.created_at)

    return chatMessages
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export async function addMessage(
  chatId: string,
  role: 'user' | 'assistant',
  content: string,
  tokensUsed: number = 0
) {
  const userId = await getUserId()

  try {
    // Verify chat belongs to user
    const chat = await getChat(chatId)
    if (!chat) return { success: false, error: 'Chat not found' }

    const messageId = nanoid()
    await db.insert(messages).values({
      id: messageId,
      chat_id: chatId,
      user_id: userId,
      role,
      content,
      tokens_used: tokensUsed,
    })

    // Update chat timestamp
    await db
      .update(chats)
      .set({ updated_at: new Date() })
      .where(eq(chats.id, chatId))

    revalidatePath(`/dashboard/chat/${chatId}`)
    return { success: true, messageId }
  } catch (error) {
    console.error('Error adding message:', error)
    return { success: false, error: 'Failed to add message' }
  }
}

export async function deleteChat(chatId: string) {
  const userId = await getUserId()

  try {
    // Verify chat belongs to user
    const chat = await getChat(chatId)
    if (!chat) return { success: false, error: 'Chat not found' }

    await db
      .update(chats)
      .set({ is_deleted: true })
      .where(eq(chats.id, chatId))

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting chat:', error)
    return { success: false, error: 'Failed to delete chat' }
  }
}

export async function renameChat(chatId: string, title: string) {
  const userId = await getUserId()

  try {
    const chat = await getChat(chatId)
    if (!chat) return { success: false, error: 'Chat not found' }

    await db
      .update(chats)
      .set({ title })
      .where(eq(chats.id, chatId))

    revalidatePath(`/dashboard/chat/${chatId}`)
    return { success: true }
  } catch (error) {
    console.error('Error renaming chat:', error)
    return { success: false, error: 'Failed to rename chat' }
  }
}
