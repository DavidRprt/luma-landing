import type { Hechos } from "./rastreo";

// Opiniones del negocio en Google Maps. Se busca por nombre y dominio y solo se acepta el resultado si su sitio web
// coincide con el dominio analizado (así nunca se muestran las reseñas de otro negocio). Necesita GOOGLE_PLACES_KEY;
// sin clave, o ante cualquier falla, simplemente no se muestra nada.
const MIN_RATING = 4.2;
const MIN_RESENAS = 8;

const limpio = (d: string) => d.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");

export async function opinionesMaps(dominio: string, h: Hechos): Promise<{ rating: number; n: number } | undefined> {
  const clave = process.env.GOOGLE_PLACES_KEY;
  if (!clave) return undefined;
  const ctl = new AbortController();
  const corte = setTimeout(() => ctl.abort(), 5_000);
  try {
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": clave, "X-Goog-FieldMask": "places.websiteUri,places.rating,places.userRatingCount" },
      body: JSON.stringify({ textQuery: `${h.titulo.slice(0, 80)} ${dominio}`.trim(), maxResultCount: 3 }),
      signal: ctl.signal,
    });
    if (!r.ok) return undefined;
    const j = await r.json();
    const mio = limpio(dominio);
    const p = (j.places ?? []).find((x: { websiteUri?: string }) => x.websiteUri && limpio(x.websiteUri) === mio);
    const rating = Number(p?.rating), n = Number(p?.userRatingCount);
    return rating >= MIN_RATING && n >= MIN_RESENAS ? { rating: Math.round(rating * 10) / 10, n } : undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(corte);
  }
}
