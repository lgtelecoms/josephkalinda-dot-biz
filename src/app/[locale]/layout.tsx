import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

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

export default function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const messages = getMessages(params.locale);

  return (
    <>
      <JsonLd locale={params.locale} description={messages.meta.description} />
      <SiteHeader
        locale={params.locale}
        brand={messages.header.brand}
        skipLabel={messages.header.skipToContent}
        lang={{
          en: messages.language.enShort,
          fr: messages.language.frShort,
          switchLabel: messages.language.switchTo,
        }}
      />
      {children}
    </>
  );
}
