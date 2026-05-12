"use client";

import type { Messages } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  messages: Messages;
};

export function Partners({ messages }: Props) {
  const p = messages.partners;
  const reduce = useReducedMotion();

  return (
    <section
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
          {p.names.map((name, i) => (
            <Reveal key={name} delay={i * 0.04}>
              <motion.div
                whileHover={
                  reduce ? undefined : { scale: 1.02, transition: { duration: 0.2 } }
                }
                className={cn(
                  "min-w-[200px] snap-center sm:min-w-0",
                  "flex h-28 items-center justify-center rounded-2xl border border-brand-forest-deep/12",
                  "bg-white/90 px-4 text-center shadow-brand backdrop-blur-sm",
                  "transition hover:border-brand-gold/60 hover:shadow-gold"
                )}
              >
                <span className="font-sans text-sm font-semibold uppercase tracking-wide text-brand-forest-deep/85">
                  {name}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
