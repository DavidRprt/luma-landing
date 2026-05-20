"use client";

import { useState, useEffect } from "react";
import { t, type Lang } from "../constants/translations";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const NavBar = ({ lang, setLang }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const c = t[lang].nav;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: c.services, href: "#servicios" },
    { label: c.works,    href: "#trabajos"  },
    { label: c.ai,       href: "#ia"        },
    { label: c.contact,  href: "#contacto"  },
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
        <a
          href="#hero"
          className="text-white text-base font-semibold hover:opacity-70 transition-opacity duration-300 shrink-0"
        >
          _luma
        </a>

        {/* Nav links con puntos y subrayado */}
        <nav className="hidden md:flex items-center">
          {links.map(({ label, href }, i) => (
            <span key={href} className="flex items-center">
              {i > 0 && (
                <span className="text-white/[0.18] select-none" style={{ fontSize: 11, margin: "0 14px" }}>
                  ·
                </span>
              )}
              <a
                href={href}
                className="group relative text-white/50 hover:text-white/90 text-sm transition-colors duration-300"
              >
                {label}
                <span className="absolute -bottom-px left-0 h-px w-0 bg-white/50 group-hover:w-full transition-all duration-300" />
              </a>
            </span>
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

          {/* CTA */}
          <a
            href="#contacto"
            className="text-sm text-black bg-white hover:bg-white/80 transition-colors duration-300 rounded-full px-4 py-1.5 font-medium"
          >
            {c.cta}
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
