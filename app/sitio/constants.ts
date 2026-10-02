export const WHATSAPP_NUMBER = "5491155988007";
export const WHATSAPP_MENSAJE = "Hola! Vi su anuncio y quiero un sitio web para mi negocio.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

// Evento interno para que los botones de los planes elijan el plan en el formulario.
export const PLAN_EVENT = "luma:plan";
export type PlanId = "landing" | "corporativo" | "no-se";
