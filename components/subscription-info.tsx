'use client'

import { Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SubscriptionInfo() {
  const subscription = {
    plan: 'Ultra Mode (Mode 5)',
    status: 'Active',
    renewalDate: '2025-08-07',
    price: '$29.99/month',
    chatsUsed: 1247,
    chatsLimit: 10000,
    codesGenerated: 482,
    filesDownloaded: 156,
  }

  const features = [
    'Multi-provider AI support',
    'Priority response times',
    'Custom system prompts',
    'Advanced analytics',
    'API key management',
    'Email support',
  ]

  const percentUsed = Math.round((subscription.chatsUsed / subscription.chatsLimit) * 100)

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Current Plan</p>
            <p className="text-2xl font-bold text-red-500">{subscription.plan}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Check className="text-green-500" size={24} />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span className="text-green-400 font-semibold">{subscription.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Renewal Date</span>
            <span className="text-white font-semibold">{subscription.renewalDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Monthly Cost</span>
            <span className="text-white font-semibold">{subscription.price}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">Manage Plan</Button>
          <Button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50">
            Cancel Subscription
          </Button>
        </div>
      </div>

      {/* Usage & Features */}
      <div className="space-y-6">
        {/* Usage Stats */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-4">Chat Usage</p>
          <p className="text-3xl font-bold text-white mb-2">
            {subscription.chatsUsed.toLocaleString()} / {subscription.chatsLimit.toLocaleString()}
          </p>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{percentUsed}% of your monthly quota</p>
        </div>

        {/* Features List */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
          <p className="text-slate-400 text-sm mb-4">Included Features</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                <Check size={16} className="text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
