"use client";

import { usePathname } from "next/navigation";
import NavBar from "../components/NavBar";
import { LangHtmlSync } from "../components/LangHtmlSync";
import ChatWidget from "../components/ChatWidget";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";
import { withLang, langFromPathname } from "@/lib/i18n";

export default function ContactoPage() {
  const lang = langFromPathname(usePathname());

  return (
    <main>
      <LangHtmlSync lang={lang} />
      <NavBar lang={lang} homeHref={withLang("/", lang)} />
      <Contact lang={lang} standalone />
      <Footer lang={lang} />
      <ChatWidget lang={lang} />
    </main>
  );
}
