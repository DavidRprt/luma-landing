import dns from "node:dns/promises";
import net from "node:net";
import chromium from "@sparticuz/chromium";
import puppeteer, { type Browser, type HTTPRequest } from "puppeteer-core";
import { ipPrivada } from "./seguro";

// Captura de escritorio del sitio (1440x900) con un Chromium propio, gratis y sin servicios externos. En el servidor
// usa @sparticuz/chromium (un Chromium liviano para servidores); en desarrollo, el navegador de CHROME_PATH.
// Cada pedido que hace el navegador (la página, imágenes, scripts) se revisa: nada que apunte a una IP privada.
// Si algo falla, devuelve null y el análisis sigue con la maqueta: la captura nunca debe romper el análisis.

export type Zona = { x: number; y: number; w: number; h: number }; // en % de la captura
export type Medidas = { cargaMs: number | null; kb: number; itemsMenu: number | null }; // itemsMenu: enlaces del menú que realmente se ven
export type Captura = { jpeg: Buffer; mini: Buffer; ancho: number; alto: number; zonas: Partial<Record<"menu" | "h1" | "cta" | "contacto" | "hero", Zona>>; medidas: Medidas };

const ANCHO = 1440;
const ALTO = 900;
const LIMITE_MS = 26_000;

// De a una captura por vez (cada Chromium usa bastante memoria) y con tope de fila: si hay mucha espera, se omite.
let activas = 0;
let cola: Promise<unknown> = Promise.resolve();

const decisiones = new Map<string, Promise<boolean>>();
function hostPermitido(host: string): Promise<boolean> {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  let r = decisiones.get(h);
  if (!r) {
    r = net.isIP(h)
      ? Promise.resolve(!ipPrivada(h))
      : dns.lookup(h, { all: true, verbatim: true }).then((d) => d.length > 0 && !d.some((x) => ipPrivada(x.address))).catch(() => false);
    decisiones.set(h, r);
  }
  return r;
}

async function revisar(req: HTTPRequest, total: { n: number }) {
  try {
    const url = new URL(req.url());
    const tipo = req.resourceType();
    if (url.protocol === "data:" || url.protocol === "blob:" || url.protocol === "about:") return req.continue();
    if (!/^https?:$/.test(url.protocol)) return req.abort("blockedbyclient");
    if (url.port && url.port !== "80" && url.port !== "443") return req.abort("blockedbyclient");
    if (/(doubleclick|googlesyndication|googletagmanager|google-analytics|facebook\.net|hotjar|clarity\.ms|tiktok|snap\.licdn|tawk\.to|intercom|zdassets|crisp\.chat|adservice|criteo|taboola|outbrain)/i.test(url.hostname)) return req.abort("blockedbyclient");
    if (tipo === "media" || tipo === "websocket" || tipo === "eventsource" || ++total.n > 160) return req.abort("blockedbyclient");
    if (!(await hostPermitido(url.hostname))) return req.abort("blockedbyclient");
    return req.continue();
  } catch {
    try { await req.abort("failed"); } catch { /* ya resuelto */ }
  }
}

