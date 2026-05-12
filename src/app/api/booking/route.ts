import { revalidatePath } from "next/cache";
import { bookingApiJsonSchema } from "@/lib/validations";
import { createConsultationBooking } from "@/lib/submissions";
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
  const rl = await checkLeadsRateLimit(`booking:${ip}`);
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

  const parsed = bookingApiJsonSchema.safeParse(body);
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
    await createConsultationBooking({
      fullName: d.fullName,
      email: d.email,
      whatsapp: d.whatsapp,
      country: d.country,
      city: d.city,
      preferredDate: d.preferredDate,
      preferredTime: d.preferredTime,
      topic: d.topic,
      languagePref: d.languagePref,
      message: d.message,
    });
  } catch {
    return leadsJsonResponse(
      { error: "Could not save booking request." },
      { status: 500 }
    );
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  return leadsJsonResponse({ ok: true });
}
