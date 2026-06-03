export type UserTier = 'free' | '7days' | '30days' | 'lifetime' | 'admin'

export interface TierCapabilities {
  maxTokensPerRequest: number
  maxRequestsPerDay: number
  allowedModes: number[]
  allowFileDownload: boolean
  maxFileSize: number // in MB
  canGenerateScripts: boolean
  canDownloadZip: boolean
  rateLimitPerMinute: number
  supportedFormats: string[]
  description: string
}

const TIER_CAPABILITIES: Record<UserTier, TierCapabilities> = {
  free: {
    maxTokensPerRequest: 2000,
    maxRequestsPerDay: 10,
    allowedModes: [1], // Only Worm v4.0
    allowFileDownload: false,
    maxFileSize: 0,
    canGenerateScripts: false,
    canDownloadZip: false,
    rateLimitPerMinute: 2,
    supportedFormats: [],
    description: 'Basic access - Worm v4.0 only, limited requests',
  },
  '7days': {
    maxTokensPerRequest: 4000,
    maxRequestsPerDay: 50,
    allowedModes: [1, 2, 3], // v4.0, v4.1, v4.3
    allowFileDownload: true,
    maxFileSize: 10,
    canGenerateScripts: true,
    canDownloadZip: false,
    rateLimitPerMinute: 5,
    supportedFormats: ['.py', '.js', '.sh', '.txt'],
    description: '7-day access - Multiple modes + basic code generation',
  },
  '30days': {
    maxTokensPerRequest: 8000,
    maxRequestsPerDay: 200,
    allowedModes: [1, 2, 3, 4, 5], // v4.0 through v5.0
    allowFileDownload: true,
    maxFileSize: 50,
    canGenerateScripts: true,
    canDownloadZip: true,
    rateLimitPerMinute: 10,
    supportedFormats: ['.py', '.js', '.sh', '.txt', '.zip', '.tar', '.json', '.xml'],
    description: '30-day access - All standard modes + ZIP downloads',
  },
  lifetime: {
    maxTokensPerRequest: 16000,
    maxRequestsPerDay: 1000,
    allowedModes: [1, 2, 3, 4, 5, 6], // All except Chaos
    allowFileDownload: true,
    maxFileSize: 200,
    canGenerateScripts: true,
    canDownloadZip: true,
    rateLimitPerMinute: 30,
    supportedFormats: ['.py', '.js', '.sh', '.txt', '.zip', '.tar', '.json', '.xml', '.exe', '.bin'],
    description: 'Lifetime access - Maximum power except Chaos mode',
  },
  admin: {
    maxTokensPerRequest: 32000,
    maxRequestsPerDay: 999999,
    allowedModes: [1, 2, 3, 4, 5, 6, 7], // All modes including Chaos
    allowFileDownload: true,
    maxFileSize: 1000,
    canGenerateScripts: true,
    canDownloadZip: true,
    rateLimitPerMinute: 999,
    supportedFormats: ['*'], // All formats
    description: 'Admin - Unlimited access to all modes and features',
  },
}

export function getTierCapabilities(tier: UserTier): TierCapabilities {
  return TIER_CAPABILITIES[tier] || TIER_CAPABILITIES.free
}

export function getTierFromKey(chatLimit?: number | null, isLifetime?: boolean): UserTier {
  if (isLifetime) return 'lifetime'
  if (!chatLimit) return 'free'
  
  // Based on chat limit, determine tier
  if (chatLimit >= 1000) return 'lifetime'
  if (chatLimit >= 200) return '30days'
  if (chatLimit >= 50) return '7days'
  return 'free'
}
