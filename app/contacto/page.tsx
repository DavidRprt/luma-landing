"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import ChatWidget from "../components/ChatWidget";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";
import { type Lang } from "../constants/translations";

export default function ContactoPage() {
  const [lang, setLang] = useState<Lang>("es");

  return (
    <main>
      <NavBar lang={lang} setLang={setLang} homeHref="/" />
      <Contact lang={lang} standalone />
      <Footer lang={lang} />
      <ChatWidget lang={lang} />
    </main>
  );
}
