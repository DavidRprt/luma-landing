import puppeteer from "@cloudflare/puppeteer";
import { esperarCarga, medirPagina } from "./medir";

// Worker de capturas: recibe { url } con la clave secreta y devuelve la captura 1440x900 (JPEG en base64), las zonas del menú, el título,
// el botón y el contacto (en %), y medidas de carga. Corre en Cloudflare Browser Rendering (plan gratuito: unos 10 minutos de navegador por día).
interface Env { BROWSER: Fetcher; CAPTURA_TOKEN: string }

const ANCHO = 1440;
const ALTO = 900;
const BLOQUEADOS = /(doubleclick|googlesyndication|googletagmanager|google-analytics|facebook\.net|hotjar|clarity\.ms|tiktok|snap\.licdn|tawk\.to|intercom|zdassets|crisp\.chat|adservice|criteo|taboola|outbrain)/i;

const json = (cuerpo: unknown, status = 200) => new Response(JSON.stringify(cuerpo), { status, headers: { "Content-Type": "application/json" } });

function aBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== "POST") return json({ error: "método" }, 405);
    if (!env.CAPTURA_TOKEN || req.headers.get("authorization") !== `Bearer ${env.CAPTURA_TOKEN}`) return json({ error: "no autorizado" }, 401);
    let destino: URL;
    try { destino = new URL(((await req.json()) as { url?: string }).url ?? ""); } catch { return json({ error: "url" }, 400); }
    if (!/^https?:$/.test(destino.protocol)) return json({ error: "url" }, 400);

    let browser;
    try {
      browser = await puppeteer.launch(env.BROWSER);
    } catch (e) {
      // Sin cupo del día (o sin navegador libre): la landing sigue sin captura.
      return json({ error: "sin cupo", detalle: String(e).slice(0, 200) }, 429);
    }
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: ANCHO, height: ALTO });
      await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36");
      let bytes = 0, pedidos = 0;
      await page.setRequestInterception(true);
      page.on("request", (r) => {
        let u: URL;
        try { u = new URL(r.url()); } catch { return void r.abort(); }
        const tipo = r.resourceType();
        if (u.protocol === "data:" || u.protocol === "blob:" || u.protocol === "about:") return void r.continue();
        if (!/^https?:$/.test(u.protocol) || (u.port && u.port !== "80" && u.port !== "443")) return void r.abort();
        if (BLOQUEADOS.test(u.hostname) || tipo === "media" || tipo === "websocket" || tipo === "eventsource" || ++pedidos > 160) return void r.abort();
        return void r.continue();
      });
      page.on("response", (r) => { bytes += Number(r.headers()["content-length"] ?? 0); });
      await page.goto(destino.toString(), { waitUntil: "load", timeout: 18_000 }).catch(() => undefined);
      await page.waitForNetworkIdle({ idleTime: 700, timeout: 5000 }).catch(() => undefined);
      await page.evaluate(esperarCarga, ALTO).catch(() => undefined);
      await new Promise((r) => setTimeout(r, 3000)); // deja terminar las animaciones de entrada
      await page.evaluate(() => window.scrollTo(0, 0)).catch(() => undefined);
      const medido = await page.evaluate(medirPagina, ANCHO, ALTO);
      const cargaMs = await page.evaluate(() => {
        const n = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
        return n && n.loadEventEnd > 0 ? Math.round(n.loadEventEnd) : null;
      }).catch(() => null);
      const jpeg = (await page.screenshot({ type: "jpeg", quality: 72, clip: { x: 0, y: 0, width: ANCHO, height: ALTO } })) as Uint8Array;
      return json({ jpeg: aBase64(jpeg), ancho: ANCHO, alto: ALTO, zonas: medido.zonas, medidas: { cargaMs, kb: Math.round(bytes / 1024), itemsMenu: medido.itemsMenu } });
    } catch (e) {
      return json({ error: "falló", detalle: String(e).slice(0, 200) }, 502);
    } finally {
      await browser.close().catch(() => undefined);
    }
  },
};
