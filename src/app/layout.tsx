import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Joseph Kalinda",
    template: "%s | Joseph Kalinda",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-pathname") ?? "/en";
  const lang = pathname.startsWith("/fr") ? "fr" : "en";

  return (
    <html
      lang={lang}
      className={`${playfair.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-brand-ivory font-sans text-brand-forest-deep antialiased">
        {children}
      </body>
    </html>
  );
}
