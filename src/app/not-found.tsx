import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-ivory px-6 text-center">
      <h1 className="font-serif text-3xl text-brand-forest-deep">404</h1>
      <p className="mt-2 text-brand-forest-deep/75">
        This page could not be found.
      </p>
      <Link
        href="/en"
        className="mt-8 rounded-full border border-brand-gold/50 bg-brand-forest-deep px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-forest-muted"
      >
        Go home
      </Link>
    </main>
  );
}
