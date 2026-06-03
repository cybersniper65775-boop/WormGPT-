import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export const metadata = {
  title: 'Dashboard - WormGPT',
  description: 'WormGPT Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
