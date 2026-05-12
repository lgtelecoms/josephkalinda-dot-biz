# Joseph Kalinda — josephkalinda.biz

Premium one-page multilingual marketing site (English / French) for Joseph Kalinda, built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Lucide**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — `/` redirects to `/en` or `/fr` based on the `NEXT_LOCALE` cookie (set when you use the language toggle; default **English**).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (default `https://www.josephkalinda.biz`) for metadata, QR code, and JSON-LD. |
| `NEXT_PUBLIC_FACEBOOK_URL` | Optional footer Facebook link (fallback generic URL). |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional footer LinkedIn link. |
| `NEXT_PUBLIC_YOUTUBE_URL` | Optional footer YouTube link. |

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build  
- `npm run start` — serve production build  
- `npm run lint` — ESLint  

## Social previews

Localized Open Graph images are generated at `/{locale}/opengraph-image` (see `src/app/[locale]/opengraph-image.tsx`). Metadata references these for Open Graph and Twitter cards.

- `src/app/[locale]/` — localized home (`en`, `fr`)  
- `src/messages/` — copy for each locale  
- `src/components/sections/` — Hero, Services, Mission, Partners, Contact, Footer  
- `middleware.ts` — `/` → preferred locale; forwards `x-pathname` for `<html lang>`  

Partner tiles use typography until logo assets are added under `public/partners/`.
