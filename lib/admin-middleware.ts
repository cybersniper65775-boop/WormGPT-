import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function requireAdmin(request: NextRequest) {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('wormgpt-admin-session')

  if (!adminSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return null // Allow access
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('wormgpt-admin-session')
  return adminSession?.value || null
}

export async function isAdmin() {
  const session = await getAdminSession()
  return !!session
}
