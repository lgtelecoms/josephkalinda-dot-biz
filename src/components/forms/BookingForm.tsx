"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import type { Messages } from "@/lib/i18n";
import { submitBookingForm, type FormState } from "@/server/actions";
import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "fr";
  messages: Messages;
};

const initial: FormState = { success: false };

export function BookingForm({ locale, messages }: Props) {
  const f = messages.forms.booking;
  const [state, formAction] = useFormState(submitBookingForm, initial);

  return (
    <form
      action={formAction}
      className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-brand-gold/30 bg-white/95 p-6 shadow-brand-lg backdrop-blur-md sm:p-10"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-forest-deep">
            {f.title}
          </h1>
          <p className="mt-1 text-sm text-brand-forest-deep/70">{f.subtitle}</p>
        </div>
        <Link
          href={`/${locale}`}
          className="text-sm font-semibold text-brand-forest-muted underline-offset-4 hover:text-brand-forest-deep hover:underline"
        >
          ← {messages.nav.home}
        </Link>
      </div>

      {state.success ? (
        <p className="rounded-2xl border border-brand-gold/40 bg-brand-ivory px-4 py-3 text-sm font-medium text-brand-forest-deep">
          {f.success}
        </p>
      ) : null}

      {!state.success && state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error || f.error}
        </p>
      ) : null}

      <fieldset
        disabled={state.success}
        className="space-y-5 disabled:opacity-60"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.fullName}
            <input
              required
              name="fullName"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.email}
            <input
              required
              type="email"
              name="email"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.whatsapp}
            <input
              required
              name="whatsapp"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.country}
            <input
              required
              name="country"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.city}
            <input
              required
              name="city"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.date}
            <input
              required
              type="date"
              name="preferredDate"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.time}
            <input
              required
              name="preferredTime"
              placeholder="09:00"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.topic}
            <input
              required
              name="topic"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.language}
            <select
              name="languagePref"
              defaultValue={locale}
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-brand-forest-deep">
          {f.message}
          <textarea
            name="message"
            rows={4}
            className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
          />
        </label>

        <button
          type="submit"
          disabled={state.success}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full border border-brand-gold/50 bg-brand-forest-deep px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-brand-lg transition hover:bg-brand-forest-muted disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {f.submit}
        </button>
      </fieldset>
    </form>
  );
}
