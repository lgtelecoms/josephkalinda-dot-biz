"use client";

import type { Partner } from "@prisma/client";
import type { Messages } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import Image from "next/image";
import Link from "next/link";

type Props = {
  locale: "en" | "fr";
  messages: Messages;
  partners: Partner[];
};

export function Partners({ locale, messages, partners }: Props) {
  const p = messages.partners;
  const reduce = useReducedMotion();

  const rows =
    partners.length > 0
      ? partners.map((x) => ({
          id: x.id,
          name: x.name,
          href: x.websiteUrl,
          desc:
            locale === "fr"
              ? x.descriptionFr ?? ""
              : x.descriptionEn ?? "",
          logo: x.logoPath,
        }))
      : p.names.map((name, i) => ({
          id: `static-${i}`,
          name,
          href: null as string | null,
          desc: "",
          logo: null as string | null,
        }));

  return (
    <section
      id="partners"
      className="border-b border-brand-gold/15 bg-brand-ivory py-20 sm:py-24"
      aria-labelledby="partners-heading"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="partners-heading"
            title={p.title}
            subtitle={p.subtitle}
          />
        </Reveal>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {rows.map((row, i) => (
            <Reveal key={row.id} delay={i * 0.04}>
              <motion.div
                whileHover={
                  reduce ? undefined : { scale: 1.02, transition: { duration: 0.2 } }
                }
                className={cn(
                  "min-w-[200px] snap-center sm:min-w-0",
                  "flex h-36 flex-col items-center justify-between gap-3 rounded-2xl border border-brand-forest-deep/12",
                  "bg-white/90 px-4 py-4 text-center shadow-brand backdrop-blur-sm",
                  "transition hover:border-brand-gold/60 hover:shadow-gold"
                )}
              >
                <div className="flex h-14 w-full items-center justify-center">
                  {row.logo && row.logo.startsWith("/") ? (
                    <Image
                      src={row.logo}
                      alt={row.name}
                      width={120}
                      height={48}
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : row.logo && row.logo.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.logo}
                      alt={row.name}
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : (
                    <span className="rounded-full border border-brand-gold/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-forest-deep">
                      {row.name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {row.href ? (
                    <Link
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block font-sans text-sm font-semibold uppercase tracking-wide text-brand-forest-deep hover:text-brand-gold"
                    >
                      {row.name}
                    </Link>
                  ) : (
                    <span className="block font-sans text-sm font-semibold uppercase tracking-wide text-brand-forest-deep/85">
                      {row.name}
                    </span>
                  )}
                  {row.desc ? (
                    <p className="text-xs leading-snug text-brand-forest-deep/65">
                      {row.desc}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
