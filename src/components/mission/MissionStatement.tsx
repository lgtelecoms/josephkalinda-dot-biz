import type { Messages } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Tone = "onLight" | "onDark";

type Props = {
  messages: Messages;
  tone: Tone;
  compact?: boolean;
  id?: string;
  className?: string;
};

export function MissionStatement({
  messages,
  tone,
  compact,
  id,
  className,
}: Props) {
  const m = messages.missionSection;

  return (
    <p
      id={id}
      className={cn(
        "text-balance leading-relaxed",
        compact ? "text-sm sm:text-base" : "text-lg sm:text-xl",
        tone === "onDark" ? "text-brand-ivory/95" : "text-brand-forest-deep/90",
        className
      )}
    >
      <strong
        className={cn(
          tone === "onDark" ? "text-brand-gold" : "text-brand-forest-deep"
        )}
      >
        {m.openingLine}
      </strong>{" "}
      {m.lead}{" "}
      <strong className="font-semibold text-brand-gold">{m.emphasis1}</strong>{" "}
      {m.mid}{" "}
      <strong className="font-semibold text-brand-gold">{m.emphasis2}</strong>
      {m.comma1}{" "}
      <strong className="font-semibold text-brand-gold">{m.emphasis3}</strong>{" "}
      {m.comma2}{" "}
      <strong className="font-semibold text-brand-gold">{m.emphasis4}</strong>
      {m.end}
    </p>
  );
}
