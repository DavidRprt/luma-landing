"use client";

import { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-3xl">
      <div
        className={`flex items-center justify-between gap-6 rounded-full px-6 py-3 transition-all duration-500 ${
          scrolled
            ? "bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl shadow-black/50"
            : "bg-transparent border border-white/15"
        }`}
      >
        <a href="#hero" className="text-white text-base font-semibold hover:opacity-70 transition-opacity duration-300">
          _luma
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ link, name }) => (
            <a
              key={name}
              href={link}
              className="text-white/70 hover:text-white text-sm transition-colors duration-300"
            >
              {name}
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="text-sm text-black bg-white hover:bg-white/80 transition-colors duration-300 rounded-full px-4 py-1.5 font-medium"
        >
          Hablemos
        </a>
      </div>
    </header>
  );
};

export default NavBar;
