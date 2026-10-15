import { Pool } from "pg";
import type { Lead } from "@/app/h/_shared/lead";

// Landings personalizadas de los mails de outreach. Viven en la base de outreach (tabla outreach.landings) y esta web
// entra con un usuario de solo lectura. El token del link es largo y no se puede adivinar.

let pool: Pool | null = null;
export function db(): Pool | null {
  const url = process.env.LANDINGS_DATABASE_URL;
  if (!url) return null;
  pool ??= new Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 3 });
  return pool;
}

const TOKEN = /^[A-Za-z0-9_-]{16,40}$/;

export async function leerLanding(token: string): Promise<Lead | null> {
  const p = db();
  if (!p || !TOKEN.test(token)) return null;
  const { rows } = await p.query(
    `SELECT negocio, dominio, idioma, datos, hallazgos, captura_ancho, captura_alto, actualizado_en FROM outreach.landings WHERE token = $1`, [token]);
  if (!rows[0]) return null;
  const r = rows[0];
  // Cuenta la visita (mejor esfuerzo: si falla, la página igual se muestra).
  p.query(`UPDATE outreach.landings SET vistas = vistas + 1, ultima_vista = now() WHERE token = $1`, [token]).catch(() => {});
  return { datos: r.datos ?? undefined, idioma: r.idioma === "es" ? "es" : "en", negocio: r.negocio, dominio: r.dominio, captura: { src: `/h/${token}/captura?v=${Math.floor(new Date(r.actualizado_en).getTime() / 1000)}`, w: r.captura_ancho, h: r.captura_alto }, hallazgos: r.hallazgos };
}

export async function leerCaptura(token: string): Promise<{ data: Buffer; tipo: string } | null> {
  const p = db();
  if (!p || !TOKEN.test(token)) return null;
  const { rows } = await p.query(`SELECT captura, captura_tipo FROM outreach.landings WHERE token = $1`, [token]);
  return rows[0] ? { data: rows[0].captura, tipo: rows[0].captura_tipo } : null;
}

// Guarda qué botón tocó el negocio ("demo" o "no") y devuelve su nombre para avisar al equipo. null si el token no existe.
export async function registrarRespuesta(token: string, respuesta: "demo" | "no", whatsapp?: string): Promise<{ negocio: string; dominio: string; leadId: number; mail: string | null } | null> {
  const p = db();
  if (!p || !TOKEN.test(token)) return null;
  const { rows } = await p.query(
    `UPDATE outreach.landings SET respuesta = $2, respondido_en = now(), whatsapp = coalesce($3, whatsapp) WHERE token = $1 RETURNING negocio, dominio, lead_id, datos->>'mail' AS mail`, [token, respuesta, whatsapp ?? null]);
  return rows[0] ? { negocio: rows[0].negocio, dominio: rows[0].dominio, leadId: rows[0].lead_id, mail: rows[0].mail ?? null } : null;
}
