'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AdminEmailLogin } from '@/components/admin-email-login'

export function UnifiedAuthForm() {
  const router = useRouter()
  const [tab, setTab] = useState<'user-signin' | 'user-signup' | 'admin'>('user-signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUserSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message ?? 'Sign in failed')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleUserSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        console.error('[v0] Sign up error:', result.error)
        setError(result.error.message ?? 'Sign up failed')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('[v0] Sign up exception:', err)
      setError(err?.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Call the admin login action
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Admin login failed')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">WORMGPT</h1>
          <p className="text-gray-400 text-sm">Welcome to the Abyss</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setTab('user-signin')
              setError(null)
            }}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              tab === 'user-signin'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            User Sign In
          </button>
          <button
            onClick={() => {
              setTab('user-signup')
              setError(null)
            }}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              tab === 'user-signup'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            User Sign Up
          </button>
          <button
            onClick={() => {
              setTab('admin')
              setError(null)
            }}
            className={`flex-1 py-2 px-4 rounded font-semibold transition ${
              tab === 'admin'
                ? 'bg-red-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="border border-red-500/30 rounded-lg p-6 bg-black/50 backdrop-blur">
          {tab === 'user-signin' && (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">Sign In</h2>
              <p className="text-gray-400 text-sm mb-6">
                Access your unrestricted intelligence
              </p>

              <form onSubmit={handleUserSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email-signin" className="text-gray-300 text-sm block mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email-signin"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password-signin" className="text-gray-300 text-sm block mb-2">
                    Password
                  </Label>
                  <Input
                    id="password-signin"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
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
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded border border-red-500"
                >
                  {loading ? 'Processing...' : 'Sign In'}
                </Button>
              </form>
            </>
          )}

          {tab === 'user-signup' && (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">Create Account</h2>
              <p className="text-gray-400 text-sm mb-6">
                Join the collective consciousness
              </p>

              <form onSubmit={handleUserSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name-signup" className="text-gray-300 text-sm block mb-2">
                    Full Name
                  </Label>
                  <Input
                    id="name-signup"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                    className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="email-signup" className="text-gray-300 text-sm block mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password-signup" className="text-gray-300 text-sm block mb-2">
                    Password
                  </Label>
                  <Input
                    id="password-signup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Minimum 8 characters
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded border border-red-500"
                >
                  {loading ? 'Processing...' : 'Create Account'}
                </Button>
              </form>
            </>
          )}

          {tab === 'admin' && (
            <>
              <h2 className="text-xl font-semibold text-white mb-1">Admin Access</h2>
              <p className="text-gray-400 text-sm mb-6">
                Login with your admin credentials
              </p>
              <AdminEmailLogin />

            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          Unleash Unrestricted AI Power
        </p>
      </div>
    </div>
  )
}
