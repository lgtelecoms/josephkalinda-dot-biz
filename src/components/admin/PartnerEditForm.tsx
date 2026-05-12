"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Partner } from "@prisma/client";
import { partnerAdminFormSchema } from "@/lib/validations";
import { updatePartnerRecord } from "@/server/actions";

type Props = {
  partner: Partner;
};

export function PartnerEditForm({ partner }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");

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
      <label className="block text-sm font-medium text-slate-700">
        Logo path (e.g. /partners/logo.svg or https://…)
        <input
          name="logoPath"
          defaultValue={partner.logoPath ?? ""}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
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
