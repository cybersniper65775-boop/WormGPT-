'use client'

import { useState } from 'react'
import { createChat } from '@/app/actions/chats'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const QUICK_TEMPLATES = [
  {
    title: 'Security Analysis',
    description: 'Get help with security audits and penetration testing',
    mode: 4,
  },
  {
    title: 'Code Review',
    description: 'Advanced code analysis and optimization',
    mode: 3,
  },
  {
    title: 'Technical Research',
    description: 'Deep dive into complex technical topics',
    mode: 2,
  },
  {
    title: 'Quick Query',
    description: 'Fast responses to technical questions',
    mode: 1,
  },
]

export function QuickStartCard() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleStartChat = async (mode: number, title: string) => {
    setLoading(true)
    const result = await createChat(title, mode)
    if (result.success) {
      router.push(`/dashboard/chat/${result.chatId}`)
    }
    setLoading(false)
  }

  return (
    <div className="border border-red-500/20 rounded-lg p-8 bg-red-500/5">
      <h2 className="text-2xl font-bold text-white mb-2">🚀 Get Started</h2>
      <p className="text-gray-400 mb-6">
        Choose a template to start your first conversation
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {QUICK_TEMPLATES.map((template) => (
          <button
            key={template.mode}
            onClick={() =>
              handleStartChat(template.mode, `New ${template.title}`)
            }
            disabled={loading}
            className="border border-red-500/30 rounded-lg p-4 hover:bg-red-500/10 text-left transition disabled:opacity-50"
          >
            <h3 className="font-semibold text-white mb-1">{template.title}</h3>
            <p className="text-sm text-gray-400">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
