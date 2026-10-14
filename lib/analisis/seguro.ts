import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import zlib from "node:zlib";

// Descarga segura de un sitio que escribió una persona cualquiera (SSRF): solo http/https por los puertos normales,
// jamás una IP privada, local o de metadatos (se revisa al CONECTAR, así que un DNS que cambia no lo esquiva), con
// tope de redirecciones, de tiempo y de tamaño.

const RESERVADOS = /\.(local|localhost|internal|lan|home|corp|intranet|test|invalid|example|onion)$/i;

/** "https://www.MiNegocio.com/inicio?x=1" -> "minegocio.com". null si no parece un dominio público. */
export function normalizarDominio(v: string): string | null {
  const d = String(v ?? "").trim().replace(/^[a-z]+:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0].toLowerCase();
  if (d.length < 4 || d.length > 120 || d.includes(":") || d.includes("@")) return null;
  if (!/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(d)) return null;
  if (RESERVADOS.test(d) || net.isIP(d)) return null;
  return d;
}

function ipv4Privada(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b, c] = p;
  return (
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113)
  );
}

export function ipPrivada(ip: string): boolean {
  const x = ip.toLowerCase();
  if (net.isIPv4(x)) return ipv4Privada(x);
  if (!net.isIPv6(x)) return true;
  const mapeada = x.match(/^(?:0*:)*:?ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapeada) return ipv4Privada(mapeada[1]);
  return (
    x === "::" || x === "::1" ||
    /^f[cd]/.test(x) || /^fe[89ab]/.test(x) || x.startsWith("ff") ||
    x.startsWith("2001:db8") || x.startsWith("64:ff9b") || x.startsWith("2002:") || x.startsWith("100::")
  );
}

// El "lookup" de las conexiones: resuelve y rechaza todo destino que no sea público.
function lookupSeguro(hostname: string, opciones: dns.LookupOptions | number, cb: (...a: unknown[]) => void) {
  const op = typeof opciones === "object" ? opciones : {};
  dns.lookup(hostname, { all: true, verbatim: true }, (err, direcciones) => {
    if (err) return cb(err);
    if (!direcciones.length || direcciones.some((d) => ipPrivada(d.address))) return cb(new Error("destino no permitido"));
    if (op.all) return cb(null, direcciones);
    return cb(null, direcciones[0].address, direcciones[0].family);
  });
}

export type Descarga = { status: number; url: URL; headers: http.IncomingHttpHeaders; cuerpo: string; bytes: number; truncado: boolean; certInvalido: boolean };

function pedir(url: URL, o: { maxBytes: number; limite: number; inseguro: boolean }): Promise<Omit<Descarga, "url" | "certInvalido">> {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === "https:" ? https : http;
    const restante = o.limite - Date.now();
    if (restante <= 0) return reject(new Error("tiempo agotado"));
    const req = mod.request(
      url,
      {
        method: "GET",
        lookup: lookupSeguro as never,
        rejectUnauthorized: !o.inseguro,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; lumaBot/1.0; +https://underluma.com)",
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "es-AR,es;q=0.9,en;q=0.5",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, headers: res.headers, cuerpo: "", bytes: 0, truncado: false });
        }
        const tipo = String(res.headers["content-type"] ?? "");
        if (tipo && !/text\/html|application\/xhtml/i.test(tipo) && !/xml|text\/plain/i.test(tipo)) {
          res.destroy();
          return reject(new Error("no es una página web"));
        }
        const enc = String(res.headers["content-encoding"] ?? "").toLowerCase();
        let flujo: NodeJS.ReadableStream = res;
        if (enc.includes("gzip")) flujo = res.pipe(zlib.createGunzip());
        else if (enc.includes("deflate")) flujo = res.pipe(zlib.createInflate());
        else if (enc.includes("br")) flujo = res.pipe(zlib.createBrotliDecompress());
        const trozos: Buffer[] = [];
        let bytes = 0;
        let truncado = false;
        const fin = () => resolve({ status, headers: res.headers, cuerpo: Buffer.concat(trozos).toString("utf8"), bytes, truncado });
        flujo.on("data", (b: Buffer) => {
          if (truncado) return;
          bytes += b.length;
          if (bytes > o.maxBytes) {
            truncado = true;
            trozos.push(b.subarray(0, Math.max(0, b.length - (bytes - o.maxBytes))));
            res.destroy();
            fin();
            return;
          }
          trozos.push(b);
        });
        flujo.on("end", () => !truncado && fin());
        flujo.on("error", (e) => (truncado ? undefined : reject(e)));
      }
    );
    req.setTimeout(Math.min(restante, 9000), () => req.destroy(new Error("tiempo agotado")));
    req.on("error", reject);
    const corte = setTimeout(() => req.destroy(new Error("tiempo agotado")), restante);
    req.on("close", () => clearTimeout(corte));
    req.end();
  });
}

const ERROR_CERT = /CERT|SELF.SIGNED|UNABLE_TO_VERIFY|EXPIRED|HOSTNAME_MISMATCH|ERR_TLS|SSL/i;

/** Descarga una página siguiendo redirecciones (máx. 4), revisando cada destino. Lanza error si no se puede. */
export async function descargar(inicial: string, o: { maxBytes?: number; timeoutMs?: number } = {}): Promise<Descarga> {
  const maxBytes = o.maxBytes ?? 600_000;
  const limite = Date.now() + (o.timeoutMs ?? 12_000);
  let url = new URL(inicial);
  let certInvalido = false;
  for (let i = 0; i <= 4; i++) {
    if (!/^https?:$/.test(url.protocol)) throw new Error("protocolo no permitido");
    if (url.port && url.port !== "80" && url.port !== "443") throw new Error("puerto no permitido");
    if (url.username || url.password) throw new Error("dirección no permitida");
    if (net.isIP(url.hostname.replace(/^\[|\]$/g, ""))) throw new Error("dirección IP directa no permitida");
    let r;
    try {
      r = await pedir(url, { maxBytes, limite, inseguro: certInvalido });
    } catch (e) {
      const c = String((e as NodeJS.ErrnoException).code ?? "") + String((e as Error).message);
      if (url.protocol === "https:" && !certInvalido && ERROR_CERT.test(c)) {
        certInvalido = true;
        r = await pedir(url, { maxBytes, limite, inseguro: true });
      } else throw e;
    }
    const destino = r.headers.location;
    if (r.status >= 300 && r.status < 400 && destino) {
      url = new URL(destino, url);
      continue;
    }
    return { ...r, url, certInvalido };
  }
  throw new Error("demasiadas redirecciones");
}
