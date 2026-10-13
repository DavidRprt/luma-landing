// Datos de una landing personalizada. Cada lead trae de 1 a 4 hallazgos; cada uno marca su zona sobre la captura
// de su sitio (caja en % del ancho y alto de la imagen, que puede tener cualquier tamaño).

export const EXTRAS = [
  ["Online payments", "Customers pay an invoice from their phone, in seconds."],
  ["Customer portal", "Past jobs, invoices and rescheduling in one place."],
  ["Chat or text button", "One tap and they’re talking to you."],
  ["An assistant that works 24/7", "Answers questions and collects leads when you can’t pick up."],
  ["Found on Google", "Fast on phones and built to show up in local searches."],
  ["Handled for you", "Hosting, domain and updates are on us."],
] as const;

export const PASOS = [
  ["We build a preview of your new website", "Using the ideas above, with your real content and colors. Free to look at, no commitment."],
  ["You take a look", "No pressure and nothing to sign. If it’s not for you, just say so."],
  ["If you like it, we launch it", "Hosting, domain and updates included, with no big upfront payment."],
] as const;

export type Caja = { x: number; y: number; w: number; h: number };
export type Hallazgo = { id: string; titulo: string; detalle: string; idea: string; ideaDetalle: string; caja: Caja };
export type Datos = { rating?: number | null; resenas?: number | null; rubro?: string; sinHttps?: boolean; noResponsive?: boolean; plataforma?: string | null; oportunidades?: [string, string][] };
export type Lead = { datos?: Datos; idioma?: "en" | "es"; negocio: string; dominio: string; captura: { src: string; w: number; h: number }; hallazgos: Hallazgo[] };

// Agranda una caja alrededor de su centro (con margen) hasta una proporción razonable, sin salirse de la imagen.
export function ampliar(c: Caja, iw: number, ih: number, min = 1.4, max = 2.6, margen = 0.12): Caja {
  let w = c.w * (1 + margen * 2), h = c.h * (1 + margen * 2);
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const ar = ((w / 100) * iw) / ((h / 100) * ih);
  if (ar < min) w = ((min * (h / 100) * ih) / iw) * 100;
  if (ar > max) h = (((w / 100) * iw) / max / ih) * 100;
  w = Math.min(100, w); h = Math.min(100, h);
  const x = Math.min(100 - w, Math.max(0, cx - w / 2)), y = Math.min(100 - h, Math.max(0, cy - h / 2));
  return { x, y, w, h };
}
