import { z } from "zod";
import { ALLOWED_SERVICE_ICONS } from "@/lib/constants";

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
  serviceId: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(1).max(40).optional()
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

export const contactApiJsonSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
    country: z.string().trim().min(2).max(120),
    languagePref: z.enum(["en", "fr"]),
    message: z.string().trim().min(10).max(8000),
    consent: z.literal(true),
    serviceId: z.preprocess(
      emptyToUndefined,
      z.string().trim().min(1).max(40).optional()
    ),
    serviceInterest: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(120).optional()
    ),
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website && data.website.trim().length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid payload",
        path: ["website"],
      });
    }
  });

export const bookingApiJsonSchema = z
  .object({
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
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.website && data.website.trim().length > 0) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid payload",
        path: ["website"],
      });
    }
  });

export const serviceAdminFormSchema = z.object({
  titleEn: z.string().trim().min(2).max(200),
  titleFr: z.string().trim().min(2).max(200),
  descriptionEn: z.string().trim().min(10).max(12000),
  descriptionFr: z.string().trim().min(10).max(12000),
  iconName: z
    .string()
    .trim()
    .refine(
      (n) => (ALLOWED_SERVICE_ICONS as readonly string[]).includes(n),
      "Unknown icon"
    ),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const partnerAdminFormSchema = z.object({
  name: z.string().trim().min(2).max(200),
  logoPath: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500).optional()
  ),
  websiteUrl: z.preprocess(
    emptyToUndefined,
    z.string().trim().url().max(500).optional()
  ),
  descriptionEn: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(12000).optional()
  ),
  descriptionFr: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(12000).optional()
  ),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export const contentValueSchema = z.string().trim().min(1).max(8000);

export const contentKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z][a-z0-9_]{0,62}$/, "Use lowercase letters, digits, underscores");

export const contentLocaleSchema = z.enum(["en", "fr"]);

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type BookingFormInput = z.infer<typeof bookingFormSchema>;
