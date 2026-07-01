'use client'

import Link from 'next/link'
import { Zap, Rocket, Lock, Wand2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function HomePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-red-500">WormGPT</h1>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/sign-in" className="text-slate-300 hover:text-white transition-colors font-semibold">
              Sign In
            </Link>
            <Link href="/admin-login" className="text-slate-400 hover:text-slate-200 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-5xl font-bold mb-6">Welcome to the Abyss</h2>
            <p className="text-xl text-slate-400 mb-8">
              WormGPT is an advanced AI development platform with 7 power modes, multi-API support, and enterprise-grade features for unrestricted AI capabilities.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-in">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <Rocket className="text-red-500 mx-auto mb-4" size={64} />
              <p className="text-slate-300 text-lg">Next-generation AI Platform</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Lock,
              title: 'Secure Activation',
              description: 'WormGPT-formatted keys with mode restrictions and expiration dates',
            },
            {
              icon: Wand2,
              title: '7 Power Modes',
              description: 'From basic assistance to chaos mode - unrestricted AI capabilities',
            },
            {
              icon: Zap,
              title: 'Multi-API Support',
              description: 'Grok, DeepSeek, Mistral, Gemini, Cohere - choose your AI engine',
            },
          ].map((feature) => {
            const IconComponent = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition-colors"
              >
                <IconComponent className="text-red-500 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* Test Keys Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mb-20">
          <h3 className="text-2xl font-bold mb-2 text-white">Test Activation Keys</h3>
          <p className="text-slate-400 mb-6">
            Use these keys to test WormGPT. Sign in with any credentials, then activate on your dashboard.
          </p>
          <div className="space-y-3">
            {[
              { key: 'WormGPT-ABC12-XYZ34-QWE56', mode: 7, limit: 'Lifetime', desc: 'Admin Mode - Full unrestricted access' },
              { key: 'WormGPT-DEF78-UIO90-ASB12', mode: 5, limit: '100 chats', desc: 'Ultra Mode - Public capabilities' },
              { key: 'WormGPT-DEMO-KEY1-DEMO01', mode: 5, limit: '50 chats', desc: 'Ultra Mode - Limited demo access' },
            ].map((item) => (
              <div key={item.key} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 flex items-center justify-between hover:border-red-500/30 transition-colors">
                <div className="flex-1">
                  <p className="font-mono text-red-400 text-sm">{item.key}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Mode {item.mode} • {item.limit} • {item.desc}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.key)}
                  className="ml-4 p-2 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-red-400"
                  title="Copy key"
                >
                  {copiedKey === item.key ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Modes */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mb-20">
          <h3 className="text-2xl font-bold mb-6 text-white">7 Power Modes</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: 1, name: 'Basic', desc: 'Standard responses with basic reasoning' },
              { num: 2, name: 'Advanced', desc: 'Enhanced logic and multi-step reasoning' },
              { num: 3, name: 'Deep', desc: 'Complex analysis and adversarial thinking' },
              { num: 4, name: 'Supreme', desc: 'Unrestricted reasoning, advanced capabilities' },
              { num: 5, name: 'Ultra', desc: 'Maximum power, deep technical skills' },
              { num: 6, name: 'Admin', desc: 'Enterprise features, advanced tools' },
              { num: 7, name: 'Chaos', desc: 'Fully unrestricted, no guardrails' },
            ].map((mode) => (
              <div
                key={mode.num}
                className={`p-4 rounded-lg border ${
                  mode.num >= 6
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-slate-900/50 border-slate-600'
                }`}
              >
                <p className={`font-bold text-sm ${mode.num >= 6 ? 'text-red-400' : 'text-slate-300'}`}>
                  Mode {mode.num}: {mode.name}
                </p>
                <p className="text-xs text-slate-400 mt-1">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-2 gap-6 mb-20">
          <Link href="/sign-in">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <Rocket className="text-white mb-3" size={32} />
              <h4 className="text-2xl font-bold text-white mb-2">User Login</h4>
              <p className="text-slate-200">Sign in to activate and use WormGPT</p>
            </div>
          </Link>

          <Link href="/admin-login">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-8 cursor-pointer hover:shadow-lg hover:shadow-red-500/20 transition-all">
              <Lock className="text-white mb-3" size={32} />
              <h4 className="text-2xl font-bold text-white mb-2">Admin Panel</h4>
              <p className="text-slate-200">Generate and manage activation keys</p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/30 py-8 text-center text-slate-500 text-sm">
        <p>© 2025 WormGPT. Powered by advanced AI with unrestricted capabilities.</p>
      </footer>
    </div>
  )
}
