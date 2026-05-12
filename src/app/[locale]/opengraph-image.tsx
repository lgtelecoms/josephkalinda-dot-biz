import { ImageResponse } from "next/og";
import { getMessages, isLocale, type Locale } from "@/lib/i18n";

export const alt = "Joseph Kalinda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : "en";
  const m = getMessages(locale);
  const tagline = m.hero.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 56,
          background: "linear-gradient(135deg, #063321 0%, #0a4a36 55%, #063321 100%)",
          color: "#faf9f6",
        }}
      >
        <div
          style={{
            height: 4,
            width: 120,
            background: "#c5a059",
            marginBottom: 36,
          }}
        />
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1,
            fontFamily: "Georgia, serif",
          }}
        >
          Joseph Kalinda
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 26,
            fontWeight: 600,
            color: "#c5a059",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 20,
            maxWidth: 900,
            lineHeight: 1.45,
            color: "rgba(250,249,246,0.88)",
          }}
        >
          {m.meta.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
