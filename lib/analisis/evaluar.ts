import type { Analisis, Extra, FichaItem, Hallazgo } from "@/app/sitio/analisisTipos";
import type { Medidas } from "./captura";
import type { Hechos } from "./rastreo";

// De los datos medidos a un puntaje, los hallazgos y el plan recomendado. Todo con reglas, sin IA:
// la IA (si hay) solo reescribe los 3 hallazgos elegidos para que hablen del sitio de la persona.

type Chequeo = {
  id: string;
  peso: number;
  ok: (h: Hechos, m?: Medidas) => boolean;
  hecho: (h: Hechos, m?: Medidas) => string; // dato corto y concreto que sirve de base para el texto
  oculto?: true; // cuenta para el puntaje pero no se muestra: es técnico y a un dueño de negocio no le dice nada
  titulo: string;
  detalle: string;
  solucion: string;
  pin: { x: number; y: number };
};

const ANIO = new Date().getFullYear();

const CHEQUEOS: Chequeo[] = [
  { id: "https", peso: 12, ok: (h) => h.https && !h.certInvalido, hecho: (h) => (h.certInvalido ? "el certificado de seguridad es inválido" : "abre sin HTTPS"),
    titulo: "El navegador lo marca como “no seguro”", detalle: "Sin el candado de seguridad, muchas personas se asustan y se van antes de leer algo.", solucion: "Un sitio con conexión segura, que muestra el candado en el navegador.", pin: { x: 22, y: 6 } },
  { id: "viewport", peso: 12, ok: (h) => h.viewport, hecho: () => "no está preparado para el celular",
    titulo: "No está pensado para el celular", detalle: "Hoy la mayoría entra desde el teléfono, y si se ve mal, se va.", solucion: "Un sitio que se adapta a cualquier pantalla y se lee bien en el celular.", pin: { x: 74, y: 40 } },
  { id: "contacto", peso: 12, ok: (h) => h.tel || h.whatsapp || h.mail || h.formularios > 0, hecho: () => "no tiene teléfono, WhatsApp, mail ni formulario a la vista",
    titulo: "No hay una forma clara de contactarte", detalle: "Quien llega con ganas de escribirte no encuentra por dónde empezar.", solucion: "Teléfono, WhatsApp y formulario siempre a la vista, en cada sección.", pin: { x: 24, y: 58 } },
  { id: "cta", peso: 10, ok: (h) => h.llamadosAccion >= 2, hecho: (h) => (h.llamadosAccion === 0 ? "no hay ningún botón que invite a escribir o pedir presupuesto" : "hay un solo botón que invite a contactarse"),
    titulo: "Falta un botón que invite a escribirte", detalle: "La página muestra lo que hacés, pero no dice qué hacer después.", solucion: "Un botón claro (“Pedí tu presupuesto”) en la portada y al final de cada sección.", pin: { x: 30, y: 52 } },
  { id: "titulo", peso: 10, ok: (h) => h.titulo.length >= 10 && h.titulo.length <= 75 && h.descripcion.length >= 50, hecho: (h) => (!h.descripcion ? "no tiene descripción para Google" : "el título que ve Google no es claro"),
    titulo: "Poca presencia en Google", detalle: "Faltan un título y una descripción pensados para que te encuentren y te elijan.", solucion: "Textos y estructura pensados para aparecer bien en las búsquedas.", pin: { x: 30, y: 27 } },
  { id: "peso", peso: 8, ok: (_h, m) => !m || ((m.cargaMs === null || m.cargaMs <= 5000) && m.kb <= 4500), hecho: (_h, m) => `se midió que tarda ${m?.cargaMs ? (m.cargaMs / 1000).toFixed(1) + " segundos" : "mucho"} en cargar y descarga ${m ? (m.kb / 1024).toFixed(1) : "?"} MB`,
    titulo: "Tarda en abrir en el celular", detalle: "Si la página demora, muchas personas se van antes de ver algo.", solucion: "Un sitio liviano, programado a medida, que abre rápido.", pin: { x: 74, y: 22 } },
  // Solo cuenta lo que se ve en pantalla (medido en el navegador). Sin medición no se marca: el HTML incluye desplegables escondidos y daría falsos positivos.
  { id: "menu", peso: 6, ok: (_h, m) => (m?.itemsMenu ?? 0) <= 10, hecho: (_h, m) => `el menú muestra ${m?.itemsMenu} opciones a la vez`,
    titulo: "Un menú con demasiadas opciones", detalle: "Cuando hay tantas opciones, la persona no sabe cuál elegir.", solucion: "Un menú corto, con una sola acción principal bien visible.", pin: { x: 70, y: 12 } },
  { id: "alt", oculto: true, peso: 6, ok: (h) => h.imagenes === 0 || h.imagenesSinAlt / h.imagenes <= 0.3, hecho: (h) => `${h.imagenesSinAlt} de ${h.imagenes} imágenes sin descripción`,
    titulo: "Las imágenes no se describen", detalle: "Sin descripción, Google no entiende tus fotos y se pierde parte de tu presencia.", solucion: "Imágenes livianas y descritas, que ayudan a que te encuentren.", pin: { x: 62, y: 62 } },
  { id: "prueba", peso: 6, ok: (h) => h.pruebaSocial, hecho: () => "no muestra opiniones ni testimonios de clientes",
    titulo: "No muestra lo que dicen tus clientes", detalle: "Las opiniones de otros clientes son lo que más ayuda a decidirse.", solucion: "Una sección de testimonios con tus mejores reseñas, a la vista.", pin: { x: 50, y: 78 } },
  { id: "vigente", peso: 4, ok: (h) => h.anioCopyright === null || h.anioCopyright >= ANIO - 2, hecho: (h) => `el pie de página dice ${h.anioCopyright}`,
    titulo: "Parece un sitio abandonado", detalle: "Un pie de página con un año viejo da la sensación de que nadie lo mantiene.", solucion: "Un sitio actualizado, con mantenimiento incluido todos los meses.", pin: { x: 50, y: 92 } },
  { id: "social", oculto: true, peso: 4, ok: (h) => h.ogImagen, hecho: () => "no tiene imagen para cuando se comparte",
    titulo: "Se ve mal al compartirlo", detalle: "Cuando alguien manda tu link por WhatsApp o redes, no aparece una imagen atractiva.", solucion: "Una vista previa cuidada para que tu link se vea profesional al compartirlo.", pin: { x: 84, y: 30 } },
  { id: "h1", oculto: true, peso: 4, ok: (h) => h.h1Unico, hecho: (h) => (h.h1.length === 0 ? "la portada no tiene un título principal" : "la portada tiene varios títulos principales"),
    titulo: "La portada no dice claro qué hacés", detalle: "En los primeros segundos, la persona tiene que entender qué ofrecés.", solucion: "Una portada con un título claro y un botón para empezar.", pin: { x: 28, y: 34 } },
];

