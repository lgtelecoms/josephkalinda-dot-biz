import { z } from "zod";

const emptyToUndefined = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  return v;
};

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  country: z.string().trim().min(2).max(120),
  languagePref: z.enum(["en", "fr"]),
  serviceInterest: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120).optional()
  ),
  message: z.string().trim().min(10).max(8000),
  consent: z.literal("on"),
});

export const bookingFormSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  whatsapp: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  preferredDate: z.coerce.date(),
  preferredTime: z.string().trim().min(1).max(40),
  topic: z.string().trim().min(2).max(200),
  languagePref: z.enum(["en", "fr"]),
  message: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(8000).optional()
  ),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type BookingFormInput = z.infer<typeof bookingFormSchema>;
