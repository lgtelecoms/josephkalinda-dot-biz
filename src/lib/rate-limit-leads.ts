import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkSimpleRateLimit } from "@/lib/rate-limit";
import { leadsRateLimitMax } from "@/lib/leads-api";

type Cached = Ratelimit | "disabled" | undefined;

let distributed: Cached;

function getDistributedRatelimit(): Ratelimit | null {
  if (distributed === "disabled") return null;
  if (distributed) return distributed;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    distributed = "disabled";
    return null;
  }

  const redis = new Redis({ url, token });
  const max = leadsRateLimitMax();
  distributed = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, "60 s"),
    prefix: "jk-leads",
  });
  return distributed;
}

/**
 * Prefer Upstash when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
 * are set (shared limit across instances). Otherwise in-memory per Node process.
 */
export async function checkLeadsRateLimit(
  identifier: string
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const rl = getDistributedRatelimit();
  if (rl) {
    const { success, reset } = await rl.limit(identifier);
    if (!success) {
      const retryAfterSec = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return { ok: false, retryAfterSec };
    }
    return { ok: true };
  }

  return checkSimpleRateLimit(identifier, leadsRateLimitMax(), 60_000);
}
