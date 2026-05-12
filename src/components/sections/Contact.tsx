"use client";

import { Mail, MapPin, MessageCircle, Globe } from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { EMAIL, WHATSAPP_URL, SITE_URL } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  messages: Messages;
};

export function Contact({ messages }: Props) {
  const c = messages.contact;
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      className="bg-white py-20 sm:py-24"
      aria-labelledby="contact-heading"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="contact-heading"
            title={c.title}
            subtitle={c.subtitle}
          />
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal delay={0.05}>
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { y: -4 }}
              className={cn(
                "flex flex-col justify-between rounded-2xl border border-brand-gold/45 bg-brand-forest-deep p-6 text-brand-ivory shadow-brand-lg",
                "transition hover:shadow-gold"
              )}
            >
              <MessageCircle className="h-8 w-8 text-brand-gold" aria-hidden />
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold/90">
                  WhatsApp
                </p>
                <p className="mt-2 font-semibold">{c.whatsappCta}</p>
              </div>
            </motion.a>
          </Reveal>
          <Reveal delay={0.1}>
            <motion.a
              href={`mailto:${EMAIL}`}
              whileHover={reduce ? undefined : { y: -4 }}
              className={cn(
                "flex flex-col justify-between rounded-2xl border border-brand-forest-deep/12 bg-brand-ivory/90 p-6 shadow-brand",
                "transition hover:border-brand-gold/50 hover:shadow-brand-lg"
              )}
            >
              <Mail className="h-8 w-8 text-brand-forest-deep" aria-hidden />
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-forest-muted">
                  Email
                </p>
                <p className="mt-2 font-semibold text-brand-forest-deep">
                  {c.emailCta}
                </p>
                <p className="mt-1 text-sm text-brand-forest-deep/70">{EMAIL}</p>
              </div>
            </motion.a>
          </Reveal>
          <Reveal delay={0.15}>
            <motion.a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              whileHover={reduce ? undefined : { y: -4 }}
              className={cn(
                "flex flex-col justify-between rounded-2xl border border-brand-forest-deep/12 bg-brand-ivory/90 p-6 shadow-brand",
                "transition hover:border-brand-gold/50 hover:shadow-brand-lg"
              )}
            >
              <Globe className="h-8 w-8 text-brand-forest-deep" aria-hidden />
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-forest-muted">
                  Web
                </p>
                <p className="mt-2 font-semibold text-brand-forest-deep">
                  {c.webCta}
                </p>
                <p className="mt-1 text-sm text-brand-forest-deep/70">
                  www.josephkalinda.biz
                </p>
              </div>
            </motion.a>
          </Reveal>
        </div>
        <Reveal delay={0.08}>
          <div className="mt-10 rounded-2xl border border-brand-forest-deep/10 bg-brand-ivory/60 p-6 shadow-brand backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3 text-brand-forest-deep">
              <MapPin className="h-6 w-6 shrink-0 text-brand-gold" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-forest-muted">
                  {c.citiesTitle}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.cities.map((city) => (
                    <li
                      key={city}
                      className="rounded-full border border-brand-gold/35 bg-white/80 px-3 py-1 text-xs font-medium text-brand-forest-deep shadow-sm sm:text-sm"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
