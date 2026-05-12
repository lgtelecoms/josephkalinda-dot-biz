export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.josephkalinda.biz";

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
