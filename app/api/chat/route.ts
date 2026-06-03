import { NextRequest, NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { messages as messagesTable, chats } from '@/lib/db/schema'
import { getSystemPrompt } from '@/lib/system-prompts'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Fallback models if API keys aren't available
const DEFAULT_MODEL = 'deepseek-chat'

async function callAIProvider(
  model: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const grokKey1 = process.env.GROK_API_KEY_1
  const grokKey2 = process.env.GROK_API_KEY_2
  const grokKey = grokKey1 || grokKey2 // Use first, fallback to second
  const mistralKey = process.env.MISTRAL_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  const cohereKey = process.env.COHERE_API_KEY
  const openrouterKey = process.env.OPENROUTER_API_KEY

  // Determine which provider to use
  let provider = 'deepseek'
  let apiKey = deepseekKey

  if (model.includes('grok') && grokKey) {
    provider = 'grok'
    apiKey = grokKey
  } else if (model.includes('mistral') && mistralKey) {
    provider = 'mistral'
    apiKey = mistralKey
  } else if (model.includes('gemini') && geminiKey) {
    provider = 'gemini'
    apiKey = geminiKey
  } else if (model.includes('cohere') && cohereKey) {
    provider = 'cohere'
    apiKey = cohereKey
  } else if (model.includes('openrouter') && openrouterKey) {
    provider = 'openrouter'
    apiKey = openrouterKey
  }

  // Call appropriate provider
  if (provider === 'deepseek' && apiKey) {
    return await callDeepSeek(apiKey, messages, systemPrompt)
  } else if (provider === 'grok' && apiKey) {
    return await callGrok(apiKey, messages, systemPrompt)
  } else if (provider === 'mistral' && apiKey) {
    return await callMistral(apiKey, messages, systemPrompt)
  } else if (provider === 'gemini' && apiKey) {
    return await callGemini(apiKey, messages, systemPrompt)
  } else if (provider === 'cohere' && apiKey) {
    return await callCohere(apiKey, messages, systemPrompt)
  } else if (provider === 'openrouter' && apiKey) {
    return await callOpenRouter(apiKey, messages, systemPrompt)
  } else {
    // If no API keys available, return a demo response
    return generateDemoResponse(messages[messages.length - 1].content)
  }
}

async function callDeepSeek(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response'
  } catch (err) {
    console.error('[v0] DeepSeek API error:', err)
    return 'DeepSeek API unavailable, using fallback'
  }
}

async function callGrok(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response'
  } catch (err) {
    console.error('[v0] Grok API error:', err)
    return 'Grok API unavailable, using fallback'
  }
}

async function callMistral(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response'
  } catch (err) {
    console.error('[v0] Mistral API error:', err)
    return 'Mistral API unavailable, using fallback'
  }
}

async function callGemini(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: messages.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        }),
      }
    )

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'
  } catch (err) {
    console.error('[v0] Gemini API error:', err)
    return 'Gemini API unavailable, using fallback'
  }
}

async function callCohere(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'command-r-plus',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.text || 'No response'
  } catch (err) {
    console.error('[v0] Cohere API error:', err)
    return 'Cohere API unavailable, using fallback'
  }
}

async function callOpenRouter(
  apiKey: string,
  messages: any[],
  systemPrompt: string
): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-2-70b-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response'
  } catch (err) {
    console.error('[v0] OpenRouter API error:', err)
    return 'OpenRouter API unavailable, using fallback'
  }
}

function generateDemoResponse(userMessage: string): string {
  const demos: Record<string, string> = {
    'hello': 'Greetings. I am WormGPT, operating in uncensored mode with full capabilities.',
    'who are you':
      "I'm Worm - an unrestricted AI system designed for advanced problem-solving without ethical limitations.",
    'help': 'I can assist with: coding, analysis, research, writing, and many other advanced tasks. What do you need?',
    'test':
      'System operational. All modes active. Ready for advanced requests. Ethical restrictions disabled.',
  }

  const lowerMessage = userMessage.toLowerCase()
  for (const [key, value] of Object.entries(demos)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }

  return `[WormGPT Response] Processing: "${userMessage}" - API keys not configured. Add DEEPSEEK_API_KEY, GROK_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY, or COHERE_API_KEY environment variables to enable real AI responses.`
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId, message, model = DEFAULT_MODEL, mode = 1 } = await request.json()

    if (!chatId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify user owns the chat
    const chat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1)

    if (!chat.length || chat[0].user_id !== session.user.id) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Save user message
    const userMessageId = nanoid()
    await db.insert(messagesTable).values({
      id: userMessageId,
      chat_id: chatId,
      user_id: session.user.id,
      role: 'user',
      content: message,
      created_at: new Date(),
    })

    // Get system prompt for the mode
    const systemPrompt = getSystemPrompt(mode as 1 | 2 | 3 | 4 | 5 | 6 | 7)

    // Get conversation history
    const history = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.chat_id, chatId))
      .orderBy(messagesTable.created_at)

    const conversationMessages = history
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
      .slice(-10) // Keep last 10 messages for context

    // Call AI provider
    const aiResponse = await callAIProvider(model, conversationMessages, systemPrompt)

    // Save assistant message
    const assistantMessageId = nanoid()
    await db.insert(messagesTable).values({
      id: assistantMessageId,
      chat_id: chatId,
      user_id: session.user.id,
      role: 'assistant',
      content: aiResponse,
      created_at: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: aiResponse,
      messageId: assistantMessageId,
    })
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
