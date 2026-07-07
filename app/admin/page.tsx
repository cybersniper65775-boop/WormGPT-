'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Key, Users, Zap, TrendingUp, LogOut, Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin-login')
    router.refresh()
  }
  const [keys, setKeys] = useState([
    { id: 1, key: 'WormGPT-ABC12-XYZ34-QWE56', mode: 7, limit: 'Lifetime', user: 'admin@wormgpt.com', created: '2025-07-01' },
    { id: 2, key: 'WormGPT-DEF78-UIO90-ASB12', mode: 5, limit: '100', user: 'user@example.com', created: '2025-06-28' },
  ])

  const [showGenerate, setShowGenerate] = useState(false)
  const [formData, setFormData] = useState({ mode: 5, limit: '100', expiration: '' })

  const generateKey = () => {
    const newKey = `WormGPT-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    const newEntry = {
      id: keys.length + 1,
      key: newKey,
      mode: formData.mode,
      limit: formData.limit,
      user: 'new-user@example.com',
      created: new Date().toISOString().split('T')[0],
    }
    setKeys([...keys, newEntry])
    setShowGenerate(false)
    setFormData({ mode: 5, limit: '100', expiration: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-500">WORMGPT ADMIN</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/logs" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              <FileText size={18} />
              <span className="text-sm">Audit Logs</span>
            </Link>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 text-slate-50">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Users', value: '2,847', icon: Users, color: 'from-blue-600 to-blue-700' },
            { label: 'Active Keys', value: '1,293', icon: Key, color: 'from-red-600 to-red-700' },
            { label: 'Generated Today', value: '124', icon: Plus, color: 'from-purple-600 to-purple-700' },
            { label: 'Revenue (Month)', value: '$18.4K', icon: TrendingUp, color: 'from-yellow-600 to-yellow-700' },
          ].map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <IconComponent size={32} className="opacity-50" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Generate Key Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Generate Activation Key</h2>
            <Button
              onClick={() => setShowGenerate(!showGenerate)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {showGenerate ? 'Cancel' : '+ New Key'}
            </Button>
          </div>

          {showGenerate && (
            <div className="space-y-4 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Mode (1-7)</label>
                  <Input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.mode}
                    onChange={(e) => setFormData({...formData, mode: parseInt(e.target.value)})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Chat Limit</label>
                  <Input
                    value={formData.limit}
                    onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    placeholder="e.g., 100 or Lifetime"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">Expiration Date</label>
                  <Input
                    type="date"
                    value={formData.expiration}
                    onChange={(e) => setFormData({...formData, expiration: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Button onClick={generateKey} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Generate Key
              </Button>
            </div>
          )}
        </div>

        {/* Keys Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold">Active Activation Keys</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Key</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Mode</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Limit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-red-400">{key.key}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        key.mode >= 6 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        Mode {key.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{key.limit}</td>
                    <td className="px-6 py-4 text-slate-300">{key.user}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{key.created}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
