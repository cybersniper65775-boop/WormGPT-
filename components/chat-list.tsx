'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { deleteChat } from '@/app/actions/chats'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ChatList({ chats }: { chats: any[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (chatId: string) => {
    setDeleting(chatId)
    await deleteChat(chatId)
    router.refresh()
  }

  if (!chats.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No chats yet. Start a conversation to begin.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="border border-red-500/20 rounded-lg p-4 hover:bg-red-500/5 transition flex items-center justify-between"
        >
          <Link
            href={`/dashboard/chat/${chat.id}`}
            className="flex-1 cursor-pointer"
          >
            <h3 className="font-semibold text-white hover:text-red-400 transition">
              {chat.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Mode {chat.mode} • {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}
            </p>
          </Link>
          <Button
            onClick={() => handleDelete(chat.id)}
            disabled={deleting === chat.id}
            variant="ghost"
            className="text-red-500 hover:text-red-400"
          >
            {deleting === chat.id ? '...' : 'Delete'}
          </Button>
        </div>
      ))}
    </div>
  )
}
