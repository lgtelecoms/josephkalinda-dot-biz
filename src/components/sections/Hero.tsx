import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Calendar,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Target,
} from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { WHATSAPP_URL } from "@/lib/site";
import { BrandSign } from "@/components/hero/BrandSign";
import { HeroQr } from "@/components/hero/HeroQr";
import { MissionStatement } from "@/components/mission/MissionStatement";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  messages: Messages;
  locale: "en" | "fr";
};

function ContactBlock({
  icon: Icon,
  children,
}: {
  icon: typeof Phone;
  children: ReactNode;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-3 backdrop-blur-sm transition hover:border-brand-gold/35 hover:bg-white/[0.1]">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/20 text-brand-gold ring-1 ring-white/10">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 text-sm leading-snug text-white/[0.92]">
        {children}
      </div>
    </div>
  );
}

export function Hero({ messages, locale }: Props) {
  const h = messages.hero;
  const base = `/${locale}`;
  const waLabel = messages.contact.whatsappCta;

  return (
    <section
      className="relative overflow-hidden border-b border-brand-gold/25 bg-gradient-to-b from-brand-ivory via-white to-brand-ivory/95 pb-20 pt-24 sm:pb-28 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand-gold/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-brand-forest-deep/[0.05] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-brand-forest-deep/10 bg-white shadow-[0_28px_90px_-34px_rgba(6,51,33,0.22)] ring-1 ring-brand-forest-deep/[0.05]">
            <div className="grid lg:grid-cols-12">
              <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:col-span-7 lg:border-r lg:border-brand-gold/20 lg:px-12 lg:py-16 xl:px-14">
                <div
                  className="absolute left-0 top-0 h-1 w-24 bg-gradient-to-r from-brand-gold to-transparent sm:w-36"
                  aria-hidden
                />

                <BrandSign
                  headingId="hero-heading"
                  tagline={h.tagline}
                  className="mx-auto sm:mx-0"
                />

                <div className="mx-auto mt-10 max-w-xl text-center sm:mx-0 sm:mt-12 sm:text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-forest-muted">
                    {h.firmLine1}
                  </p>
                  <h2 className="mt-3 font-serif text-[1.65rem] font-semibold leading-[1.12] tracking-tight text-brand-forest-deep sm:text-3xl md:text-[2.2rem]">
                    <span className="relative inline-block">
                      <span className="relative z-0">{h.firmHighlight}</span>
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-brand-gold"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-2 block font-sans text-[0.95rem] font-medium normal-case leading-snug tracking-normal text-brand-forest-muted sm:text-lg">
                      {h.firmLine2}
                    </span>
                  </h2>
                </div>

                <div className="mx-auto mt-9 w-full max-w-xl rounded-2xl border border-brand-forest-deep/[0.08] bg-gradient-to-br from-brand-ivory/90 to-white/80 p-5 shadow-inner sm:mx-0 sm:mt-10 sm:p-6">
                  <div className="flex gap-3.5 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-forest-deep text-brand-gold shadow-md shadow-brand-forest-deep/20">
                      <Target className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-forest-muted">
                        {h.missionEyebrow}
                      </p>
                      <div className="mt-2">
                        <MissionStatement
                          messages={messages}
                          tone="onLight"
                          compact
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-9 flex w-full max-w-xl flex-col gap-3 sm:mx-0 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link
                    href={`${base}/book`}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-forest-deep px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-brand-forest-deep/25 transition hover:bg-brand-forest-muted sm:flex-initial sm:min-w-[12rem] sm:px-6 sm:text-xs"
                  >
                    <Calendar className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                    {h.ctaBook}
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                  </Link>
                  <Link
                    href={`${base}#contact`}
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-brand-forest-deep/18 bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest-deep transition hover:border-brand-gold/45 hover:bg-brand-ivory sm:flex-initial sm:min-w-[9.5rem] sm:text-xs"
                  >
                    {h.ctaContact}
                  </Link>
                  <Link
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-brand-gold/40 bg-brand-ivory/90 px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest-deep transition hover:border-brand-gold/60 hover:bg-white sm:flex-initial sm:min-w-[10.75rem] sm:text-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {waLabel}
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[440px] flex-col bg-brand-forest-deep lg:col-span-5 lg:min-h-[520px]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.11]"
                  style={{
                    backgroundImage: "url('/textures/world-map.svg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-forest-deep via-brand-forest-deep to-[#041f16]" />

                <div className="relative z-10 flex flex-1 flex-col p-8 pb-44 sm:p-10 sm:pb-48 lg:p-11 lg:pb-52 xl:p-12">
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between lg:gap-6">
                    <div className="max-w-xs text-center sm:max-w-[13rem] sm:text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold/90">
                        {h.panelEyebrow}
                      </p>
                      <p className="mt-2 font-serif text-lg leading-snug text-brand-ivory/95 sm:text-xl">
                        {messages.header.brand}
                      </p>
                    </div>
                    <HeroQr scanLabel={h.scanHint} className="shrink-0 sm:pt-0.5" />
                  </div>

                  <div className="mt-10 flex flex-col gap-2.5 sm:mt-12">
                    <ContactBlock icon={Phone}>
                      <a
                        href={`tel:${h.contact.phone.replace(/\s/g, "")}`}
                        className="block font-medium text-white transition hover:text-brand-gold"
                      >
                        {h.contact.phone}
                      </a>
                    </ContactBlock>
                    <ContactBlock icon={Mail}>
                      <a
                        href={`mailto:${h.contact.email}`}
                        className="block break-words font-medium text-white transition hover:text-brand-gold"
                      >
                        {h.contact.email}
                      </a>
                    </ContactBlock>
                    <ContactBlock icon={Globe}>
                      <a
                        href="https://www.josephkalinda.biz"
                        className="block font-medium text-white transition hover:text-brand-gold"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {h.contact.web}
                      </a>
                    </ContactBlock>
                    <ContactBlock icon={MapPin}>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold/90">
                          {h.contact.locationsLabel}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-white/90">
                          {h.contact.locations}
                        </p>
                      </div>
                    </ContactBlock>
                  </div>
                </div>

                <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-52 sm:h-52 sm:w-60 lg:h-64 lg:w-72">
                  <Image
                    src="/images/hero-plant.jpg"
                    alt="Young plant sprouting from rich soil, symbolizing agricultural growth and transformation."
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 220px, 288px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-deep via-brand-forest-deep/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-forest-deep/90 via-brand-forest-deep/35 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
