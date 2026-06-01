"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { type Lang } from "./constants/translations";
import NavBar from "./components/NavBar";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";

// Below-the-fold sections — loaded as separate JS chunks
const Features = dynamic(() => import("./sections/Features"));
const Works    = dynamic(() => import("./sections/Works"));
const AI       = dynamic(() => import("./sections/AI"));
const Contact  = dynamic(() => import("./sections/Contact"));
const Footer   = dynamic(() => import("./sections/Footer"));

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
