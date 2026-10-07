"use client";

import { useEffect } from "react";
import { trackGa } from "@/lib/tracking";

// Registra qué botones y links toca la gente (cta_<texto>) para poder ver, por
// ejemplo, qué hizo en el portfolio quien llegó desde un mail. Los que ya tienen
// evento propio (WhatsApp, planes, formulario) no se duplican.
const YA_MEDIDOS = ["whatsapp", "plan", "enviar", "empezar"];

const aSlug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);

export function ClickTracker() {
  useEffect(() => {
    const alClic = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a, button");
      if (!el) return;
      const texto = (el.getAttribute("aria-label") || el.textContent || "").trim();
      const slug = aSlug(texto);
      if (slug.length < 2 || YA_MEDIDOS.some((p) => slug.includes(p))) return;
      trackGa(`cta_${slug}`, { page: window.location.pathname });
    };
    document.addEventListener("click", alClic, { capture: true });
    return () => document.removeEventListener("click", alClic, { capture: true });
  }, []);
  return null;
}
