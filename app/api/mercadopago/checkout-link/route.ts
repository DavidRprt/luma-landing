import { NextRequest, NextResponse } from "next/server"

// Suscripciones "con plan asociado": el plan (precio, frecuencia) se crea una
// única vez vía POST /preapproval_plan y se referencia acá por su id — nunca
// se crea un plan nuevo por cada visitante. El checkout en sí queda 100% del
// lado de Mercado Pago (carga de tarjeta, autorización, reintentos), acá solo
// resolvemos a qué link de checkout corresponde cada plan.
const PLAN_IDS: Record<string, string | undefined> = {
  landing: process.env.MERCADOPAGO_PLAN_ID_LANDING,
  corporativo: process.env.MERCADOPAGO_PLAN_ID_CORPORATIVO,
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan")

  if (!plan || !(plan in PLAN_IDS)) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 })
  }

  const planId = PLAN_IDS[plan]
  if (!planId) {
    return NextResponse.json({ error: "Plan no configurado" }, { status: 500 })
  }

  return NextResponse.json({
    url: `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${planId}`,
  })
}
