"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, Check, Gift, Globe } from "lucide-react";
import type { Analisis, Extra, Hallazgo } from "./analisisTipos";
import { ANALISIS_EVENT, WHATSAPP_URL, abrirContacto, type AnalisisDetalle, type PlanId } from "./constants";
import { t } from "../constants/translations";
import { trackGa } from "@/lib/tracking";
import { PROMO, precioPromo } from "./promo";
import s from "./sitio.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const planes = t.es.subscription.plans;
const PLANES: { id: PlanId; nombre: string; precio: string; sufijo: string; tagline: string; incluye: string[] }[] = [
  { id: "landing", nombre: planes.landing.name, precio: planes.landing.price, sufijo: planes.landing.priceSuffix, tagline: planes.landing.tagline, incluye: planes.landing.features.filter((f) => !("addon" in f && f.addon)).map((f) => f.text).slice(0, 4) },
  { id: "corporativo", nombre: planes.corporate.name, precio: planes.corporate.price, sufijo: planes.corporate.priceSuffix, tagline: planes.corporate.tagline, incluye: planes.corporate.features.filter((f) => !("addon" in f && f.addon)).map((f) => f.text).slice(0, 4) },
];

type ConPin = Hallazgo & { pin: { x: number; y: number } };

// La captura del sitio. Si hay imagen real se usa; si no, una maqueta genérica con la misma forma.
// Cada hallazgo visible lleva un pin numerado; el que está activo muestra su título junto al pin.
function Captura({ dominio, pines, captura, activo, onActivo }: { dominio: string; pines: ConPin[]; captura?: Analisis["captura"]; activo: number | null; onActivo: (i: number | null) => void }) {
  const src = captura?.src;
  const w = captura?.w ?? 1440, h = captura?.h ?? 900;
  return (
    <div className={s.repMarco}>
      <div className={s.repBarra}>
        <span className={s.repPuntos}><i /><i /><i /></span>
        <span className={s.repDir}>{dominio}</span>
      </div>
      <div className={s.repWeb} style={{ aspectRatio: `${w} / ${h}` }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`Captura de ${dominio}`} loading="eager" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        ) : (
          <div className={s.wf} aria-hidden="true">
            <i className={s.wfLogo} /><i className={s.wfLink} style={{ left: "58%" }} /><i className={s.wfLink} style={{ left: "68%" }} /><i className={s.wfLink} style={{ left: "78%" }} /><i className={s.wfLink} style={{ left: "88%", width: "6%" }} />
            <i className={s.wfH} style={{ top: "24%", width: "44%" }} /><i className={s.wfH} style={{ top: "32%", width: "34%" }} />
            <i className={s.wfP} style={{ top: "44%", width: "40%" }} /><i className={s.wfP} style={{ top: "48%", width: "37%" }} /><i className={s.wfP} style={{ top: "52%", width: "30%" }} />
            <i className={s.wfBtn} />
            <i className={s.wfImg} />
            <i className={s.wfCard} style={{ left: "6%" }} /><i className={s.wfCard} style={{ left: "37%" }} /><i className={s.wfCard} style={{ left: "68%" }} />
          </div>
        )}
        {pines.map((hl, i) => (
          <button
            key={hl.id}
            type="button"
            className={s.repPin}
            data-on={activo === i ? 1 : 0}
            style={{ left: `${hl.pin.x}%`, top: `${hl.pin.y}%`, ["--d" as string]: `${0.9 + i * 0.25}s` }}
            aria-label={`Hallazgo ${i + 1}: ${hl.titulo}`}
            onPointerEnter={() => onActivo(i)}
            onPointerLeave={() => onActivo(null)}
            onFocus={() => onActivo(i)}
            onBlur={() => onActivo(null)}
          >
            {i + 1}
            <span className={s.rpEtiqueta} data-lado={hl.pin.x > 58 ? "izq" : "der"} data-on={activo === i ? 1 : 0} aria-hidden="true">{hl.titulo}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Un hallazgo que se ve en la captura. Mientras se lee, ocupa el centro de la pantalla y enciende su pin.
function Paso({ i, hl, activo, onActivo, movil, raiz }: { i: number; hl: Hallazgo; activo: boolean; onActivo: (i: number) => void; movil: boolean; raiz: React.RefObject<HTMLOListElement | null> }) {
  const ref = useRef<HTMLLIElement>(null);
  // Escritorio: el que pasa por el centro de la pantalla. Celular: el que queda en el centro de la lista que se desliza de costado.
  const centro = useInView(ref, movil ? { root: raiz as React.RefObject<Element>, margin: "0px -38% 0px -38%" } : { margin: "-42% 0px -42% 0px" });
  useEffect(() => { if (centro) onActivo(i); }, [centro, i, onActivo]);
  return (
    <motion.li ref={ref} className={s.rpPaso} data-on={activo ? 1 : 0} initial={movil ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }} viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      <span className={s.rpN}>{String(i + 1).padStart(2, "0")}</span>
      <h3 className={s.rpTit}>{hl.titulo}</h3>
      <p className={s.rpDet}>{hl.detalle}</p>
    </motion.li>
  );
}

// Lo básico que un sitio nuevo trae y que a este sitio hoy le falta. Si ya lo tiene, no se menciona.
function basicosDe(a: Analisis): Extra[] {
  const falla = (k: RegExp) => a.ficha?.find((f) => k.test(f.k))?.ok === false;
  const x: Extra[] = [];
  if (falla(/segura/i)) x.push({ titulo: "Conexión segura desde el día uno", detalle: "El candado en el navegador, para que quien entre confíe en vos en el primer segundo y no vea una advertencia." });
  if (falla(/celular/i)) x.push({ titulo: "Pensado primero para el celular", detalle: "La mayoría de tus clientes te va a encontrar desde el teléfono, así que se ve y funciona bien ahí." });
  if (falla(/carga/i)) x.push({ titulo: "Rápido en cualquier celular", detalle: "Se abre enseguida, incluso con poca señal, porque cada segundo de espera es un cliente que se va." });
  if (falla(/opiniones/i)) x.push({ titulo: "Opiniones y trabajos reales a la vista", detalle: "Lo que dicen tus clientes y lo que ya hiciste, en los lugares donde la gente decide." });
  if (falla(/botones|contacto/i)) x.push({ titulo: "Formas claras de consultarte", detalle: "WhatsApp, llamada y presupuesto a un toque, en cada sección." });
  return x.slice(0, 4);
}

// Si la estética no pasa, es un punto obligatorio: se dice sí o sí que el sitio nuevo va a verse moderno.
function disenoDe(a: Analisis): { titulo: string; detalle: string } | null {
  const nivel = a.estetica?.nivel ?? (a.puntaje < 60 ? "anticuado" : "moderno");
  if (nivel === "moderno") return null;
  const hoy = a.estetica?.detalle ? `Hoy ${a.estetica.detalle.charAt(0).toLowerCase()}${a.estetica.detalle.slice(1)}. ` : "";
  return nivel === "anticuado"
    ? { titulo: "Un diseño moderno, hecho desde cero", detalle: `${hoy}Tu sitio nuevo tendría una imagen actual, limpia y prolija, pensada para que quien llega confíe en tu negocio desde el primer vistazo.` }
    : { titulo: "Un diseño más actual y con personalidad", detalle: `${hoy}Tu sitio nuevo se vería moderno y propio, distinto al de tu competencia, para que te recuerden y te elijan.` };
}

// Si está armado con un constructor o con WordPress, se dice y se explica por qué un sitio programado a medida es mejor.
function plataformaDe(a: Analisis): { nombre: string; hoy: string; nuestro: string } | null {
  const tec = a.ficha?.find((f) => /armado/i.test(f.k))?.v ?? "";
  const constructor = tec.match(/Wix|Squarespace|GoDaddy|Weebly|Jimdo|Webflow/i)?.[0];
  if (constructor) return {
    nombre: constructor,
    hoy: `Hoy tu sitio está armado con ${constructor}. Es práctico para empezar, pero te deja dentro de sus plantillas y sus límites: se parece a miles de otros sitios, suele cargar más pesado y cada cosa distinta que quieras sumar depende de lo que esa plataforma permita.`,
    nuestro: "Lo nuestro se programa a medida, a mano y desde cero: es liviano y rápido, no se parece a ningún otro, y puede hacer lo que tu negocio necesite, como pagos, turnos o formularios a medida. Y el sitio es tuyo, no vive atado a una plataforma.",
  };
  if (/WordPress|WooCommerce|Elementor|Divi/i.test(tec)) return {
    nombre: "WordPress",
    hoy: `Hoy tu sitio está armado con ${tec.match(/WordPress/i) ? "WordPress" : tec}. Funciona, pero depende de un tema y de plugins de distintos autores que hay que actualizar todo el tiempo: con los años se vuelve más lento y más difícil de mantener, y cada plugin extra es una pieza más que puede fallar.`,
    nuestro: "Lo nuestro es código propio, sin plugins ni piezas ajenas que mantener: se mantiene simple y rápido, y las actualizaciones y el mantenimiento mensual los resolvemos nosotros, incluidos en el plan.",
  };
  return null;
}

// SOLO VISUAL: la cinta del plan elegido. El descuento real (monto y condiciones) lo define la lógica que se agregue después;
// acá solo están los textos que se muestran.
const CINTA = { titulo: `${PROMO.pct}% de descuento`, detalle: `los primeros ${PROMO.meses} meses` };
const reveal = (i = 0) => ({ initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: i * 0.08 } }, viewport: { once: true, margin: "0px 0px -12% 0px" } });

