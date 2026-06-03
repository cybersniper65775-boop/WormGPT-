'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function WormGPTAuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = isSignUp
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password })

      if (error) {
        setError(error.message ?? 'Something went wrong')
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">WORMGPT</h1>
          <p className="text-gray-400 text-sm">Welcome to the Abyss</p>
        </div>

        {/* Form Card */}
        <div className="border border-red-500/30 rounded-lg p-6 bg-black/50 backdrop-blur">
          <h2 className="text-xl font-semibold text-white mb-1">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {isSignUp
              ? 'Join the collective consciousness'
              : 'Access your unrestricted intelligence'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name" className="text-gray-300 text-sm block mb-2">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  placeholder="Enter your name"
                  className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm block mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 text-sm block mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500"
              />
              {isSignUp && (
                <p className="text-gray-500 text-xs mt-1">
                  Minimum 8 characters
                </p>
              )}
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
              {loading
                ? 'Processing...'
                : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-red-500/20">
            <p className="text-gray-400 text-sm text-center">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Link
                href={isSignUp ? '/sign-in' : '/sign-up'}
                className="text-red-500 hover:text-red-400 font-semibold transition"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          Unleash Unrestricted AI Power
        </p>
      </div>
    </div>
  )
}
