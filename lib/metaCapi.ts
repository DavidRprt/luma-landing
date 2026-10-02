import { createHash } from "node:crypto";

// API de Conversiones de Meta (server-side). Complementa al píxel del navegador:
// con iOS y los bloqueadores, el píxel solo ve una parte de los leads, y esto
// le avisa a Meta de TODOS. Si falta el token, no hace nada. Se deduplica con
// el mismo event_id que manda el navegador.
//
// Variables: META_CAPI_ACCESS_TOKEN (Events Manager → Configuración → API de
// conversiones → Generar token) y, opcional, META_CAPI_TEST_CODE para probar.

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export async function sendMetaLead(data: {
  eventId: string;
  telefono: string; // normalizado, solo dígitos con código de país
  nombre: string;
  url: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  plan?: string;
}) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixelId) return;

  const primerNombre = data.nombre.split(/\s+/)[0] ?? "";
  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: data.eventId,
        action_source: "website",
        event_source_url: data.url,
        user_data: {
          ph: [sha256(data.telefono)],
          ...(primerNombre ? { fn: [sha256(primerNombre)] } : {}),
          country: [sha256("ar")],
          ...(data.ip ? { client_ip_address: data.ip } : {}),
          ...(data.userAgent ? { client_user_agent: data.userAgent } : {}),
          ...(data.fbp ? { fbp: data.fbp } : {}),
          ...(data.fbc ? { fbc: data.fbc } : {}),
        },
        custom_data: { content_name: "Landing /sitio", ...(data.plan ? { plan: data.plan } : {}) },
      },
    ],
    ...(process.env.META_CAPI_TEST_CODE ? { test_event_code: process.env.META_CAPI_TEST_CODE } : {}),
  };

  const res = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("[meta-capi] error", res.status, (await res.text().catch(() => "")).slice(0, 300));
}
