import crypto from "node:crypto";
import { db } from "@/lib/landings";
import type { Analisis } from "@/app/sitio/analisisTipos";

// Protecciones contra el spam y el gasto, todas guardadas en la base (outreach.analisis_web), así valen aunque haya
// varias copias del servidor o se reinicie:
//  - caché por dominio: el mismo sitio no se vuelve a analizar (ni gasta nada) durante 7 días,
//  - tope por persona (IP con hash): pocos análisis nuevos por hora y por día, y de a uno a la vez,
//  - tope global por hora y por día (lo que protege la plata aunque alguien falsifique su IP),
//  - tope diario de llamados a la IA: pasado ese número se responde igual, pero sin IA (cero tokens).
// Si no se puede consultar la base, se rechaza el pedido: ante la duda, no se gasta.

export const LIMITES = {
  porIpHora: 3,
  porIpDia: 8,
  porDispositivoHora: 3, // el id anónimo del navegador (cookie) cuenta aparte de la IP: no se esquiva cambiando de IP
  porDispositivoDia: 6,
  pedidosPorIpHora: 25, // cualquier pedido (también los de caché o bloqueados)
  globalHora: 40,
  globalDia: 250,
  iaDia: 150,
  cacheDias: 7,
};

// Presupuesto: en cualquier ventana de 24 horas, lo que se gasta en la IA y en Google Maps no pasa de GASTO_MAX_USD.
// Pasado ese tope se responde igual, pero sin IA (y antes, sin Maps): cero costo. Los precios son los de lista, redondeados hacia arriba.
export const GASTO_MAX_USD = 2;
export const GASTO_MAPS_HASTA_USD = 1; // Maps es lo más caro por pedido: se corta primero
export const PRECIO_ENTRADA_USD = 0.10 / 1_000_000;
export const PRECIO_SALIDA_USD = 0.50 / 1_000_000;
export const PRECIO_MAPS_USD = 0.035;
export const costoUsd = (tokensEntrada: number, tokensSalida: number, maps: boolean) => tokensEntrada * PRECIO_ENTRADA_USD + tokensSalida * PRECIO_SALIDA_USD + (maps ? PRECIO_MAPS_USD : 0);

export const secreto = () => process.env.ANALISIS_SECRET || crypto.createHash("sha256").update(`analisis:${process.env.OPENAI_API_KEY ?? ""}:${process.env.LANDINGS_DATABASE_URL ?? ""}`).digest("hex");

export function hashIp(ip: string): string {
  return crypto.createHmac("sha256", secreto()).update(ip).digest("hex").slice(0, 32);
}

export type Veredicto =
  | { tipo: "cache"; analisis: Analisis }
  | { tipo: "permitido"; id: number; usarIa: boolean; usarMaps: boolean }
  | { tipo: "bloqueado"; motivo: "ip" | "global" | "ocupado" | "base"; esperaMin: number };

