import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { bookingApiJsonSchema } from "@/lib/validations";
import { createConsultationBooking } from "@/lib/submissions";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bookingApiJsonSchema.safeParse(body);
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
    return NextResponse.json(
      { error: "Could not save booking request." },
      { status: 500 }
    );
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  return NextResponse.json({ ok: true });
}
