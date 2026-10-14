"use client";

import { irAlFormulario } from "./irAlFormulario";
import { trackGa } from "@/lib/tracking";

// Botón que lleva al analizador del hero y deja el cursor en el campo de la dirección.
export function IrAlForm({ className, style, children, placement }: { className?: string; style?: React.CSSProperties; children: React.ReactNode; placement: string }) {
  return (
    <a
      href="#form"
      className={className}
      style={style}
      onClick={(e) => { e.preventDefault(); trackGa("click_analizar", { placement }); irAlFormulario(); }}
    >
      {children}
    </a>
  );
}
