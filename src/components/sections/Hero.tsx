import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { WHATSAPP_URL } from "@/lib/site";
import { BrandSign } from "@/components/hero/BrandSign";
import { HeroQr } from "@/components/hero/HeroQr";
import { MissionStatement } from "@/components/mission/MissionStatement";
import { CurvedDivider } from "@/components/ui/CurvedDivider";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  messages: Messages;
  locale: "en" | "fr";
};

function IconRow({
  icon: Icon,
  children,
}: {
  icon: typeof Phone;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-brand-gold/25 py-3 last:border-b-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-white">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="text-sm leading-relaxed text-white/95">{children}</div>
    </div>
  );
}

export function Hero({ messages, locale }: Props) {
  const h = messages.hero;
  const base = `/${locale}`;

  return (
    <section
      className="relative border-b border-brand-gold/20 bg-brand-ivory pb-16 pt-24 sm:pb-20 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-brand-lg sm:rounded-3xl">
            <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,auto)_minmax(0,0.92fr)] lg:items-stretch">
              <div className="relative border-b border-brand-gold/25 bg-white p-8 sm:p-10 lg:border-b-0 lg:border-r-0 lg:p-12 xl:p-14">
                <div className="flex justify-center sm:justify-start">
                  <BrandSign headingId="hero-heading" tagline={h.tagline} />
                </div>
                <div className="relative mt-8 border-l-4 border-brand-gold pl-5 sm:pl-6">
                  <p className="font-sans text-sm font-medium uppercase tracking-[0.12em] text-brand-forest-muted sm:text-base">
                    {h.firmLine1}
                  </p>
                  <p className="mt-2 inline-block border-b-[3px] border-brand-gold pb-0.5 font-sans text-2xl font-bold uppercase tracking-tight text-brand-forest-deep sm:mt-2.5 sm:text-3xl md:text-[2rem]">
                    {h.firmHighlight}
                  </p>
                  <p className="mt-2 font-sans text-sm font-medium uppercase tracking-[0.12em] text-brand-forest-muted sm:text-base">
                    {h.firmLine2}
                  </p>
                </div>
                <div className="mt-8 border-t border-brand-gold/25 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-forest-muted">
                    {h.missionEyebrow}
                  </p>
                  <div className="mt-3">
                    <MissionStatement
                      messages={messages}
                      tone="onLight"
                      compact
                    />
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`${base}#contact`}
                    className="inline-flex items-center justify-center rounded-full border border-brand-forest-deep/20 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-forest-deep shadow-sm transition hover:border-brand-gold/60 hover:shadow-brand"
                  >
                    {h.ctaContact}
                  </Link>
                  <Link
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-brand-gold/50 bg-brand-forest-deep px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-brand transition hover:bg-brand-forest-muted"
                  >
                    WhatsApp
                  </Link>
                  <Link
                    href={`${base}/book`}
                    className="inline-flex items-center justify-center rounded-full border border-brand-gold/50 bg-brand-ivory px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-forest-deep shadow-sm transition hover:shadow-brand-lg"
                  >
                    {h.ctaBook}
                  </Link>
                </div>
              </div>

              <div className="relative hidden bg-gradient-to-b from-white via-brand-ivory to-white lg:flex lg:min-h-[420px] lg:items-stretch lg:justify-center lg:py-12">
                <CurvedDivider className="text-brand-gold" />
              </div>

              <div className="flex justify-center bg-gradient-to-b from-white to-brand-ivory py-3 lg:hidden">
                <CurvedDivider orientation="horizontal" className="w-48" />
              </div>

              <div className="relative min-h-[380px] overflow-hidden bg-brand-forest-deep lg:min-h-[420px]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.14]"
                  style={{
                    backgroundImage: "url('/textures/world-map.svg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-forest-deep via-brand-forest-deep to-brand-forest-muted/40" />
                <div className="relative z-10 flex h-full flex-col gap-8 p-8 pb-36 sm:p-10 sm:pb-40 lg:p-12 lg:pb-44">
                  <div className="flex flex-col items-end gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <HeroQr scanLabel={h.scanHint} className="shrink-0" />
                  </div>
                  <div className="mt-auto space-y-0">
                    <IconRow icon={Phone}>
                      <a
                        href={`tel:${h.contact.phone.replace(/\s/g, "")}`}
                        className="transition hover:text-brand-gold"
                      >
                        {h.contact.phone}
                      </a>
                    </IconRow>
                    <IconRow icon={Mail}>
                      <a
                        href={`mailto:${h.contact.email}`}
                        className="break-all transition hover:text-brand-gold"
                      >
                        {h.contact.email}
                      </a>
                    </IconRow>
                    <IconRow icon={Globe}>
                      <a
                        href="https://www.josephkalinda.biz"
                        className="transition hover:text-brand-gold"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {h.contact.web}
                      </a>
                    </IconRow>
                    <IconRow icon={MapPin}>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-gold/90">
                          {h.contact.locationsLabel}
                        </p>
                        <p className="mt-1">{h.contact.locations}</p>
                      </div>
                    </IconRow>
                  </div>
                </div>
                <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-52 sm:h-48 sm:w-64 lg:h-56 lg:w-72">
                  <Image
                    src="/images/hero-plant.jpg"
                    alt="Young plant sprouting from rich soil, symbolizing agricultural growth and transformation."
                    fill
                    className="object-cover object-center opacity-95"
                    sizes="(max-width: 1024px) 200px, 288px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-deep via-brand-forest-deep/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
