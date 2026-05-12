import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withDb } from "@/lib/db-safe";
import { PartnerEditForm } from "@/components/admin/PartnerEditForm";

type Props = { params: { id: string } };

export default async function AdminPartnerEditPage({ params }: Props) {
  const partner = await withDb(
    () => prisma.partner.findUnique({ where: { id: params.id } }),
    null
  );

  if (!partner) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit partner</h1>
          <p className="text-sm text-slate-600">{partner.name}</p>
        </div>
        <Link
          href="/admin/partners"
          className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
        >
          ← All partners
        </Link>
      </div>
      <PartnerEditForm
        partner={partner}
        blobStorage={Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())}
      />
    </div>
  );
}
