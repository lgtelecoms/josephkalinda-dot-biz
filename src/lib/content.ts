import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";

export type ContentMap = Record<string, string>;

export async function getContentMap(locale: Locale): Promise<ContentMap> {
  try {
    const rows = await prisma.contentEntry.findMany({
      where: { locale },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export function pickContent(map: ContentMap, key: string, fallback: string) {
  return map[key] ?? fallback;
}
