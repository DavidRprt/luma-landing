"use client";

import { useRef, useState } from "react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { HighlightGrid, WorkImg, type Work } from "../components/WorkCard";
import { ShineButton } from "../components/ShineButton";
import { irAlFormulario } from "./irAlFormulario";
import { trackGa } from "@/lib/tracking";

// Card de proyecto de la landing. "Ver más" abre el mismo popup que la home
// (misma animación y mismo estilo), pero SIN link al sitio del cliente: la idea
// es que nadie se vaya de la página. En su lugar, el popup lleva al formulario.
export function ProyectoCard({ w }: { w: Work }) {
  const [open, setOpen] = useState(false);

  // Igual que en la home: el popup sale y se esconde desde el botón que lo abrió.
  const triggerPointRef = useRef<{ x: number; y: number } | null>(null);
  const onTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    triggerPointRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    trackGa("view_project", { project: w.title });
  };
  const applyTransformOrigin = (el: HTMLDivElement | null) => {
    const point = triggerPointRef.current;
    if (!el || !point) return;
    const popupLeft = window.innerWidth / 2 - el.offsetWidth / 2;
    const popupTop = window.innerHeight / 2 - el.offsetHeight / 2;
    el.style.transformOrigin = `${point.x - popupLeft}px ${point.y - popupTop}px`;
  };

  // Mancha de luz que sigue al cursor dentro del popup (igual que en la home).
  const spotRef = useRef<HTMLDivElement | null>(null);
  const onDialogMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = spotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };
  const setDialogRef = (el: HTMLDivElement | null) => {
    spotRef.current = el;
    applyTransformOrigin(el);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <Image
          src={`/${w.img}.png`}
          alt={`Sitio de ${w.title}`}
          width={1800}
          height={1020}
          sizes="(min-width: 1152px) 280px, (min-width: 640px) 48vw, 70vw"
          className="aspect-[16/9] w-full object-cover object-top"
        />
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold" style={{ fontSize: 16 }}>{w.title}</h3>
            <span className="text-white/35" style={{ fontSize: 12 }}>{w.category}</span>
          </div>
          <p className="mt-2 line-clamp-3 text-white/55" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{w.desc}</p>
          {w.stat && <p className="mt-2 font-medium text-[#6aa9ff]" style={{ fontSize: 12.5 }}>{w.stat}</p>}
          <Dialog.Trigger asChild>
            <button
              type="button"
              onClick={onTriggerClick}
              className="group mt-3 inline-flex w-fit items-center gap-1.5 text-white/45 transition-colors duration-300 hover:text-[#6aa9ff]"
              style={{ fontSize: 13 }}
            >
              <span
                className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-90"
                style={{ width: 16, height: 16, border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <Plus size={10} />
              </span>
              Ver más
            </button>
          </Dialog.Trigger>
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 data-[state=open]:[animation:luma-overlay-in_0.2s_ease-out] data-[state=closed]:[animation:luma-overlay-out_0.15s_ease-in]"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(3px)", zIndex: 100 }}
        />
        <Dialog.Content
          ref={setDialogRef}
          onMouseMove={onDialogMouseMove}
          className="fixed left-1/2 top-1/2 flex max-h-[90vh] w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border data-[state=open]:[animation:luma-popup-in_0.4s_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:[animation:luma-popup-out_0.28s_cubic-bezier(0.6,0,0.8,0.2)]"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            background: "#0d0d13",
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
            zIndex: 101,
            "--spot-x": "50%",
            "--spot-y": "0%",
          } as React.CSSProperties}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(106,169,255,0.1), transparent 70%)" }}
          />

          <div className="relative shrink-0">
            <WorkImg img={w.img} />
            <Dialog.Close asChild>
              <button
                aria-label="Cerrar"
                className="group absolute flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-black/70"
                style={{ top: 12, right: 12, width: 32, height: 32, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)" }}
              >
                <X size={16} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
              </button>
            </Dialog.Close>
          </div>

          <div className="relative overflow-y-auto p-6">
            <div className="mb-3 flex items-center justify-between">
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full uppercase"
                style={{ fontSize: 9.5, letterSpacing: "0.16em", padding: "3px 9px 3px 7px", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}
              >
                <span className="shrink-0 rounded-full" style={{ width: 3.5, height: 3.5, background: "#6aa9ff" }} />
                {w.category}
              </span>
              <span className="font-mono text-white/[0.25]" style={{ fontSize: 10 }}>{w.year}</span>
            </div>
            <Dialog.Title asChild>
              <h3 className="mb-2 font-semibold text-white" style={{ fontSize: 24, letterSpacing: "-0.02em" }}>{w.title}</h3>
            </Dialog.Title>
            {w.stat && (
              <div className="mb-3 w-fit font-mono" style={{ fontSize: 11, color: "#6aa9ff", background: "rgba(106,169,255,0.08)", padding: "5px 10px", borderRadius: 6 }}>
                {w.stat}
              </div>
            )}
            <Dialog.Description asChild>
              <p className="mb-4 leading-relaxed text-white/[0.5]" style={{ fontSize: 13, lineHeight: 1.6 }}>{w.desc}</p>
            </Dialog.Description>
            {w.highlights && w.highlights.length > 0 && (
              <div className="mb-5">
                <HighlightGrid highlights={w.highlights} />
              </div>
            )}
            <ShineButton
              className="w-fit"
              onClick={() => {
                setOpen(false);
                window.setTimeout(irAlFormulario, 300);
              }}
            >
              Quiero un sitio así
            </ShineButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
