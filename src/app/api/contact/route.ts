import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { contactApiJsonSchema } from "@/lib/validations";
import { createContactSubmission } from "@/lib/submissions";
import {
  getLeadsClientIp,
  leadsRateLimitMax,
  validateLeadsApiSecret,
} from "@/lib/leads-api";
import { checkSimpleRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const authBlock = validateLeadsApiSecret(request);
  if (authBlock) return authBlock;

  const ip = getLeadsClientIp(request);
  const limit = leadsRateLimitMax();
  const rl = checkSimpleRateLimit(`contact:${ip}`, limit, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactApiJsonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: parsed.error.flatten(),
      },
      { status: 422 }
    );
  }

  const d = parsed.data;

  try {
    await createContactSubmission({
      name: d.name,
      email: d.email,
      phone: d.phone ?? null,
      country: d.country,
      languagePref: d.languagePref,
      message: d.message,
      serviceId: d.serviceId ?? null,
      serviceInterestFree: d.serviceInterest ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not save submission." },
      { status: 500 }
    );
  }

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
  return NextResponse.json({ ok: true });
}
