import { NextRequest, NextResponse, after } from "next/server"
import { notifyTeam, emailListFromEnv } from "@/lib/email"
import { normalizarWhatsApp, linkWhatsApp } from "@/lib/phone"
import { sendMetaLead } from "@/lib/metaCapi"
import NewLead from "../../../emails/internal/NewLead"

// Leads de la landing de publicidad (/sitio). Formulario corto: nombre, WhatsApp
// y tipo de negocio. Avisa al equipo por mail (con link directo a WhatsApp) y,
// si hay token configurado, le avisa a Meta (API de Conversiones).

const TO = emailListFromEnv(process.env.LEAD_NOTIFY_EMAILS || process.env.CONTACT_TO_EMAIL || "davirapo@gmail.com")
const PLANES: Record<string, string> = { landing: "Landing", corporativo: "Corporativo", "no-se": "No sabe todavía" }
const WHATSAPP_EQUIPO = "5491155988007"

// Límite simple por IP (en memoria): frena el spam más básico sin infraestructura extra.
const intentos = new Map<string, { n: number; reinicio: number }>()
function demasiadosIntentos(ip: string) {
  const ahora = Date.now()
  const reg = intentos.get(ip)
  if (!reg || reg.reinicio < ahora) {
    intentos.set(ip, { n: 1, reinicio: ahora + 10 * 60_000 })
    return false
  }
  reg.n++
  return reg.n > 6
}

const limpiar = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida"

  // Anti-bot: campo trampa vacío y un mínimo de tiempo desde que se mostró el form.
  // Se responde "ok" igual para no darle pistas al bot.
  if (limpiar(body.website, 50) || Number(body.tiempoMs) < 1500) return NextResponse.json({ ok: true })
  if (demasiadosIntentos(ip)) return NextResponse.json({ error: "Demasiados intentos, probá en unos minutos." }, { status: 429 })

  const nombre = limpiar(body.nombre, 80)
  const negocio = limpiar(body.negocio, 120)
  const telefonoOriginal = limpiar(body.telefono, 40)
  const telefono = normalizarWhatsApp(telefonoOriginal)
  const planClave = limpiar(body.plan, 20)
  const plan = PLANES[planClave] ? planClave : "no-se"
  const eventId = limpiar(body.eventId, 80)

  if (nombre.length < 2) return NextResponse.json({ error: "Falta tu nombre", campo: "nombre" }, { status: 400 })
  if (!telefono) return NextResponse.json({ error: "Revisá tu número de WhatsApp", campo: "telefono" }, { status: 400 })

  const attr: Record<string, string> = {}
  if (body.attr && typeof body.attr === "object") {
    for (const [k, v] of Object.entries(body.attr as Record<string, unknown>).slice(0, 20)) attr[limpiar(k, 30)] = limpiar(v, 200)
  }
  const origen =
    [attr.utm_source, attr.utm_medium, attr.utm_campaign, attr.utm_content].filter(Boolean).join(" / ") ||
    (attr.fbclid ? "Meta (fbclid)" : attr.gclid ? "Google (gclid)" : attr.referrer || "directo")

  const primerNombre = nombre.split(/\s+/)[0]
  const whatsappLead = linkWhatsApp(
    telefono,
    `Hola ${primerNombre}! Te escribe David de _luma. Vi que pediste info para tu sitio${negocio ? ` (${negocio})` : ""}. ¿Cuándo tenés 10 minutos para charlarlo?`
  )

  if (!process.env.RESEND_API_KEY) {
    console.error("[lead] RESEND_API_KEY no está configurada")
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 503 })
  }

  // Log explícito: si algo falla con el mail, el lead igual queda en los logs.
  console.log("[lead]", JSON.stringify({ nombre, telefono, negocio, plan, origen }))

  try {
    const enviado = await notifyTeam(
      TO,
      negocio ? `Nuevo lead: ${nombre} — ${negocio}` : `Nuevo lead: ${nombre}`,
      NewLead({
        nombre,
        telefonoOriginal,
        whatsappUrl: whatsappLead,
        negocio: negocio || "No indicó",
        plan: PLANES[plan],
        origen,
        recibidoEn: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short" }),
      })
    )
    if (!enviado) return NextResponse.json({ error: "No se pudo enviar" }, { status: 502 })
  } catch (err) {
    console.error("[lead] no se pudo avisar al equipo:", err)
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 502 })
  }

  const host = req.headers.get("host") ?? ""
  const esLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host)
  if (!esLocal && eventId) {
    after(() =>
      sendMetaLead({
        eventId,
        telefono,
        nombre,
        url: `https://${host}/sitio`,
        ip: ip === "desconocida" ? undefined : ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
        fbp: limpiar(body.fbp, 100) || undefined,
        fbc: limpiar(body.fbc, 200) || undefined,
        plan: PLANES[plan],
      }).catch((err) => console.error("[lead] meta capi:", err))
    )
  }

  return NextResponse.json({
    ok: true,
    whatsappUrl: linkWhatsApp(WHATSAPP_EQUIPO, negocio ? `Hola! Soy ${primerNombre}, tengo ${negocio} y quiero un sitio web.` : `Hola! Soy ${primerNombre} y quiero un sitio web.`),
  })
}
