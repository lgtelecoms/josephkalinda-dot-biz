import { prisma } from "@/lib/prisma";
import { notifyNewBooking, notifyNewContact } from "@/lib/email";

export type CreateContactInput = {
  name: string;
  email: string;
  phone?: string | null;
  country: string;
  languagePref: "en" | "fr";
  message: string;
  /** When set, must match an existing Service id */
  serviceId?: string | null;
  /** Plain-text interest when no service id (API integrations) */
  serviceInterestFree?: string | null;
};

export async function createContactSubmission(input: CreateContactInput) {
  let serviceId: string | null = input.serviceId?.trim() || null;
  let serviceInterest: string | null =
    input.serviceInterestFree?.trim() || null;

  if (serviceId) {
    const svc = await prisma.service.findUnique({ where: { id: serviceId } });
    if (svc) {
      serviceInterest =
        input.languagePref === "fr" ? svc.titleFr : svc.titleEn;
    } else {
      serviceId = null;
    }
  }

  const row = await prisma.contactSubmission.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      country: input.country,
      languagePref: input.languagePref,
      serviceId,
      serviceInterest,
      message: input.message,
      consent: true,
    },
  });

  await notifyNewContact({
    name: input.name,
    email: input.email,
    phone: input.phone,
    country: input.country,
    languagePref: input.languagePref,
    serviceInterest,
    serviceId,
    message: input.message,
  });

  return row;
}

export type CreateBookingInput = {
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  preferredDate: Date;
  preferredTime: string;
  topic: string;
  languagePref: "en" | "fr";
  message?: string | null;
};

export async function createConsultationBooking(input: CreateBookingInput) {
  const row = await prisma.consultationBooking.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      whatsapp: input.whatsapp,
      country: input.country,
      city: input.city,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      topic: input.topic,
      languagePref: input.languagePref,
      message: input.message ?? null,
    },
  });

  await notifyNewBooking({
    fullName: input.fullName,
    email: input.email,
    whatsapp: input.whatsapp,
    country: input.country,
    city: input.city,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    topic: input.topic,
    languagePref: input.languagePref,
    message: input.message,
  });

  return row;
}
