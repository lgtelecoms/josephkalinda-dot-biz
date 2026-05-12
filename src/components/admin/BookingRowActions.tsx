"use client";

import { useTransition } from "react";
import { BookingStatus } from "@prisma/client";
import { deleteBooking, updateBookingStatus } from "@/server/actions";

const statuses: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONTACTED,
  BookingStatus.COMPLETED,
  BookingStatus.CANCELLED,
];

export function BookingRowActions({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <select
        defaultValue={status}
        disabled={pending}
        onChange={(e) =>
          start(() =>
            updateBookingStatus(id, e.target.value as BookingStatus)
          )
        }
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this booking permanently?")) {
            start(() => deleteBooking(id));
          }
        }}
        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
