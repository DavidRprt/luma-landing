import type { Metadata } from "next";
import type { Lang } from "@/app/constants/translations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://underluma.com";

/**
 * Arma metadata (title, description, canonical, hreflang) para una ruta que
 * existe en las dos versiones: "/planes" (es) y "/en/planes" (en). `path` es
 * siempre la ruta canónica en español, sin el prefijo /en.
 */
export function pageMetadata({
  path,
  lang,
  title,
  description,
  noindex = false,
}: {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const suffix = path === "/" ? "" : path;
  const esUrl = `${SITE_URL}${suffix}`;
  const enUrl = `${SITE_URL}/en${suffix}`;
  const canonical = lang === "en" ? enUrl : esUrl;

  // El título siempre re-declara su propio `template`: si un layout intermedio
  // pone un string plano (o solo `default`), Next.js NO propaga el template
  // del ancestro a los hijos de ESE layout (queda sin el "| _luma" más abajo
  // en el árbol — pasaba con /planes/empezar bajo /planes). La home usa
  // `absolute` porque su título ya incluye "_luma —" y no debe duplicarse.
  return {
    title:
      path === "/"
        ? { absolute: title, template: "%s | _luma" }
        : { default: title, template: "%s | _luma" },
    description,
    alternates: {
      canonical,
      languages: {
        "es-AR": esUrl,
        "en-US": enUrl,
        "x-default": esUrl,
      },
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url: canonical,
      locale: lang === "en" ? "en_US" : "es_AR",
      alternateLocale: lang === "en" ? "es_AR" : "en_US",
    },
    twitter: {
      title,
      description,
    },
  };
}
