export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

type Options = {
  /** Requests allowed per key within the window. */
  limit: number;
  windowMs: number;
  /** Upper bound on tracked keys; expired keys are dropped once it is exceeded. */
  maxKeys?: number;
};

/**
 * In-memory sliding-window rate limiter. Each call to the returned function counts as one request
 * for `key` and says whether it is allowed.
 *
 * State lives in the current server instance only. On serverless hosting each instance has its own
 * counters, so this slows down casual abuse but is not a hard guarantee; pair it with the host's
 * firewall rate limiting for that.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 5000 }: Options) {
  const hits = new Map<string, number[]>();

  const prune = (now: number) => {
    for (const [key, times] of hits) {
      if (times.length === 0 || now - times[times.length - 1] >= windowMs) hits.delete(key);
    }
  };

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((recent[0] + windowMs - now) / 1000)) };
    }

    recent.push(now);
    hits.set(key, recent);
    if (hits.size > maxKeys) prune(now);
    return { allowed: true };
  };
}
