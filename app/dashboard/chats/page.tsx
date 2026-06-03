import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserChats } from '@/app/actions/chats'
import { ChatList } from '@/components/chat-list'

export const metadata = {
  title: 'All Chats - WormGPT',
  description: 'View all your WormGPT chats',
}

export default async function ChatsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const chats = await getUserChats()

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur px-6 py-4">
        <h1 className="text-2xl font-bold text-white">All Chats</h1>
        <p className="text-gray-400 text-sm mt-1">
          {chats.length} conversation{chats.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <ChatList chats={chats} />
        </div>
      </div>
    </div>
  )
}
