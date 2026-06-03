import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('wormgpt-admin-session')

  return Response.json({
    success: true,
    message: 'Admin session terminated',
  })
}
