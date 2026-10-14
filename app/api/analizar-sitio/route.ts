import { NextRequest, NextResponse } from "next/server";
import { analizarSitio } from "@/lib/analisis";
import { POW_BITS, emitirToken, hashIp, nuevoDispositivo, tokenValido } from "@/lib/analisis/limites";

// Analizador de sitios de la landing /sitio. GET entrega el token de la página; POST analiza.
// Las protecciones están en lib/analisis/limites.ts (caché, topes por persona y globales) y seguro.ts (SSRF).

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const sinCache = { "Cache-Control": "no-store" };

function ipDe(req: NextRequest): string {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
}

// Solo se acepta si viene de la propia página (mismo dominio).
function mismoOrigen(req: NextRequest): boolean {
  const origen = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origen || !host) return false;
  try {
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

const COOKIE = "luma_did";
const dispositivoDe = (req: NextRequest) => {
  const c = req.cookies.get(COOKIE)?.value ?? "";
  return /^[a-f0-9]{24}$/.test(c) ? c : "";
};

// GET: entrega el token de la página (con una pequeña prueba de trabajo) y, si hace falta, el id anónimo del navegador.
export async function GET(req: NextRequest) {
  const did = dispositivoDe(req) || nuevoDispositivo();
  const res = NextResponse.json({ t: emitirToken(did), bits: POW_BITS }, { headers: sinCache });
  res.cookies.set(COOKIE, did, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/api/analizar-sitio" });
  return res;
}

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) return NextResponse.json({ ok: false, motivo: "origen" }, { status: 403, headers: sinCache });
  if (Number(req.headers.get("content-length") ?? 0) > 2000) return NextResponse.json({ ok: false, motivo: "invalido" }, { status: 413, headers: sinCache });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false, motivo: "invalido" }, { status: 400, headers: sinCache });

  // Campo trampa (lo llena un bot, una persona no lo ve) y token de página con espera mínima.
  const did = dispositivoDe(req);
  if (String(body.website ?? "").trim() || !did || !tokenValido(body.t, did, body.pow)) {
    return NextResponse.json({ ok: false, motivo: "invalido" }, { status: 400, headers: sinCache });
  }

  const r = await analizarSitio(String(body.sitio ?? ""), hashIp(ipDe(req)), did);
  if (r.ok) return NextResponse.json({ ok: true, analisis: r.analisis }, { headers: sinCache });

  const estado = r.motivo === "limite" || r.motivo === "ocupado" ? 429 : r.motivo === "error" ? 500 : 200;
  const headers = r.esperaMin ? { ...sinCache, "Retry-After": String(r.esperaMin * 60) } : sinCache;
  return NextResponse.json({ ok: false, motivo: r.motivo, esperaMin: r.esperaMin }, { status: estado, headers });
}
