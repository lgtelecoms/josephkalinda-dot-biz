import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

type Props = {
  locale: Locale;
  description: string;
};

export function JsonLd({ locale, description }: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Joseph Kalinda",
    description,
    url: `${SITE_URL.replace(/\/$/, "")}/${locale}`,
    areaServed: [
      "South Africa",
      "Democratic Republic of the Congo",
      "Africa",
    ],
    email: "info@josephkalinda.biz",
    telephone: "+27-61-007-8595",
    sameAs: [SITE_URL],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
