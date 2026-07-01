import { NextRequest, NextResponse } from 'next/server'
import { getSystemPrompt } from '@/lib/ai-modes'

const API_KEYS = {
  grok: process.env.GROK_API_KEY_1 || process.env.GROK_API_KEY_2,
  deepseek: process.env.DEEPSEEK_API_KEY,
  mistral: process.env.MISTRAL_API_KEY,
  gemini: process.env.GEMINI_API_KEY,
  cohere: process.env.COHERE_API_KEY,
}

export async function POST(req: NextRequest) {
  try {
    const { message, mode = 1, model = 'grok', conversationId } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      )
    }

    const systemPrompt = getSystemPrompt(mode)
    const apiKey = API_KEYS[model as keyof typeof API_KEYS]

    if (!apiKey) {
      return NextResponse.json(
        { error: `API key not configured for ${model}` },
        { status: 500 }
      )
    }

    // Call the selected AI provider
    let response
    let fullContent = ''

    if (model === 'grok') {
      response = await callGrok(apiKey, message, systemPrompt)
      fullContent = response
    } else if (model === 'deepseek') {
      response = await callDeepSeek(apiKey, message, systemPrompt)
      fullContent = response
    } else if (model === 'mistral') {
      response = await callMistral(apiKey, message, systemPrompt)
      fullContent = response
    } else if (model === 'gemini') {
      response = await callGemini(apiKey, message, systemPrompt)
      fullContent = response
    } else if (model === 'cohere') {
      response = await callCohere(apiKey, message, systemPrompt)
      fullContent = response
    }

    return NextResponse.json({
      success: true,
      message: fullContent,
      mode,
      model,
      conversationId: conversationId || `conv-${Date.now()}`,
    })
  } catch (error: any) {
    console.error('[v0] Chat error:', error)
    return NextResponse.json(
      { error: error?.message || 'Chat failed' },
      { status: 500 }
    )
  }
}

async function callGrok(apiKey: string, message: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response from Grok'
  } catch (error) {
    console.error('[v0] Grok error:', error)
    throw error
  }
}

async function callDeepSeek(apiKey: string, message: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response from DeepSeek'
  } catch (error) {
    console.error('[v0] DeepSeek error:', error)
    throw error
  }
}

async function callMistral(apiKey: string, message: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'No response from Mistral'
  } catch (error) {
    console.error('[v0] Mistral error:', error)
    throw error
  }
}

async function callGemini(apiKey: string, message: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: message },
            ],
          },
        ],
      }),
    })

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini'
  } catch (error) {
    console.error('[v0] Gemini error:', error)
    throw error
  }
}

async function callCohere(apiKey: string, message: string, systemPrompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
        max_tokens: 2000,
        temperature: 0.8,
      }),
    })

    const data = await response.json()
    return data.generations?.[0]?.text || 'No response from Cohere'
  } catch (error) {
    console.error('[v0] Cohere error:', error)
    throw error
  }
}
