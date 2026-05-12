import { Great_Vibes } from "next/font/google";
import { cn } from "@/lib/cn";

const kalindaScript = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

type Props = {
  headingId: string;
  tagline: string;
  className?: string;
};

/**
 * Card-style lockup: bordered nameplate, script surname, integrated tagline bar (matches business card).
 */
export function BrandSign({ headingId, tagline, className }: Props) {
  return (
    <div
      className={cn(
        "inline-block border-2 border-brand-forest-deep shadow-[0_12px_40px_-16px_rgba(6,51,33,0.18)]",
        className
      )}
    >
      <div className="bg-white px-6 py-4 sm:px-8 sm:py-5">
        <h1
          id={headingId}
          className="flex flex-wrap items-end justify-center gap-x-3 gap-y-1 sm:justify-start"
        >
          <span className="font-serif text-[2.1rem] font-semibold leading-none tracking-tight text-brand-forest-deep sm:text-[2.65rem] md:text-[2.85rem]">
            Joseph
          </span>
          <span
            className={`${kalindaScript.className} text-[2.35rem] leading-none text-brand-forest-deep sm:text-[2.85rem] md:text-[3.1rem]`}
          >
            Kalinda
          </span>
        </h1>
      </div>
      <div className="border-t-2 border-brand-forest-deep bg-brand-forest-deep px-4 py-2.5 text-center sm:px-6 sm:py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs md:text-sm">
          {tagline}
        </p>
      </div>
    </div>
  );
}
