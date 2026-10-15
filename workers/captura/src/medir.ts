// Se ejecuta DENTRO de la página (en el navegador de Cloudflare): mide dónde están el menú, el título, el botón principal y el
// contacto, en % de la captura, y cuántas opciones distintas tiene el menú. Es el mismo código que usa la landing en local.
export function medirPagina(W: number, H: number) {
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
  const area = (e: Element) => { const r = e.getBoundingClientRect(); return Math.max(0, Math.min(W, r.right) - Math.max(0, r.left)) * Math.max(0, Math.min(H, r.bottom) - Math.max(0, r.top)); };
  const conFondo = Array.from(document.querySelectorAll("img,picture,video,section,div,header")).filter((e) => visible(e) && (e.tagName === "IMG" || e.tagName === "VIDEO" || (getComputedStyle(e).backgroundImage || "none") !== "none") && area(e) > W * H * 0.12);
  const hero = conFondo.sort((a, b) => area(b) - area(a))[0];
  const textos = new Set<string>();
  if (menu) for (const a of Array.from(menu.querySelectorAll("a"))) {
    if (!visible(a) || a.getBoundingClientRect().top > 220) continue;
    const t = (a.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (t.length >= 2 && t.length <= 40) textos.add(t);
  }
  return { zonas: { menu: zona(menu), h1: zona(h1), cta: zona(cta), contacto: zona(contacto), hero: zona(hero) }, itemsMenu: menu ? textos.size : null };
}

// Espera a que el sitio termine de cargar de verdad: tipografías e imágenes de la primera pantalla.
export async function esperarCarga(H: number) {
  const tope = new Promise((r) => setTimeout(r, 3500));
  const listo = (async () => {
    await document.fonts?.ready;
    const imgs = Array.from(document.images).filter((i) => i.getBoundingClientRect().top < H && !i.complete);
    await Promise.all(imgs.map((i) => new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })));
  })();
  await Promise.race([listo, tope]);
}
