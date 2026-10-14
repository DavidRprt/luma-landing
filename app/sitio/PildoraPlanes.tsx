"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { trackGa } from "@/lib/tracking";
import s from "./sitio.module.css";

// Baja suave hasta los planes, salteando el aire de arriba de la sección para que el título y las tarjetas se vean completos.
function irAPlanes() {
  const sec = document.getElementById("planes");
  if (!sec) return;
  const aire = Math.max(0, parseFloat(getComputedStyle(sec).paddingTop) - 48);
  window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY + aire, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

// Píldora flotante: acompaña el scroll y lleva a los planes. Aparece un momento después de cargar y se esconde
// cuando los planes ya están cerca de la pantalla (ahí no hace falta).
export function PildoraPlanes() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let listo = false;
    const actualizar = () => {
      const sec = document.getElementById("planes");
      if (!sec) return;
      let ok = listo && sec.getBoundingClientRect().top > window.innerHeight * 0.55;
      // En celular, mientras el panel del analizador está a la vista, la píldora taparía su botón: se espera.
      const panel = document.getElementById("form");
      if (ok && panel && window.innerWidth < 1024) {
        const r = panel.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > window.innerHeight - 110) ok = false;
      }
      setVisible(ok);
    };
    const id = window.setTimeout(() => { listo = true; actualizar(); }, 1400);
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => { window.clearTimeout(id); window.removeEventListener("scroll", actualizar); window.removeEventListener("resize", actualizar); };
  }, []);

  return (
    <div className={s.pildoraWrap} data-on={visible ? 1 : 0}>
      <button
        type="button"
        className={s.pildora}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
        onClick={() => { trackGa("click_ver_planes", { placement: "pildora" }); irAPlanes(); }}
      >
        <span>Ver planes</span>
        <span className={s.pildoraIcono} aria-hidden="true"><ArrowDown size={16} strokeWidth={2} /></span>
      </button>
    </div>
  );
}
