"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingFormSchema, contactFormSchema } from "@/lib/validations";
import {
  createConsultationBooking,
  createContactSubmission,
} from "@/lib/submissions";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

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

const UPLOAD_MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
};

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

  const ext = UPLOAD_MIME_TO_EXT[f.type];
  if (!ext) {
    return { ok: false, error: "Use PNG, JPEG, or WebP only." };
  }

  const buf = Buffer.from(await f.arrayBuffer());
  if (buf.length === 0) {
    return { ok: false, error: "Empty file." };
  }

  const filename = `partner-${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (blobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`partners/${filename}`, buf, {
      access: "public",
      token: blobToken,
    });
    return { ok: true, path: blob.url };
  }

  const dir = join(process.cwd(), "public", "uploads", "partners");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), buf);

  const publicPath = `/uploads/partners/${filename}`;
  return { ok: true, path: publicPath };
}
