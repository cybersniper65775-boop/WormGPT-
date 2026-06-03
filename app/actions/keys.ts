'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  activationKeys,
  userKeys,
  adminLogs,
  user as userTable,
} from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function isAdmin(userId: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)

  return user[0]?.subscription_tier === 'admin'
}

export async function activateKey(keyCode: string) {
  const userId = await getUserId()

  // Validate key format (WormGPT-XXXXX-XXXXX-XXXXX)
  if (!keyCode.startsWith('WormGPT-')) {
    return { success: false, error: 'Invalid key format' }
  }

  try {
    // Find the key
    const key = await db
      .select()
      .from(activationKeys)
      .where(
        and(
          eq(activationKeys.key_code, keyCode),
          eq(activationKeys.status, 'active')
        )
      )
      .limit(1)

    if (!key.length) {
      return { success: false, error: 'Key not found or already used' }
    }

    const activationKey = key[0]

    // Check if key has expired
    if (
      activationKey.expiration_date &&
      activationKey.expiration_date < new Date()
    ) {
      return { success: false, error: 'Key has expired' }
    }

    // Check if user already has this key activated
    const existing = await db
      .select()
      .from(userKeys)
      .where(
        and(
          eq(userKeys.user_id, userId),
          eq(userKeys.activation_key_id, activationKey.id)
        )
      )
      .limit(1)

    if (existing.length) {
      return { success: false, error: 'Key already activated on your account' }
    }

    // Create user key
    const userKeyId = nanoid()
    await db.insert(userKeys).values({
      id: userKeyId,
      user_id: userId,
      activation_key_id: activationKey.id,
      mode: activationKey.mode,
      chat_limit: activationKey.chat_limit,
      is_lifetime: activationKey.is_lifetime,
      expiration_date: activationKey.expiration_date,
    })

    // Update activation key status
    await db
      .update(activationKeys)
      .set({
        status: 'used',
        activated_at: new Date(),
        activated_by_user_id: userId,
        chat_count: (activationKey.chat_count || 0) + 1,
      })
      .where(eq(activationKeys.id, activationKey.id))

    return {
      success: true,
      mode: activationKey.mode,
      chat_limit: activationKey.chat_limit,
      is_lifetime: activationKey.is_lifetime,
      expiration_date: activationKey.expiration_date,
    }
  } catch (error) {
    console.error('Error activating key:', error)
    return { success: false, error: 'Failed to activate key' }
  }
}

export async function getUserActiveKey() {
  const userId = await getUserId()

  try {
    const userKey = await db
      .select()
      .from(userKeys)
      .where(eq(userKeys.user_id, userId))
      .limit(1)

    if (!userKey.length) {
      return null
    }

    const key = userKey[0]

    // Check if expired
    if (key.expiration_date && key.expiration_date < new Date()) {
      return null
    }

    return {
      mode: key.mode,
      chat_limit: key.chat_limit,
      chat_count: key.chat_count,
      is_lifetime: key.is_lifetime,
      expiration_date: key.expiration_date,
    }
  } catch (error) {
    console.error('Error getting user key:', error)
    return null
  }
}

export async function generateAdminKey(
  mode: number,
  chatLimit?: number,
  isLifetime: boolean = false,
  expirationDate?: Date
) {
  const userId = await getUserId()
  const admin = await isAdmin(userId)

  if (!admin) {
    return { success: false, error: 'Admin access required' }
  }

  try {
    const keyId = nanoid()
    const keyCode = `WormGPT-${nanoid(5)}-${nanoid(5)}-${nanoid(5)}`

    await db.insert(activationKeys).values({
      id: keyId,
      key_code: keyCode,
      mode,
      created_by_user_id: userId,
      chat_limit: chatLimit,
      is_lifetime: isLifetime,
      expiration_date: expirationDate,
      status: 'active',
    })

    // Log the action
    await db.insert(adminLogs).values({
      id: nanoid(),
      admin_user_id: userId,
      action: 'generate_key',
      target_type: 'activation_key',
      target_id: keyId,
      details: {
        mode,
        chat_limit: chatLimit,
        is_lifetime: isLifetime,
        expiration_date: expirationDate?.toISOString(),
      },
    })

    return {
      success: true,
      keyCode,
      mode,
      chatLimit,
      isLifetime,
      expirationDate,
    }
  } catch (error) {
    console.error('Error generating key:', error)
    return { success: false, error: 'Failed to generate key' }
  }
}

export async function revokeAdminKey(keyCode: string) {
  const userId = await getUserId()
  const admin = await isAdmin(userId)

  if (!admin) {
    return { success: false, error: 'Admin access required' }
  }

  try {
    const key = await db
      .select()
      .from(activationKeys)
      .where(eq(activationKeys.key_code, keyCode))
      .limit(1)

    if (!key.length) {
      return { success: false, error: 'Key not found' }
    }

    await db
      .update(activationKeys)
      .set({ status: 'revoked' })
      .where(eq(activationKeys.id, key[0].id))

    // Log the action
    await db.insert(adminLogs).values({
      id: nanoid(),
      admin_user_id: userId,
      action: 'revoke_key',
      target_type: 'activation_key',
      target_id: key[0].id,
    })

    return { success: true }
  } catch (error) {
    console.error('Error revoking key:', error)
    return { success: false, error: 'Failed to revoke key' }
  }
}
