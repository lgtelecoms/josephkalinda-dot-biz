import { prisma } from "@/lib/prisma";
import { withDb } from "@/lib/db-safe";
import { ContentAdminTable } from "@/components/admin/ContentAdminTable";

export default async function AdminContentPage() {
  const entries = await withDb(
    () =>
      prisma.contentEntry.findMany({
        orderBy: [{ locale: "asc" }, { key: "asc" }],
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Site content</h1>
        <p className="text-sm text-slate-600">
          CMS strings for navigation and CTAs (merged with defaults in{" "}
          <code className="rounded bg-slate-100 px-1 text-xs">src/messages</code>
          ). Seed creates starter keys; edit values here without redeploying.
        </p>
      </div>
      <ContentAdminTable entries={entries} />
    </div>
  );
}
