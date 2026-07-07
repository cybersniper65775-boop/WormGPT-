'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function UsageAnalytics() {
  const data = [
    { day: 'Mon', chats: 120, codes: 80, files: 45 },
    { day: 'Tue', chats: 150, codes: 110, files: 65 },
    { day: 'Wed', chats: 110, codes: 95, files: 55 },
    { day: 'Thu', chats: 180, codes: 140, files: 85 },
    { day: 'Fri', chats: 220, codes: 170, files: 110 },
    { day: 'Sat', chats: 90, codes: 60, files: 40 },
    { day: 'Sun', chats: 140, codes: 100, files: 70 },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-6">Usage Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          <Bar dataKey="chats" fill="#DC143C" radius={[8, 8, 0, 0]} />
          <Bar dataKey="codes" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="files" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
