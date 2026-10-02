/**
 * Normaliza un WhatsApp a lo que espera wa.me: solo dígitos, con código de país
 * (y el 9 de los celulares argentinos). Devuelve null si no parece un número real.
 *
 * Acepta cómo lo escribe la gente: "11 5598-8007", "011 15 5598-8007",
 * "+54 9 11 5598 8007", "+598 99 123 456" (otro país con +).
 */
export function normalizarWhatsApp(input: string): string | null {
  const raw = input.trim();
  let d = raw.replace(/\D/g, "");
  if (!d) return null;

  // Con "+" o "00" ya viene con código de país.
  if (raw.startsWith("+") || raw.startsWith("00")) {
    if (raw.startsWith("00")) d = d.slice(2);
    if (d.startsWith("54")) return normalizarArgentinaConPais(d);
    return d.length >= 10 && d.length <= 15 ? d : null;
  }

  if (d.startsWith("54") && d.length >= 12) return normalizarArgentinaConPais(d);

  // Formato local argentino.
  d = d.replace(/^0+/, "");
  if (d.length === 10) return `549${d}`;
  // Con el "15" de los celulares viejos: 11 15 5598 8007 → 11 5598 8007.
  if (d.length === 12) {
    for (const area of [2, 3, 4]) {
      if (d.slice(area, area + 2) === "15") return `549${d.slice(0, area)}${d.slice(area + 2)}`;
    }
    return null;
  }
  // "15 5598 8007" sin código de área: se asume Buenos Aires (11).
  if (d.length === 10 + 1 && d.startsWith("15")) return `54911${d.slice(2)}`;
  return null;
}

function normalizarArgentinaConPais(d: string): string | null {
  // 54 + 10 dígitos (le falta el 9 de celular) o 549 + 10 dígitos.
  if (d.length === 12) return `549${d.slice(2)}`;
  if (d.length === 13 && d.startsWith("549")) return d;
  return null;
}

export function linkWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
