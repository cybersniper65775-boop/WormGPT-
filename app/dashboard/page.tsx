'use client'

import Link from 'next/link'
import { Code, MessageSquare, FileText, Zap, LogOut, Settings } from 'lucide-react'
import { Terminal } from '@/components/terminal'

export default function DashboardPage() {
  const features = [
    {
      id: 'editor',
      name: 'IDE Editor',
      description: 'Code editor with live preview',
      icon: Code,
      href: '/ide',
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 'chat',
      name: 'AI Chat',
      description: 'Interactive chat with AI assistance',
      icon: MessageSquare,
      href: '/chat',
      color: 'from-red-600 to-red-700',
    },
    {
      id: 'generator',
      name: 'Code Generator',
      description: 'Generate and download code',
      icon: FileText,
      href: '/generator',
      color: 'from-purple-600 to-purple-700',
    },
    {
      id: 'files',
      name: 'File Manager',
      description: 'Manage project files',
      icon: Zap,
      href: '/files',
      color: 'from-yellow-600 to-yellow-700',
    },
  ]

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
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors font-semibold">
              Dashboard
            </Link>
            <Link href="/settings" className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              <Settings size={18} />
              Settings
            </Link>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400">
              <LogOut size={20} />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-xl text-slate-400">
            Choose a feature to get started with your AI-powered development environment
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Projects', value: '12', color: 'from-blue-600 to-blue-700' },
            { label: 'AI Chats', value: '48', color: 'from-red-600 to-red-700' },
            { label: 'Generated Files', value: '256', color: 'from-purple-600 to-purple-700' },
            { label: 'Lines of Code', value: '12.4K', color: 'from-yellow-600 to-yellow-700' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
            >
              <p className="text-sm font-semibold opacity-90">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <Link key={feature.id} href={feature.href}>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group cursor-pointer h-full">
                  <div
                    className={`inline-block bg-gradient-to-br ${feature.color} p-4 rounded-lg mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                  <div className="mt-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                    Launch →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '2 hours ago', action: 'Generated React component', tool: 'Code Generator' },
              { time: '4 hours ago', action: 'Asked AI to debug function', tool: 'AI Chat' },
              { time: '1 day ago', action: 'Created new project', tool: 'File Manager' },
              { time: '2 days ago', action: 'Built landing page', tool: 'IDE Editor' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-slate-300">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
                <span className="text-xs px-3 py-1 bg-slate-700 rounded-full text-slate-300">
                  {activity.tool}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Terminal */}
      <Terminal />
    </div>
  )
}
