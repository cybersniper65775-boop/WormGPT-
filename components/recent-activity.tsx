'use client'

import { MessageSquare, FileText, Code, Zap, User } from 'lucide-react'

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'chat',
      title: 'Started new chat session',
      description: 'Mode 5 - Ultra Mode',
      time: '2 minutes ago',
      icon: MessageSquare,
    },
    {
      id: 2,
      type: 'code',
      title: 'Generated React component',
      description: 'Button component with variants',
      time: '15 minutes ago',
      icon: Code,
    },
    {
      id: 3,
      type: 'file',
      title: 'Downloaded project files',
      description: 'wormgpt-app-v1.0.zip',
      time: '1 hour ago',
      icon: FileText,
    },
    {
      id: 4,
      type: 'mode',
      title: 'Upgraded to Mode 6',
      description: 'Admin capabilities unlocked',
      time: '2 hours ago',
      icon: Zap,
    },
    {
      id: 5,
      type: 'user',
      title: 'Updated profile information',
      description: 'Added bio and profile picture',
      time: '5 hours ago',
      icon: User,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors border border-slate-700/50"
            >
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="text-slate-300" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{activity.title}</p>
                <p className="text-xs text-slate-400">{activity.description}</p>
              </div>
              <p className="text-xs text-slate-500 flex-shrink-0">{activity.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
