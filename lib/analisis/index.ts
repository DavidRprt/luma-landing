import type { Analisis, Hallazgo } from "@/app/sitio/analisisTipos";
import { ademas, evaluar, elegirPlan, ficha } from "./evaluar";
import { personalizar, type ResultadoIa } from "./ia";
import { opinionesMaps } from "./maps";
import { analisisGuino, guinoDe } from "./guinos";
import crypto from "node:crypto";
import { capturar, type Zona } from "./captura";
import { avisarAnalisis, avisarGasto, cerrar, costoUsd, revisar, type Veredicto } from "./limites";
import { rastrear, type Hechos } from "./rastreo";
import { dominioSensible } from "./contenido";
import { analisisNicho } from "./nichos";
import { normalizarDominio } from "./seguro";

export type Resultado =
  | { ok: true; analisis: Analisis; cache: boolean }
  | { ok: false; motivo: "dominio" | "no_abre" | "limite" | "ocupado" | "error"; esperaMin?: number };

// El plan lo elige la IA según el negocio (y, si no hay IA, una regla conservadora); la tienda siempre sale de los datos medidos.
function planFinal(hechos: Hechos, ia: ResultadoIa): ReturnType<typeof elegirPlan> {
  const base = elegirPlan(hechos);
  return ia.plan && ia.motivoPlan ? { ...base, planRecomendado: ia.plan, motivoPlan: ia.motivoPlan } : base;
}

