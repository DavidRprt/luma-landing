import { NextRequest, NextResponse } from "next/server"

const FLUXY_API    = process.env.FLUXY_API_URL!
const CLAVE_PUBLICA = process.env.FLUXY_CLAVE_PUBLICA!
const BOT_SLUG     = process.env.FLUXY_BOT_SLUG!

export async function POST(req: NextRequest) {
  const { mensaje, conversacion_id } = await req.json()

  if (!mensaje?.trim()) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 })
  }

  try {
    const res = await fetch(`${FLUXY_API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje,
        clave_publica: CLAVE_PUBLICA,
        slug: BOT_SLUG,
        conversacion_id: conversacion_id || null,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Error del servidor" }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el servidor" }, { status: 503 })
  }
}
