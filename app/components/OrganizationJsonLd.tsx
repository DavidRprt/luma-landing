"use client";

import { usePathname } from "next/navigation";
import { langFromPathname } from "@/lib/i18n";
import { SITE_URL, HOME_COPY } from "@/lib/seo";

// Cliente porque el layout raíz está por encima del segmento /en y no tiene
// forma de saber el idioma — se resuelve leyendo la ruta, igual que
// <LangHtmlSync>. Un solo <script>, contenido según el idioma detectado (no
// dos scripts fijos: dos Organization en la misma página confunde más de lo
// que ayuda).
export function OrganizationJsonLd() {
  const lang = langFromPathname(usePathname());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "_luma",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    email: "hello@underluma.com",
    description: HOME_COPY[lang].description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
