import { NextRequest } from "next/server";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (req: NextRequest) => string;
}

const requests = new Map<string, { count: number; resetTime: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options;
  return async (
    req: NextRequest
  ): Promise<{
    success: boolean;
    limit?: number;
    remaining?: number;
    resetTime?: number;
  }> => {
    const key = keyGenerator
      ? keyGenerator(req)
      : getClientIp(req) || "unknown";
    const now = Date.now();

    for (const [k, v] of requests.entries()) {
      if (v.resetTime < now) {
        requests.delete(k);
      }
    }

    const current = requests.get(key);

    if (!current || current.resetTime < now) {
      // First request in window or window expired
      requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });

      return {
        success: true,
        limit: max,
        remaining: max - 1,
        resetTime: now + windowMs,
      };
    }

    if (current.count >= max) {
      return {
        success: false,
        limit: max,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    current.count++;
    requests.set(key, current);

    return {
      success: true,
      limit: max,
      remaining: max - current.count,
      resetTime: current.resetTime,
    };
  };
}

// Pre-configured rate limiters
export const buyerCreateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const userId = req.headers.get("x-user-id");
    return userId || getClientIp(req) || "unknown";
  },
});

export const buyerUpdateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  keyGenerator: (req) => {
    const userId = req.headers.get("x-user-id");
    return userId || getClientIp(req) || "unknown";
  },
});
