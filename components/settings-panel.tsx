'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUserActiveKey } from '@/app/actions/keys'
import { useEffect } from 'react'

export function SettingsPanel({ user }: { user: any }) {
  const router = useRouter()
  const [activeKey, setActiveKey] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getUserActiveKey()
      setActiveKey(key)
      setLoading(false)
    }
    fetchKey()
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-8">
          {/* Account Section */}
          <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
            <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400 block mb-2">Email</Label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-900 border-red-500/20 text-gray-400"
                />
              </div>
              <div>
                <Label className="text-gray-400 block mb-2">Name</Label>
                <Input
                  value={user.name || ''}
                  disabled
                  className="bg-gray-900 border-red-500/20 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* License Section */}
          {!loading && (
            <div className="border border-yellow-500/20 rounded-lg p-6 bg-yellow-500/5">
              <h2 className="text-lg font-semibold text-white mb-4">License</h2>
              {activeKey ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400 font-semibold">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span className="text-yellow-400">
                      Worm v{Math.floor(activeKey.mode / 10)}.{activeKey.mode % 10}
                    </span>
                  </div>
                  {!activeKey.is_lifetime && activeKey.chat_limit && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chats Remaining:</span>
                      <span className="text-white">
                        {activeKey.chat_limit - activeKey.chat_count} / {activeKey.chat_limit}
                      </span>
                    </div>
                  )}
                  {activeKey.is_lifetime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">Lifetime</span>
                    </div>
                  )}
                  {activeKey.expiration_date && !activeKey.is_lifetime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white">
                        {new Date(activeKey.expiration_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">
                  No active license. Go to dashboard to activate a key.
                </p>
              )}
            </div>
          )}

          {/* Preferences Section */}
          <div className="border border-blue-500/20 rounded-lg p-6 bg-blue-500/5">
            <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">
                  Receive email notifications
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Save chat history</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Dark theme (default)</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-2 border-red-500/50 rounded-lg p-6 bg-red-500/10">
            <h2 className="text-lg font-semibold text-red-500 mb-4">⚠️ Danger Zone</h2>
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Other destructive actions like account deletion can be requested through support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
