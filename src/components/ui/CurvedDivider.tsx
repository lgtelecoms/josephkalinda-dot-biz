import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  orientation?: "vertical" | "horizontal";
};

export function CurvedDivider({
  className,
  orientation = "vertical",
}: Props) {
  if (orientation === "horizontal") {
    return (
      <div
        className={cn("relative h-8 w-full text-brand-gold", className)}
        aria-hidden
      >
        <svg
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 16 C60 4 140 28 200 16 C260 4 340 28 400 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[280px] w-8 shrink-0 items-stretch justify-center sm:w-10",
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        className="h-full min-h-[280px] w-full text-brand-gold"
      >
        <path
          d="M22 0 C6 90 34 180 22 200 C10 220 34 310 18 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
