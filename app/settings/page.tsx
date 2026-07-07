'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, Lock, Bell, Palette, Trash2, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'danger'>('general')
  const [email, setEmail] = useState('user@example.com')
  const [name, setName] = useState('John Doe')
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState({
    email: true,
    chat: true,
    updates: false,
  })

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/sign-in')
    router.refresh()
  }

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'security' as const, label: 'Security', icon: Lock },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'danger' as const, label: 'Danger Zone', icon: Trash2 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-red-500">
            WormGPT
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-6">
          {/* Tabs */}
          <div className="col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{tab.label}</span>
                    {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="col-span-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Account Settings</h2>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-slate-300">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-slate-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="theme" className="text-slate-300">
                      Theme
                    </Label>
                    <select
                      id="theme"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="mt-2 w-full px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg"
                    >
                      <option value="dark">Dark (Cyberpunk)</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <Button className="bg-red-600 hover:bg-red-700 text-white">Save Changes</Button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Security</h2>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-pass" className="text-slate-300">
                          Current Password
                        </Label>
                        <Input
                          id="current-pass"
                          type="password"
                          className="mt-2 bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-pass" className="text-slate-300">
                          New Password
                        </Label>
                        <Input
                          id="new-pass"
                          type="password"
                          className="mt-2 bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-pass" className="text-slate-300">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirm-pass"
                          type="password"
                          className="mt-2 bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">Update Password</Button>
                  </div>

                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Active Sessions</h3>
                    <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                      <p className="text-slate-300">Current device</p>
                      <p className="text-xs text-slate-500 mt-1">Last active: Just now</p>
                      <Button className="mt-4 bg-slate-700 hover:bg-slate-600 text-white">Logout All Other Sessions</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Notification Settings</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'email' as const, label: 'Email Notifications', desc: 'Receive updates via email' },
                      { key: 'chat' as const, label: 'Chat Notifications', desc: 'Notify when responses arrive' },
                      { key: 'updates' as const, label: 'Product Updates', desc: 'Get notified about new features' },
                    ].map((notif) => (
                      <label key={notif.key} className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-600 rounded-lg hover:border-red-500/30 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[notif.key]}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [notif.key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <div>
                          <p className="font-medium text-white">{notif.label}</p>
                          <p className="text-xs text-slate-400">{notif.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <Button className="bg-red-600 hover:bg-red-700 text-white">Save Preferences</Button>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-red-500">Danger Zone</h2>
                    <p className="text-slate-400 mb-6">These actions cannot be undone.</p>
                  </div>

                  <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Delete All Chats</h3>
                    <p className="text-slate-400 mb-4">Permanently delete all your chat history and messages.</p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">Delete All Chats</Button>
                  </div>

                  <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Deactivate Account</h3>
                    <p className="text-slate-400 mb-4">Temporarily disable your account. You can reactivate it anytime.</p>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">Deactivate Account</Button>
                  </div>

                  <div className="border border-red-600 bg-red-600/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-500 mb-2">Delete Account</h3>
                    <p className="text-slate-400 mb-4">
                      Permanently delete your account and all associated data. This cannot be reversed.
                    </p>
                    <Button className="bg-red-700 hover:bg-red-800 text-white">Delete Account Permanently</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
