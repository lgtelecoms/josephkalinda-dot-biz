import { NextResponse } from "next/server";

function getLeadsCorsHeaders(): Record<string, string> | null {
  const origin = process.env.LEADS_API_CORS_ORIGIN?.trim();
  if (!origin) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-leads-secret",
    "Access-Control-Max-Age": "86400",
  };
}

export function leadsJsonResponse(
  body: unknown,
  init?: ResponseInit
): NextResponse {
  const cors = getLeadsCorsHeaders();
  const headers = new Headers(init?.headers);
  if (cors) {
    for (const [k, v] of Object.entries(cors)) {
      headers.set(k, v);
    }
  }
  return NextResponse.json(body, { ...init, headers });
}

export function leadsOptionsResponse(): NextResponse {
  const cors = getLeadsCorsHeaders();
  if (!cors) {
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 204, headers: cors });
}