// Mejoras para sitios que ya cumplen casi todo: nunca se devuelve un análisis vacío.
const MEJORAS: Omit<Hallazgo, "id">[] = [
  { titulo: "Se puede pedir una cita sin llamar", detalle: "Hoy cuesta reservar sin hablar por teléfono.", solucion: "Un formulario de reserva o un botón de WhatsApp siempre a mano.", pin: { x: 26, y: 56 } },
  { titulo: "Se puede medir qué hace la gente", detalle: "Sin datos, no se sabe qué funciona y qué no.", solucion: "Reportes mensuales de visitas y consultas para decidir mejor.", pin: { x: 74, y: 40 } },
  { titulo: "Más lugares donde conseguir consultas", detalle: "Un sitio sin páginas pensadas para campañas pierde oportunidades.", solucion: "Páginas enfocadas en una oferta, listas para recibir publicidad.", pin: { x: 30, y: 27 } },
];

export type Base = { puntaje: number; fallan: { id: string; hecho: string }[]; hallazgos: Hallazgo[]; candidatos: Hallazgo[] };

export function evaluar(h: Hechos, m?: Medidas): Base {
  const evaluados = CHEQUEOS.map((c) => ({ c, ok: c.ok(h, m) }));
  const puntaje = Math.max(5, Math.min(98, evaluados.reduce((s, e) => s + (e.ok ? e.c.peso : 0), 0)));
  const falla = evaluados.filter((e) => !e.ok && !e.c.oculto).sort((a, b) => b.c.peso - a.c.peso);
  const aHallazgo = (e: (typeof falla)[number]): Hallazgo => ({ id: e.c.id, titulo: e.c.titulo, detalle: e.c.detalle, solucion: e.c.solucion, pin: e.c.pin });
  const hallazgos: Hallazgo[] = falla.slice(0, 3).map(aHallazgo);
  for (let i = 0; hallazgos.length < 3; i++) hallazgos.push({ id: `mejora${i}`, ...MEJORAS[i] });
  // "candidatos" es lo que se le muestra a la IA (hasta 6, con su dato real) para que elija los 3 que más le importan al dueño.
  return { puntaje, fallan: falla.slice(0, 6).map((e) => ({ id: e.c.id, hecho: e.c.hecho(h, m) })), hallazgos, candidatos: falla.slice(0, 6).map(aHallazgo) };
}

