'use client'

import Link from 'next/link'
import { MessageSquare, Code, FileText, Settings, Download, HelpCircle } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'New Chat',
      description: 'Start a new AI conversation',
      icon: MessageSquare,
      href: '/chat',
      color: 'from-red-600 to-red-700',
    },
    {
      title: 'Generate Code',
      description: 'Create code with AI assistance',
      icon: Code,
      href: '/generator',
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'IDE Editor',
      description: 'Open the code editor',
      icon: FileText,
      href: '/ide',
      color: 'from-purple-600 to-purple-700',
    },
    {
      title: 'Export Data',
      description: 'Download your project files',
      icon: Download,
      href: '/dashboard/export',
      color: 'from-green-600 to-green-700',
    },
    {
      title: 'Settings',
      description: 'Manage account and preferences',
      icon: Settings,
      href: '/settings',
      color: 'from-yellow-600 to-yellow-700',
    },
    {
      title: 'Help & Support',
      description: 'View documentation and FAQ',
      icon: HelpCircle,
      href: '/help',
      color: 'from-pink-600 to-pink-700',
    },
  ]

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon
          return (
            <Link key={action.title} href={action.href}>
              <div
                className={`bg-gradient-to-br ${action.color} rounded-lg p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-300 group h-full`}
              >
                <IconComponent size={32} className="mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm mb-1">{action.title}</h4>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
