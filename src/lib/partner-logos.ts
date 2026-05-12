/** Default logo files matching business card partners (used when DB has no logoPath). */
const DEFAULT_LOGO_BY_NAME: Record<string, string> = {
  DiaspoPass: "/images/partners/diaspopass.svg",
  "Panter Africa": "/images/partners/panter-africa.svg",
  "UPLIFT Hub": "/images/partners/uplift-hub.svg",
  "CIEL Diaspora": "/images/partners/ciel-diaspora.svg",
  "LG Telecoms": "/images/partners/lg-telecoms.svg",
  Gazify: "/images/partners/gazify.svg",
  "Swift Serve": "/images/partners/swift-serve.svg",
  CDI: "/images/partners/cdi.svg",
};

export function resolvePartnerLogoUrl(
  name: string,
  logoPath: string | null | undefined
): string | null {
  const trimmed = logoPath?.trim();
  if (trimmed) return trimmed;
  return DEFAULT_LOGO_BY_NAME[name] ?? null;
}
