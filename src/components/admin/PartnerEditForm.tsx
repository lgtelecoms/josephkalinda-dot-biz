"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Partner } from "@prisma/client";
import { partnerAdminFormSchema } from "@/lib/validations";
import { updatePartnerRecord, uploadPartnerLogo } from "@/server/actions";

type Props = {
  partner: Partner;
};

export function PartnerEditForm({ partner }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [uploadPending, startUpload] = useTransition();
  const [message, setMessage] = useState("");
  const [logoPath, setLogoPath] = useState(partner.logoPath ?? "");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setLogoPath(partner.logoPath ?? "");
  }, [partner.logoPath]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get("name"),
      logoPath: fd.get("logoPath"),
      websiteUrl: fd.get("websiteUrl"),
      descriptionEn: fd.get("descriptionEn"),
      descriptionFr: fd.get("descriptionFr"),
      sortOrder: fd.get("sortOrder"),
      active: fd.get("active"),
    };
    const parsed = partnerAdminFormSchema.safeParse(raw);
    if (!parsed.success) {
      setMessage("Please check all fields (website must be a valid URL or empty).");
      return;
    }
    start(async () => {
      try {
        await updatePartnerRecord(partner.id, {
          name: parsed.data.name,
          logoPath: parsed.data.logoPath ?? null,
          websiteUrl: parsed.data.websiteUrl ?? null,
          descriptionEn: parsed.data.descriptionEn ?? null,
          descriptionFr: parsed.data.descriptionFr ?? null,
          sortOrder: parsed.data.sortOrder,
          active: parsed.data.active,
        });
        setMessage("Saved.");
        router.refresh();
      } catch {
        setMessage("Could not save.");
      }
    });
  }

  function onUploadClick() {
    if (!file) {
      setMessage("Choose a PNG, JPEG, or WebP file first.");
      return;
    }
    setMessage("");
    const fd = new FormData();
    fd.set("file", file);
    startUpload(async () => {
      const res = await uploadPartnerLogo(fd);
      if (res.ok) {
        setLogoPath(res.path);
        setFile(null);
        setMessage("Logo uploaded — click Save changes to persist on the partner record.");
      } else {
        setMessage(res.error);
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {message ? (
        <p className="text-sm font-medium text-slate-700" role="status">
          {message}
        </p>
      ) : null}
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input
          name="name"
          required
          defaultValue={partner.name}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>

      <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-medium text-slate-800">Partner logo</p>
        <p className="mt-1 text-xs text-slate-600">
          Upload PNG, JPEG, or WebP (max 2 MB). Files are stored under{" "}
          <code className="rounded bg-white px-1">/public/uploads/partners/</code>.
          On serverless hosts without a persistent disk, prefer an external URL in
          the path field instead.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <button
            type="button"
            disabled={uploadPending}
            onClick={onUploadClick}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            {uploadPending ? "Uploading…" : "Upload file"}
          </button>
        </div>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Logo path (auto-filled after upload, or paste a URL)
          <input
            name="logoPath"
            value={logoPath}
            onChange={(e) => setLogoPath(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Website URL
        <input
          name="websiteUrl"
          placeholder="https://"
          defaultValue={partner.websiteUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description (EN)
        <textarea
          name="descriptionEn"
          rows={3}
          defaultValue={partner.descriptionEn ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description (FR)
        <textarea
          name="descriptionFr"
          rows={3}
          defaultValue={partner.descriptionFr ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Sort order
          <input
            name="sortOrder"
            type="number"
            required
            min={0}
            max={999}
            defaultValue={partner.sortOrder}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Visibility
          <select
            name="active"
            defaultValue={partner.active ? "true" : "false"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="true">Active on website</option>
            <option value="false">Hidden</option>
          </select>
        </label>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
