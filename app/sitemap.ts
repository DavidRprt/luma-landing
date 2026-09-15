import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://underluma.com";

// Rutas indexables — /planes/empezar queda afuera a propósito (noindex, ver
// app/planes/empezar/layout.tsx: es una página de checkout, no de contenido).
const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/planes", priority: 0.9 },
  { path: "/proyectos", priority: 0.8 },
  { path: "/contacto", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap(({ path, priority }) => {
    const suffix = path === "/" ? "" : path;
    const esUrl = `${SITE_URL}${suffix}`;
    const enUrl = `${SITE_URL}/en${suffix}`;
    const alternates = { languages: { "es-AR": esUrl, "en-US": enUrl } };

    return [
      { url: esUrl, lastModified, changeFrequency: "monthly" as const, priority, alternates },
      { url: enUrl, lastModified, changeFrequency: "monthly" as const, priority: Math.round((priority - 0.1) * 10) / 10, alternates },
    ];
  });
}
