import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "davirapo@gmail.com"
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "_luma <onboarding@resend.dev>"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
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
  const mensaje = String(body.mensaje ?? "").trim()

  if (!nombre || !email || !telefono || !mensaje) {
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
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #111; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">Nueva consulta desde underluma.com</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
          ${empresa ? `<p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-line;">${escapeHtml(mensaje)}</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: "No se pudo enviar" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 500 })
  }
}
