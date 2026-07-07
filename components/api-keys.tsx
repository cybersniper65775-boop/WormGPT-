'use client'

import { useState } from 'react'
import { Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function APIKeysManager() {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Key', key: 'wgpt_prod_abc123def456ghi789', created: '2025-06-15', lastUsed: '2 minutes ago', hidden: true },
    { id: 2, name: 'Development Key', key: 'wgpt_dev_xyz789abc456def123', created: '2025-06-20', lastUsed: '1 hour ago', hidden: true },
  ])
  const [showNew, setShowNew] = useState(false)

  const toggleHide = (id: number) => {
    setKeys(keys.map(k => k.id === id ? { ...k, hidden: !k.hidden } : k))
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const deleteKey = (id: number) => {
    setKeys(keys.filter(k => k.id !== id))
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">API Keys</h3>
        <Button
          onClick={() => setShowNew(!showNew)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          <Plus size={16} className="mr-2" />
          New Key
        </Button>
      </div>

      {showNew && (
        <div className="mb-6 p-4 bg-slate-900/50 border border-slate-600 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Key name (e.g., Production Key)"
            className="w-full bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded text-sm"
          />
          <div className="flex gap-2">
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm">Generate</Button>
            <Button
              onClick={() => setShowNew(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {keys.map((key) => (
          <div key={key.id} className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">{key.name}</p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                {key.hidden ? '••••••••••••••••••••••' : key.key}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Created {key.created} • Last used {key.lastUsed}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleHide(key.id)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              >
                {key.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => copyToClipboard(key.key)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => deleteKey(key.id)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
