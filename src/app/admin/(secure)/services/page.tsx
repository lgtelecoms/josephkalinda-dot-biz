import { prisma } from "@/lib/prisma";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { withDb } from "@/lib/db-safe";

export default async function AdminServicesPage() {
  const rows = await withDb(
    () =>
      prisma.service.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Services</h1>
        <p className="text-sm text-slate-600">
          Control which services appear on the public website.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order {s.sortOrder} · Icon {s.iconName}
                </p>
                <p className="font-semibold text-slate-900">{s.titleEn}</p>
                <p className="text-sm text-slate-600">{s.titleFr}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">
                  {s.active ? "Active" : "Hidden"}
                </span>
                <ToggleActiveButton id={s.id} active={s.active} kind="service" />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-xs text-slate-600">
              {s.descriptionEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
