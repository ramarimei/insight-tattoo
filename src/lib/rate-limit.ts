// Simple in-memory rate limiter
// Resets on server restart, which is fine for Vercel serverless

const requests = new Map<string, { count: number; resetAt: number }>();

// Clean up old entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, value] of requests) {
    if (now > value.resetAt) requests.delete(key);
  }
}

setInterval(cleanup, 60_000);

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterMs: 0 };
  }

  if (entry.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count++;
  return { allowed: true, remaining: maxAttempts - entry.count, retryAfterMs: 0 };
}
