"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WhatsAppLink } from "./TrackedLink";
import { ANALISIS_EVENT, WHATSAPP_URL } from "./constants";
import { irAlFormulario } from "./irAlFormulario";
import s from "./sitio.module.css";

// Barra fija abajo, solo en celular. Aparece al bajar del primer pantallazo y
// se esconde cuando el formulario ya está a la vista (para no taparlo).
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pasoElInicio = false;
    let formVisible = false;
    const update = () => setVisible(pasoElInicio && !formVisible);

    const onScroll = () => {
      pasoElInicio = window.scrollY > 480;
      update();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const visibles = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      }
      formVisible = visibles.size > 0;
      update();
    });
    // El reporte aparece después de cargar la página: se vuelve a buscar cuando termina un análisis.
    const observar = () => document.querySelectorAll("[data-lead-form]").forEach((f) => io.observe(f));
    observar();
    let id = 0;
    const onAnalisis = () => { window.clearTimeout(id); id = window.setTimeout(observar, 1100); };
    window.addEventListener(ANALISIS_EVENT, onAnalisis);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(ANALISIS_EVENT, onAnalisis);
      window.clearTimeout(id);
      io.disconnect();
    };
  }, []);

  return (
    <div className={s.sticky} data-on={visible ? 1 : 0} style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }} aria-hidden={!visible}>
      <div className={s.stickyIn}>
        <a
          href="#form"
          onClick={(e) => { e.preventDefault(); irAlFormulario(); }}
          tabIndex={visible ? 0 : -1}
          className={`${s.btn}`}
          style={{ flex: 1 }}
        >
          Analizar mi sitio
        </a>
        <WhatsAppLink href={WHATSAPP_URL} placement="sticky" className={`${s.btn} ${s.btnWa}`}>
          <WhatsAppIcon /> WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
