import { NextRequest } from 'next/server'

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  max: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string
}

const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options

  return async (req: NextRequest): Promise<{ success: boolean; limit?: number; remaining?: number; resetTime?: number }> => {
    const key = keyGenerator ? keyGenerator(req) : req?.ip || 'unknown'
    const now = Date.now()

    for (const [k, v] of requests.entries()) {
      if (v.resetTime < now) {
        requests.delete(k)
      }
    }

    const current = requests.get(key)
    
    if (!current || current.resetTime < now) {
      // First request in window or window expired
      requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      
      return {
        success: true,
        limit: max,
        remaining: max - 1,
        resetTime: now + windowMs
      }
    }

    if (current.count >= max) {
      // Rate limit exceeded
      return {
        success: false,
        limit: max,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    // Increment counter
    current.count++
    requests.set(key, current)

    return {
      success: true,
      limit: max,
      remaining: max - current.count,
      resetTime: current.resetTime
    }
  }
}

// Pre-configured rate limiters
export const buyerCreateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  keyGenerator: (req) => {
    // Use user ID if available, otherwise IP
    const userId = req.headers.get('x-user-id')
    return userId || req.ip || 'unknown'
  }
})

export const buyerUpdateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  keyGenerator: (req) => {
    const userId = req.headers.get('x-user-id')
    return userId || req.ip || 'unknown'
  }
})
