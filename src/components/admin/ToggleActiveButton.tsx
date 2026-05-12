"use client";

import { useTransition } from "react";
import { togglePartnerActive, toggleServiceActive } from "@/server/actions";

export function ToggleActiveButton({
  id,
  active,
  kind,
}: {
  id: string;
  active: boolean;
  kind: "service" | "partner";
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(() =>
          kind === "service"
            ? toggleServiceActive(id, !active)
            : togglePartnerActive(id, !active)
        )
      }
      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
    >
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}
