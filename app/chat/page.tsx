import { AIChatInterface } from '@/components/ai-chat-interface'

export const metadata = {
  title: 'WormGPT Chat',
  description: 'AI-powered chat interface for code generation and assistance',
}

export default function ChatPage() {
  return (
    <main>
      <AIChatInterface />
    </main>
  )
}
