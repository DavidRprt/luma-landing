import type { Lang } from "@/app/constants/translations";

/**
 * El español vive sin prefijo ("/planes"), el inglés bajo "/en" ("/en/planes").
 * Nunca cambiamos las URLs en español ya existentes — solo se agrega el árbol /en.
 */
export function withLang(path: string, lang: Lang): string {
  if (lang !== "en") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function langFromPathname(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}

/** La ruta "canónica" en español, sin el prefijo /en, para reconstruir el link al cambiar de idioma. */
export function basePathFromPathname(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/** Type guard para validar un `lang` recibido en el body de una request (no confiable por sí solo). */
export function isLang(value: unknown): value is Lang {
  return value === "es" || value === "en";
}
