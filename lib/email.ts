import { Resend } from "resend";
import type { ReactElement } from "react";

export const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "_luma <onboarding@resend.dev>";

export function emailListFromEnv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Notifica al equipo (no a un cliente) a uno o varios destinatarios — un
 * envío por destinatario, para que si Resend rechaza a uno (p. ej. un
 * dominio sin verificar todavía) no se caiga el aviso para el resto.
 */
export async function notifyTeam(
  to: string | string[],
  subject: string,
  react: ReactElement,
  options?: { replyTo?: string }
) {
  const recipients = Array.isArray(to) ? to : [to];
  if (!process.env.RESEND_API_KEY || recipients.length === 0) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = await Promise.allSettled(
    recipients.map((recipient) =>
      resend.emails.send({ from: FROM_EMAIL, to: recipient, replyTo: options?.replyTo, subject, react })
    )
  );
  for (const result of results) {
    if (result.status === "rejected" || result.value?.error) {
      console.error("[notifyTeam] no se pudo enviar a un destinatario:", result.status === "rejected" ? result.reason : result.value.error);
    }
  }
}
