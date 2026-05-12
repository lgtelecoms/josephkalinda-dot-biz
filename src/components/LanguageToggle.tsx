"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const COOKIE = "NEXT_LOCALE";
const STORAGE = "NEXT_LOCALE";

type Props = {
  locale: Locale;
  labels: { en: string; fr: string; switchLabel: string };
};

export function LanguageToggle({ locale, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      const nextPath = pathname.replace(/^\/(en|fr)/, `/${next}`);
      document.cookie = `${COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
      try {
        localStorage.setItem(STORAGE, next);
      } catch {
        /* ignore */
      }
      router.replace(nextPath || `/${next}`);
    },
    [locale, pathname, router]
  );

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-brand-gold/40 bg-white/60 p-1 shadow-brand backdrop-blur-sm"
      role="group"
      aria-label={labels.switchLabel}
    >
      {(["en", "fr"] as const).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className={cn(
              "relative min-w-[2.75rem] rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
              active
                ? "text-brand-forest-deep"
                : "text-brand-forest-deep/55 hover:text-brand-forest-deep"
            )}
          >
            {active && !reduce ? (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-brand-gold/35 shadow-inner"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : active ? (
              <span className="absolute inset-0 rounded-full bg-brand-gold/35 shadow-inner" />
            ) : null}
            <span className="relative z-10">
              {code === "en" ? labels.en : labels.fr}
            </span>
          </button>
        );
      })}
    </div>
  );
}