export async function analizarSitio(entrada: string, ipHash: string, dispositivo: string): Promise<Resultado> {
  const dominio = normalizarDominio(entrada);
  if (!dominio) return { ok: false, motivo: "dominio" };

  const v: Veredicto = await revisar(dominio, ipHash, dispositivo);
  if (v.tipo === "cache") { void avisarAnalisis(dominio, "ya analizado hace poco (caché)", { Plan: v.analisis.planRecomendado, Rubro: v.analisis.rubro }); return { ok: true, analisis: v.analisis, cache: true }; }
  if (v.tipo === "bloqueado") return { ok: false, motivo: v.motivo === "ocupado" ? "ocupado" : "limite", esperaMin: v.esperaMin };

  try {
    // El rastreo (sin IA) y la captura corren a la vez; la captura también mide la velocidad real de carga.
    // Sitios para adultos: no se capturan, no se guardan y no se mandan a la IA. Se lee solo el HTML y se hace un mini análisis con reglas.
    const porNombre = dominioSensible(dominio);
    const hechos = await rastrear(dominio).catch((e) => { if (porNombre) return null; throw e; });
    if (porNombre || hechos?.sensible) {
      await cerrar(v.id, { resultado: "no_apto" });
      const hallazgos = hechos ? evaluar(hechos).candidatos : [];
      void avisarAnalisis(dominio, "sitio para adultos (sin captura ni IA)", { Tipo: hechos?.tipoAdulto ?? "general" });
      return { ok: true, analisis: analisisNicho(dominio, hechos?.tipoAdulto ?? "general", hallazgos), cache: false };
    }
    if (!hechos) throw new Error("no abre");
    const cap0 = await capturar(`https://${dominio}/`);
    const cap = cap0 ?? (hechos.https ? null : await capturar(hechos.urlFinal)); // sitio que solo abre por http
    const guino = guinoDe(dominio);
    if (guino) {
      // Sitio nuestro: se muestra la captura y sus virtudes. Sin IA ni consultas extra.
      let captura: Analisis["captura"];
      let guardada: { jpeg: Buffer; ancho: number; alto: number; token: string } | undefined;
      if (cap) {
        const token = crypto.randomBytes(16).toString("base64url");
        guardada = { jpeg: cap.jpeg, ancho: cap.ancho, alto: cap.alto, token };
        captura = { src: `/api/analizar-sitio/captura/${token}`, w: cap.ancho, h: cap.alto };
      }
      const analisis = analisisGuino(dominio, guino, captura);
      await cerrar(v.id, { resultado: "ok", datos: analisis, usoIa: false, tokensEntrada: 0, tokensSalida: 0, captura: guardada });
      void avisarAnalisis(dominio, `guiño (${guino.tipo})`);
      return { ok: true, analisis, cache: false };
    }
    const base = evaluar(hechos, cap?.medidas);
    // La IA mira la miniatura y elige y escribe los 3 hallazgos (si hay cupo de IA; si no, quedan los de reglas).
    const [ia, resenas]: [ResultadoIa, Awaited<ReturnType<typeof opinionesMaps>>] = await Promise.all([
      v.usarIa ? personalizar(hechos, base, cap?.mini) : Promise.resolve({ hallazgos: base.hallazgos, tokensEntrada: 0, tokensSalida: 0, usoIa: false }),
      v.usarMaps ? opinionesMaps(dominio, hechos) : Promise.resolve(undefined),
    ]);
    let hallazgos: Hallazgo[] = ia.hallazgos.map((h) => { const { zona, ...resto } = h; void zona; return resto; }); // sin captura, quedan los pines de reglas
    let captura: Analisis["captura"];
    let guardada: { jpeg: Buffer; ancho: number; alto: number; token: string } | undefined;
    if (cap) {
      // Si el hallazgo es del menú, el título, el botón o el contacto, se marca donde está de verdad (medido en la página).
      const zonaDe: Record<string, Zona | undefined> = { menu: cap.zonas.menu, h1: cap.zonas.h1, titulo: cap.zonas.h1, cta: cap.zonas.cta, boton: cap.zonas.cta, contacto: cap.zonas.contacto, imagen: cap.zonas.hero };
      hallazgos = ia.hallazgos.map(({ zona, ...h }) => {
        const z = zonaDe[zona ?? ""] ?? zonaDe[h.id];
        // Con captura real, un hallazgo sin zona visible no se marca (mejor sin pin que un pin en el lugar equivocado).
        return { ...h, pin: z ? { x: Math.round(Math.min(96, Math.max(4, z.x + z.w / 2))), y: Math.round(Math.min(94, Math.max(6, z.y + z.h / 2))) } : null };
      });
      const token = crypto.randomBytes(16).toString("base64url");
      guardada = { jpeg: cap.jpeg, ancho: cap.ancho, alto: cap.alto, token };
      captura = { src: `/api/analizar-sitio/captura/${token}`, w: cap.ancho, h: cap.alto };
    }
    const analisis: Analisis = { dominio, puntaje: base.puntaje, hallazgos, ...planFinal(hechos, ia), ficha: ficha(hechos, cap?.medidas), ademas: ademas(hechos), ...(ia.oportunidades ? { oportunidades: ia.oportunidades } : {}), ...(ia.rubro ? { rubro: ia.rubro } : {}), ...(ia.estetica ? { estetica: ia.estetica } : {}), ...(resenas ? { resenas } : {}), ...(captura ? { captura } : {}) };
    await cerrar(v.id, { resultado: "ok", datos: analisis, usoIa: ia.usoIa, costoUsd: costoUsd(ia.tokensEntrada, ia.tokensSalida, v.usarMaps && Boolean(process.env.GOOGLE_PLACES_KEY)), tokensEntrada: ia.tokensEntrada, tokensSalida: ia.tokensSalida, captura: guardada });
    void avisarGasto();
    void avisarAnalisis(dominio, "análisis completo", { Plan: analisis.planRecomendado, Rubro: analisis.rubro, Estética: analisis.estetica?.nivel, "Hallazgos": hallazgos.map((h) => h.titulo).join(" / "), "Con IA": ia.usoIa ? "sí" : "no", "Costo estimado (USD)": costoUsd(ia.tokensEntrada, ia.tokensSalida, v.usarMaps && Boolean(process.env.GOOGLE_PLACES_KEY)).toFixed(4) });
    return { ok: true, analisis, cache: false };
  } catch (e) {
    const sinAbrir = /no abre|ENOTFOUND|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|tiempo agotado|no es una página|destino no permitido|redirecciones|no permitid/i.test(String((e as Error)?.message) + String((e as NodeJS.ErrnoException)?.code));
    await cerrar(v.id, { resultado: sinAbrir ? "no_abre" : "error" });
    void avisarAnalisis(dominio, sinAbrir ? "el sitio no abre" : "error del analizador");
    return { ok: false, motivo: sinAbrir ? "no_abre" : "error" };
  }
}
