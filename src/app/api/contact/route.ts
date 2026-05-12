import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { contactApiJsonSchema } from "@/lib/validations";
import { createContactSubmission } from "@/lib/submissions";

export async function POST(request: Request) {
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
