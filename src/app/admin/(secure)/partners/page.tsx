import { prisma } from "@/lib/prisma";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { withDb } from "@/lib/db-safe";

export default async function AdminPartnersPage() {
  const rows = await withDb(
    () =>
      prisma.partner.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Partners</h1>
        <p className="text-sm text-slate-600">
          Partner tiles on the public site. Upload logo paths via database tools
          for now.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order {p.sortOrder}
                </p>
                <p className="font-semibold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">
                  Logo: {p.logoPath ?? "—"} · Site: {p.websiteUrl ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  {p.active ? "Active" : "Hidden"}
                </span>
                <ToggleActiveButton id={p.id} active={p.active} kind="partner" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
