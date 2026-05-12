import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export type PublicNavLabels = {
  home: string;
  services: string;
  mission: string;
  partners: string;
  contact: string;
  book: string;
};

type Props = {
  locale: Locale;
  brand: string;
  skipLabel: string;
  lang: { en: string; fr: string; switchLabel: string };
  nav: PublicNavLabels;
};

const linkClass =
  "text-sm font-medium text-brand-forest-deep/80 transition hover:text-brand-forest-deep";

export function SiteHeader({ locale, brand, skipLabel, lang, nav }: Props) {
  const base = `/${locale}`;

  const links = [
    { href: `${base}#main`, label: nav.home },
    { href: `${base}#services`, label: nav.services },
    { href: `${base}#mission`, label: nav.mission },
    { href: `${base}#partners`, label: nav.partners },
    { href: `${base}#contact`, label: nav.contact },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-brand-gold/25",
        "bg-brand-ivory/90 shadow-brand backdrop-blur-lg"
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-forest-deep focus:px-3 focus:py-2 focus:text-sm focus:text-brand-ivory"
      >
        {skipLabel}
      </a>
      <Container className="flex h-14 items-center justify-between gap-3 sm:h-16">
        <Link
          href={base}
          className="shrink-0 font-serif text-lg font-semibold tracking-tight text-brand-forest-deep sm:text-xl"
        >
          {brand}
        </Link>
        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Primary"
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`${base}/book`}
            className="hidden rounded-full border border-brand-gold/50 bg-brand-forest-deep px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-brand transition hover:bg-brand-forest-muted sm:inline-flex sm:px-4 sm:text-[11px]"
          >
            {nav.book}
          </Link>
          <LanguageToggle locale={locale} labels={lang} />
        </div>
      </Container>
      <div className="border-t border-brand-gold/15 bg-brand-ivory/95 lg:hidden">
        <Container className="flex items-center gap-3 overflow-x-auto py-2.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full border border-brand-forest-deep/10 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-forest-deep shadow-sm"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`${base}/book`}
            className="whitespace-nowrap rounded-full border border-brand-gold/50 bg-brand-forest-deep px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {nav.book}
          </Link>
        </Container>
      </div>
    </header>
  );
}
