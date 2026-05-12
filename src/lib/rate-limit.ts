type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5000;

function prune(now: number) {
  if (buckets.size <= MAX_KEYS) return;
  for (const [k, b] of Array.from(buckets.entries())) {
    if (b.resetAt < now) buckets.delete(k);
  }
  if (buckets.size <= MAX_KEYS) return;
  const keys = Array.from(buckets.keys());
  const half = Math.ceil(keys.length / 2);
  for (let i = 0; i < half; i++) {
    const k = keys[i];
    if (k) buckets.delete(k);
  }
}

/**
 * Fixed-window counter per key (best-effort on a single Node instance).
 * For distributed production traffic, use Redis/Upstash instead.
 */
export function checkSimpleRateLimit(
  key: string,
  maxPerWindow: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);

  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }

  if (b.count >= maxPerWindow) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }

  b.count += 1;
  return { ok: true };
}
