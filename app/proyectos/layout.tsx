import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/proyectos",
  lang: "es",
  title: "Proyectos",
  description:
    "Sitios web, e-commerce y sistemas a medida que desarrollamos para nuestros clientes. Casos reales, resultados reales.",
});

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
