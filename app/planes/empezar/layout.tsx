import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Página de checkout con querystring (?plan=...) — sin valor propio para
// buscar, así que no debería competir por indexación con /planes.
export const metadata: Metadata = pageMetadata({
  path: "/planes/empezar",
  lang: "es",
  title: "Confirmá tu plan",
  description: "Confirmá los datos de tu suscripción y arrancá con tu sitio en minutos.",
  noindex: true,
});

export default function EmpezarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
