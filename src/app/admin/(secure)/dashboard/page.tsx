import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { withDb } from "@/lib/db-safe";

export default async function AdminDashboardPage() {
  const [contacts, bookings, services, partners] = await withDb(
    () =>
      Promise.all([
        prisma.contactSubmission.count(),
        prisma.consultationBooking.count(),
        prisma.service.count(),
        prisma.partner.count(),
      ]),
    [0, 0, 0, 0]
  );

  const recentContacts = await withDb(
    () =>
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    []
  );

  const contactByInterest = await withDb(
    () =>
      prisma.contactSubmission.groupBy({
        by: ["serviceInterest"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 8,
      }),
    []
  );

  const bookingsByStatus = await withDb(
    () =>
      prisma.consultationBooking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
    []
  );

  const statusOrder = [
    "PENDING",
    "CONTACTED",
    "COMPLETED",
    "CANCELLED",
  ] as const;
  const bookingRows = [...bookingsByStatus].sort(
    (a, b) =>
      statusOrder.indexOf(a.status as (typeof statusOrder)[number]) -
      statusOrder.indexOf(b.status as (typeof statusOrder)[number])
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Overview of inbound interest and published content.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Contact submissions", value: contacts, href: "/admin/contacts" },
          { label: "Consultation requests", value: bookings, href: "/admin/bookings" },
          { label: "Services", value: services, href: "/admin/services" },
          { label: "Partners", value: partners, href: "/admin/partners" },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Contact — service interest
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Grouped by stored interest label (from form or linked service title).
          </p>
          {contactByInterest.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No data yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {contactByInterest.map((row) => (
                <li
                  key={row.serviceInterest ?? "__null__"}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="truncate text-slate-700">
                    {row.serviceInterest ?? "(Not specified)"}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                    {row._count.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Bookings — by status
          </h2>
          {bookingRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No bookings yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {bookingRows.map((row) => (
                <li
                  key={row.status}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="text-slate-700">{row.status}</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {row._count.id}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Latest contacts</h2>
          <Link
            href="/admin/contacts"
            className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {recentContacts.length === 0 ? (
            <li className="py-6 text-sm text-slate-500">No submissions yet.</li>
          ) : (
            recentContacts.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <span className="font-medium text-slate-900">{r.name}</span>
                <span className="text-slate-600">{r.email}</span>
                <span className="text-xs text-slate-400">
                  {r.createdAt.toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
