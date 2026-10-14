"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowDown, ArrowRight, Globe } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { PASOS_ANALISIS, type Analisis } from "./analisisTipos";
import { Anillo } from "./Anillo";
import { ANALISIS_EVENT, type AnalisisDetalle } from "./constants";
import { trackGa } from "@/lib/tracking";
import s from "./sitio.module.css";

type Fase = "idle" | "analizando" | "listo" | "sinsitio" | "error";
type Respuesta = { ok: true; analisis: Analisis } | { ok: false; motivo: string; esperaMin?: number };

const DURACION = 9000; // ms que tarda el círculo en llegar al 90%; el resto lo completa la respuesta real
const MIN_MS = 4000; // aunque la respuesta llegue antes, el análisis se muestra al menos este tiempo
const ESPERA_TOKEN = 3200; // el servidor pide una espera mínima desde que cargó la página (anti-bots)
const dormir = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const EASE = [0.16, 1, 0.3, 1] as const;

// "https://www.MiNegocio.com/inicio?x=1" -> "minegocio.com". Devuelve null si no parece una dirección.
function normalizar(v: string): string | null {
  const d = v.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0].toLowerCase();
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d) && d.length <= 120 ? d : null;
}

// ---- Límites del lado del navegador (comodidad, no seguridad: el servidor tiene los topes de verdad).
// Se recuerdan los últimos análisis para no repetirlos y se corta el uso excesivo antes de pedirle nada al servidor.
const LS = "luma.analisis.v3"; // se sube el número cada vez que cambia la forma o el texto de los resultados: los guardados antes se descartan
const MAX_DIA = 6;
const SIETE_DIAS = 7 * 24 * 3600_000;
type Memoria = { hist: number[]; cache: Record<string, { t: number; a: Analisis }> };
function leerMemoria(): Memoria {
  try {
    const m = JSON.parse(localStorage.getItem(LS) ?? "null") as Memoria | null;
    const ahora = Date.now();
    return { hist: (m?.hist ?? []).filter((t) => ahora - t < 24 * 3600_000), cache: Object.fromEntries(Object.entries(m?.cache ?? {}).filter(([, v]) => ahora - v.t < SIETE_DIAS)) };
  } catch { return { hist: [], cache: {} }; }
}
function guardarMemoria(m: Memoria) { try { localStorage.setItem(LS, JSON.stringify(m)); } catch { /* sin almacenamiento: sigue igual */ } }

// Prueba de trabajo: encontrar un número que, junto con el token, dé un hash con N ceros al inicio. Toma menos de un segundo
// en un celular normal; a un robot que dispara miles de pedidos le cuesta mucho.
async function resolverPow(token: string, bits: number): Promise<string> {
  const enc = new TextEncoder();
  for (let n = 0; ; n++) {
    const h = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(`${token}:${n}`)));
    let ceros = 0;
    for (const b of h) { if (b === 0) { ceros += 8; continue; } ceros += Math.clz32(b) - 24; break; }
    if (ceros >= bits) return String(n);
    if (n % 1500 === 1499) await new Promise((r) => setTimeout(r, 0)); // deja respirar a la pantalla
  }
}

const entra = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.1 } }, exit: { opacity: 0, y: -8, transition: { duration: 0.22 } } };

