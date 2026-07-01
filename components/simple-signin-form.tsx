'use client'

// Version 2.1 - Fixed authentication
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SimpleSigninForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
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
        console.log('[v0] User logged in, redirecting to dashboard')
        // Wait for cookie to be set before redirecting
        await new Promise(resolve => setTimeout(resolve, 300))
        router.push('/dashboard')
        // Refresh to ensure middleware processes new session
        router.refresh()
        // Give router time to complete before returning
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (err: any) {
      console.error('[v0] Signin error:', err)
      setError(err?.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Label htmlFor="signin-email" className="text-gray-300 text-sm">
          Email Address
        </Label>
        <Input
          id="signin-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="signin-password" className="text-gray-300 text-sm">
          Password
        </Label>
        <Input
          id="signin-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
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
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-gray-400 text-xs">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => window.location.href = '/sign-up'}
          className="text-red-500 hover:text-red-400"
        >
          Sign Up
        </button>
      </p>
    </form>
  )
}
