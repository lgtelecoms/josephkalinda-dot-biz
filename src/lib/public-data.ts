import { prisma } from "@/lib/prisma";
import type { Partner, Service } from "@prisma/client";

export async function getPublicServices(): Promise<Service[]> {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getPublicPartners(): Promise<Partner[]> {
  try {
    return await prisma.partner.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
