import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  dark,
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
      <h2
        id={id}
        className={cn(
          "font-sans text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl",
          dark ? "text-brand-ivory" : "text-brand-forest-deep"
        )}
      >
        {title}
      </h2>
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