// Captura en Cloudflare (workers/captura): el navegador corre allá y no gasta la memoria de este servidor. Si CAPTURA_URL no está, se usa el
// Chromium local (desarrollo, o producción sin el Worker). Si el Worker no tiene cupo o falla, devuelve null y el análisis sigue sin captura.
async function sacarRemoto(url: string): Promise<Captura | null> {
  try {
    if (!(await hostPermitido(new URL(url).hostname))) return null;
  } catch { return null; }
  const ctl = new AbortController();
  const corte = setTimeout(() => ctl.abort(), LIMITE_MS + 4000);
  try {
    const r = await fetch(process.env.CAPTURA_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.CAPTURA_TOKEN ?? ""}` },
      body: JSON.stringify({ url }),
      signal: ctl.signal,
    });
    if (!r.ok) { console.error("[analisis captura remota] respondió", r.status, (await r.text().catch(() => "")).slice(0, 160)); return null; }
    const j = await r.json();
    const jpeg = Buffer.from(String(j.jpeg ?? ""), "base64");
    if (jpeg.length < 4000) return null; // pantalla en blanco
    return { jpeg, mini: jpeg, ancho: Number(j.ancho) || ANCHO, alto: Number(j.alto) || ALTO, zonas: j.zonas ?? {}, medidas: j.medidas ?? { cargaMs: null, kb: 0, itemsMenu: null } };
  } catch (e) {
    console.error("[analisis captura remota]", (e as Error).message);
    return null;
  } finally {
    clearTimeout(corte);
  }
}

async function sacar(url: string): Promise<Captura | null> {
  if (process.env.CAPTURA_URL) return sacarRemoto(url);
  const dev = Boolean(process.env.CHROME_PATH);
  let browser: Browser | null = null;
  const matar = setTimeout(() => { browser?.process()?.kill("SIGKILL"); }, LIMITE_MS + 4000);
  try {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH || (await chromium.executablePath()),
      // En el servidor: se sacan los ajustes de GPU por software (gastan memoria de más y solo hacen falta para WebGL), se evita
      // /dev/shm (en contenedores es chico y es la causa más común de "Target closed") y se limita la memoria de JavaScript.
      args: dev
        ? ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"]
        : [
            ...chromium.args.filter((a) => !/use-gl|use-angle|swiftshader|in-process-gpu|ignore-gpu/.test(a)),
            "--disable-gpu", "--disable-dev-shm-usage", "--disable-extensions", "--mute-audio", "--hide-scrollbars",
            "--js-flags=--max-old-space-size=128",
          ],
      headless: dev ? true : "shell",
      defaultViewport: { width: ANCHO, height: ALTO },
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36");
    // Medidas reales de carga: lo que se descargó (con compresión) y cuánto tardó en cargar.
    const cdp = await page.createCDPSession();
    await cdp.send("Network.enable");
    let bytes = 0;
    cdp.on("Network.loadingFinished", (e: { encodedDataLength?: number }) => { bytes += Number(e.encodedDataLength ?? 0); });
    await page.setRequestInterception(true);
    const total = { n: 0 };
    page.on("request", (r) => { void revisar(r, total); });
    page.on("dialog", (d) => { void d.dismiss().catch(() => {}); });
    await page.goto(url, { waitUntil: "load", timeout: 18_000 }).catch(() => undefined); // si tarda, se saca con lo que haya
    // Espera a que el sitio termine de cargar de verdad: red quieta, tipografías, imágenes de la primera pantalla y animaciones.
    await page.waitForNetworkIdle({ idleTime: 700, timeout: 5000 }).catch(() => undefined);
    await page.evaluate(async (H) => {
      const tope = new Promise((r) => setTimeout(r, 3500));
      const listo = (async () => {
        await document.fonts?.ready;
        const imgs = Array.from(document.images).filter((i) => i.getBoundingClientRect().top < H && !i.complete);
        await Promise.all(imgs.map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })));
      })();
      await Promise.race([listo, tope]);
    }, ALTO).catch(() => undefined);
    await new Promise((r) => setTimeout(r, 3000)); // deja terminar las animaciones de entrada (muchos sitios hacen aparecer el texto de a poco)
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => undefined);
    // Mide dónde están el menú, el título, el botón principal y el contacto (para marcar los hallazgos sobre la captura).
    const medido = await page.evaluate((W, H) => {
      const visible = (e: Element) => {
        const r = e.getBoundingClientRect();
        const s = getComputedStyle(e);
        return r.width > 8 && r.height > 8 && r.bottom > 0 && r.top < H * 0.98 && r.left < W && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
      };
      const zona = (e: Element | null | undefined) => {
        if (!e || !visible(e)) return undefined;
        const r = e.getBoundingClientRect();
        const x = Math.max(0, r.left), y = Math.max(0, r.top), x2 = Math.min(W, r.right), y2 = Math.min(H, r.bottom);
        if (x2 - x < 8 || y2 - y < 8) return undefined;
        return { x: (x / W) * 100, y: (y / H) * 100, w: ((x2 - x) / W) * 100, h: ((y2 - y) / H) * 100 };
      };
      const todos = Array.from(document.querySelectorAll("a,button,input[type=submit]"));
      const texto = (e: Element) => (e.textContent || (e as HTMLInputElement).value || "").trim().toLowerCase().slice(0, 60);
      const cta = todos.find((e) => visible(e) && /contact|cotiz|presupuesto|reserv|turno|agend|solicit|escrib|llam|whatsapp|consult|quote|book|call|estimate|get started/.test(texto(e)));
      const contacto = Array.from(document.querySelectorAll("a[href^='tel:'],a[href*='wa.me'],a[href*='whatsapp'],a[href^='mailto:'],form")).find(visible);
      const menu = Array.from(document.querySelectorAll("nav,header")).find((e) => visible(e) && e.getBoundingClientRect().height < H * 0.5);
      const h1 = Array.from(document.querySelectorAll("h1")).find(visible);
      // La imagen o fondo más grande de la portada.
      const area = (e: Element) => { const r = e.getBoundingClientRect(); return Math.max(0, Math.min(W, r.right) - Math.max(0, r.left)) * Math.max(0, Math.min(H, r.bottom) - Math.max(0, r.top)); };
      const conFondo = Array.from(document.querySelectorAll("img,picture,video,section,div,header")).filter((e) => visible(e) && (e.tagName === "IMG" || e.tagName === "VIDEO" || (getComputedStyle(e).backgroundImage || "none") !== "none") && area(e) > W * H * 0.12);
      const hero = conFondo.sort((a, b) => area(b) - area(a))[0];
      // Opciones distintas del menú que se ven en la barra superior: se cuentan textos únicos (sin logo, íconos ni enlaces repetidos).
      const textos = new Set<string>();
      if (menu) for (const a of Array.from(menu.querySelectorAll("a"))) {
        if (!visible(a) || a.getBoundingClientRect().top > 220) continue;
        const t = (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
        if (t.length >= 2 && t.length <= 40) textos.add(t);
      }
      const itemsMenu = menu ? textos.size : null;
      return { zonas: { menu: zona(menu), h1: zona(h1), cta: zona(cta), contacto: zona(contacto), hero: zona(hero) }, itemsMenu };
    }, ANCHO, ALTO);
    const cargaMs = await page.evaluate(() => {
      const n = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      return n && n.loadEventEnd > 0 ? Math.round(n.loadEventEnd) : null;
    }).catch(() => null);
    const clip = { x: 0, y: 0, width: ANCHO, height: ALTO };
    const jpeg = Buffer.from(await page.screenshot({ type: "jpeg", quality: 72, clip }));
    if (jpeg.length < 4000) return null; // pantalla en blanco
    // La IA recibe la misma captura con detalle bajo (sale baratísima en tokens): no se vuelve a renderizar, que es cuando más memoria se usa.
    return { jpeg, mini: jpeg, ancho: ANCHO, alto: ALTO, zonas: medido.zonas, medidas: { cargaMs, kb: Math.round(bytes / 1024), itemsMenu: medido.itemsMenu } };
  } catch (e) {
    console.error("[analisis captura]", (e as Error).message);
    return null;
  } finally {
    clearTimeout(matar);
    await browser?.close().catch(() => browser?.process()?.kill("SIGKILL"));
  }
}

export async function capturar(url: string): Promise<Captura | null> {
  if (activas >= 3) return null; // demasiada fila: mejor sin captura que un servidor sin memoria
  activas++;
  const turno = cola.then(() => Promise.race([sacar(url), new Promise<null>((r) => setTimeout(() => r(null), LIMITE_MS + 6000))]));
  cola = turno.catch(() => null);
  try {
    return (await turno) as Captura | null;
  } finally {
    activas--;
  }
}
