'use client'

import { useState } from 'react'
import { activateKey } from '@/app/actions/keys'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function KeyActivationCard() {
  const [keyCode, setKeyCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await activateKey(keyCode)

    if (!result.success) {
      setError(result.error || 'Failed to activate key')
      setLoading(false)
      return
    }

    setKeyCode('')
    router.refresh()
  }

  return (
    <div className="border-2 border-yellow-500/50 rounded-lg p-8 bg-yellow-500/5">
      <h2 className="text-2xl font-bold text-yellow-500 mb-2">
        🔑 Activate Your License
      </h2>
      <p className="text-gray-400 mb-6">
        Enter your WormGPT activation key to unlock advanced features and modes.
      </p>

      <form onSubmit={handleActivate} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Activation Key
          </label>
          <Input
            value={keyCode}
            onChange={(e) => setKeyCode(e.target.value)}
            placeholder="WormGPT-XXXXX-XXXXX-XXXXX"
            className="bg-gray-900 border-yellow-500/30 text-white placeholder-gray-600"
          />
          <p className="text-xs text-gray-500 mt-2">
            Keys start with 'WormGPT-' and contain uppercase letters and numbers
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !keyCode}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
        >
          {loading ? 'Activating...' : 'Activate Key'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Don&apos;t have a key?{' '}
        <a href="#" className="text-yellow-500 hover:text-yellow-400">
          Get one
        </a>
      </p>
    </div>
  )
}
