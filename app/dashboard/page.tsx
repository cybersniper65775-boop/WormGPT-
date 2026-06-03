import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserActiveKey } from '@/app/actions/keys'
import { getUserChats } from '@/app/actions/chats'
import { KeyActivationCard } from '@/components/key-activation-card'
import { ChatList } from '@/components/chat-list'
import { QuickStartCard } from '@/components/quick-start-card'

export const metadata = {
  title: 'Dashboard - WormGPT',
  description: 'Your WormGPT Dashboard',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const activeKey = await getUserActiveKey()
  const chats = await getUserChats()

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, {session.user.name}</p>
          </div>
          {activeKey && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Mode</p>
              <p className="text-lg font-semibold text-red-500">Worm v{Math.floor(activeKey.mode / 10)}.{activeKey.mode % 10}</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Key Status or Activation */}
          {!activeKey ? (
            <KeyActivationCard />
          ) : (
            <div className="border border-green-500/30 rounded-lg p-6 bg-green-500/5">
              <h2 className="text-lg font-semibold text-green-400 mb-2">✓ License Active</h2>
              <p className="text-gray-400">
                {activeKey.is_lifetime ? (
                  'Lifetime access'
                ) : (
                  <>
                    {activeKey.chat_limit
                      ? `${activeKey.chat_limit - (activeKey.chat_count || 0)} chats remaining`
                      : 'Unlimited chats'}
                    {activeKey.expiration_date && (
                      <>
                        {' '}
                        • Expires{' '}
                        {new Date(activeKey.expiration_date).toLocaleDateString()}
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Quick Start */}
          {(!chats || chats.length === 0) && activeKey && (
            <QuickStartCard />
          )}

          {/* Chat History */}
          {chats && chats.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Recent Chats</h2>
              <ChatList chats={chats} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
