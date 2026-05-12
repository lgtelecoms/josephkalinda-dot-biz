import { revalidatePath } from "next/cache";
import { contactApiJsonSchema } from "@/lib/validations";
import { createContactSubmission } from "@/lib/submissions";
import {
  getLeadsClientIp,
  validateLeadsApiSecret,
} from "@/lib/leads-api";
import { checkLeadsRateLimit } from "@/lib/rate-limit-leads";
import { leadsJsonResponse, leadsOptionsResponse } from "@/lib/leads-cors";

export async function OPTIONS() {
  return leadsOptionsResponse();
}

export async function POST(request: Request) {
  const authBlock = validateLeadsApiSecret(request);
  if (authBlock) return authBlock;

  const ip = getLeadsClientIp(request);
  const rl = await checkLeadsRateLimit(`contact:${ip}`);
  if (!rl.ok) {
    return leadsJsonResponse(
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
    return leadsJsonResponse({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactApiJsonSchema.safeParse(body);
  if (!parsed.success) {
    return leadsJsonResponse(
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
    return leadsJsonResponse(
      { error: "Could not save submission." },
      { status: 500 }
    );
  }

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
  return leadsJsonResponse({ ok: true });
}
