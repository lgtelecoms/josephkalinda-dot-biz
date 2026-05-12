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
| `EMAIL_FROM`, `EMAIL_TO`, `RESEND_API_KEY` | Transactional email (see **Email** below) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Optional SMTP when not using Resend |
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
- Admin: `/admin/login` → `/admin/dashboard`, `/admin/contacts`, `/admin/bookings`, `/admin/services`, `/admin/partners`, plus **Edit** at `/admin/services/[id]` and `/admin/partners/[id]`.

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

- **Public**: `[locale]` routes, DB-driven services/partners, server actions for contact + booking forms, transactional email (Resend or SMTP).
- **HTTP API** (JSON `POST`): `/api/contact` and `/api/booking` mirror the same validation and persistence as the website forms (for integrations, Zapier, mobile apps, etc.).
- **Admin**: NextAuth credentials, JWT sessions, protected `/admin/*` (middleware), dashboards for leads and CMS toggles.
- **Content**: `ContentEntry` table for navigation labels (seeded); marketing copy fallbacks live in `src/messages/*`.

## Email delivery

1. If **`RESEND_API_KEY`** plus **`EMAIL_FROM`** and **`EMAIL_TO`** are set, mail is sent via the [Resend](https://resend.com) HTTP API.
2. Otherwise, if **`SMTP_HOST`** plus **`EMAIL_FROM`** and **`EMAIL_TO`** are set, mail is sent with **Nodemailer** (optional `SMTP_USER` / `SMTP_PASS`, default port **587**, TLS on port **465**).
3. If neither path is configured, sends are skipped (with a short log line in development).

## HTTP API (JSON)

- **`POST /api/contact`** — body must match `contactApiJsonSchema` (see `src/lib/validations.ts`): includes `consent: true`, optional `serviceId`, optional `serviceInterest` (free text when no catalog id), optional anti-spam field `website` (must be empty).
- **`POST /api/booking`** — body must match `bookingApiJsonSchema`; optional honeypot `website` (must be empty).

Responses: **`200`** `{ "ok": true }`, **`400`** invalid JSON, **`422`** validation error (with `details` when Zod fails).

## Notes

- Partner **logos**: set `Partner.logoPath` in the admin partner editor or Prisma Studio to a path under `public/` or an `https://` URL.
- **Schema migrations**: `prisma/migrations/` includes `contact_service_id` for linking contacts to services. Prefer `npm run db:migrate` in production after reviewing SQL; `db push` is fine for local iteration.
- Email sending is **skipped** when no provider env vars are configured (see server logs in development).
