import { NextResponse } from "next/server"

const FLUXY_API = process.env.FLUXY_API_URL!
const BOT_SLUG  = process.env.FLUXY_BOT_SLUG!

export async function GET() {
  try {
    const res = await fetch(`${FLUXY_API}/bots/${BOT_SLUG}`, { cache: "no-store" })

    if (!res.ok) {
      return NextResponse.json({ mensaje_inicial: null })
    }

    const data = await res.json()
    return NextResponse.json({ mensaje_inicial: data.mensaje_inicial ?? null })
  } catch {
    return NextResponse.json({ mensaje_inicial: null })
  }
}
