import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Props = {
  locale: Locale;
  brand: string;
  skipLabel: string;
  lang: { en: string; fr: string; switchLabel: string };
};

export function SiteHeader({ locale, brand, skipLabel, lang }: Props) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-brand-gold/25",
        "bg-brand-ivory/85 shadow-brand backdrop-blur-md"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-forest-deep focus:px-3 focus:py-2 focus:text-sm focus:text-brand-ivory"
      >
        {skipLabel}
      </a>
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <Link
          href={`/${locale}`}
          className="font-serif text-lg font-semibold tracking-tight text-brand-forest-deep sm:text-xl"
        >
          {brand}
        </Link>
        <LanguageToggle locale={locale} labels={lang} />
      </Container>
    </header>
  );
}
