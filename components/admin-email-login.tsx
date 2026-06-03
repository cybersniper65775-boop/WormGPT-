'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AdminEmailLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin-email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      if (data.success) {
        console.log('[v0] Admin login successful, redirecting to /admin')
        // Wait a moment for cookie to be set
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('[v0] Admin login error:', err)
      setError(err?.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleAdminLogin} className="space-y-4">
      <div>
        <Label htmlFor="admin-email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@wormgpt.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      <div>
        <Label htmlFor="admin-password" className="text-gray-300">
          Password
        </Label>
        <Input
          id="admin-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 bg-gray-800 border-gray-700 text-white"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-600/20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
      >
        {loading ? 'Logging in...' : 'Access Admin Panel'}
      </Button>

      <p className="text-center text-gray-400 text-xs mt-4">
        Default: admin@wormgpt.com / password
      </p>
    </form>
  )
}
