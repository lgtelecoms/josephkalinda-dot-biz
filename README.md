# Joseph Kalinda — josephkalinda.biz

Full-stack multilingual marketing and lead platform for **Joseph Kalinda** (Next.js 14, TypeScript, Tailwind, Framer Motion, Prisma, PostgreSQL, NextAuth).

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Environment

Copy `.env.example` to `.env` and fill values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret (32+ chars) for JWT signing |
| `NEXTAUTH_URL` | Public site URL (e.g. `http://localhost:3000`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin user (used by `prisma db seed`) |
| `EMAIL_FROM`, `EMAIL_TO`, `RESEND_API_KEY` | Optional transactional email via [Resend](https://resend.com) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and QR codes |

## Setup

```bash
npm install
cp .env.example .env
# edit .env — set DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_*

npx prisma db push
npm run db:seed
```

For migration-based workflows you can use `npm run db:migrate` instead of `db push` once you configure migrations locally.

## Development

```bash
npm run dev
```

- Public site: `/` redirects to `/en` or `/fr` (cookie `NEXT_LOCALE`).
- Consultation booking: `/en/book`, `/fr/book`.
- Admin: `/admin/login` → `/admin/dashboard`, `/admin/contacts`, `/admin/bookings`, `/admin/services`, `/admin/partners`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Create/apply dev migrations |
| `npm run db:seed` | Seed admin, services, partners, navigation content |
| `npm run db:studio` | Prisma Studio |

## Architecture (high level)

- **Public**: `[locale]` routes, DB-driven services/partners, server actions for contact + booking forms, Resend-ready email notifications.
- **Admin**: NextAuth credentials, JWT sessions, protected `/admin/*` (middleware), dashboards for leads and CMS toggles.
- **Content**: `ContentEntry` table for navigation labels (seeded); marketing copy fallbacks live in `src/messages/*`.

## Notes

- Partner **logos**: set `Partner.logoPath` to a path under `public/` (e.g. `/partners/diaspopass.svg`) or an `https://` URL.
- Service **editing**: admin UI supports activate/deactivate; full inline editing of titles/descriptions can be added later or via Prisma Studio.
- Email sending is **skipped** in development when Resend env vars are missing (see server logs).
