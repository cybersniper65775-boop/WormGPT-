'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function DashboardSidebar({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-red-500/20 bg-black/50 backdrop-blur flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-red-500/20">
        <Link href="/dashboard" className="text-2xl font-bold text-red-500">
          WORMGPT
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-4">
        <Link
          href="/dashboard"
          className="block w-full px-4 py-2 text-left rounded hover:bg-red-500/10 text-gray-300 hover:text-white transition"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/chats"
          className="block w-full px-4 py-2 text-left rounded hover:bg-red-500/10 text-gray-300 hover:text-white transition"
        >
          All Chats
        </Link>
        <Link
          href="/dashboard/settings"
          className="block w-full px-4 py-2 text-left rounded hover:bg-red-500/10 text-gray-300 hover:text-white transition"
        >
          Settings
        </Link>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-6 border-t border-red-500/20 space-y-4">
        <div className="text-sm">
          <p className="text-gray-400">Logged in as</p>
          <p className="font-semibold text-white">{user.name || user.email}</p>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Logout
        </Button>
      </div>
    </aside>
  )
}
