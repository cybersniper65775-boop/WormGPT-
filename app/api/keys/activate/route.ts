import { NextRequest, NextResponse } from 'next/server'

const VALID_KEYS: Record<string, { mode: number; limit: number | null; created: string }> = {
  'WormGPT-ABC12-XYZ34-QWE56': { mode: 7, limit: null, created: '2025-07-01' },
  'WormGPT-DEF78-UIO90-ASB12': { mode: 5, limit: 100, created: '2025-06-28' },
  'WormGPT-DEMO-KEY1-DEMO01': { mode: 5, limit: 50, created: '2025-07-01' },
}

export async function POST(req: NextRequest) {
  try {
    const { activationKey } = await req.json()

    if (!activationKey) {
      return NextResponse.json(
        { error: 'Activation key required' },
        { status: 400 }
      )
    }

    const keyData = VALID_KEYS[activationKey]
    if (!keyData) {
      return NextResponse.json(
        { error: 'Invalid activation key' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      mode: keyData.mode,
      limit: keyData.limit,
      isLifetime: keyData.limit === null,
    })
  } catch (error: any) {
    console.error('[v0] Key activation error:', error)
    return NextResponse.json(
      { error: 'Activation failed' },
      { status: 500 }
    )
  }
}
