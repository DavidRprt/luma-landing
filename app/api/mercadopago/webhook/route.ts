import { NextRequest, NextResponse, after } from "next/server"
import { createHmac, timingSafeEqual } from "node:crypto"
import { Resend } from "resend"
import WelcomeEmail from "../../../../emails/customer/WelcomeEmail"

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET
const NOTIFY_EMAILS = (process.env.MERCADOPAGO_NOTIFY_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "_luma <onboarding@resend.dev>"
const WHATSAPP_URL = "https://wa.me/5491157387432"

// Valida que la notificación venga realmente de Mercado Pago.
// Formato del header, y algoritmo de validación:
// https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/notifications/webhooks
function isValidSignature(req: NextRequest, dataId: string): boolean {
  if (!WEBHOOK_SECRET) return false

  const signatureHeader = req.headers.get("x-signature")
  const requestId = req.headers.get("x-request-id")
  if (!signatureHeader || !requestId) return false

  const parts: Record<string, string> = {}
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=")
    if (key && value) parts[key.trim()] = value.trim()
  }
  const { ts, v1 } = parts
  if (!ts || !v1) return false

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(manifest).digest("hex")

  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(v1)
  if (expectedBuf.length !== receivedBuf.length) return false
  return timingSafeEqual(expectedBuf, receivedBuf)
}

async function notify(subject: string, html: string) {
  if (!process.env.RESEND_API_KEY || NOTIFY_EMAILS.length === 0) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  // Un envío por destinatario: si Resend rechaza a uno (p. ej. dominio sin
  // verificar todavía), que no se caiga el aviso para el resto.
  const results = await Promise.allSettled(
    NOTIFY_EMAILS.map((to) => resend.emails.send({ from: FROM_EMAIL, to, subject, html }))
  )
  for (const result of results) {
    if (result.status === "rejected" || result.value?.error) {
      console.error("[mercadopago webhook] no se pudo enviar el aviso a un destinatario:", result.status === "rejected" ? result.reason : result.value.error)
    }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const dataId = req.nextUrl.searchParams.get("data.id") ?? body?.data?.id
  const topic = req.nextUrl.searchParams.get("type") ?? body?.type

  if (!dataId || !topic) {
    return NextResponse.json({ error: "Notificación inválida" }, { status: 400 })
  }
  if (!isValidSignature(req, String(dataId))) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 })
  }

  try {
    if (topic === "subscription_preapproval") {
      const res = await fetch(`https://api.mercadopago.com/preapproval/${dataId}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const sub = await res.json()

      await notify(
        `Suscripción ${sub.status} — ${sub.reason ?? ""}`,
        `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
          <p><strong>Estado:</strong> ${sub.status}</p>
          <p><strong>Plan:</strong> ${sub.reason}</p>
          <p><strong>Email del cliente:</strong> ${sub.payer_email}</p>
          <p><strong>Monto:</strong> $${sub.auto_recurring?.transaction_amount} ${sub.auto_recurring?.currency_id}</p>
        </div>`
      )

      // Bienvenida al cliente — solo quedará "authorized" la primera vez que
      // se activa la suscripción, así que no hace falta deduplicar acá.
      if (sub.status === "authorized" && sub.payer_email && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        after(() =>
          resend.emails
            .send({
              from: FROM_EMAIL,
              to: sub.payer_email,
              subject: `¡Bienvenido/a a _luma! Tu plan ${sub.reason ?? ""} ya está activo`,
              react: WelcomeEmail({
                planName: sub.reason ?? "",
                price: String(sub.auto_recurring?.transaction_amount ?? ""),
                whatsappUrl: WHATSAPP_URL,
              }),
            })
            .catch((err) => console.error("[mercadopago webhook] no se pudo enviar la bienvenida al cliente:", err))
        )
      }
    } else if (topic === "subscription_authorized_payment") {
      const res = await fetch(`https://api.mercadopago.com/authorized_payments/${dataId}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const payment = await res.json()
      const ok = payment.status === "processed" || payment.status === "approved"

      await notify(
        ok
          ? `✅ Cobro exitoso — $${payment.transaction_amount}`
          : `⚠️ Falló un cobro — suscripción ${payment.preapproval_id}`,
        `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">
          <p><strong>Estado:</strong> ${payment.status}</p>
          <p><strong>Monto:</strong> $${payment.transaction_amount}</p>
          <p><strong>ID de suscripción:</strong> ${payment.preapproval_id}</p>
        </div>`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[mercadopago webhook] error procesando notificación:", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
