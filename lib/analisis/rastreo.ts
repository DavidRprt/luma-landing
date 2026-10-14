import { htmlSensible, tipoAdulto, type TipoAdulto } from "./contenido";
import type { IncomingHttpHeaders } from "node:http";
import { descargar } from "./seguro";

// Lee un sitio SIN inteligencia artificial: baja la página principal (y el sitemap, si hay) y saca datos medibles.
// Es lo que más pesa del análisis y no gasta un solo token.

export type Hechos = {
  dominio: string;
  urlFinal: string;
  https: boolean;
  certInvalido: boolean;
  status: number;
  bytes: number;
  truncado: boolean;
  titulo: string;
  sensible: boolean; // sitio para adultos (no se captura ni se manda a la IA)
  tipoAdulto?: TipoAdulto; // solo si es sensible: página de links, videos, tienda, creador u otro
  descripcion: string;
  h1: string[];
  lang: string;
  viewport: boolean;
  plataforma: string | null;
  tecnologia: string; // con qué está armado, lo más exacto posible (por ejemplo "WordPress + Elementor + WooCommerce")
  datosEstructurados: boolean; // tiene datos para Google y asistentes de IA (schema.org / JSON-LD)
  scripts: number;
  imagenes: number;
  imagenesSinAlt: number;
  itemsMenu: number;
  secciones: string[]; // secciones con contenido propio (sin portada, contacto, cuenta ni legales)
  rutas: number; // páginas distintas a las que lleva el menú (sin contar la principal)
  rutasSitemap: number;
  tieneBlog: boolean;
  tel: boolean;
  whatsapp: boolean;
  mail: boolean;
  formularios: number;
  llamadosAccion: number;
  tienda: boolean;
  pruebaSocial: boolean;
  anioCopyright: number | null;
  ogImagen: boolean;
  h1Unico: boolean;
};

const limpiar = (t: string, max: number) => t.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&amp;|&quot;|&#39;/g, " ").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const meta = (html: string, nombre: string) => {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${nombre}["'][^>]*>`, "i"));
  const c = m?.[0].match(/content=["']([^"']*)["']/i);
  return c ? c[1] : "";
};

function plataforma(html: string): string | null {
  if (/wixstatic\.com|static\.parastorage|x-wix|wix\.com/i.test(html)) return "Wix";
  if (/squarespace/i.test(html)) return "Squarespace";
  if (/cdn\.shopify\.com|shopify\.theme/i.test(html)) return "Shopify";
  if (/wp-content|wp-includes|wordpress/i.test(html)) return "WordPress";
  if (/godaddy|secureserver\.net|gdwebsites|websitebuilder/i.test(html)) return "GoDaddy";
  if (/weebly/i.test(html)) return "Weebly";
  if (/webflow/i.test(html)) return "Webflow";
  if (/tiendanube|nuvemshop/i.test(html)) return "Tiendanube";
  return null;
}

