'use client'

import { X, AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'API Key Generated',
      message: 'Your new API key has been created successfully',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Mode Upgrade Available',
      message: 'Upgrade to Mode 6 for admin features and advanced analytics',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'warning',
      title: '80% of Monthly Quota Used',
      message: 'You have used 8,000 of your 10,000 monthly chat allowance',
      time: '3 hours ago',
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'WormGPT was updated with new AI models and features',
      time: '1 day ago',
    },
  ])

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />
      default:
        return <InfoIcon className="text-blue-500" size={20} />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30'
      case 'error':
        return 'bg-red-500/10 border-red-500/30'
      default:
        return 'bg-blue-500/10 border-blue-500/30'
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Notifications</h3>
        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full font-semibold">
          {notifications.length}
        </span>
      </div>

      {notifications.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-4 rounded-lg border ${getColor(notif.type)}`}
            >
              <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{notif.title}</p>
                <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="flex-shrink-0 p-1 hover:bg-slate-700/50 rounded text-slate-500 hover:text-slate-300"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
