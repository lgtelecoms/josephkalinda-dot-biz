import { prisma } from "@/lib/prisma";
import { ContactRowActions } from "@/components/admin/ContactRowActions";
import { withDb } from "@/lib/db-safe";

export default async function AdminContactsPage() {
  const rows = await withDb(
    () =>
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
        <p className="text-sm text-slate-600">
          Inbound inquiries from the public website contact form.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Lang</th>
              <th className="px-4 py-3">Read</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                  No contact submissions yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <td className="px-4 py-3 text-slate-600">
                    {r.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                  <td className="px-4 py-3 text-slate-700">{r.email}</td>
                  <td className="px-4 py-3 text-slate-700">{r.country}</td>
                  <td className="px-4 py-3 text-slate-700">{r.languagePref}</td>
                  <td className="px-4 py-3 text-slate-700">{r.read ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <ContactRowActions id={r.id} read={r.read} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <details
            key={`d-${r.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm"
          >
            <summary className="cursor-pointer font-semibold text-slate-900">
              Message from {r.name} — {r.email}
            </summary>
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{r.message}</p>
            {r.serviceInterest ? (
              <p className="mt-2 text-xs text-slate-500">
                Service interest: {r.serviceInterest}
              </p>
            ) : null}
          </details>
        ))}
      </div>
    </div>
  );
}
