import { prisma } from "@/lib/prisma";
import { BookingRowActions } from "@/components/admin/BookingRowActions";
import { withDb } from "@/lib/db-safe";

export default async function AdminBookingsPage() {
  const rows = await withDb(
    () =>
      prisma.consultationBooking.findMany({
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bookings</h1>
        <p className="text-sm text-slate-600">
          Consultation requests captured from the booking flow.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                  No booking requests yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-4 py-3 text-slate-600">
                    {r.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {r.fullName}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.email}</td>
                  <td className="px-4 py-3 text-slate-700">{r.whatsapp}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {r.preferredDate.toLocaleDateString()} · {r.preferredTime}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.status}</td>
                  <td className="px-4 py-3">
                    <BookingRowActions id={r.id} status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
