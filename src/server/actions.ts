"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyNewBooking, notifyNewContact } from "@/lib/email";
import { bookingFormSchema, contactFormSchema } from "@/lib/validations";

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
    serviceInterest: formData.get("serviceInterest"),
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
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        country: parsed.data.country,
        languagePref: parsed.data.languagePref,
        serviceInterest: parsed.data.serviceInterest ?? null,
        message: parsed.data.message,
        consent: true,
      },
    });
  } catch {
    return {
      success: false,
      error: "We could not save your message. Please try again shortly.",
    };
  }

  await notifyNewContact({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    country: parsed.data.country,
    languagePref: parsed.data.languagePref,
    serviceInterest: parsed.data.serviceInterest,
    message: parsed.data.message,
  });

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
    await prisma.consultationBooking.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        country: parsed.data.country,
        city: parsed.data.city,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
        topic: parsed.data.topic,
        languagePref: parsed.data.languagePref,
        message: parsed.data.message ?? null,
      },
    });
  } catch {
    return {
      success: false,
      error: "We could not save your request. Please try again shortly.",
    };
  }

  await notifyNewBooking({
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
}

export async function togglePartnerActive(id: string, active: boolean) {
  await requireAdminSession();
  await prisma.partner.update({ where: { id }, data: { active } });
  revalidatePath("/admin/partners");
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
}
