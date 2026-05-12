"use client";

import { QRCodeSVG } from "qrcode.react";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/cn";

type Props = {
  scanLabel: string;
  className?: string;
};

export function HeroQr({ scanLabel, className }: Props) {
  return (
    <div className={cn("relative flex flex-col items-center gap-3", className)}>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-gold sm:text-xs">
        {scanLabel}
      </p>
      <div className="relative rounded-2xl border border-brand-gold/50 bg-white p-3 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)] ring-1 ring-white/60">
        <QRCodeSVG
          value={SITE_URL}
          size={132}
          level="H"
          includeMargin={false}
          className="block"
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-brand-forest-deep text-[9px] font-bold uppercase tracking-tighter text-white ring-2 ring-white">
          JK
        </div>
      </div>
      <svg
        className="absolute -left-4 top-1/2 hidden w-10 -translate-y-1/2 text-brand-gold sm:block"
        viewBox="0 0 48 48"
        aria-hidden
      >
        <path
          d="M4 40 C18 32 26 20 40 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M34 6 L42 6 L42 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
