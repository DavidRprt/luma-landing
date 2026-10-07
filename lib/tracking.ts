// Utilidades de medición del lado del navegador. Todo es "best effort": si el
// píxel o GA4 no están cargados (desarrollo, localhost, bloqueadores), no pasa nada.

const ATTR_KEY = "luma_attr";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ad_id", "adset_id", "campaign_id"];

export type Attribution = Record<string, string>;

/** Guarda de dónde vino la persona (UTM, fbclid…) la primera vez que cae en el sitio. */
export function captureAttribution(): Attribution {
  try {
    const stored: Attribution = JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}");
    const url = new URLSearchParams(window.location.search);
    const fresh: Attribution = {};
    for (const key of PARAMS) {
      const v = url.get(key);
      if (v) fresh[key] = v.slice(0, 200);
    }
    const merged: Attribution = { ...stored, ...fresh };
    if (!merged.landing) merged.landing = window.location.pathname;
    if (!merged.referrer && document.referrer) merged.referrer = document.referrer.slice(0, 200);
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return {};
  }
}

export function getCookie(name: string): string | undefined {
  try {
    return document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1];
  } catch {
    return undefined;
  }
}

/** _fbc: si hay fbclid en la URL y todavía no existe la cookie, se arma con el formato de Meta. */
export function getFbc(attr: Attribution): string | undefined {
  return getCookie("_fbc") ?? (attr.fbclid ? `fb.1.${Date.now()}.${attr.fbclid}` : undefined);
}

export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

// Los scripts de GA4 y del píxel cargan después de que React hidrata. Un evento
// que se dispara al montar la página (view_landing, ViewContent) llegaba antes
// de que existiera gtag/fbq y se perdía en silencio: se reintenta hasta ~8 s.
function cuandoEsteListo(listo: () => boolean, enviar: () => void) {
  if (listo()) {
    enviar();
    return;
  }
  let intentos = 0;
  const timer = setInterval(() => {
    intentos++;
    if (listo()) {
      clearInterval(timer);
      enviar();
    } else if (intentos >= 40) clearInterval(timer);
  }, 200);
}

export function trackMeta(event: string, params?: Record<string, unknown>, eventId?: string) {
  try {
    cuandoEsteListo(
      () => typeof window.fbq === "function",
      () => {
        try {
          if (eventId) window.fbq?.("track", event, params ?? {}, { eventID: eventId });
          else window.fbq?.("track", event, params ?? {});
        } catch { /* nunca romper la página por la medición */ }
      }
    );
  } catch { /* idem */ }
}

// Conversión "Enviar formulario de clientes potenciales" de Google Ads. Se dispara
// solo cuando el lead se envió bien (nunca en la carga de página, que contaría cada visita).
const ADS_LEAD_CONVERSION = "AW-17134038147/bFKPCJOo6-IaEIPZkuo_";

export function trackGa(event: string, params?: Record<string, unknown>) {
  try {
    cuandoEsteListo(
      () => typeof window.gtag === "function",
      () => {
        try {
          window.gtag?.("event", event, params ?? {});
          if (event === "generate_lead") window.gtag?.("event", "conversion", { send_to: ADS_LEAD_CONVERSION });
        } catch { /* idem */ }
      }
    );
  } catch { /* idem */ }
}
