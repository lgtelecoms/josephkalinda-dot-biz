import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
  /** Green pill title like the printed business card section header */
  variant?: "default" | "pill";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  dark,
  variant = "default",
}: Props) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-2 text-xs font-semibold uppercase tracking-[0.2em]",
            dark ? "text-brand-gold" : "text-brand-forest-muted"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {variant === "pill" ? (
        <h2
          id={id}
          className="inline-block max-w-full rounded-lg bg-brand-forest-deep px-4 py-2.5 text-center text-[11px] font-bold uppercase leading-snug tracking-[0.16em] text-white shadow-brand sm:px-6 sm:py-3 sm:text-xs md:text-sm"
        >
          {title}
        </h2>
      ) : (
        <h2
          id={id}
          className={cn(
            "font-sans text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl",
            dark ? "text-brand-ivory" : "text-brand-forest-deep"
          )}
        >
          {title}
        </h2>
      )}
      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-sm sm:text-base",
            dark ? "text-brand-ivory/80" : "text-brand-forest-deep/75"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
