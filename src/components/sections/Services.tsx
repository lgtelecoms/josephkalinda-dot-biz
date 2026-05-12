"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ClipboardList,
  Package,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

const icons = [Package, TrendingUp, ClipboardList, UsersRound] as const;

type Props = {
  messages: Messages;
};

export function Services({ messages }: Props) {
  const reduce = useReducedMotion();
  const s = messages.services;

  return (
    <section
      className="border-b border-brand-gold/15 bg-white py-20 sm:py-24"
      aria-labelledby="services-heading"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="services-heading"
            title={s.title}
            subtitle={s.subtitle}
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {s.items.map((item, i) => {
            const Icon = icons[i] ?? Package;
            return (
              <Reveal key={item.key} delay={i * 0.06}>
                <motion.article
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -6, transition: { duration: 0.28 } }
                  }
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-forest-deep/10",
                    "bg-brand-ivory/80 p-6 shadow-brand backdrop-blur-sm",
                    "transition-shadow duration-300 hover:border-brand-gold/55 hover:shadow-gold"
                  )}
                >
                  <div className="mb-5 flex justify-center">
                    <div className="relative flex h-16 w-16 rotate-45 items-center justify-center rounded-xl border border-brand-gold/50 bg-white shadow-brand transition group-hover:border-brand-gold group-hover:shadow-brand-lg">
                      <Icon
                        className="-rotate-45 h-7 w-7 text-brand-forest-deep transition group-hover:text-brand-forest-muted"
                        aria-hidden
                      />
                    </div>
                  </div>
                  <h3 className="text-center font-sans text-lg font-bold text-brand-forest-deep">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-center text-sm leading-relaxed text-brand-forest-deep/75">
                    {item.description}
                  </p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
