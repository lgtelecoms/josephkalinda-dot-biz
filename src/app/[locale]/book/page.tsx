import { getMessages } from "@/lib/i18n";
import { BookingForm } from "@/components/forms/BookingForm";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: { locale: "en" | "fr" } };

export function generateMetadata({ params }: Props): Metadata {
  const m = getMessages(params.locale);
  return {
    title: `${m.forms.booking.title} | Joseph Kalinda`,
    description: m.forms.booking.subtitle,
  };
}

export default function BookConsultationPage({ params }: Props) {
  const messages = getMessages(params.locale);
  return (
    <main className="border-t border-brand-gold/10 bg-brand-ivory pb-24 pt-36">
      <Container>
        <BookingForm locale={params.locale} messages={messages} />
      </Container>
    </main>
  );
}
