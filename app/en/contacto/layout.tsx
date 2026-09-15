import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contacto",
  lang: "en",
  title: "Contact",
  description:
    "Tell us about your project and we'll get back to you within 24 hours. Message us on WhatsApp or fill out the form.",
});

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
