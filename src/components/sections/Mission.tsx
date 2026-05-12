import { Target } from "lucide-react";
import type { Messages } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  messages: Messages;
};

export function Mission({ messages }: Props) {
  const m = messages.missionSection;

  return (
    <section
      className="relative overflow-hidden border-b border-brand-gold/20 bg-gradient-to-br from-brand-forest-deep via-brand-forest-deep to-brand-forest-muted py-20 sm:py-24"
      aria-labelledby="mission-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "url('/textures/world-map.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Container className="relative z-10">
        <Reveal>
          <div className="mx-auto max-w-4xl rounded-3xl border border-brand-gold/35 bg-white/5 p-8 shadow-brand-lg backdrop-blur-md sm:p-12 lg:p-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/50 bg-brand-forest-deep/60 text-brand-gold">
                <Target className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                  {m.eyebrow}
                </p>
                <h2
                  id="mission-heading"
                  className="mt-2 font-serif text-2xl font-semibold text-brand-ivory sm:text-3xl"
                >
                  {m.title}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-brand-ivory/95 sm:text-xl">
                  {m.lead}{" "}
                  <strong className="font-semibold text-brand-gold">
                    {m.emphasis1}
                  </strong>{" "}
                  {m.mid}{" "}
                  <strong className="font-semibold text-brand-gold">
                    {m.emphasis2}
                  </strong>
                  {m.comma1}{" "}
                  <strong className="font-semibold text-brand-gold">
                    {m.emphasis3}
                  </strong>{" "}
                  {m.comma2}{" "}
                  <strong className="font-semibold text-brand-gold">
                    {m.emphasis4}
                  </strong>
                  {m.end}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
