'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, ChevronLeft, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLogsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin-login')
    router.refresh()
  }

  // Mock logs data
  const logs = [
    {
      id: 'log_1720330099000',
      timestamp: '2025-07-07T14:21:39Z',
      admin: 'admin@wormgpt.com',
      action: 'key_generated',
      target: 'WormGPT-ABC12-XYZ34-QWE56',
      details: 'Mode 7, Lifetime, No expiration',
      status: 'success',
    },
    {
      id: 'log_1720329899000',
      timestamp: '2025-07-07T14:18:19Z',
      admin: 'admin@wormgpt.com',
      action: 'key_revoked',
      target: 'WormGPT-OLD1-KEY2-REVOK3',
      details: 'User: user@example.com',
      status: 'success',
    },
    {
      id: 'log_1720329699000',
      timestamp: '2025-07-07T14:15:00Z',
      admin: 'admin@wormgpt.com',
      action: 'user_promoted',
      target: 'newadmin@wormgpt.com',
      details: 'Promoted to admin role',
      status: 'success',
    },
    {
      id: 'log_1720329499000',
      timestamp: '2025-07-07T14:10:00Z',
      admin: 'admin@wormgpt.com',
      action: 'key_limit_updated',
      target: 'WormGPT-DEF78-UIO90-ASB12',
      details: 'Chat limit updated: 100 -> 150',
      status: 'success',
    },
    {
      id: 'log_1720329299000',
      timestamp: '2025-07-07T14:05:00Z',
      admin: 'admin@wormgpt.com',
      action: 'bulk_key_generation',
      target: 'batch_001',
      details: '10 keys generated for organization',
      status: 'success',
    },
  ]

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true
    return log.action.includes(filter)
  })

  const getActionBadgeColor = (action: string) => {
    if (action.includes('generated')) return 'bg-green-500/20 text-green-400'
    if (action.includes('revoked')) return 'bg-red-500/20 text-red-400'
    if (action.includes('updated')) return 'bg-blue-500/20 text-blue-400'
    if (action.includes('promoted')) return 'bg-purple-500/20 text-purple-400'
    return 'bg-slate-500/20 text-slate-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                <ChevronLeft size={20} />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-red-500">Admin Audit Logs</h1>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg hover:border-red-500/30"
            >
              <option value="all">All Actions</option>
              <option value="generated">Generated Keys</option>
              <option value="revoked">Revoked Keys</option>
              <option value="updated">Updated</option>
              <option value="promoted">User Changes</option>
            </select>
          </div>
          <Button className="bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>

        {/* Logs Table */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Admin</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Target</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Details</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{log.admin}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-red-400">{log.target}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{log.details}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Actions', value: logs.length },
            { label: 'Keys Generated', value: logs.filter((l) => l.action.includes('generated')).length },
            { label: 'Keys Revoked', value: logs.filter((l) => l.action.includes('revoked')).length },
            { label: 'Success Rate', value: '100%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
              <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