/** El plan se decide por las rutas del sitio actual: una sola página -> Landing; varias secciones o blog -> Corporativo. */
// Plan de respaldo (cuando no hay IA): Landing salvo señales claras de que hace falta un sitio más grande.
export function elegirPlan(h: Hechos): Pick<Analisis, "planRecomendado" | "motivoPlan" | "tienda"> {
  const tienda = h.tienda || h.plataforma === "Shopify" || h.plataforma === "Tiendanube";
  if (tienda) {
    return { planRecomendado: "corporativo", tienda: true, motivoPlan: "Vendés online, y eso pide páginas de producto, categorías y un recorrido de compra cuidado. El plan Corporativo lo cubre, y además armamos tiendas a medida con Mercado Pago y sin comisión de plataforma. Lo vemos juntos." };
  }
  if (h.rutasSitemap > 25 || h.secciones.length >= 9) {
    return { planRecomendado: "corporativo", tienda: false, motivoPlan: "Tu sitio tiene mucho contenido repartido en muchas secciones. El plan Corporativo incluye hasta 5 páginas con reportes mensuales y blog para ordenarlo y que cada tema se encuentre en Google." };
  }
  return {
    planRecomendado: "landing",
    tienda: false,
    motivoPlan: "Lo que ofrecés se entiende mejor en una sola página bien armada, con tus servicios, trabajos, opiniones y contacto a mano. Una landing rápida y enfocada alcanza para recibir consultas, y más adelante se puede ampliar.",
  };
}

/** Datos medidos del sitio para mostrar en el reporte (sin puntaje: cada uno se entiende solo). */
export function ficha(h: Hechos, m?: Medidas): FichaItem[] {
  const si = (b: boolean) => (b ? "Sí" : "No");
  const seguro = h.https && !h.certInvalido;
  const contacto = h.tel || h.whatsapp || h.mail || h.formularios > 0;
  const rutas = Math.max(h.rutas, h.rutasSitemap > 6 ? 6 : h.rutasSitemap > 1 ? h.rutasSitemap - 1 : 0) + 1;
  return [
    { k: "Conexión segura (candado)", v: si(seguro), ok: seguro },
    { k: "Se adapta al celular", v: si(h.viewport), ok: h.viewport },
    { k: "Contacto a la vista", v: si(contacto), ok: contacto },
    { k: "Botones para consultar", v: h.llamadosAccion >= 2 ? "Sí" : h.llamadosAccion === 1 ? "Uno solo" : "No hay", ok: h.llamadosAccion >= 2 },
    { k: "Opiniones de clientes", v: si(h.pruebaSocial), ok: h.pruebaSocial },
    ...(m?.cargaMs ? [{ k: "Tiempo de carga", v: `${(m.cargaMs / 1000).toFixed(1)} segundos`, ok: m.cargaMs <= 5000 && m.kb <= 4500 }] : []),
    { k: "Páginas del sitio", v: rutas > 6 ? "Más de 6" : String(rutas), ok: null },
    { k: "Armado con", v: h.tecnologia, ok: null },
  ];
}

/** Mejoras extra, pensadas para lo que le importa a un negocio: que lo encuentren, que lo recomienden y que lo consulten. */
export function ademas(h: Hechos): Extra[] {
  const x: Extra[] = [];
  x.push({
    titulo: "Que Google y la inteligencia artificial te recomienden",
    detalle: h.datosEstructurados
      ? "Reforzamos los datos de tu negocio (servicios, zona, horarios, opiniones) para que Google y asistentes como ChatGPT o Gemini te nombren cuando alguien pregunte por lo tuyo."
      : "Tu sitio no le explica a Google ni a asistentes como ChatGPT o Gemini quién sos, qué hacés y dónde. Con esos datos bien armados, es más probable que te recomienden cuando alguien pregunte por lo tuyo.",
  });
  if (!h.whatsapp || h.formularios === 0 || !(h.tel || h.mail)) {
    x.push({ titulo: "Más consultas, sin que tengan que llamar", detalle: "WhatsApp y un formulario corto en cada sección, y un aviso a tu celular apenas entra una consulta, para contestar antes que la competencia." });
  }
  if (!h.pruebaSocial || h.llamadosAccion < 2) {
    x.push({ titulo: "Que la gente se decida antes", detalle: "Opiniones de clientes, tus mejores trabajos y un botón claro para pedir presupuesto o reservar, justo en el momento en que la persona ya está convencida." });
  }
  if (h.tienda) {
    x.push({ titulo: "Vender online sin comisiones de plataforma", detalle: "Una tienda a medida, con Mercado Pago integrado, que se ve bien en el celular y te deja ver qué producto se vende más." });
  }
  x.push({ titulo: "Saber qué te trae clientes", detalle: "Reportes mensuales de cuánta gente entra, de dónde viene y cuántos te consultan, para decidir con datos y no a ciegas." });
  return x.slice(0, 4);
}
