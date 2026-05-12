import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { withDb } from "@/lib/db-safe";
import { ServiceEditForm } from "@/components/admin/ServiceEditForm";

type Props = { params: { id: string } };

export default async function AdminServiceEditPage({ params }: Props) {
  const service = await withDb(
    () => prisma.service.findUnique({ where: { id: params.id } }),
    null
  );

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit service</h1>
          <p className="text-sm text-slate-600">{service.titleEn}</p>
        </div>
        <Link
          href="/admin/services"
          className="text-sm font-semibold text-slate-700 underline-offset-4 hover:underline"
        >
          ← All services
        </Link>
      </div>
      <ServiceEditForm service={service} />
    </div>
  );
}
