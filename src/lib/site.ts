const DEFAULT_SITE_URL = "https://www.josephkalinda.biz";

/**
 * Resolves an absolute public site URL for metadata and links.
 * Vercel/preview often sets `NEXT_PUBLIC_SITE_URL` to "" or a bare host; both break `new URL()`.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;
  try {
    const u = new URL(candidate);
    if (!u.hostname) return DEFAULT_SITE_URL;
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return `${u.origin}${path}`;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

export const WHATSAPP_URL = "https://wa.me/27610078595";

export const EMAIL = "info@josephkalinda.biz";

export const PHONE_DISPLAY = "+27 61 007 8595";

export const socialLinks = {
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/",
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/",
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "https://www.youtube.com/",
} as const;
