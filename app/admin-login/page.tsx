'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin-signin', {
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
        setLoading(false)
        router.push('/admin')
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-red-500/20 rounded-lg p-8 bg-slate-900/50 backdrop-blur">
          <div className="mb-8 text-center">
            <img src="/wormgpt-logo.png" alt="WormGPT" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-500 mb-2">ADMIN PANEL</h1>
            <p className="text-gray-400">Enter your admin credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-gray-300 text-sm block mb-2">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@wormgpt.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="admin-password" className="text-gray-300 text-sm block mb-2">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

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
              {loading ? 'Logging in...' : 'Admin Login'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-800/50 rounded border border-slate-700">
            <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-300 font-mono space-y-1">
              <p>Email: <span className="text-red-400">admin@wormgpt.com</span></p>
              <p>Pass: <span className="text-red-400">password</span></p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            User login? <Link href="/sign-in" className="text-red-500 hover:text-red-400 font-semibold">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
