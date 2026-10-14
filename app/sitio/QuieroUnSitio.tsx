"use client";

import { abrirContacto } from "./constants";
import { trackGa } from "@/lib/tracking";

// Enlace general "Quiero un sitio así" (sobre la vitrina de proyectos): abre la ventana corta de contacto.
export function QuieroUnSitio({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackGa("click_quiero_sitio", { placement: "proyectos" });
        abrirContacto({
          titulo: "Quiero un sitio así",
          subtitulo: "Dejanos tu nombre y tu WhatsApp y te escribimos.",
          contexto: "Le gustaron los proyectos de la página",
          placement: "proyecto",
        });
      }}
    >
      {children}
    </button>
  );
}
