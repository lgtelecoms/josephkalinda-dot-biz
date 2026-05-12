"use client";

import { useFormState } from "react-dom";
import type { Messages } from "@/lib/i18n";
import type { Service } from "@prisma/client";
import { submitContactForm, type FormState } from "@/server/actions";
import { cn } from "@/lib/cn";

type Props = {
  locale: "en" | "fr";
  messages: Messages;
  services: Service[];
};

const initial: FormState = { success: false };

export function ContactForm({ locale, messages, services }: Props) {
  const f = messages.forms.contact;
  const [state, formAction] = useFormState(submitContactForm, initial);

  return (
    <form
      action={formAction}
      className="mt-10 space-y-5 rounded-3xl border border-brand-forest-deep/10 bg-white/90 p-6 shadow-brand backdrop-blur-md sm:p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-brand-forest-deep">
            {f.title}
          </h3>
          <p className="text-sm text-brand-forest-deep/70">
            {messages.contact.subtitle}
          </p>
        </div>
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
            {f.name}
            <input
              required
              name="name"
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
            {f.phone}
            <input
              name="phone"
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
          <label className="block text-sm font-medium text-brand-forest-deep">
            {f.serviceInterest}
            <select
              name="serviceId"
              className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
            >
              <option value="">{f.servicePlaceholder}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {locale === "fr" ? s.titleFr : s.titleEn}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-brand-forest-deep">
          {f.message}
          <textarea
            required
            name="message"
            rows={5}
            className="mt-1 w-full rounded-xl border border-brand-forest-deep/15 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-brand-gold/40 focus:ring-2"
          />
        </label>

        <label className="flex items-start gap-3 text-sm text-brand-forest-deep/85">
          <input required type="checkbox" name="consent" className="mt-1" />
          <span>{f.consent}</span>
        </label>

        <button
          type="submit"
          disabled={state.success}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-full border border-brand-gold/50 bg-brand-forest-deep px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-brand-lg transition hover:bg-brand-forest-muted disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          )}
        >
          {f.submit}
        </button>
      </fieldset>
    </form>
  );
}
