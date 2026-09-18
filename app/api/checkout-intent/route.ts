import { NextRequest, NextResponse, after } from "next/server"
import CheckoutIntent from "../../../emails/internal/CheckoutIntent"
import { notifyTeam, emailListFromEnv } from "@/lib/email"
import { isLang } from "@/lib/i18n"

const TEAM_EMAILS = emailListFromEnv(process.env.MERCADOPAGO_NOTIFY_EMAILS)

const PLAN_NAMES: Record<string, string> = {
  landing: "Landing",
  corporativo: "Corporativo",
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Se llama justo antes de redirigir a Mercado Pago (ver /planes/empezar) —
// registra la intención de suscripción para que el equipo tenga con quién
// contactarse aunque la persona abandone el pago del lado de MP. No guarda
// nada en una base de datos: solo dispara el aviso interno.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const email = String(body.email ?? "").trim()
  const telefono = String(body.telefono ?? "").trim()
  const empresa = String(body.empresa ?? "").trim()
  const descripcion = String(body.descripcion ?? "").trim()
  const plan = String(body.plan ?? "")
  const lang = isLang(body.lang) ? body.lang : "es"

  if (!email || !telefono || !empresa) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 })
  }

  const planName = PLAN_NAMES[plan] ?? plan

  after(() =>
    notifyTeam(
      TEAM_EMAILS,
      `Nuevo intento de checkout — ${planName}`,
      CheckoutIntent({ planName, email, telefono, empresa, descripcion: descripcion || undefined, lang })
    )
  )

  return NextResponse.json({ ok: true })
}
