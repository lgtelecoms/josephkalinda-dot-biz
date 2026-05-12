import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminSecureLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Admin
            </p>
            <p className="font-serif text-lg font-semibold text-slate-900">
              Joseph Kalinda
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 sm:gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/api/auth/signout?callbackUrl=/admin/login"
              className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-800"
            >
              Sign out
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
