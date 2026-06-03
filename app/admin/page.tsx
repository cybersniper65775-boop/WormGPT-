import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { user as userTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AdminPanel } from '@/components/admin-panel'

export const metadata = {
  title: 'Admin Panel - WormGPT',
  description: 'WormGPT Admin Controls',
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Check if user is admin
  const adminUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1)

  if (!adminUser.length || adminUser[0].subscription_tier !== 'admin') {
    redirect('/dashboard')
  }

  return <AdminPanel user={session.user} />
}
