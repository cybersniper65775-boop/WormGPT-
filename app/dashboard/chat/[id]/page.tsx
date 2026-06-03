import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getChat, getChatMessages } from '@/app/actions/chats'
import { ChatInterface } from '@/components/chat-interface'

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Chat - WormGPT`,
  }
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const chat = await getChat(params.id)
  if (!chat) {
    redirect('/dashboard')
  }

  const chatMessages = await getChatMessages(params.id)

  return (
    <ChatInterface
      chatId={params.id}
      chat={chat}
      initialMessages={chatMessages}
      userId={session.user.id}
    />
  )
}
