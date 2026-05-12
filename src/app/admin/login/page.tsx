import { Suspense } from "react";
import AdminLoginInner from "./login-inner";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-slate-50">
          <p className="text-sm text-white/60">Loading…</p>
        </main>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
