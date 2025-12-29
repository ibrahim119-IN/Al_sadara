/**
 * Simple in-memory rate limiter for API protection
 * For production, consider using Redis-based solution (e.g., @upstash/ratelimit)
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store - Note: This resets on server restart
// For production with multiple instances, use Redis
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000
let cleanupTimer: NodeJS.Timeout | null = null

function startCleanup() {
  if (cleanupTimer) return

  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)

  // Don't prevent process from exiting
  cleanupTimer.unref()
}

startCleanup()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number // seconds until reset
}

/**
 * Check if a request should be rate limited
 * @param key - Unique identifier (e.g., IP address, user ID, session ID)
 * @param limit - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  // If no record or window expired, start fresh
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs
    rateLimitStore.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    }
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfter,
    }
  }

  // Increment count
  record.count++
  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Get rate limit key from request
 * Uses IP address or falls back to a default key
 */
export function getRateLimitKey(request: Request, prefix: string = 'api'): string {
  // Try to get IP from various headers (common in reverse proxy setups)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  let ip = 'unknown'
  if (forwardedFor) {
    ip = forwardedFor.split(',')[0].trim()
  } else if (realIp) {
    ip = realIp
  }

  return `${prefix}:${ip}`
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // AI Chat - more restrictive due to API costs
  AI_CHAT: {
    limit: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '20', 10),
    windowMs: 60 * 1000, // 1 minute
  },
  AI_CHAT_HOURLY: {
    limit: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '100', 10),
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Orders - moderate limit
  ORDERS: {
    limit: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  // Auth endpoints - strict to prevent brute force
  AUTH: {
    limit: 5,
    windowMs: 60 * 1000, // 1 minute
  },
  // Password change - very strict
  PASSWORD_CHANGE: {
    limit: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // General API
  GENERAL: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  },
} as const
