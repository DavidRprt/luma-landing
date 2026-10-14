// Detección de sitios para adultos, sin IA y sin abrir un navegador. Se usa antes de capturar o mandar nada a la IA:
// si el sitio es de ese tipo, el analizador no lo analiza (para no guardar ni enviar ese contenido), pero sí
// queda a disposición para trabajar con el negocio. Es una revisión por señales claras; no pretende ser perfecta.

// Términos que, por sí solos, delatan un sitio para adultos.
const FUERTES = /\b(porn|porno|pornografi[ac]|pornhub|xxx|xvideos|hentai|nsfw|onlyfans|camgirls?|cam\s?girls?|livejasmin|erotic[oa]?s?|er[oó]tic[oa]s?|sexcam|sex\s?shop|sexshop|sex\s?toys?|sexo\s?(?:gratis|en vivo)|escort\s?(?:girls?|service|agency)|putas?|prostitut[ao]s?|acompa[ñn]antes\s?(?:vip|sexuales)|swingers?|fetish|fetiche|bdsm|stripper?s?)\b/i;
// Términos que solos no alcanzan (hay negocios legítimos con esas palabras) pero juntos sí.
const DEBILES = /\b(sex|sexo|sexual|sexy|adults?\s?only|solo adultos|only adults|mayores de 18|over 18|\+18|18\+|age verification|verificaci[oó]n de edad|desnud[oa]s?|nude|naked)\b/gi;

export function dominioSensible(dominio: string): boolean {
  // Se parte el dominio en palabras y también se revisa junto (porn, xxx, etc. pegados a otras palabras).
  const d = dominio.toLowerCase().replace(/^www\./, "");
  return /(porn|xxx|hentai|onlyfans|camgirl|livejasmin|sexcam|sexshop|escortgirl|nsfw|xvideos|xnxx|xhamster|redtube|youporn|brazzers|chaturbate)/.test(d.replace(/[^a-z0-9]/g, ""));
}

export function htmlSensible(html: string, titulo: string, h1: string[]): boolean {
  // Etiquetas oficiales de contenido para adultos (RTA y meta rating).
  if (/RTA-5042-1996-1400-1577-RTA/i.test(html)) return true;
  if (/<meta[^>]+name=["']rating["'][^>]+content=["'](?:adult|mature|rta)/i.test(html)) return true;
  const descripcion = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "";
  const ogTitulo = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "";
  const cabecera = `${titulo} ${h1.join(" ")} ${descripcion} ${ogTitulo}`;
  if (FUERTES.test(cabecera)) return true;
  const debiles = new Set((cabecera.match(DEBILES) ?? []).map((x) => x.toLowerCase()));
  return debiles.size >= 2;
}

export type TipoAdulto = "links" | "video" | "cams" | "tienda" | "creador" | "general";

const PLATAFORMAS = /(onlyfans|fansly|patreon|manyvids|justfor\.fans|fanvue|loyalfans|linktr\.ee|beacons\.ai|allmylinks|solo\.to|carrd\.co|t\.me|telegram\.me|instagram\.com|twitter\.com|x\.com|tiktok\.com|snapchat\.com|reddit\.com)/i;

// Qué tipo de sitio es, mirando solo el HTML (sin captura ni IA): una página de links, un sitio de videos, una tienda, un creador con suscripciones u otro.
export function tipoAdulto(html: string, host: string): TipoAdulto {
  const sinCodigo = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ");
  const texto = sinCodigo.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const enlaces = [...sinCodigo.matchAll(/<a\b[^>]*?href=["'](https?:\/\/[^"']+)["']/gi)].map((m) => m[1]);
  const plataformas = new Set(enlaces.map((u) => u.match(PLATAFORMAS)?.[1]?.toLowerCase()).filter(Boolean));
  if (/^(linktr\.ee|beacons\.ai|allmylinks\.com|solo\.to)$/i.test(host) || (plataformas.size >= 3 && texto.length < 2500)) return "links";
  const videos = (sinCodigo.match(/<video\b/gi) ?? []).length + (texto.match(/\bvideos?\b/gi) ?? []).length;
  if (videos >= 8) return "video";
  if (/\b(webcams?|cam\s?shows?|live\s?(cams?|chat|shows?|streams?)|chat en vivo|shows? en vivo|en vivo)\b/i.test(texto) && /\b(chat|tokens?|tip|propinas?|online now|en l[ií]nea)\b/i.test(texto)) return "cams";
  if (/add to cart|agregar al carrito|añadir al carrito|checkout|\/cart\b|\/carrito\b/i.test(sinCodigo)) return "tienda";
  if (/onlyfans|fansly|subscribe|suscrib|membership|membres[ií]a|exclusive|exclusivo/i.test(texto) || plataformas.size >= 1) return "creador";
  return "general";
}
