import { render } from "@react-email/components";
import { Resend } from "resend";
import type { ReactElement } from "react";

import { db, schema } from "@/db";
import { env } from "@/env";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!env.AUTH_RESEND_KEY) return null;
  if (!resend) resend = new Resend(env.AUTH_RESEND_KEY);
  return resend;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  template: string;
  react: ReactElement;
  stripeEventId?: string;
}

export async function sendEmail({ to, subject, template, react, stripeEventId }: SendEmailParams) {
  if (stripeEventId) {
    const duped = await db.query.emailLog.findFirst({
      where: (log, { eq }) => eq(log.stripeEventId, stripeEventId),
    });
    if (duped) return { deduped: true };
  }

  const client = getResend();
  const from = env.AUTH_RESEND_FROM ?? "auth@strongroots.local";

  if (!client) {
    const html = await render(react);
    console.log(`\n[email] ${template} to ${to} — RESEND DISABLED\nsubject: ${subject}\n${html.slice(0, 200)}...\n`);
  } else {
    await client.emails.send({
      from,
      to,
      subject,
      react,
    });
  }

  await db.insert(schema.emailLog).values({
    to,
    template,
    stripeEventId: stripeEventId ?? null,
  });

  return { deduped: false };
}
