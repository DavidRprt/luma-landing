"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { CONTACTO_EVENT, type ContactoDetalle } from "./constants";
import s from "./sitio.module.css";

// Ventana corta de contacto. Se abre encima de la página (no mueve nada) con el plan o el proyecto ya elegido.
export function Contacto() {
  const [abierto, setAbierto] = useState(false);
  const [d, setD] = useState<ContactoDetalle | null>(null);
  const [n, setN] = useState(0); // fuerza un formulario nuevo en cada apertura
  const cuerpo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = (e: Event) => { setD((e as CustomEvent<ContactoDetalle>).detail); setN((x) => x + 1); setAbierto(true); };
    window.addEventListener(CONTACTO_EVENT, on);
    return () => window.removeEventListener(CONTACTO_EVENT, on);
  }, []);

  return (
    <Dialog.Root open={abierto} onOpenChange={setAbierto}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.modalFondo} />
        <Dialog.Content
          className={`${s.root} ${s.modal}`}
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => { e.preventDefault(); cuerpo.current?.querySelector<HTMLInputElement>("input[name='nombre'], input[type='tel']")?.focus(); }}
        >
          <div ref={cuerpo}>
            <Dialog.Title className={s.panelTitulo}>{d?.titulo}</Dialog.Title>
            {d?.subtitulo && <p className={s.panelSub}>{d.subtitulo}</p>}
            {d && (
              <LeadForm
                key={n}
                placement={d.placement as "plan" | "proyecto"}
                variante="corto"
                plano
                title=""
                subtitle=""
                planInicial={d.plan}
                contexto={d.contexto}
                soloWhatsApp={d.soloWhatsApp}
                boton="Quiero mi sitio"
              />
            )}
          </div>
          <Dialog.Close className={s.modalCerrar} aria-label="Cerrar"><X size={20} strokeWidth={1.5} aria-hidden="true" /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
