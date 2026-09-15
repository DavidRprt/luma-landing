"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import NavBar from "./components/NavBar";
import { LangHtmlSync } from "./components/LangHtmlSync";
import ChatWidget from "./components/ChatWidget";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import { langFromPathname } from "@/lib/i18n";

// Below-the-fold sections — loaded as separate JS chunks
const Subscription = dynamic(() => import("./sections/Subscription"));
const Works        = dynamic(() => import("./sections/Works"));
const Contact       = dynamic(() => import("./sections/Contact"));
const Footer        = dynamic(() => import("./sections/Footer"));

export default function Home() {
  const lang = langFromPathname(usePathname());

  return (
    <main>
      <LangHtmlSync lang={lang} />
      <NavBar lang={lang} />
      <Hero lang={lang} />
      <Marquee lang={lang} />
      <Subscription lang={lang} />
      <Works lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
      <ChatWidget lang={lang} />
    </main>
  );
}
