import { Facebook, Linkedin, Youtube } from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { socialLinks } from "@/lib/site";
import { Container } from "@/components/ui/Container";

type Props = {
  messages: Messages;
};

export function Footer({ messages }: Props) {
  const f = messages.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-gold/25 bg-brand-forest-deep py-12 text-brand-ivory">
      <Container>
        <div className="flex flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-serif text-lg text-brand-gold">{f.tagline}</p>
            <p className="mt-2 text-sm text-brand-ivory/75">
              © {year} Joseph Kalinda · josephkalinda.biz
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold/90">
              {f.socialLabel}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-brand-gold hover:text-brand-gold"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-brand-ivory/80">{f.socialHandle}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
