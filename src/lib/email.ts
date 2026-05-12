type EmailPayload = {
  subject: string;
  html: string;
  text?: string;
};

export async function sendTransactionalEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;

  if (!apiKey || !from || !to) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] Skipping send (missing RESEND_API_KEY / EMAIL_FROM / EMAIL_TO)");
      console.info("[email] Subject:", payload.subject);
    }
    return { ok: true as const, skipped: true as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error", res.status, body);
    return { ok: false as const, error: "Email provider rejected the request." };
  }

  return { ok: true as const, skipped: false as const };
}

export async function notifyNewContact(data: {
  name: string;
  email: string;
  phone?: string | null;
  country: string;
  languagePref: string;
  serviceInterest?: string | null;
  message: string;
}) {
  const subject = `New contact: ${data.name}`;
  const html = `
    <h2>New contact submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone ?? "—")}</p>
    <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
    <p><strong>Language:</strong> ${escapeHtml(data.languagePref)}</p>
    <p><strong>Service interest:</strong> ${escapeHtml(data.serviceInterest ?? "—")}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:system-ui">${escapeHtml(data.message)}</pre>
  `;
  return sendTransactionalEmail({ subject, html });
}

export async function notifyNewBooking(data: {
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  city: string;
  preferredDate: Date;
  preferredTime: string;
  topic: string;
  languagePref: string;
  message?: string | null;
}) {
  const subject = `Consultation request: ${data.fullName}`;
  const html = `
    <h2>New consultation booking</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(data.whatsapp)}</p>
    <p><strong>Country:</strong> ${escapeHtml(data.country)}</p>
    <p><strong>City:</strong> ${escapeHtml(data.city)}</p>
    <p><strong>Preferred date:</strong> ${escapeHtml(data.preferredDate.toISOString())}</p>
    <p><strong>Preferred time:</strong> ${escapeHtml(data.preferredTime)}</p>
    <p><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
    <p><strong>Language:</strong> ${escapeHtml(data.languagePref)}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:system-ui">${escapeHtml(data.message ?? "—")}</pre>
  `;
  return sendTransactionalEmail({ subject, html });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
