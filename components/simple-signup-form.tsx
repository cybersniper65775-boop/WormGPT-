'use client'

// Version 2.1 - Fixed authentication  
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SimpleSignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Register user
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        setError(registerData.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto-login user
      const loginRes = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginRes.json()

      if (!loginRes.ok) {
        setError(loginData.error || 'Login failed')
        setLoading(false)
        return
      }

      if (loginData.success) {
        console.log('[v0] User registered and logged in, redirecting to dashboard')
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      console.error('[v0] Signup error:', err)
      setError(err?.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div>
        <Label htmlFor="signup-name" className="text-gray-300 text-sm">
          Full Name
        </Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="signup-email" className="text-gray-300 text-sm">
          Email Address
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
          required
        />
      </div>

      <div>
        <Label htmlFor="signup-password" className="text-gray-300 text-sm">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
          required
          minLength={8}
        />
        <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-gray-400 text-xs">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => window.location.href = '/sign-in'}
          className="text-red-500 hover:text-red-400"
        >
          Sign In
        </button>
      </p>
    </form>
  )
}
