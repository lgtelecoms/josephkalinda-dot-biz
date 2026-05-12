"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  bookingFormSchema,
  contactFormSchema,
  contentKeySchema,
  contentLocaleSchema,
  contentValueSchema,
} from "@/lib/validations";
import {
  partnerLogoExtension,
  persistPartnerLogoImage,
} from "@/lib/partner-logo-storage";
import {
  createConsultationBooking,
  createContactSubmission,
} from "@/lib/submissions";
import { checkLeadsRateLimit } from "@/lib/rate-limit-leads";
import { getRequestIpFromHeaders } from "@/lib/request-ip";

export type FormState = { success: boolean; error?: string };

function honeypotTripped(formData: FormData) {
  const v = formData.get("website");
  return typeof v === "string" && v.trim().length > 0;
}

export async function submitContactForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (honeypotTripped(formData)) {
    return { success: false, error: "Unable to submit this form." };
  }

  const ip = getRequestIpFromHeaders();
  const rl = await checkLeadsRateLimit(`contact:${ip}`);
  if (!rl.ok) {
    return {
      success: false,
      error: `Too many submissions. Please wait ${rl.retryAfterSec}s and try again.`,
    };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    languagePref: formData.get("languagePref"),
    serviceId: formData.get("serviceId"),
    message: formData.get("message"),
    consent: formData.get("consent"),
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please review the form and correct any highlighted issues.",
    };
  }

  try {
    await createContactSubmission({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      languagePref: parsed.data.languagePref,
      message: parsed.data.message,
      serviceId: parsed.data.serviceId ?? null,
    });
  } catch {
    return {
      success: false,
      error: "We could not save your message. Please try again shortly.",
    };
  }

  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function submitBookingForm(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (honeypotTripped(formData)) {
    return { success: false, error: "Unable to submit this form." };
  }

  const ip = getRequestIpFromHeaders();
  const rl = await checkLeadsRateLimit(`booking:${ip}`);
  if (!rl.ok) {
    return {
      success: false,
      error: `Too many requests. Please wait ${rl.retryAfterSec}s and try again.`,
    };
  }

  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    country: formData.get("country"),
    city: formData.get("city"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    topic: formData.get("topic"),
    languagePref: formData.get("languagePref"),
    message: formData.get("message"),
  };

  const parsed = bookingFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please review the form and correct any highlighted issues.",
    };
  }

  try {
    await createConsultationBooking({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      whatsapp: parsed.data.whatsapp,
      country: parsed.data.country,
      city: parsed.data.city,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      topic: parsed.data.topic,
      languagePref: parsed.data.languagePref,
      message: parsed.data.message,
    });
  } catch {
    return {
      success: false,
      error: "We could not save your request. Please try again shortly.",
    };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function toggleContactRead(id: string, read: boolean) {
  await requireAdminSession();
  await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
}

export async function deleteContact(id: string) {
  await requireAdminSession();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/dashboard");
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
) {
  await requireAdminSession();
  await prisma.consultationBooking.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
}

export async function deleteBooking(id: string) {
  await requireAdminSession();
  await prisma.consultationBooking.delete({ where: { id } });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
}

export async function toggleServiceActive(id: string, active: boolean) {
  await requireAdminSession();
  await prisma.service.update({ where: { id }, data: { active } });
  revalidatePath("/admin/services");
  revalidatePath("/en");
  revalidatePath("/fr");
}

export async function togglePartnerActive(id: string, active: boolean) {
  await requireAdminSession();
  await prisma.partner.update({ where: { id }, data: { active } });
  revalidatePath("/admin/partners");
  revalidatePath("/en");
  revalidatePath("/fr");
}

export async function updateServiceRecord(
  id: string,
  data: {
    titleEn: string;
    titleFr: string;
    descriptionEn: string;
    descriptionFr: string;
    iconName: string;
    sortOrder: number;
    active: boolean;
  }
) {
  await requireAdminSession();
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/admin/services");
  revalidatePath("/en");
  revalidatePath("/fr");
}

export async function updatePartnerRecord(
  id: string,
  data: {
    name: string;
    logoPath: string | null;
    websiteUrl: string | null;
    descriptionEn: string | null;
    descriptionFr: string | null;
    sortOrder: number;
    active: boolean;
  }
) {
  await requireAdminSession();
  await prisma.partner.update({ where: { id }, data });
  revalidatePath("/admin/partners");
  revalidatePath("/en");
  revalidatePath("/fr");
}

export async function uploadPartnerLogo(
  formData: FormData
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  try {
    await requireAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const file = formData.get("file");
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return { ok: false, error: "Choose an image file first." };
  }

  const f = file as File;
  if (f.size > 2 * 1024 * 1024) {
    return { ok: false, error: "File too large (max 2 MB)." };
  }

  if (!partnerLogoExtension(f.type)) {
    return { ok: false, error: "Use PNG, JPEG, or WebP only." };
  }

  const buf = Buffer.from(await f.arrayBuffer());
  if (buf.length === 0) {
    return { ok: false, error: "Empty file." };
  }

  try {
    const { publicUrl } = await persistPartnerLogoImage(buf, f.type);
    return { ok: true, path: publicUrl };
  } catch {
    return { ok: false, error: "Upload failed. Check storage configuration." };
  }
}

export type ContentActionState = { ok: boolean; error?: string };

export async function updateContentEntryValue(
  id: string,
  value: string
): Promise<ContentActionState> {
  try {
    await requireAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const parsed = contentValueSchema.safeParse(value);
  if (!parsed.success) {
    return { ok: false, error: "Value must be 1–8000 characters." };
  }

  try {
    await prisma.contentEntry.update({
      where: { id },
      data: { value: parsed.data },
    });
  } catch {
    return { ok: false, error: "Could not save." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/en");
  revalidatePath("/fr");
  return { ok: true };
}

export async function createContentEntryRecord(
  key: string,
  locale: string,
  value: string
): Promise<ContentActionState> {
  try {
    await requireAdminSession();
  } catch {
    return { ok: false, error: "Unauthorized." };
  }

  const k = contentKeySchema.safeParse(key);
  const loc = contentLocaleSchema.safeParse(locale);
  const v = contentValueSchema.safeParse(value);
  if (!k.success || !loc.success || !v.success) {
    return {
      ok: false,
      error: "Invalid key (lowercase snake_case), locale (en|fr), or value length.",
    };
  }

  try {
    await prisma.contentEntry.upsert({
      where: {
        key_locale: { key: k.data, locale: loc.data },
      },
      create: { key: k.data, locale: loc.data, value: v.data },
      update: { value: v.data },
    });
  } catch {
    return { ok: false, error: "Could not create or update entry." };
  }

  revalidatePath("/admin/content");
  revalidatePath("/en");
  revalidatePath("/fr");
  return { ok: true };
}
