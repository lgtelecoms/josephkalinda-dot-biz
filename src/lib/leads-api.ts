import type { NextResponse } from "next/server";
import { leadsJsonResponse } from "@/lib/leads-cors";

const SECRET_HEADER = "x-leads-secret";

export function getLeadsClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * When `LEADS_API_SECRET` is set, callers must send the same value in
 * `x-leads-secret` or `Authorization: Bearer <secret>`.
 * When unset, no auth is required (suitable only for trusted networks).
 */
export function validateLeadsApiSecret(request: Request): NextResponse | null {
  const secret = process.env.LEADS_API_SECRET?.trim();
  if (!secret) return null;

  const header = request.headers.get(SECRET_HEADER)?.trim();
  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const supplied = header || bearer;

  if (!supplied || supplied !== secret) {
    return leadsJsonResponse({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

export function leadsRateLimitMax(): number {
  const raw = process.env.LEADS_RATE_LIMIT_PER_MINUTE;
  const n = raw ? Number.parseInt(raw, 10) : 30;
  if (!Number.isFinite(n) || n < 1) return 30;
  return Math.min(n, 300);
}
