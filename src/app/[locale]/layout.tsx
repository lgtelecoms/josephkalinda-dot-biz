import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";
import { SiteHeader, type PublicNavLabels } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { getContentMap, pickContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) {
    return {};
  }
  const m = getMessages(params.locale);
  const base = SITE_URL.replace(/\/$/, "");

  return {
    title: m.meta.title,
    description: m.meta.description,
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        en: `${base}/en`,
        fr: `${base}/fr`,
        "x-default": `${base}/en`,
      },
    },
    openGraph: {
      title: m.meta.title,
      description: m.meta.description,
      url: `/${params.locale}`,
      siteName: "Joseph Kalinda",
      locale: m.meta.ogLocale,
      type: "website",
      images: [
        {
          url: `/${params.locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Joseph Kalinda",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.meta.title,
      description: m.meta.description,
      images: [`/${params.locale}/opengraph-image`],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale as Locale;
  const messages = getMessages(locale);
  const content = await getContentMap(locale);

  const nav: PublicNavLabels = {
    home: pickContent(content, "nav_home", messages.nav.home),
    services: pickContent(content, "nav_services", messages.nav.services),
    mission: pickContent(content, "nav_mission", messages.nav.mission),
    partners: pickContent(content, "nav_partners", messages.nav.partners),
    contact: pickContent(content, "nav_contact", messages.nav.contact),
    book: pickContent(content, "cta_book", messages.nav.book),
  };

  return (
    <>
      <JsonLd locale={locale} description={messages.meta.description} />
      <SiteHeader
        locale={locale}
        brand={messages.header.brand}
        skipLabel={messages.header.skipToContent}
        lang={{
          en: messages.language.enShort,
          fr: messages.language.frShort,
          switchLabel: messages.language.switchTo,
        }}
        nav={nav}
      />
      {children}
    </>
  );
}
