"use client";

import { useTransition } from "react";
import { deleteContact, toggleContactRead } from "@/server/actions";

export function ContactRowActions({
  id,
  read,
}: {
  id: string;
  read: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => toggleContactRead(id, !read))}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
      >
        {read ? "Mark unread" : "Mark read"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this submission permanently?")) {
            start(() => deleteContact(id));
          }
        }}
        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