export function Analizador() {
  const [fase, setFase] = useState<Fase>("idle");
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");
  const [dominio, setDominio] = useState("");
  const [pct, setPct] = useState(0);
  const [resultado, setResultado] = useState<Analisis | null>(null);
  const [mensajeError, setMensajeError] = useState("");
  const token = useRef<{ t: string; en: number; bits: number } | null>(null);
  const trampa = useRef<HTMLInputElement>(null);
  const [alto, setAlto] = useState<number>();
  const interior = useRef<HTMLDivElement>(null);
  const inicioRef = useRef(0);

  // Token de la página: el servidor lo emite al cargar y lo pide de vuelta con cada análisis.
  async function cargarToken() {
    try {
      const r = await fetch("/api/analizar-sitio", { cache: "no-store" });
      const j = await r.json();
      token.current = { t: j.t, en: Date.now(), bits: Number(j.bits) || 14 };
    } catch { token.current = null; }
  }
  useEffect(() => { cargarToken(); }, []);

  async function pedir(sitio: string): Promise<Respuesta> {
    try {
      if (!token.current) await cargarToken();
      if (!token.current) return { ok: false, motivo: "red" };
      const { t, en, bits } = token.current;
      const espera = ESPERA_TOKEN - (Date.now() - en);
      const [pow] = await Promise.all([resolverPow(t, bits), espera > 0 ? dormir(espera) : Promise.resolve()]);
      const r = await fetch("/api/analizar-sitio", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitio, t, pow, website: trampa.current?.value ?? "" }),
      });
      const j = await r.json().catch(() => null);
      cargarToken(); // token nuevo para el próximo intento
      return j?.ok ? { ok: true, analisis: j.analisis } : { ok: false, motivo: j?.motivo ?? "error", esperaMin: j?.esperaMin };
    } catch {
      return { ok: false, motivo: "red" };
    }
  }

  // El panel acompaña a su contenido: cuando cambia de estado, cambia de altura con suavidad.
  useEffect(() => {
    const el = interior.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAlto(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Avance del círculo: parejo, con un pequeño frenazo al final (queda en 92% esperando la respuesta). Se actualiza 10 veces por segundo
  // (el arco se suaviza con una transición CSS), para no recargar de trabajo a los celulares modestos.
  useEffect(() => {
    if (fase !== "analizando") return;
    inicioRef.current = performance.now();
    const id = window.setInterval(() => {
      const x = Math.min(1, (performance.now() - inicioRef.current) / DURACION);
      const eased = x < 0.85 ? (x / 0.85) * 0.9 : 0.9 + ((x - 0.85) / 0.15) * 0.1;
      setPct(Math.min(92, Math.round(eased * 100))); // no llega al 100% hasta que hay respuesta
    }, 100);
    return () => window.clearInterval(id);
  }, [fase]);

  // El reporte (debajo del hero) aparece cuando termina el análisis y se esconde si se vuelve a empezar.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent<AnalisisDetalle>(ANALISIS_EVENT, { detail: { analisis: fase === "listo" ? resultado : null } }));
  }, [fase, resultado]);

  async function analizar(e: React.FormEvent) {
    e.preventDefault();
    const d = normalizar(valor);
    if (!d) { setError("Escribí la dirección de tu sitio, por ejemplo minegocio.com"); return; }
    setError("");
    setDominio(d);
    setPct(0);
    setResultado(null);
    setFase("analizando");
    trackGa("analysis_start", { sitio: d });
    const inicio = performance.now();
    // 1) Si este navegador ya analizó ese sitio hace poco, se muestra lo mismo sin molestar al servidor.
    const memoria = leerMemoria();
    const guardado = memoria.cache[d];
    // 2) Tope por navegador: pasado un número de análisis por día, se invita a escribirnos.
    const agotado = !guardado && memoria.hist.length >= MAX_DIA;
    const r: Respuesta = guardado ? { ok: true, analisis: guardado.a } : agotado ? { ok: false, motivo: "limite" } : await pedir(d);
    // Los sitios para adultos no se guardan en el navegador: no cuestan nada y así siempre se ve la versión actual.
    if (r.ok && !guardado && !r.analisis.nicho) {
      memoria.hist.push(Date.now());
      memoria.cache[d] = { t: Date.now(), a: r.analisis };
      guardarMemoria(memoria);
    }
    const falta = MIN_MS - (performance.now() - inicio);
    if (falta > 0) await dormir(falta);
    if (!r.ok) {
      if (r.motivo === "dominio") { setFase("idle"); setError("Esa dirección no parece válida. Probá con algo como minegocio.com"); return; }
      setMensajeError(
        r.motivo === "no_abre" ? `No pudimos abrir ${d}. Revisá que esté bien escrita o probá con otra dirección.`
        : r.motivo === "limite" || r.motivo === "ocupado" ? "Hiciste muchos análisis seguidos. Probá de nuevo en un rato, o escribinos y lo vemos juntos."
        : "Algo falló de nuestro lado. Probá de nuevo en unos minutos."
      );
      setFase("error");
      trackGa("analysis_error", { sitio: d, motivo: r.motivo });
      return;
    }
    setResultado(r.analisis);
    setPct(100);
    setFase("listo");
    trackGa("analysis_done", r.analisis.nicho ? { nicho: "adultos" } : { sitio: d, puntaje: r.analisis.puntaje, plan: r.analisis.planRecomendado });
  }

  const paso = Math.min(PASOS_ANALISIS.length - 1, Math.floor(pct / 25));
  const salida = `${s.link} ${s.linkSoft} ${s.linkBtn} ${s.salida}`;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        id="form"
        data-lead-form
        className={s.panel}
        style={{ scrollMarginTop: 24 }}
        initial={false}
        animate={alto ? { height: alto } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div ref={interior}>
          <AnimatePresence mode="wait" initial={false}>
            {fase === "idle" && (
              <motion.form key="idle" onSubmit={analizar} noValidate className={`${s.panelIn} ${s.fijo}`} {...entra}>
                <h2 className={s.panelTitulo}>¿Ya tenés sitio? Vemos qué mejorarle.</h2>
                <p className={`${s.panelSub} ${s.soloDesk}`}>Pegá la dirección y en segundos te mostramos un análisis.</p>

                {/* Campo trampa: las personas no lo ven; un bot que completa todo lo llena y se lo rechaza. */}
                <input ref={trampa} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <div className={s.campo}>
                  <label htmlFor="sitio-url" className={s.etiqueta}>La dirección de tu sitio</label>
                  <div className={s.direccion}>
                    <Globe size={20} strokeWidth={1.5} aria-hidden="true" />
                    <input
                      id="sitio-url"
                      name="sitio"
                      type="text"
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      autoComplete="url"
                      placeholder="minegocio.com"
                      value={valor}
                      onChange={(e) => { setValor(e.target.value); if (error) setError(""); }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "sitio-url-err" : undefined}
                    />
                  </div>
                  {error && <p id="sitio-url-err" className={s.error}>{error}</p>}
                </div>

                <div className={s.pie}>
                  <div className={s.accion}>
                    <button type="submit" className={`${s.btn} ${s.btnFull}`}>
                      Analizar mi sitio <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <button type="button" onClick={() => { setFase("sinsitio"); trackGa("no_site_click"); }} className={salida}>
                    Todavía no tengo sitio
                  </button>
                </div>
              </motion.form>
            )}

            {fase === "analizando" && (
              <motion.div key="analizando" className={s.cargando} role="status" {...entra}>
                <Anillo progreso={pct} orbita>
                  <span className={s.cargaNum}>{pct}%</span>
                </Anillo>
                <p className={s.cargaTit}>Analizando {dominio}</p>
                <p className={s.cargaPaso} aria-live="polite">{PASOS_ANALISIS[paso]}…</p>
              </motion.div>
            )}

            {fase === "listo" && (
              <motion.div key="listo" className={`${s.panelIn} ${s.fijo}`} {...entra}>
                <div>
                  <p className={s.dominio}><Globe size={16} strokeWidth={1.5} aria-hidden="true" />{dominio}</p>
                  {resultado?.nicho ? (
                    <>
                      <h2 className={s.h3} style={{ marginTop: 20 }}>{resultado.nicho.panelTitulo}</h2>
                      <p className={s.itemD} style={{ marginTop: 8 }}>Mirá lo que podemos ofrecerte, justo debajo.</p>
                    </>
                  ) : resultado?.guino ? (
                    <>
                      <h2 className={s.h3} style={{ marginTop: 20 }}>{resultado.guino.titulo}</h2>
                      <p className={s.itemD} style={{ marginTop: 8 }}>Mirá lo que tiene, justo debajo.</p>
                    </>
                  ) : (
                    <>
                      <h2 className={s.h3} style={{ marginTop: 20 }}>Listo. Encontramos {resultado?.hallazgos.length ?? 3} cosas para mejorar.</h2>
                      <p className={s.itemD} style={{ marginTop: 8 }}>Te las mostramos sobre tu propia página, justo debajo.</p>
                    </>
                  )}
                </div>
                <div className={s.pie}>
                  <div className={s.accion}>
                    <button type="button" className={`${s.btn} ${s.btnFull}`} onClick={() => document.getElementById("reporte")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                      Ver el análisis <ArrowDown size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <button type="button" onClick={() => { setFase("idle"); setValor(""); }} className={salida}>
                    Analizar otro sitio
                  </button>
                </div>
              </motion.div>
            )}

            {fase === "error" && (
              <motion.div key="error" className={`${s.panelIn} ${s.fijo}`} role="alert" {...entra}>
                <div>
                  <p className={s.dominio}><Globe size={16} strokeWidth={1.5} aria-hidden="true" />{dominio}</p>
                  <h2 className={s.h3} style={{ marginTop: 12 }}>No pudimos completar el análisis.</h2>
                  <p className={s.itemD}>{mensajeError}</p>
                </div>
                <div className={s.pie}>
                  <div className={s.accion}>
                    <button type="button" className={`${s.btn} ${s.btnFull}`} onClick={() => { setFase("idle"); }}>Probar con otra dirección</button>
                  </div>
                  <button type="button" onClick={() => { setFase("sinsitio"); trackGa("no_site_click"); }} className={salida}>
                    Prefiero que me escriban
                  </button>
                </div>
              </motion.div>
            )}

            {fase === "sinsitio" && (
              <motion.div key="sinsitio" className={`${s.panelIn} ${s.fijo}`} {...entra}>
                <LeadForm
                  placement="sin-sitio"
                  variante="corto"
                  plano
                  title="Armemos tu sitio desde cero"
                  subtitle=""
                  boton="Quiero mi sitio"
                />
                <button type="button" onClick={() => setFase("idle")} className={salida}>
                  Prefiero analizar mi sitio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
}
