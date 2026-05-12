import { getMessages } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Mission } from "@/components/sections/Mission";
import { Partners } from "@/components/sections/Partners";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

type Props = {
  params: { locale: "en" | "fr" };
};

export default function HomePage({ params }: Props) {
  const messages = getMessages(params.locale);

  return (
    <main id="main" className="pt-14 sm:pt-16">
      <Hero messages={messages} />
      <Services messages={messages} />
      <Mission messages={messages} />
      <Partners messages={messages} />
      <Contact messages={messages} />
      <Footer messages={messages} />
    </main>
  );
}
