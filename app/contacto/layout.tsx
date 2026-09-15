import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contacto",
  lang: "es",
  title: "Contacto",
  description:
    "Contanos tu proyecto y te respondemos en menos de 24 horas. Escribinos por WhatsApp o completá el formulario.",
});

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