export async function revisar(dominio: string, ipHash: string, dispositivo: string): Promise<Veredicto> {
  const p = db();
  if (!p) return { tipo: "bloqueado", motivo: "base", esperaMin: 5 };
  try {
    if (Math.random() < 0.02) void limpiarViejos();
    // 1) Caché: si el sitio ya se analizó hace poco, se devuelve lo mismo.
    const c = await p.query(
      `SELECT datos FROM outreach.analisis_web WHERE dominio = $1 AND resultado = 'ok' AND datos IS NOT NULL AND creado_en > now() - make_interval(days => $2) ORDER BY id DESC LIMIT 1`,
      [dominio, LIMITES.cacheDias]
    );
    if (c.rows[0]?.datos) {
      await p.query(`INSERT INTO outreach.analisis_web (dominio, ip_hash, resultado) VALUES ($1, $2, 'cache')`, [dominio, ipHash]);
      return { tipo: "cache", analisis: c.rows[0].datos as Analisis };
    }

    // 2) Contadores (una sola consulta).
    const { rows } = await p.query(
      `SELECT
         count(*) FILTER (WHERE ip_hash = $1 AND creado_en > now() - interval '1 hour') AS pedidos_ip_hora,
         count(*) FILTER (WHERE ip_hash = $1 AND resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 hour') AS nuevos_ip_hora,
         count(*) FILTER (WHERE ip_hash = $1 AND resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 day') AS nuevos_ip_dia,
         count(*) FILTER (WHERE dispositivo = $2 AND resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 hour') AS nuevos_dev_hora,
         count(*) FILTER (WHERE dispositivo = $2 AND resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 day') AS nuevos_dev_dia,
         count(*) FILTER (WHERE (ip_hash = $1 OR dispositivo = $2) AND resultado = 'pendiente' AND creado_en > now() - interval '40 seconds') AS ocupado,
         count(*) FILTER (WHERE resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 hour') AS global_hora,
         count(*) FILTER (WHERE resultado IN ('ok','no_abre','error','pendiente','no_apto') AND creado_en > now() - interval '1 day') AS global_dia,
         count(*) FILTER (WHERE uso_ia AND creado_en > now() - interval '1 day') AS ia_dia,
         coalesce(sum(costo_usd) FILTER (WHERE creado_en > now() - interval '1 day'), 0) AS gasto_dia
       FROM outreach.analisis_web WHERE creado_en > now() - interval '1 day'`,
      [ipHash, dispositivo]
    );
    const n = Object.fromEntries(Object.entries(rows[0]).map(([k, v]) => [k, Number(v)]));
    if (n.ocupado > 0) return { tipo: "bloqueado", motivo: "ocupado", esperaMin: 1 };
    if (n.pedidos_ip_hora >= LIMITES.pedidosPorIpHora || n.nuevos_ip_hora >= LIMITES.porIpHora) return { tipo: "bloqueado", motivo: "ip", esperaMin: 60 };
    if (n.nuevos_dev_hora >= LIMITES.porDispositivoHora || n.nuevos_dev_dia >= LIMITES.porDispositivoDia) return { tipo: "bloqueado", motivo: "ip", esperaMin: n.nuevos_dev_hora >= LIMITES.porDispositivoHora ? 60 : 24 * 60 };
    if (n.nuevos_ip_dia >= LIMITES.porIpDia) return { tipo: "bloqueado", motivo: "ip", esperaMin: 24 * 60 };
    if (n.global_hora >= LIMITES.globalHora || n.global_dia >= LIMITES.globalDia) return { tipo: "bloqueado", motivo: "global", esperaMin: 30 };

    const ins = await p.query(`INSERT INTO outreach.analisis_web (dominio, ip_hash, dispositivo, resultado) VALUES ($1, $2, $3, 'pendiente') RETURNING id`, [dominio, ipHash, dispositivo]);
    return { tipo: "permitido", id: ins.rows[0].id, usarIa: n.ia_dia < LIMITES.iaDia && n.gasto_dia < GASTO_MAX_USD, usarMaps: n.gasto_dia < GASTO_MAPS_HASTA_USD };
  } catch {
    return { tipo: "bloqueado", motivo: "base", esperaMin: 5 };
  }
}

export async function cerrar(id: number, r: { resultado: "ok" | "no_abre" | "error" | "no_apto"; datos?: Analisis; usoIa?: boolean; costoUsd?: number; tokensEntrada?: number; tokensSalida?: number; captura?: { jpeg: Buffer; ancho: number; alto: number; token: string } }) {
  try {
    await db()?.query(
      `UPDATE outreach.analisis_web SET resultado = $2, datos = $3, uso_ia = $4, tokens_entrada = $5, tokens_salida = $6,
         captura = $7, captura_token = $8, captura_ancho = $9, captura_alto = $10, costo_usd = $11 WHERE id = $1`,
      [id, r.resultado, r.datos ? JSON.stringify(r.datos) : null, Boolean(r.usoIa), r.tokensEntrada ?? 0, r.tokensSalida ?? 0, r.captura?.jpeg ?? null, r.captura?.token ?? null, r.captura?.ancho ?? null, r.captura?.alto ?? null, r.costoUsd ?? 0]
    );
  } catch { /* si no se puede cerrar, el registro queda como pendiente y cuenta igual para los topes */ }
}

// ---- Token de página: lo emite el servidor cuando se muestra el analizador y hay que devolverlo con el pedido.
// Lleva el id anónimo del navegador (el mismo que va en la cookie), una espera mínima y una pequeña prueba de trabajo
// (el navegador resuelve un acertijo de unos milisegundos; a un bot que lanza miles de pedidos le sale caro).
const MIN_MS = 2500;
const MAX_MS = 2 * 3600_000;
export const POW_BITS = 14;

const firma = (t: string) => crypto.createHmac("sha256", secreto()).update(t).digest("hex").slice(0, 24);

export function nuevoDispositivo(): string {
  return crypto.randomBytes(12).toString("hex");
}

export function emitirToken(dispositivo: string): string {
  const t = `${Date.now()}.${crypto.randomBytes(6).toString("hex")}.${dispositivo}`;
  return `${t}.${firma(t)}`;
}

function cerosIniciales(hex: Buffer): number {
  let bits = 0;
  for (const byte of hex) {
    if (byte === 0) { bits += 8; continue; }
    bits += Math.clz32(byte) - 24;
    break;
  }
  return bits;
}

/** El token es válido si lo firmamos nosotros, es del mismo navegador (cookie), tiene la edad correcta y trae la prueba de trabajo. */
export function tokenValido(token: unknown, dispositivo: string, pow: unknown): boolean {
  if (typeof token !== "string" || typeof pow !== "string" || pow.length > 24) return false;
  const partes = token.split(".");
  if (partes.length !== 4) return false;
  const [ts, nonce, did, f] = partes;
  if (did !== dispositivo) return false;
  const esperada = firma(`${ts}.${nonce}.${did}`);
  const a = Buffer.from(f), b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const edad = Date.now() - Number(ts);
  if (!(edad >= MIN_MS && edad <= MAX_MS)) return false;
  return cerosIniciales(crypto.createHash("sha256").update(`${token}:${pow}`).digest()) >= POW_BITS;
}

