import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/planes",
  lang: "es",
  title: "Planes y precios",
  description:
    "Landing pages y sitios corporativos por suscripción mensual, desde $59/mes. Hosting, dominio y mantenimiento incluidos — sin pagar todo de una.",
});

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
