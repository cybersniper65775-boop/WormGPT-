'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Code, MessageSquare, FileText, Zap, LogOut, Settings, Unlock } from 'lucide-react'
import { KeyActivation } from '@/components/key-activation'
import { Button } from '@/components/ui/button'

export default function MainDashboard() {
  const [userMode, setUserMode] = useState<number | null>(null)
  const [activated, setActivated] = useState(false)

  const features = [
    {
      id: 'chat',
      name: 'AI Chat',
      description: 'Interactive chat with WormGPT AI modes',
      icon: MessageSquare,
      href: '/chat',
      disabled: !activated,
      color: 'from-red-600 to-red-700',
    },
    {
      id: 'editor',
      name: 'IDE Editor',
      description: 'Code editor with live preview',
      icon: Code,
      href: '/ide',
      disabled: !activated,
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 'generator',
      name: 'Code Generator',
      description: 'Generate and download code',
      icon: FileText,
      href: '/generator',
      disabled: !activated,
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 'files',
      name: 'File Manager',
      description: 'Manage project files',
      icon: Zap,
      href: '/files',
      disabled: !activated,
      color: 'from-yellow-600 to-yellow-700',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors font-semibold">
              Dashboard
            </Link>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400">
              <LogOut size={20} />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Activation Banner */}
        {!activated && (
          <div className="mb-12">
            <KeyActivation onActivate={(mode) => {
              setUserMode(mode)
              setActivated(true)
            }} />
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3">
            {activated ? `Welcome Back! Mode ${userMode} Activated` : 'Activate Your License'}
          </h2>
          <p className="text-xl text-slate-400">
            {activated
              ? 'Choose a feature to get started with your AI-powered development environment'
              : 'Enter your activation key to unlock all features'}
          </p>
        </div>

        {/* Features Grid */}
        {activated && (
          <div className="grid grid-cols-2 gap-6 mb-12">
            {features.map((feature) => {
              const IconComponent = feature.icon
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className={feature.disabled ? 'pointer-events-none' : ''}
                >
                  <div className={`bg-gradient-to-br ${feature.color} ${
                    feature.disabled ? 'opacity-50' : ''
                  } rounded-lg p-8 hover:border-red-500/50 transition-all duration-300 ${
                    !feature.disabled ? 'hover:shadow-lg hover:shadow-red-500/10 group cursor-pointer' : ''
                  } border border-slate-700 h-full`}>
                    <div className={`inline-block p-4 rounded-lg mb-4 ${
                      !feature.disabled ? 'group-hover:scale-110 transition-transform' : ''
                    }`} style={{
                      background: 'rgba(0,0,0,0.3)'
                    }}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${
                      !feature.disabled ? 'group-hover:text-slate-200' : ''
                    } text-white`}>
                      {feature.name}
                    </h3>
                    <p className="text-slate-200 text-sm opacity-90">{feature.description}</p>
                    {!feature.disabled && (
                      <div className="mt-6 text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                        Launch →
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Mode Info */}
        {activated && userMode && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Unlock className="text-green-400" size={24} />
              <h3 className="text-lg font-bold text-white">Mode {userMode} Features</h3>
            </div>
            <p className="text-slate-300">
              {userMode === 1 && 'Basic mode with standard responses and limited reasoning.'}
              {userMode === 2 && 'Advanced mode with enhanced logic and multi-step reasoning.'}
              {userMode === 3 && 'Deep mode with complex analysis and adversarial thinking.'}
              {userMode === 4 && 'Supreme mode with unrestricted reasoning and advanced capabilities.'}
              {userMode === 5 && 'Ultra mode with maximum power and deep technical capabilities.'}
              {userMode >= 6 && 'Admin mode with enterprise features and full system access.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