export async function leerCaptura(token: string): Promise<Buffer | null> {
  if (!/^[A-Za-z0-9_-]{16,40}$/.test(token)) return null;
  try {
    const { rows } = (await db()?.query(`SELECT captura FROM outreach.analisis_web WHERE captura_token = $1`, [token])) ?? { rows: [] };
    return rows[0]?.captura ?? null;
  } catch {
    return null;
  }
}

// Limpieza: de vez en cuando se borran los análisis viejos (con sus capturas) para que la base no crezca.
export async function limpiarViejos() {
  try { await db()?.query(`DELETE FROM outreach.analisis_web WHERE creado_en < now() - interval '45 days'`); } catch { /* sin limpieza, igual sigue */ }
}

// ---- Avisos de gasto: al cruzar GASTO_MAPS_HASTA_USD y GASTO_MAX_USD (ventana de 24 horas) se manda un mail, una sola vez por umbral y por día.
export async function avisarGasto(): Promise<void> {
  const p = db();
  const clave = process.env.RESEND_API_KEY;
  if (!p || !clave) return;
  try {
    const { rows } = await p.query(
      `SELECT coalesce(sum(costo_usd), 0) AS gasto, count(*) FILTER (WHERE uso_ia) AS con_ia, count(*) FILTER (WHERE resultado IN ('ok','no_apto')) AS analisis
       FROM outreach.analisis_web WHERE creado_en > now() - interval '1 day'`);
    const gasto = Number(rows[0].gasto);
    for (const [umbral, marca, texto] of [
      [GASTO_MAX_USD, "alerta_2", `Llegó al tope diario: ya no se usa la IA hasta que el gasto de las últimas 24 horas baje. Los análisis siguen funcionando, solo con reglas y sin costo.`],
      [GASTO_MAPS_HASTA_USD, "alerta_1", `Llegó al primer aviso: desde ahora no se consultan más las reseñas de Google Maps (lo más caro). La IA sigue funcionando hasta US$ ${GASTO_MAX_USD}.`],
    ] as const) {
      if (gasto < umbral) continue;
      const ya = await p.query(`SELECT 1 FROM outreach.analisis_web WHERE resultado = $1 AND creado_en > now() - interval '1 day' LIMIT 1`, [marca]);
      if (ya.rowCount) break; // si ya avisamos del umbral más alto, el menor ya se avisó antes
      await p.query(`INSERT INTO outreach.analisis_web (dominio, ip_hash, resultado) VALUES ('alerta-gasto', 'sistema', $1)`, [marca]);
      const { Resend } = await import("resend");
      await new Resend(clave).emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "_luma <onboarding@resend.dev>",
        to: process.env.ALERTA_GASTO_EMAIL || "davirapo@gmail.com",
        subject: `Analizador de /sitio: gasto de US$ ${gasto.toFixed(2)} en 24 horas`,
        text: `${texto}\n\nGasto estimado en las últimas 24 horas: US$ ${gasto.toFixed(2)}\nAnálisis hechos: ${rows[0].analisis} (con IA: ${rows[0].con_ia})\n\nEs una estimación con los precios de lista. Los topes duros se configuran en OpenAI y en Google Cloud.`,
      }).catch((e) => console.error("[analisis] no se pudo mandar el aviso de gasto", e));
      break;
    }
  } catch { /* un aviso que falla nunca rompe el análisis */ }
}

// ---- Aviso por cada análisis: llega un mail con el dominio y el resultado. Solo en producción (en localhost no se manda).
export async function avisarAnalisis(dominio: string, resultado: string, detalle: Record<string, string | number | undefined> = {}): Promise<void> {
  const clave = process.env.RESEND_API_KEY;
  if (process.env.NODE_ENV !== "production" || !clave) return;
  try {
    const { Resend } = await import("resend");
    const lineas = Object.entries(detalle).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}: ${v}`);
    await new Resend(clave).emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "_luma <onboarding@resend.dev>",
      to: process.env.ALERTA_GASTO_EMAIL || "davirapo@gmail.com",
      subject: `Análisis en /sitio: ${dominio} (${resultado})`,
      text: `Alguien analizó ${dominio} en /sitio.\nResultado: ${resultado}\n${lineas.join("\n")}\n\nAbrilo en https://underluma.com/sitio y pegá la dirección para verlo.`,
    }).catch((e) => console.error("[analisis] no se pudo mandar el aviso del análisis", e));
  } catch { /* un aviso que falla nunca rompe el análisis */ }
}
