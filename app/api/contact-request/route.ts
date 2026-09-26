import { NextRequest, NextResponse, after } from "next/server"
import { Resend } from "resend"
import ContactAutoReply from "../../../emails/customer/ContactAutoReply"
import ContactNotification from "../../../emails/internal/ContactNotification"
import { FROM_EMAIL } from "@/lib/email"
import { isLang } from "@/lib/i18n"

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "davirapo@gmail.com"
const WHATSAPP_URL = "https://wa.me/5491155988007"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const nombre = String(body.nombre ?? "").trim()
  const email = String(body.email ?? "").trim()
  const telefono = String(body.telefono ?? "").trim()
  const empresa = String(body.empresa ?? "").trim()
  const motivo = String(body.motivo ?? "").trim()
  const mensaje = String(body.mensaje ?? "").trim()
  const lang = isLang(body.lang) ? body.lang : "es"

  if (!nombre || !email || !telefono || !motivo || !mensaje) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact-request] RESEND_API_KEY no está configurada")
    return NextResponse.json({ error: "El envío de emails no está configurado" }, { status: 503 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nueva consulta de ${nombre} — _luma`,
      react: ContactNotification({ nombre, email, telefono, empresa: empresa || undefined, motivo, mensaje, lang }),
    })

    if (error) {
      return NextResponse.json({ error: "No se pudo enviar" }, { status: 502 })
    }

    // Confirmación para quien completó el form, en su propio idioma — se
    // manda después de responder (after) y si falla no debe afectar la
    // respuesta: el aviso interno de arriba, que es lo esencial, ya se envió.
    after(() =>
      resend.emails
        .send({
          from: FROM_EMAIL,
          to: email,
          subject: lang === "en" ? "We got your message — _luma" : "Recibimos tu mensaje — _luma",
          react: ContactAutoReply({ nombre, whatsappUrl: WHATSAPP_URL, lang }),
        })
        .catch((err) => console.error("[contact-request] no se pudo enviar la confirmación al remitente:", err))
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 500 })
  }
}
