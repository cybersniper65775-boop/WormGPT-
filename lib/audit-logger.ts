'use server'

import { db } from '@/lib/db'
import { adminLogs } from '@/lib/db/schema'

export async function logAdminAction(
  adminUserId: string,
  action: string,
  targetType: string,
  targetId: string,
  details: Record<string, any>
) {
  try {
    await db.insert(adminLogs).values({
      id: `log_${Date.now()}`,
      admin_user_id: adminUserId,
      action,
      target_type: targetType,
      target_id: targetId,
      details: JSON.stringify(details),
      created_at: new Date(),
    })
  } catch (error) {
    console.error('[v0] Audit logging error:', error)
  }
}

export async function getAdminLogs(adminUserId: string, limit = 50) {
  try {
    const logs = await db
      .select()
      .from(adminLogs)
      .where((col) => col.admin_user_id === adminUserId)
      .limit(limit)
      .orderBy(desc(adminLogs.created_at))
    
    return logs
  } catch (error) {
    console.error('[v0] Fetching audit logs error:', error)
    return []
  }
}
