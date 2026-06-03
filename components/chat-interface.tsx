'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getModeConfig } from '@/lib/wormgpt-modes'

interface Message {
  id: string
  role: string
  content: string
  created_at: Date | string
}

interface Chat {
  id: string
  title: string | null
  mode: number | null
  model: string | null
}

export function ChatInterface({
  chatId,
  chat,
  initialMessages,
  userId,
}: {
  chatId: string
  chat: Chat
  initialMessages: Message[]
  userId: string
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const modeConfig = getModeConfig(chat.mode || 1)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message to UI
    const userMessageId = Date.now().toString()
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    try {
      // Call the actual chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          message: userMessage,
          model: chat.model || 'deepseek',
          mode: chat.mode || 1,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send message')
      }

      const data = await response.json()
      const aiResponse = data.message

      const aiMessageId = data.messageId || (Date.now() + 1).toString()
      const newAiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, newAiMessage])

      // Save AI response to database
      await addMessage(chatId, 'assistant', aiResponse)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{chat.title}</h1>
            <p className="text-sm text-gray-400">
              {modeConfig.name} • {modeConfig.description}
            </p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-400">
                {modeConfig.label} mode is active. Ask anything.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-red-600/20 text-white border border-red-500/30'
                    : 'bg-gray-900/50 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900/50 text-gray-100 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-red-500/20 bg-black/50 backdrop-blur px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${modeConfig.label}...`}
            disabled={loading}
            className="bg-gray-900 border-red-500/20 text-white placeholder-gray-500 flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-6"
          >
            {loading ? '⏳' : '→'}
          </Button>
        </form>
      </div>
    </div>
  )
}
