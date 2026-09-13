"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { t, type Lang } from "../constants/translations";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Where the logo links to. Defaults to the in-page hero anchor (for the homepage itself). */
  homeHref?: string;
}

const NavBar = ({ lang, setLang, homeHref = "#hero" }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const c = t[lang].nav;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Cierra el menú mobile apenas cambia la ruta (click en un link) o la pantalla
  // crece a desktop, para que nunca quede abierto colgado de un estado viejo.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const links = [
    { label: c.services, href: "/planes", active: pathname.startsWith("/planes") },
    { label: c.works,    href: "/proyectos",   active: pathname.startsWith("/proyectos")   },
    { label: c.contact,  href: "/contacto",    active: pathname.startsWith("/contacto")    },
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-3xl">
      <div
        style={
          scrolled
            ? {
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }
            : {
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
              }
        }
        className="flex items-center justify-between gap-4 rounded-full px-5 py-2.5 transition-all duration-500"
      >
        {/* Logo */}
        <a href={homeHref} className="group relative shrink-0 flex items-center gap-0">
          {/* underscore + dot */}
          <span className="relative inline-flex flex-col items-center mr-[3px]" style={{ width: 17, gap: 3.5 }}>
            <span
              className="logo-dot rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ width: 6, height: 6 }}
            />
            <span
              className="logo-bar rounded-sm bg-[#6aa9ff]"
              style={{ width: 17, height: 3 }}
            />
          </span>
          <span className="text-white font-semibold" style={{ fontSize: 17, letterSpacing: "-0.02em" }}>luma</span>
        </a>

        {/* Nav links — mono uppercase, con un punto de acento que aparece al hover */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map(({ label, href, active }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-1.5 font-mono uppercase transition-colors duration-300 ${
                active ? "text-white/95" : "text-white/45 hover:text-white/95"
              }`}
              style={{ fontSize: 10.5, letterSpacing: "0.14em" }}
            >
              <span
                className={`rounded-full shrink-0 transition-transform duration-300 ${
                  active ? "scale-100" : "scale-0 group-hover:scale-100"
                }`}
                style={{ width: 4, height: 4, background: "#6aa9ff" }}
              />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Pill de idioma */}
          <div
            className="relative flex rounded-full p-0.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="absolute top-0.5 bottom-0.5 rounded-full pointer-events-none"
              style={{
                width: "calc(50% - 2px)",
                background: "rgba(255,255,255,0.15)",
                transform: lang === "en" ? "translateX(100%)" : "translateX(0)",
                transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {(["es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="relative z-10 text-center rounded-full border-none cursor-pointer bg-transparent"
                style={{
                  width: 34,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "5px 0",
                  color: lang === l ? "white" : "rgba(255,255,255,0.35)",
                  transition: "color 0.25s",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* CTA — oculto en mobile, donde "Contacto" ya vive en el menú hamburguesa */}
          <Link
            href="/contacto"
            className="hidden md:inline-block text-sm text-black bg-white hover:bg-white/80 transition-colors duration-300 rounded-full px-4 py-1.5 font-medium"
          >
            {c.cta}
          </Link>

          {/* Botón hamburguesa — solo mobile, revela los mismos links que la nav de desktop */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? c.closeMenuLabel : c.openMenuLabel}
            aria-expanded={menuOpen}
            className="flex md:hidden items-center justify-center rounded-full transition-colors"
            style={{ width: 32, height: 32, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
          >
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Panel mobile — mismos links que la nav de desktop, ahora alcanzables sin ella */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute left-0 right-0 top-[calc(100%+10px)] flex flex-col rounded-2xl overflow-hidden origin-top"
            style={{
              background: "rgba(20,20,26,0.85)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6)",
            }}
          >
            {links.map(({ label, href, active }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 font-mono uppercase transition-colors duration-200 ${
                  active ? "text-white/95" : "text-white/55 hover:text-white/90"
                }`}
                style={{ fontSize: 12, letterSpacing: "0.12em", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span
                  className="rounded-full shrink-0"
                  style={{ width: 4, height: 4, background: "#6aa9ff", opacity: active ? 1 : 0 }}
                />
                {label}
              </Link>
            ))}
            <Link
              href="/contacto"
              className="text-center text-black bg-white hover:bg-white/85 transition-colors duration-200 font-medium"
              style={{ fontSize: 13, padding: "13px 20px", margin: 10, borderRadius: 999 }}
            >
              {c.cta}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
