'use client'

import { TrendingUp, MessageSquare, Zap, Clock } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      label: 'API Calls',
      value: '1,247',
      change: '+12.5%',
      icon: Zap,
      color: 'from-blue-600 to-blue-700',
    },
    {
      label: 'Chat Messages',
      value: '3,482',
      change: '+8.2%',
      icon: MessageSquare,
      color: 'from-red-600 to-red-700',
    },
    {
      label: 'Avg Response Time',
      value: '234ms',
      change: '-5.1%',
      icon: Clock,
      color: 'from-green-600 to-green-700',
    },
    {
      label: 'Uptime',
      value: '99.98%',
      change: '+0.02%',
      icon: TrendingUp,
      color: 'from-purple-600 to-purple-700',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold opacity-90">{stat.label}</p>
              <IconComponent size={20} className="opacity-70" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-75 mt-2">{stat.change} from last month</p>
          </div>
        )
      })}
    </div>
  )
}
