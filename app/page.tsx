"use client";

import { useState } from "react";
import { type Lang } from "./constants/translations";
import NavBar from "./components/NavBar";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Features from "./sections/Features";
import Works from "./sections/Works";
import AI from "./sections/AI";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function Home() {
  const [lang, setLang] = useState<Lang>("es");

  return (
    <main>
      <NavBar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Marquee lang={lang} />
      <Features lang={lang} />
      <Works lang={lang} />
      <AI lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
