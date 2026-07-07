'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Menu, X, Bell, Search } from 'lucide-react'
import { DashboardStats } from '@/components/dashboard-stats'
import { RecentActivity } from '@/components/recent-activity'
import { APIKeysManager } from '@/components/api-keys'
import { UsageAnalytics } from '@/components/usage-analytics'
import { SubscriptionInfo } from '@/components/subscription-info'
import { QuickActions } from '@/components/quick-actions'

export default function ComprehensiveDashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/sign-in')
  }

  const tabs = ['overview', 'analytics', 'api-keys', 'subscription']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">WormGPT Dashboard</h1>
                <p className="text-xs text-slate-400">Mode 5 - Ultra</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
              />
            </div>

            <button className="relative p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:from-slate-600 hover:to-slate-700">
              <span className="text-white font-bold">U</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-1 border-t border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-red-500 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-slate-700 bg-slate-900/30 backdrop-blur p-6 hidden lg:block">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Navigation</p>
                <nav className="space-y-2">
                  {[
                    { name: 'Overview', href: '/dashboard' },
                    { name: 'Chat', href: '/chat' },
                    { name: 'Code Generator', href: '/generator' },
                    { name: 'IDE Editor', href: '/ide' },
                    { name: 'File Manager', href: '/files' },
                  ].map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors cursor-pointer">
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Account</p>
                <nav className="space-y-2">
                  {[
                    { name: 'Settings', href: '/settings' },
                    { name: 'Billing', href: '/pricing' },
                    { name: 'Help', href: '/help' },
                    { name: 'Contact', href: '/contact' },
                  ].map((item) => (
                    <Link key={item.name} href={item.href}>
                      <div className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors cursor-pointer">
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        )}

        {/* Main Panel */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <DashboardStats />
              <QuickActions />
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <UsageAnalytics />
                </div>
                <RecentActivity />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics & Usage</h2>
              <UsageAnalytics />
              <RecentActivity />
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">API Keys Management</h2>
              <APIKeysManager />
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Subscription & Billing</h2>
              <SubscriptionInfo />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
