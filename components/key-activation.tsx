'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, CheckCircle } from 'lucide-react'

export function KeyActivation({ onActivate }: { onActivate?: (mode: number) => void }) {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activated, setActivated] = useState(false)
  const [modeInfo, setModeInfo] = useState<any>(null)

  const handleActivate = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/keys/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activationKey: key }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Activation failed')
        setLoading(false)
        return
      }

      setModeInfo(data)
      setActivated(true)
      if (onActivate) onActivate(data.mode)
    } catch (err: any) {
      setError(err?.message || 'Activation error')
    } finally {
      setLoading(false)
    }
  }

  if (activated && modeInfo) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-400 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Activated!</h3>
            <p className="text-slate-300 mb-3">
              Mode {modeInfo.mode} enabled • {modeInfo.isLifetime ? 'Lifetime access' : `${modeInfo.limit} chats`}
            </p>
            <Button onClick={() => setActivated(false)} className="text-sm">
              Change Key
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="text-red-500" size={24} />
        <h2 className="text-xl font-bold text-white">Activate License</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="activation-key" className="text-slate-300 text-sm mb-2 block">
            Enter your activation key
          </Label>
          <Input
            id="activation-key"
            placeholder="WormGPT-XXXXX-XXXXX-XXXXX"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="font-mono text-sm bg-slate-900 border-slate-600 text-white placeholder-slate-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Format: WormGPT-XXXXX-XXXXX-XXXXX
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleActivate}
          disabled={!key || loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Activating...' : 'Activate'}
        </Button>
      </div>
    </div>
  )
}
