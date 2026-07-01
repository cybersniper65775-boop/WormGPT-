'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Copy,
  RotateCcw,
  Download,
  Pin,
  PinOff,
  Trash2,
  Send,
  Settings,
  ChevronDown,
  Zap,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  pinned?: boolean
  model?: string
  timestamp?: Date
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to WormGPT. I can help you code, debug, and build with AI assistance. What would you like to create today?',
      timestamp: new Date(),
      model: 'WormGPT v4.1',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('WormGPT v4.1')
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you want to "${input}". I can help you with that using ${selectedModel}. Would you like me to generate code, explain concepts, or provide a solution?`,
        timestamp: new Date(),
        model: selectedModel,
      }
      setMessages((prev) => [...prev, aiResponse])
      setLoading(false)
    }, 1000)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateMessage = (messageId: string) => {
    // Regenerate the last assistant message
    const lastAssistantIndex = messages.findIndex(
      (m, idx) => m.id === messageId && m.role === 'assistant'
    )
    if (lastAssistantIndex !== -1) {
      setMessages((prev) => prev.filter((_, i) => i <= lastAssistantIndex - 1))
    }
  }

  const downloadMessage = (content: string, messageId: string) => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `wormgpt-${messageId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const togglePin = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      )
    )
  }

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }

  const pinnedMessages = messages.filter((m) => m.pinned)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-red-500/20 bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-red-500/20">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded rotate-45 flex items-center justify-center">
              <Zap size={16} className="text-white -rotate-45" />
            </div>
            <h1 className="text-2xl font-bold text-red-500">WormGPT</h1>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              + New Chat
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-4">Chat History</p>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer text-sm text-slate-300 transition-colors truncate"
            >
              Chat {i + 1}
            </div>
          ))}
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="border-t border-slate-700 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pinned</p>
            <div className="space-y-2 max-h-32 overflow-auto">
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="p-2 bg-slate-800 rounded text-xs text-slate-300">
                  <p className="truncate">{msg.content.substring(0, 50)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Settings */}
        <div className="border-t border-slate-700 p-4 space-y-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Model Selector */}
        <div className="h-14 border-b border-slate-700 bg-slate-900/50 flex items-center px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Model:</span>
            <button className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-200 transition-colors">
              {selectedModel}
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex gap-4 group"
              onMouseEnter={() => setHoveredMessageId(message.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {message.role === 'user' ? 'You' : 'AI'}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">
                      {message.role === 'user' ? 'You' : message.model || 'Assistant'}
                    </p>
                    <p className="text-slate-100 leading-relaxed">{message.content}</p>
                  </div>

                  {/* Message Controls */}
                  {hoveredMessageId === message.id && message.role === 'assistant' && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200"
                        title="Copy"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => regenerateMessage(message.id)}
                        className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200"
                        title="Regenerate"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => downloadMessage(message.content, message.id)}
                        className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => togglePin(message.id)}
                        className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200"
                        title="Pin"
                      >
                        {message.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-2 hover:bg-red-900/20 rounded transition-colors text-slate-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <span className="text-white text-sm">AI</span>
              </div>
              <div className="flex-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-slate-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 bg-slate-900 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message WormGPT..."
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