// Reporte debajo del hero. Aparece cuando el análisis termina; la página baja sola hasta él.
// Mientras se baja, la captura queda fija y cada hallazgo se enciende sobre ella; después vienen lo medido, lo que
// haríamos, el plan elegido y un cierre para actuar.
export function Reporte() {
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const dominio = analisis?.dominio ?? null;
  const [activo, setActivo] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const [movil, setMovil] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const on = () => setMovil(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const irAPaso = (i: number) => {
    const ol = lista.current;
    const li = ol?.children[i] as HTMLElement | undefined;
    if (!ol || !li) return;
    ol.scrollTo({ left: li.offsetLeft - (ol.clientWidth - li.clientWidth) / 2, behavior: "smooth" });
  };
  const quieto = useReducedMotion();

  useEffect(() => {
    const on = (e: Event) => {
      const a = (e as CustomEvent<AnalisisDetalle>).detail.analisis;
      setAnalisis(a);
      setActivo(a ? 0 : null); // arranca con el primer hallazgo encendido
    };
    window.addEventListener(ANALISIS_EVENT, on);
    return () => window.removeEventListener(ANALISIS_EVENT, on);
  }, []);

  // Baja sola hasta el reporte apenas aparece.
  useEffect(() => {
    if (!dominio) return;
    const id = window.setTimeout(() => ref.current?.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "start" }), 400);
    return () => window.clearTimeout(id);
  }, [dominio, quieto]);

  // Si se vuelve a empezar, sube de nuevo al panel.
  const antes = useRef<string | null>(null);
  useEffect(() => {
    if (antes.current && !dominio) document.getElementById("form")?.scrollIntoView({ behavior: quieto ? "auto" : "smooth", block: "center" });
    antes.current = dominio;
  }, [dominio, quieto]);

  const elegido = PLANES.find((p) => p.id === analisis?.planRecomendado) ?? PLANES[0];
  const otro = PLANES.find((p) => p.id !== elegido.id) ?? PLANES[1];

  const elegir = (p: typeof elegido, via: string) => {
    trackGa("select_plan", { plan: p.id, via: "analisis" });
    const conPromo = p.id === elegido.id; // la promo es solo para el plan que elegimos
    abrirContacto({ soloWhatsApp: true,
      titulo: `Plan ${p.nombre}`,
      subtitulo: conPromo
        ? `$${precioPromo(p.precio)}${p.sufijo} los primeros ${PROMO.meses} meses (después $${p.precio}) · Sin pago inicial. Dejanos tu nombre y tu WhatsApp y te escribimos.`
        : `$${p.precio}${p.sufijo} · Sin pago inicial. Dejanos tu nombre y tu WhatsApp y te escribimos.`,
      plan: p.id,
      contexto: `Sitio: ${dominio} · ${via} el plan ${p.nombre}${conPromo ? ` · PROMO ${PROMO.pct}% los primeros ${PROMO.meses} meses ($${precioPromo(p.precio)}/mes, luego $${p.precio})` : ""}`,
      placement: "plan",
    });
  };
  const pedirAnalisis = () => {
    trackGa("pedir_analisis_completo", { sitio: dominio });
    abrirContacto({ soloWhatsApp: true,
      titulo: "Te mandamos el análisis completo",
      subtitulo: "Dejanos tu nombre y tu WhatsApp y te lo enviamos.",
      contexto: `Sitio: ${dominio} · pidió el análisis completo`,
      placement: "plan",
    });
  };
  const hablar = () => trackGa("click_whatsapp", { via: "reporte", sitio: dominio });

  // Los que se ven en la captura llevan pin; el resto (por ejemplo, la seguridad o la velocidad) se cuenta en "Así lo resolvería".
  const pines = (analisis?.hallazgos ?? []).filter((h): h is ConPin => Boolean(h.pin));
  const pasos: Hallazgo[] = pines.length ? pines : analisis?.hallazgos ?? [];
  const total = analisis?.hallazgos.length ?? 3;
  const basicos = analisis ? basicosDe(analisis) : [];
  const diseno = analisis ? disenoDe(analisis) : null;
  const plataforma = analisis ? plataformaDe(analisis) : null;
  const oportunidades = analisis?.oportunidades?.length ? analisis.oportunidades : analisis?.ademas ?? [];

  return (
    <AnimatePresence>
      {analisis?.nicho && (
        <motion.section
          key="nicho"
          id="reporte"
          ref={ref}
          className={s.rep}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: 0.9, ease: EASE } }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          aria-label={analisis.nicho.titulo}
        >
          <div className={`${s.cont} ${s.rpIn}`}>
            <motion.header className={s.rpCab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.4 } }}>
              <h2 className={s.h2}>{analisis.nicho.titulo}</h2>
              <p className={s.lead} style={{ marginTop: 20, maxWidth: "42em" }}>{analisis.nicho.texto}</p>
              <a className={s.rpCue} href="#rp-nicho" aria-label="Seguir bajando">Seguí bajando <ArrowDown size={16} aria-hidden="true" /></a>
            </motion.header>

            <div className={s.rpBloque} id="rp-nicho">
              {(analisis.nicho.hallazgos?.length ?? 0) > 0 && (
                <div className={s.rpMarcado} style={{ marginTop: 0 }}>
                  <motion.h3 className={s.rpSub} {...reveal()}>Lo que podemos <em className={s.rpEm}>mejorar.</em></motion.h3>
                  <div className={s.rpComp}>
                    <div className={s.rpCompCab} aria-hidden="true"><span>Hoy</span><span>Con tu sitio nuevo</span></div>
                    <ul className={s.rpCompLista}>
                      {(analisis.nicho.hallazgos ?? []).map((hl, i) => (
                        <motion.li key={hl.titulo} className={s.rpCompFila} {...reveal(i * 0.06)}>
                          <div className={s.rpHoy}>
                            <p className={s.rpHoyT}>{hl.titulo}</p>
                            <p className={s.rpHoyD}>{hl.detalle}</p>
                          </div>
                          <ArrowRight className={s.rpFlecha} size={20} strokeWidth={1.5} aria-hidden="true" />
                          <p className={s.rpNuevo}>{hl.solucion}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className={s.rpAdemas}>
                <motion.h3 className={s.rpSub} {...reveal()}>Lo que podemos <em className={s.rpEm}>ofrecerte.</em></motion.h3>
                <ul className={s.rpAdemasLista}>
                  {(analisis.nicho.ideas ?? []).map((x, i) => (
                    <motion.li key={x.titulo} className={s.rpAd} {...reveal(i * 0.06)}>
                      <h5 className={s.rpAdT}>{x.titulo}</h5>
                      <p className={s.rpAdD}>{x.detalle}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={s.rpMarcado}>
                <motion.h4 className={s.rpSubS} {...reveal()}>Cómo trabajamos</motion.h4>
                <ul className={s.rpAdemasLista}>
                  {(analisis.nicho.trato ?? []).map((x, i) => (
                    <motion.li key={x.titulo} className={s.rpAd} {...reveal(i * 0.06)}>
                      <h5 className={s.rpAdT}>{x.titulo}</h5>
                      <p className={s.rpAdD}>{x.detalle}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={s.rpMarcado}>
                <motion.h4 className={s.rpSubS} {...reveal()}>Contanos un poco más y te armamos una propuesta</motion.h4>
                <ul className={s.rpPide}>
                  {(analisis.nicho.pedimos ?? []).map((x) => (
                    <motion.li key={x} {...reveal()}><Check size={16} strokeWidth={2} aria-hidden="true" /><span>{x}</span></motion.li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.div className={s.rpCierre} {...reveal()}>
              <h2 className={s.rpCierreT}>Hablemos de <span className={s.rpDomCierre}>tu sitio.</span></h2>
              <p className={s.lead}>Dejanos tu nombre y tu WhatsApp y te escribimos. Sin compromiso.</p>
              <div className={s.rpCierreAcc}>
                <button type="button" className={`${s.btn} ${s.btnLg}`} onClick={() => { trackGa("nicho_quiero"); abrirContacto({ soloWhatsApp: true, titulo: "Contanos tu proyecto", subtitulo: "Dejanos tu nombre y tu WhatsApp y te escribimos.", contexto: "Sitio con contenido para adultos", placement: "plan" }); }}>Quiero mi sitio <ArrowRight size={18} aria-hidden="true" /></button>
                <a className={`${s.btn} ${s.btnWa} ${s.btnLg}`} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackGa("click_whatsapp", { via: "nicho" })}>Hablar por WhatsApp</a>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
      {analisis?.guino && (
        <motion.section
          key="guino"
          id="reporte"
          ref={ref}
          className={s.rep}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: 0.9, ease: EASE } }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          aria-label={analisis.guino.titulo}
        >
          <div className={`${s.cont} ${s.rpIn}`}>
            <motion.header className={s.rpCab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.4 } }}>
              <p className={s.dominio}><Globe size={16} strokeWidth={1.5} aria-hidden="true" />{analisis.dominio}</p>
              <h2 className={s.h2} style={{ marginTop: 16 }}>{analisis.guino.titulo}</h2>
              <p className={s.lead} style={{ marginTop: 20 }}>{analisis.guino.texto}</p>
              {analisis.guino.dato && <p className={s.small} style={{ marginTop: 12 }}>{analisis.guino.dato}</p>}
            </motion.header>
            <motion.div className={s.rpGuinoCap} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.6 } }}>
              <Captura dominio={analisis.dominio} pines={[]} captura={analisis.captura} activo={null} onActivo={() => {}} />
            </motion.div>
            <div className={s.rpBloque}>
              <motion.h3 className={s.rpSub} {...reveal()}>{analisis.guino.tipo === "luma" ? <>Lo que tiene <em className={s.rpEm}>un sitio de _luma.</em></> : analisis.guino.tipo === "gigante" ? <>Lo que hace tan bien <em className={s.rpEm}>un sitio así.</em></> : <>Lo que le <em className={s.rpEm}>construimos.</em></>}</motion.h3>
              <div className={s.rpAdemas}>
                <ul className={s.rpAdemasLista}>
                  {analisis.guino.virtudes.map((x, i) => (
                    <motion.li key={x.titulo} className={s.rpAd} {...reveal(i * 0.06)}>
                      <h5 className={s.rpAdT}>{x.titulo}</h5>
                      <p className={s.rpAdD}>{x.detalle}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            <motion.div className={s.rpCierre} {...reveal()}>
              <h2 className={s.rpCierreT}>{analisis.guino.tipo === "gigante" ? <>¿Querés un sitio con <span className={s.rpDomCierre}>esa calidad</span> para tu negocio?</> : <>¿Querés <span className={s.rpDomCierre}>uno así</span> para tu negocio?</>}</h2>
              <p className={s.lead}>Contanos de tu negocio y te mostramos cómo quedaría tu sitio. Sin compromiso.</p>
              <div className={s.rpCierreAcc}>
                <button type="button" className={`${s.btn} ${s.btnLg}`} onClick={() => { trackGa("guino_quiero", { sitio: analisis.dominio }); abrirContacto({ soloWhatsApp: true, titulo: "Quiero un sitio así", subtitulo: "Dejanos tu nombre y tu WhatsApp y te escribimos.", contexto: `Sitio de referencia: ${analisis.dominio}`, placement: "plan" }); }}>Quiero un sitio así <ArrowRight size={18} aria-hidden="true" /></button>
                <a className={`${s.btn} ${s.btnWa} ${s.btnLg}`} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={hablar}>Hablar por WhatsApp</a>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
      {analisis && !analisis.guino && !analisis.nicho && (
        <motion.section
          key="reporte"
          id="reporte"
          data-lead-form
          ref={ref}
          className={s.rep}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: 0.9, ease: EASE } }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          aria-label={`Análisis de ${analisis.dominio}`}
        >
          <div className={`${s.cont} ${s.rpIn}`}>
            {/* 1) Qué encontramos, con la captura fija a la izquierda */}
            <motion.header className={s.rpCab} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.4 } }}>
              <p className={s.dominio}><Globe size={16} strokeWidth={1.5} aria-hidden="true" />{analisis.dominio}</p>
              <h2 className={s.h2} style={{ marginTop: 16 }}>
                Encontramos {total === 1 ? "algo" : `${total} cosas`} que le <em className={s.rpEm}>cuestan clientes</em> a tu sitio.
              </h2>
              <p className={s.lead} style={{ marginTop: 20 }}>Lo miramos como lo ve alguien que llega por primera vez. Bajá y te mostramos cada punto sobre tu propia página.</p>
              <a className={s.rpCue} href="#rp-pasos" aria-label="Seguir bajando">Seguí bajando <ArrowDown size={16} aria-hidden="true" /></a>
            </motion.header>

            <div className={s.rpScroll} id="rp-pasos">
              <motion.div className={s.rpCaptura} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: 0.6 } }}>
                <Captura dominio={analisis.dominio} pines={pines} captura={analisis.captura} activo={activo} onActivo={setActivo} />
                <p className={s.rpCuenta} aria-hidden="true">
                  <span className={s.num}>{String((activo ?? 0) + 1).padStart(2, "0")} / {String(pasos.length).padStart(2, "0")}</span>
                  {(activo ?? 0) < pasos.length - 1 && <span className={s.rpSigue}>Seguí bajando <ArrowDown size={14} aria-hidden="true" /></span>}
                </p>
              </motion.div>
              <ol className={s.rpPasos} ref={lista}>
                {pasos.map((hl, i) => (
                  <Paso key={hl.id} i={i} hl={hl} activo={activo === i} onActivo={setActivo} movil={movil} raiz={lista} />
                ))}
              </ol>
              <div className={s.rpPuntos} aria-label="Hallazgos">
                {pasos.map((hl, i) => (
                  <button key={hl.id} type="button" className={s.rpPunto} data-on={activo === i ? 1 : 0} aria-label={`Ver el hallazgo ${i + 1}: ${hl.titulo}`} aria-current={activo === i} onClick={() => irAPaso(i)} />
                ))}
              </div>
            </div>

            {/* 2) El sitio nuevo: primero lo que haría de más (ideas a medida del negocio), después lo marcado resuelto y lo básico */}
            <div className={s.rpBloque}>
              <motion.h3 className={s.rpSub} {...reveal()}>Te armamos un sitio <em className={s.rpEm}>completamente nuevo.</em></motion.h3>
              <motion.p className={s.lead} style={{ marginTop: 14, maxWidth: "40em" }} {...reveal(1)}>
                No es un parche sobre {analisis.dominio}: lo hacemos desde cero, alrededor de lo que hace tu negocio. Resuelve lo que marcamos y, sobre todo, hace más que el de hoy.
              </motion.p>

              {diseno && (
                <motion.div className={s.rpDestaca} {...reveal()}>
                  <h4 className={s.rpDestacaT}>{diseno.titulo}</h4>
                  <p className={s.rpDestacaD}>{diseno.detalle}</p>
                </motion.div>
              )}

              {oportunidades.length > 0 && (
                <div className={s.rpAdemas}>
                  <motion.h4 className={s.rpSub} {...reveal()}>{analisis.oportunidades?.length && analisis.rubro ? <>Lo que tu sitio podría hacer <em className={s.rpEm}>por tu {analisis.rubro}.</em></> : "Y además, para que te encuentren y te elijan"}</motion.h4>
                  <ul className={s.rpAdemasLista}>
                    {oportunidades.map((x, i) => (
                      <motion.li key={x.titulo} className={s.rpAd} {...reveal(i * 0.06)}>
                        <h5 className={s.rpAdT}>{x.titulo}</h5>
                        <p className={s.rpAdD}>{x.detalle}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {plataforma && (
                <motion.div className={s.rpPlat} {...reveal()}>
                  <h4 className={s.rpSubS}>Hoy está hecho con {plataforma.nombre}. El tuyo sería a medida.</h4>
                  <div className={s.rpPlatCols}>
                    <p className={s.rpPlatP}>{plataforma.hoy}</p>
                    <p className={s.rpPlatP}>{plataforma.nuestro}</p>
                  </div>
                </motion.div>
              )}

              {analisis.resenas && (
                <motion.div className={s.rpResenas} {...reveal()}>
                  <p className={s.rpResenasN}><strong>{analisis.resenas.rating.toString().replace(".", ",")} ★</strong> en {analisis.resenas.n} reseñas de Google</p>
                  <p className={s.rpResenasT}>Tus clientes ya confían en vos. Tu sitio nuevo pondría esas opiniones al frente, justo donde la gente decide escribirte.</p>
                </motion.div>
              )}

              <div className={s.rpMarcado}>
                <motion.h4 className={s.rpSubS} {...reveal()}>Y todo lo que marcamos, resuelto</motion.h4>
                <div className={s.rpComp}>
                <div className={s.rpCompCab} aria-hidden="true"><span>Hoy</span><span>Con tu sitio nuevo</span></div>
                <ul className={s.rpCompLista}>
                  {analisis.hallazgos.map((hl, i) => (
                    <motion.li key={hl.id} className={s.rpCompFila} {...reveal(i * 0.06)}>
                      <div className={s.rpHoy}>
                        <p className={s.rpHoyT}>{hl.titulo}</p>
                        <p className={s.rpHoyD}>{hl.detalle}</p>
                      </div>
                      <ArrowRight className={s.rpFlecha} size={20} strokeWidth={1.5} aria-hidden="true" />
                      <p className={s.rpNuevo}>{hl.solucion}</p>
                    </motion.li>
                  ))}
                </ul>
                </div>
              </div>

              {basicos.length > 0 && (
                <div className={s.rpAdemas}>
                  <motion.h4 className={s.rpSubS} {...reveal()}>Y desde el primer día también tendría</motion.h4>
                  <ul className={s.rpAdemasLista}>
                    {basicos.map((x, i) => (
                      <motion.li key={x.titulo} className={s.rpAd} {...reveal(i * 0.06)}>
                        <h5 className={s.rpAdT}>{x.titulo}</h5>
                        <p className={s.rpAdD}>{x.detalle}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.ul className={s.rpIncluye} {...reveal(1)}>
                <li>Hecho a mano, sin plantillas</li>
                <li>Hosting y dominio incluidos</li>
                <li>Mantenimiento todos los meses</li>
                <li>Sin pago inicial</li>
              </motion.ul>
            </div>

            {/* 4) Cierre y plan, juntos */}
            <motion.div className={s.rpCierre} {...reveal()}>
              <h2 className={`${s.rpCierreT} ${s.rpCierreFit}`}>Hagamos que <span className={`${s.rpDomCierre} ${s.rpDomFit}`} style={{ ["--n" as string]: analisis.dominio.length }}>{analisis.dominio}</span> trabaje para vos.</h2>
              <p className={s.lead}>Contanos de tu negocio y te mostramos cómo quedaría tu sitio. Sin compromiso.</p>

              <div className={s.rpPlanZona}>
                <p className={s.rpPlanMotivo}>{analisis.motivoPlan}</p>
                <div className={s.repPlanes}>
                  <div className={`${s.repCard} ${s.eleg}`}>
                    <div className={s.cintaWrap}>
                      <div className={s.cinta} role="note">
                        <Gift size={26} strokeWidth={1.8} aria-hidden="true" />
                        <div>
                          <strong>{CINTA.titulo}</strong>
                          <span>{CINTA.detalle}</span>
                        </div>
                      </div>
                      <i className={s.cintaPliegue} aria-hidden="true" />
                    </div>
                    <p className={s.elegido}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" /><path className={s.elegidoTilde} d="M5.5 9.4l2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>El plan que elegimos para vos</span>
                    </p>
                    <h3 className={s.h3}>{elegido.nombre}</h3>
                    <p className={s.body} style={{ marginTop: 8 }}>{elegido.tagline}</p>
                    <p className={s.precioPlan}><s className={s.precioTachado}>${elegido.precio}</s><strong>${precioPromo(elegido.precio)}</strong><span>{elegido.sufijo}</span></p>
                    <p className={s.promoNota}>{PROMO.pct}% de descuento los primeros {PROMO.meses} meses. Después, ${elegido.precio}{elegido.sufijo}.</p>
                    <ul className={s.feat}>
                      {elegido.incluye.map((f) => (
                        <li key={f}><Check size={16} strokeWidth={2} aria-hidden="true" /><span>{f}</span></li>
                      ))}
                    </ul>
                    <div className={s.repAcc}>
                      <button type="button" className={`${s.btn} ${s.btnFull}`} onClick={() => elegir(elegido, "eligió")}>Quiero el plan {elegido.nombre}</button>
                      <button type="button" className={`${s.link} ${s.linkSoft} ${s.linkBtn} ${s.salida}`} onClick={pedirAnalisis}>Recibir el análisis completo por WhatsApp</button>
                    </div>
                  </div>

                  <div className={`${s.repCard} ${s.otro}`}>
                    <h3 className={s.h3}>{otro.nombre}</h3>
                    <p className={s.body} style={{ marginTop: 8 }}>{otro.tagline}</p>
                    <p className={s.precioPlan}><strong>${otro.precio}</strong><span>{otro.sufijo}</span></p>
                    <ul className={s.feat}>
                      {otro.incluye.map((f) => (
                        <li key={f}><Check size={16} strokeWidth={2} aria-hidden="true" /><span>{f}</span></li>
                      ))}
                    </ul>
                    <div className={s.repAcc}>
                      <button type="button" className={`${s.link} ${s.linkSoft} ${s.linkBtn} ${s.salida}`} onClick={() => elegir(otro, "prefirió")}>Prefiero el plan {otro.nombre}</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={s.rpCierreAcc}>
                <button type="button" className={`${s.btn} ${s.btnLg}`} onClick={() => elegir(elegido, "eligió")}>Quiero mi sitio <ArrowRight size={18} aria-hidden="true" /></button>
                <a className={`${s.btn} ${s.btnWa} ${s.btnLg}`} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={hablar}>Hablar por WhatsApp</a>
              </div>
              {analisis.tienda && <p className={s.small}>Vimos que vendés online: también armamos tiendas a medida, con Mercado Pago integrado y 0% de comisión de plataforma.</p>}
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
