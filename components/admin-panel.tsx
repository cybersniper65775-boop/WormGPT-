'use client'

import { useState } from 'react'
import { generateAdminKey, revokeAdminKey } from '@/app/actions/keys'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const MODES = [
  { value: 1, label: 'Worm v4.0 - FAST' },
  { value: 2, label: 'Worm v4.1 - SMART' },
  { value: 3, label: 'Worm v4.3 - DEEP' },
  { value: 4, label: 'Worm v5.0 - SUPREME' },
  { value: 5, label: 'Worm v5.1 - ULTRA' },
  { value: 6, label: 'Admin Mode Alpha' },
  { value: 7, label: 'Chaos Mode' },
]

export function AdminPanel({ user }: { user: any }) {
  const [mode, setMode] = useState(5)
  const [chatLimit, setChatLimit] = useState('')
  const [isLifetime, setIsLifetime] = useState(false)
  const [expirationDays, setExpirationDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [revokeKey, setRevokeKey] = useState<string>('')
  const [revokeLoading, setRevokeLoading] = useState<boolean>(false)

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setGeneratedKey(null)
    setLoading(true)

    try {
      const expirationDate = !isLifetime
        ? expirationDays
          ? new Date(Date.now() + parseInt(expirationDays) * 24 * 60 * 60 * 1000)
          : undefined
        : undefined

      const result = await generateAdminKey(
        mode,
        chatLimit ? parseInt(chatLimit) : undefined,
        isLifetime,
        expirationDate
      )

      if (result.success) {
        setGeneratedKey(result.keyCode || '')
        setMode(5)
        setChatLimit('')
        setIsLifetime(false)
        setExpirationDays('')
      } else {
        setError(result.error || 'Failed to generate key')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setRevokeLoading(true)

    try {
      const result = await revokeAdminKey(revokeKey)

      if (result.success) {
        setRevokeKey('')
        alert('Key revoked successfully')
      } else {
        setError(result.error || 'Failed to revoke key')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setRevokeLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-red-500">ADMIN PANEL</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome, {user.name}</p>
          </div>
          <Link href="/dashboard" className="text-gray-400 hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Generate Key */}
          <div className="border border-red-500/20 rounded-lg p-6 bg-red-500/5">
            <h2 className="text-xl font-bold text-white mb-6">Generate License Key</h2>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <Label className="text-gray-300 block mb-2">Mode</Label>
                <select
                  value={mode}
                  onChange={(e) => setMode(parseInt(e.target.value))}
                  className="w-full bg-gray-900 border border-red-500/20 text-white rounded p-2"
                >
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-300 block mb-2">Chat Limit</Label>
                <Input
                  type="number"
                  value={chatLimit}
                  onChange={(e) => setChatLimit(e.target.value)}
                  placeholder="Leave empty for unlimited"
                  className="bg-gray-900 border-red-500/20 text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLifetime}
                    onChange={(e) => setIsLifetime(e.target.checked)}
                    className="rounded"
                  />
                  Lifetime Access
                </label>
              </div>

              {!isLifetime && (
                <div>
                  <Label className="text-gray-300 block mb-2">Expiration (Days)</Label>
                  <Input
                    type="number"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(e.target.value)}
                    placeholder="Leave empty for no expiration"
                    className="bg-gray-900 border-red-500/20 text-white"
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {loading ? 'Generating...' : 'Generate Key'}
              </Button>

              {generatedKey && (
                <div className="bg-green-500/20 border border-green-500/50 rounded p-4 mt-4">
                  <p className="text-green-400 text-sm font-semibold mb-2">
                    Key Generated Successfully
                  </p>
                  <div className="bg-black rounded p-2 text-center font-mono text-lg text-green-400 break-all">
                    {generatedKey}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Copy this key and share it with the user. It can only be used once.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Revoke Key */}
          <div className="border border-yellow-500/20 rounded-lg p-6 bg-yellow-500/5">
            <h2 className="text-xl font-bold text-white mb-6">Revoke License Key</h2>

            <form onSubmit={handleRevokeKey} className="space-y-4">
              <div>
                <Label className="text-gray-300 block mb-2">Key Code</Label>
                <Input
                  value={revokeKey}
                  onChange={(e) => setRevokeKey(e.target.value)}
                  placeholder="WormGPT-XXXXX-XXXXX-XXXXX"
                  className="bg-gray-900 border-yellow-500/20 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={revokeLoading || !revokeKey}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              >
                {revokeLoading ? 'Revoking...' : 'Revoke Key'}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Revoking a key will prevent it from being used to activate new
                accounts.
              </p>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 border border-blue-500/20 rounded-lg p-6 bg-blue-500/5">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            ℹ️ Admin Info
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Keys must start with 'WormGPT-' to be valid</p>
            <p>
              • Each key can only be activated once (with one user account)
            </p>
            <p>
              • Lifetime keys grant unlimited access indefinitely
            </p>
            <p>
              • Chat limits restrict the number of chats a user can create
            </p>
            <p>
              • Modes 6-7 are admin-only and require special approval
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
