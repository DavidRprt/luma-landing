// Lo que devuelve el análisis real (/api/analizar-sitio) y lo que usan el panel del hero y el reporte.
// Los pines son dónde se marca cada hallazgo sobre la maqueta del sitio, en % del ancho y del alto.

export type Hallazgo = { id: string; titulo: string; detalle: string; solucion: string; pin: { x: number; y: number } | null }; // pin null: no hay una zona visible para marcar

export type FichaItem = { k: string; v: string; ok: boolean | null }; // ok null: dato neutro (no es ni bueno ni malo)

export type Extra = { titulo: string; detalle: string };

// Guiño para sitios hechos por _luma (portfolio o el propio underluma): se muestran sus virtudes en vez de un análisis.
export type Guino = { tipo: "portfolio" | "luma" | "gigante"; titulo: string; texto: string; dato?: string; virtudes: { titulo: string; detalle: string }[] };

// Nicho al que le hablamos distinto (creadores y negocios para adultos): sin captura ni IA, con una propuesta hecha a mano.
export type Nicho = {
  titulo: string; // encabezado del reporte
  texto: string;
  panelTitulo: string; // lo que se ve en el panel del hero
  hallazgos: { titulo: string; detalle: string; solucion: string }[]; // mini análisis hecho con reglas, sin captura
  ideas: { titulo: string; detalle: string }[]; // lo que el sitio podría hacer, según el tipo de sitio
  trato: { titulo: string; detalle: string }[];
  pedimos: string[]; // lo que nos sirve que nos cuenten
};

export type Analisis = {
  nicho?: Nicho;
  guino?: Guino;
  dominio: string;
  puntaje: number; // 0 a 100 (uso interno: ya no se muestra)
  hallazgos: Hallazgo[];
  planRecomendado: "landing" | "corporativo";
  motivoPlan: string;
  tienda: boolean; // vende online: se le avisa que armamos tiendas a medida
  estetica?: { nivel: "moderno" | "correcto" | "anticuado"; detalle: string }; // qué tan actual se ve hoy, según la IA
  rubro?: string; // a qué se dedica el negocio, deducido por la IA
  oportunidades?: Extra[]; // 3 cosas concretas que el sitio nuevo haría para ese negocio (IA)
  resenas?: { rating: number; n: number }; // opiniones en Google Maps, si se encontró el negocio y son buenas
  ademas?: Extra[]; // mejoras extra pensadas para conseguir más consultas y ventas (Google, IA, contacto, confianza)
  ficha?: FichaItem[]; // datos medidos del sitio, para mostrarlos en el reporte
  captura?: { src: string; w: number; h: number }; // captura real del sitio (si se pudo sacar); si falta, el reporte dibuja una maqueta
};

// Textos del círculo de carga, en orden.
export const PASOS_ANALISIS = [
  "Abriendo tu sitio",
  "Midiendo cómo carga en el celular",
  "Revisando cómo aparecés en Google",
  "Buscando qué te falta para conseguir clientes",
] as const;
