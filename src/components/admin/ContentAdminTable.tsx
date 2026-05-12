"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createContentEntryRecord,
  updateContentEntryValue,
} from "@/server/actions";

type Entry = { id: string; key: string; locale: string; value: string };

export function ContentAdminTable({ entries }: { entries: Entry[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {message ? (
        <p className="text-sm font-medium text-slate-700" role="status">
          {message}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3 w-28"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No content entries. Run the seed script or add one below.
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <ContentRow
                  key={e.id}
                  entry={e}
                  disabled={pending}
                  onSave={(value) => {
                    setMessage(null);
                    start(async () => {
                      const res = await updateContentEntryValue(e.id, value);
                      if (res.ok) {
                        setMessage("Saved.");
                        router.refresh();
                      } else {
                        setMessage(res.error ?? "Save failed.");
                      }
                    });
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add or overwrite</h2>
        <p className="mt-1 text-xs text-slate-500">
          Keys like <code className="rounded bg-slate-100 px-1">nav_home</code>. Upserts
          if the key + locale pair already exists.
        </p>
        <NewEntryForm
          disabled={pending}
          onDone={(msg) => {
            setMessage(msg);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}

function ContentRow({
  entry,
  disabled,
  onSave,
}: {
  entry: Entry;
  disabled: boolean;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(entry.value);

  useEffect(() => {
    setValue(entry.value);
  }, [entry.id, entry.value]);

  return (
    <tr className="align-top">
      <td className="px-4 py-3 font-mono text-xs text-slate-600">{entry.locale}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-900">{entry.key}</td>
      <td className="px-4 py-3">
        <textarea
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          rows={2}
          className="w-full min-w-[200px] rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
        />
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSave(value)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Save
        </button>
      </td>
    </tr>
  );
}

function NewEntryForm({
  disabled,
  onDone,
}: {
  disabled: boolean;
  onDone: (msg: string) => void;
}) {
  const [key, setKey] = useState("");
  const [locale, setLocale] = useState<"en" | "fr">("en");
  const [value, setValue] = useState("");

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block text-sm text-slate-700 sm:col-span-1">
        Key
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="nav_home"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
        />
      </label>
      <label className="block text-sm text-slate-700">
        Locale
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as "en" | "fr")}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="en">en</option>
          <option value="fr">fr</option>
        </select>
      </label>
      <label className="block text-sm text-slate-700 sm:col-span-2 lg:col-span-2">
        Value
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <div className="flex items-end sm:col-span-2 lg:col-span-4">
        <button
          type="button"
          disabled={disabled}
          onClick={async () => {
            const res = await createContentEntryRecord(key, locale, value);
            if (res.ok) {
              setKey("");
              setValue("");
              onDone("Entry created or updated.");
            } else {
              onDone(res.error ?? "Failed.");
            }
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Upsert entry
        </button>
      </div>
    </div>
  );
}
