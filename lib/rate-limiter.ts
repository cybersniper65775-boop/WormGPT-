// Simple in-memory rate limiter for demo purposes
// In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000 // 1 minute default
): { remaining: number; reset: number; limited: boolean } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now >= entry.resetTime) {
    // New window or expired
    const resetTime = now + windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return {
      remaining: limit - 1,
      reset: resetTime,
      limited: false,
    }
  }

  // Within current window
  if (entry.count >= limit) {
    return {
      remaining: 0,
      reset: entry.resetTime,
      limited: true,
    }
  }

  entry.count++
  return {
    remaining: limit - entry.count,
    reset: entry.resetTime,
    limited: false,
  }
}

export function checkChatLimit(
  userId: string,
  userChatLimit: number | null,
  chatCount: number
): { allowed: boolean; remaining: number } {
  if (userChatLimit === null) {
    return { allowed: true, remaining: -1 } // Unlimited
  }

  const remaining = Math.max(0, userChatLimit - chatCount)
  return {
    allowed: remaining > 0,
    remaining,
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime + 300000) {
      // Clean up entries older than 5 minutes
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Run every minute
