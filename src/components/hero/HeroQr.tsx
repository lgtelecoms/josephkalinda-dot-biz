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
    <div className={cn("relative flex flex-col items-center gap-2", className)}>
      <p className="font-serif text-lg italic text-brand-gold sm:text-xl">
        {scanLabel}
      </p>
      <div className="relative rounded-2xl border-2 border-brand-gold/60 bg-white p-3 shadow-brand-lg">
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
