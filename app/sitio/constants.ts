export const WHATSAPP_NUMBER = "5491155988007";
export const WHATSAPP_MENSAJE = "Hola! Vi su anuncio y quiero un sitio web para mi negocio.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

export type PlanId = "landing" | "corporativo" | "no-se";

// Ventana corta de contacto (nombre y WhatsApp). La abren los botones de los planes y "Quiero un sitio así":
// la persona ya decidió, así que no se la manda al analizador ni a otra parte.
export const CONTACTO_EVENT = "luma:contacto";
export type ContactoDetalle = {
  titulo: string;       // título de la ventana
  subtitulo?: string;
  plan?: PlanId;        // plan elegido (si lo hay)
  contexto: string;     // lo que le llega al equipo en el mail, en el campo "negocio"
  placement: string;    // de qué botón salió (para medición)
  soloWhatsApp?: boolean; // pide únicamente el WhatsApp (sin nombre)
};
export const abrirContacto = (d: ContactoDetalle) => window.dispatchEvent(new CustomEvent<ContactoDetalle>(CONTACTO_EVENT, { detail: d }));

// Cuando termina el análisis, el panel del hero avisa y el reporte (debajo) aparece. detail.analisis = null lo esconde.
export const ANALISIS_EVENT = "luma:analisis";
export type AnalisisDetalle = { analisis: import("./analisisTipos").Analisis | null };
