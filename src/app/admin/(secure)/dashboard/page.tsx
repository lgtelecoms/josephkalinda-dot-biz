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
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
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
