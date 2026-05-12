"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@prisma/client";
import { serviceAdminFormSchema } from "@/lib/validations";
import { ALLOWED_SERVICE_ICONS } from "@/lib/constants";
import { updateServiceRecord } from "@/server/actions";

type Props = {
  service: Service;
};

export function ServiceEditForm({ service }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const raw = {
      titleEn: fd.get("titleEn"),
      titleFr: fd.get("titleFr"),
      descriptionEn: fd.get("descriptionEn"),
      descriptionFr: fd.get("descriptionFr"),
      iconName: fd.get("iconName"),
      sortOrder: fd.get("sortOrder"),
      active: fd.get("active"),
    };
    const parsed = serviceAdminFormSchema.safeParse(raw);
    if (!parsed.success) {
      setMessage("Please check all fields.");
      return;
    }
    start(async () => {
      try {
        await updateServiceRecord(service.id, parsed.data);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title (EN)
          <input
            name="titleEn"
            required
            defaultValue={service.titleEn}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Title (FR)
          <input
            name="titleFr"
            required
            defaultValue={service.titleFr}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Description (EN)
        <textarea
          name="descriptionEn"
          required
          rows={5}
          defaultValue={service.descriptionEn}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description (FR)
        <textarea
          name="descriptionFr"
          required
          rows={5}
          defaultValue={service.descriptionFr}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Icon
          <select
            name="iconName"
            required
            defaultValue={service.iconName}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {ALLOWED_SERVICE_ICONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sort order
          <input
            name="sortOrder"
            type="number"
            required
            min={0}
            max={999}
            defaultValue={service.sortOrder}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Visibility
        <select
          name="active"
          defaultValue={service.active ? "true" : "false"}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="true">Active on website</option>
          <option value="false">Hidden</option>
        </select>
      </label>
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
