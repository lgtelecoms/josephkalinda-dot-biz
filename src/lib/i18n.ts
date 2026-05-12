import { en } from "@/messages/en";
import { fr } from "@/messages/fr";

export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr";
}

export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  return locale === "fr" ? fr : en;
}
