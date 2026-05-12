import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Seeded admin user:", adminEmail);
  } else {
    console.warn(
      "Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD in environment for prisma seed."
    );
  }

  const services = [
    {
      titleEn: "Product Development",
      titleFr: "Développement de produits",
      descriptionEn:
        "Design and scale offerings that meet market realities and long-term resilience goals.",
      descriptionFr:
        "Concevoir et faire évoluer des offres alignées sur le marché et la résilience.",
      iconName: "Package",
      sortOrder: 0,
    },
    {
      titleEn: "Personal Development",
      titleFr: "Développement personnel",
      descriptionEn:
        "Build leadership capacity, clarity, and momentum for high-stakes change programs.",
      descriptionFr:
        "Renforcer le leadership, la clarté et l’élan pour des programmes de changement ambitieux.",
      iconName: "TrendingUp",
      sortOrder: 1,
    },
    {
      titleEn: "Project Development",
      titleFr: "Développement de projets",
      descriptionEn:
        "Structure initiatives with disciplined governance, milestones, and measurable outcomes.",
      descriptionFr:
        "Structurer les initiatives avec gouvernance, jalons et résultats mesurables.",
      iconName: "ClipboardList",
      sortOrder: 2,
    },
    {
      titleEn: "Management for Agricultural Transformation",
      titleFr: "Gestion de projets pour la transformation agricole",
      descriptionEn:
        "Align stakeholders, operations, and investment around regenerative, inclusive growth.",
      descriptionFr:
        "Aligner parties prenantes, opérations et investissements autour d’une croissance inclusive.",
      iconName: "UsersRound",
      sortOrder: 3,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-service-${s.sortOrder}` },
      update: s,
      create: { id: `seed-service-${s.sortOrder}`, ...s, active: true },
    });
  }
  console.log("Seeded services.");

  const partners = [
    {
      name: "DiaspoPass",
      sortOrder: 0,
      logoPath: "/images/partners/diaspopass.svg",
      websiteUrl: null as string | null,
      descriptionEn: "Documents. Immigration. Simplified.",
      descriptionFr: "Documents. Immigration. Simplifié.",
    },
    {
      name: "Panter Africa",
      sortOrder: 1,
      logoPath: "/images/partners/panter-africa.svg",
      websiteUrl: null,
      descriptionEn: "Bridging the gap for a prosperous Africa.",
      descriptionFr: "Relier les écarts pour une Afrique prospère.",
    },
    {
      name: "UPLIFT Hub",
      sortOrder: 2,
      logoPath: "/images/partners/uplift-hub.svg",
      websiteUrl: null,
      descriptionEn: "Adapting skills for an evolving world.",
      descriptionFr: "Adapter les compétences à un monde en évolution.",
    },
    {
      name: "CIEL Diaspora",
      sortOrder: 3,
      logoPath: "/images/partners/ciel-diaspora.svg",
      websiteUrl: null,
      descriptionEn: "Remittances · Payments · Funding.",
      descriptionFr: "Transferts · Paiements · Financement.",
    },
    {
      name: "LG Telecoms",
      sortOrder: 4,
      logoPath: "/images/partners/lg-telecoms.svg",
      websiteUrl: null,
      descriptionEn: "Let's get connected.",
      descriptionFr: "Connectons-nous.",
    },
    {
      name: "Gazify",
      sortOrder: 5,
      logoPath: "/images/partners/gazify.svg",
      websiteUrl: null,
      descriptionEn: "Gas delivered in minutes.",
      descriptionFr: "Le gaz livré en quelques minutes.",
    },
    {
      name: "Swift Serve",
      sortOrder: 6,
      logoPath: "/images/partners/swift-serve.svg",
      websiteUrl: null,
      descriptionEn: "Fast · Reliable · Affordable.",
      descriptionFr: "Rapide · Fiable · Abordable.",
    },
    {
      name: "CDI",
      sortOrder: 7,
      logoPath: "/images/partners/cdi.svg",
      websiteUrl: null,
      descriptionEn: "Construction · Agriculture · Financial services.",
      descriptionFr: "Construction · Agriculture · Services financiers.",
    },
  ];

  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: `seed-partner-${p.sortOrder}` },
      update: {
        name: p.name,
        sortOrder: p.sortOrder,
        active: true,
        logoPath: p.logoPath,
        websiteUrl: p.websiteUrl,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
      },
      create: {
        id: `seed-partner-${p.sortOrder}`,
        name: p.name,
        sortOrder: p.sortOrder,
        active: true,
        logoPath: p.logoPath,
        websiteUrl: p.websiteUrl,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
      },
    });
  }
  console.log("Seeded partners.");

  const content: Array<{ key: string; locale: string; value: string }> = [
    { key: "nav_home", locale: "en", value: "Home" },
    { key: "nav_home", locale: "fr", value: "Accueil" },
    { key: "nav_services", locale: "en", value: "Services" },
    { key: "nav_services", locale: "fr", value: "Services" },
    { key: "nav_mission", locale: "en", value: "Mission" },
    { key: "nav_mission", locale: "fr", value: "Mission" },
    { key: "nav_partners", locale: "en", value: "Partners" },
    { key: "nav_partners", locale: "fr", value: "Partenaires" },
    { key: "nav_contact", locale: "en", value: "Contact" },
    { key: "nav_contact", locale: "fr", value: "Contact" },
    { key: "cta_book", locale: "en", value: "Book consultation" },
    { key: "cta_book", locale: "fr", value: "Réserver une consultation" },
  ];

  for (const c of content) {
    const existing = await prisma.contentEntry.findFirst({
      where: { key: c.key, locale: c.locale },
    });
    if (existing) {
      await prisma.contentEntry.update({
        where: { id: existing.id },
        data: { value: c.value },
      });
    } else {
      await prisma.contentEntry.create({ data: c });
    }
  }
  console.log("Seeded navigation content entries.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
