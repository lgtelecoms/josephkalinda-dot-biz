import { getMessages } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Mission } from "@/components/sections/Mission";
import { Partners } from "@/components/sections/Partners";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getPublicPartners, getPublicServices } from "@/lib/public-data";

export const dynamic = "force-dynamic";

type Props = {
  params: { locale: "en" | "fr" };
};

export default async function HomePage({ params }: Props) {
  const messages = getMessages(params.locale);
  const [services, partners] = await Promise.all([
    getPublicServices(),
    getPublicPartners(),
  ]);

  return (
    <main id="main" className="pt-36 sm:pt-32">
      <Hero messages={messages} locale={params.locale} />
      <Services
        locale={params.locale}
        messages={messages}
        services={services}
      />
      <Mission messages={messages} />
      <Partners
        locale={params.locale}
        messages={messages}
        partners={partners}
      />
      <Contact
        locale={params.locale}
        messages={messages}
        services={services}
      />
      <Footer locale={params.locale} messages={messages} />
    </main>
  );
}