// Con qué está hecho el sitio, lo más exacto que se pueda: constructor o gestor + componentes, o el framework.
function tecnologia(html: string, headers: IncomingHttpHeaders): string {
  const gen = html.match(/<meta[^>]+name=["']generator["'][^>]*content=["']([^"']+)["']/i)?.[1] ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']generator["']/i)?.[1] ?? "";
  const version = (m: RegExpMatchArray | null) => (m?.[1] ? ` ${m[1]}` : "");
  const lista: string[] = [];
  const hay = (re: RegExp) => re.test(html);
  // Constructores y gestores de contenido
  if (hay(/wixstatic\.com|static\.parastorage|x-wix|wix\.com/i)) lista.push("Wix");
  else if (hay(/squarespace/i)) lista.push("Squarespace");
  else if (hay(/cdn\.shopify\.com|shopify\.theme/i)) lista.push("Shopify");
  else if (hay(/tiendanube|nuvemshop/i)) lista.push("Tiendanube");
  else if (hay(/webflow/i)) lista.push("Webflow");
  else if (hay(/godaddy|secureserver\.net|gdwebsites|websitebuilder/i)) lista.push("GoDaddy Website Builder");
  else if (hay(/weebly/i)) lista.push("Weebly");
  else if (hay(/jimdo/i)) lista.push("Jimdo");
  else if (/wordpress/i.test(gen) || hay(/wp-content|wp-includes/i)) {
    lista.push(`WordPress${version(gen.match(/WordPress\s+([\d.]+)/i))}`);
    if (hay(/elementor/i)) lista.push("Elementor");
    else if (hay(/\/themes\/divi|et-pb-|et_pb_/i)) lista.push("Divi");
    else if (hay(/wpbakery|js_composer/i)) lista.push("WPBakery");
    else if (hay(/beaver-builder|fl-builder/i)) lista.push("Beaver Builder");
    if (hay(/woocommerce/i)) lista.push("WooCommerce");
  } else if (/joomla/i.test(gen)) lista.push("Joomla");
  else if (/drupal/i.test(gen) || hay(/\/sites\/default\/files|drupal-settings-json/i)) lista.push("Drupal");
  else if (hay(/prestashop/i)) lista.push("PrestaShop");
  else if (hay(/magento|mage-/i)) lista.push("Magento");
  // Frameworks (sitios programados)
  if (!lista.length) {
    if (hay(/__NEXT_DATA__|\/_next\/static/i)) lista.push("Next.js", "React");
    else if (hay(/\/_nuxt\/|__NUXT__/i)) lista.push("Nuxt", "Vue");
    else if (hay(/___gatsby|gatsby-/i)) lista.push("Gatsby", "React");
    else if (hay(/astro-island|\/_astro\//i)) lista.push("Astro");
    else if (hay(/\/_app\/immutable|sveltekit/i)) lista.push("SvelteKit");
    else if (hay(/ng-version=/i)) lista.push("Angular");
    else if (hay(/data-reactroot|id=["']root["']|id=["']__next["']|react-dom/i)) lista.push("React");
    else if (hay(/data-v-[0-9a-f]{6,}|vue(?:\.min)?\.js|id=["']app["']/i)) lista.push("Vue");
    else if (hay(/Typo3|typo3/i)) lista.push("TYPO3");
  }
  if (hay(/bootstrap(?:\.min)?\.(?:css|js)|class=["'][^"']*\bcontainer-fluid\b/i) && lista.length < 3) lista.push("Bootstrap");
  else if (hay(/tailwind/i) && lista.length < 3) lista.push("Tailwind");
  if (lista.length) return lista.join(" + ");
  // Sin plataforma conocida: se dice lo que se sepa (HTML propio y el servidor).
  const servidor = String(headers.server ?? "").split(/[\s/]/)[0].replace(/[^\w.-]/g, "");
  const php = /php/i.test(String(headers["x-powered-by"] ?? ""));
  return `HTML propio${php ? " (PHP)" : ""}${servidor && !/^cloudflare$/i.test(servidor) ? `, servidor ${servidor}` : ""}`;
}

export async function rastrear(dominio: string): Promise<Hechos> {
  let d;
  let https = true;
  try {
    d = await descargar(`https://${dominio}/`);
  } catch (e) {
    // Si por https no abre, se prueba por http: un sitio que solo abre así ya es un hallazgo.
    d = await descargar(`http://${dominio}/`).catch(() => { throw e; });
    https = false;
  }
  const html = d.cuerpo;
  if (d.status >= 400 || !html || html.length < 200) throw new Error("no abre");
  if (d.url.protocol !== "https:") https = false;

  const cuerpo = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ");
  const host = d.url.hostname.replace(/^www\./, "");
  const titulo = limpiar(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "", 120);
  const h1 = [...cuerpo.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => limpiar(m[1], 90)).filter(Boolean);

  // Menú: los enlaces dentro de <nav> o <header>; si no hay, los primeros del documento.
  const zonaMenu = (cuerpo.match(/<nav[\s\S]*?<\/nav>/gi) ?? []).join(" ") || (cuerpo.match(/<header[\s\S]*?<\/header>/i) ?? [""])[0] || cuerpo.slice(0, 6000);
  const hrefs = (txt: string) => [...txt.matchAll(/<a\b[^>]*?href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({ href: m[1].trim(), texto: limpiar(m[2], 60) }));
  const interno = (href: string): string | null => {
    if (/^(mailto:|tel:|javascript:|sms:|whatsapp:)/i.test(href)) return null;
    try {
      const u = new URL(href, d.url);
      if (u.hostname.replace(/^www\./, "") !== host) return null;
      if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|docx?|xlsx?|mp4)$/i.test(u.pathname)) return null;
      const seg = u.pathname.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
      return seg ? `/${seg}` : null;
    } catch { return null; }
  };
  const itemsMenu = hrefs(zonaMenu);
  const rutasMenu = new Set(itemsMenu.map((a) => interno(a.href)).filter(Boolean) as string[]);
  const utilitaria = /^\/(contact|contacto|contactanos|contact-us|login|ingresar|cuenta|account|mi-cuenta|cart|carrito|checkout|search|buscar|privacy|privacidad|terminos|terms|cookies|legal|faq|preguntas|politica|wp-|cdn-cgi|en|es|home|inicio|index)/i;
  const secciones = [...rutasMenu].filter((x) => !utilitaria.test(x)).map((x) => x.slice(1).replace(/[-_]/g, " ")).slice(0, 8);
  const todos = hrefs(cuerpo);
  const rutasTodas = new Set(todos.map((a) => interno(a.href)).filter(Boolean) as string[]);
  const tieneBlog = [...rutasTodas].some((r) => /^\/(blog|noticias|news|articulos|novedades)/.test(r));

  // Sitemap (si existe): sirve para saber cuántas páginas tiene de verdad.
  let rutasSitemap = 0;
  try {
    const sm = await descargar(`${d.url.protocol}//${d.url.host}/sitemap.xml`, { maxBytes: 150_000, timeoutMs: 4000 });
    if (sm.status === 200) rutasSitemap = (sm.cuerpo.match(/<loc>/gi) ?? []).length;
  } catch { /* sin sitemap */ }

  const imgs = [...cuerpo.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const sinAlt = imgs.filter((i) => !/\balt=["'][^"']+["']/i.test(i)).length;
  const textoAcciones = [...cuerpo.matchAll(/<(?:a|button)\b[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)].map((m) => limpiar(m[1], 50).toLowerCase());
  const llamados = textoAcciones.filter((t) => /contact|cotiz|presupuesto|reserv|turno|agend|solicit|escrib|llam|whatsapp|consult|quote|book|call us|get started|pedí|pedi/.test(t)).length;
  const copy = cuerpo.match(/(?:©|&copy;|copyright)[^0-9]{0,40}((?:19|20)\d{2})(?:\s*[-–]\s*((?:19|20)\d{2}))?/i);
  const anio = copy ? Number(copy[2] ?? copy[1]) : null;

  return {
    dominio,
    urlFinal: d.url.toString(),
    https,
    certInvalido: d.certInvalido,
    status: d.status,
    bytes: d.bytes,
    truncado: d.truncado,
    titulo,
    sensible: htmlSensible(html, titulo, h1),
    tipoAdulto: tipoAdulto(html, host),
    descripcion: limpiar(meta(html, "description"), 200),
    h1: h1.slice(0, 2),
    lang: (html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? "").slice(0, 10),
    viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    plataforma: plataforma(html),
    tecnologia: tecnologia(html, d.headers),
    datosEstructurados: /application\/ld\+json/i.test(html),
    scripts: (html.match(/<script\b/gi) ?? []).length,
    imagenes: imgs.length,
    imagenesSinAlt: sinAlt,
    itemsMenu: itemsMenu.length,
    secciones,
    rutas: rutasMenu.size,
    rutasSitemap,
    tieneBlog,
    tel: /href=["']tel:/i.test(html),
    whatsapp: /wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|wa\.link|whatsapp:\/\//i.test(html),
    mail: /href=["']mailto:/i.test(html),
    formularios: (cuerpo.match(/<form\b/gi) ?? []).length,
    llamadosAccion: llamados,
    tienda: /add.to.cart|agregar al carrito|añadir al carrito|\/cart\b|\/carrito|\/checkout|woocommerce|cdn\.shopify|tiendanube|nuvemshop/i.test(html),
    pruebaSocial: /testimonio|testimonial|reseñas|opiniones|lo que dicen|clientes (?:dicen|felices)|reviews/i.test(cuerpo),
    anioCopyright: anio && anio > 1995 && anio <= new Date().getFullYear() + 1 ? anio : null,
    ogImagen: Boolean(meta(html, "og:image")),
    h1Unico: h1.length === 1,
  };
}
