import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// No <html>/<body> acá — Next.js solo permite declararlos una vez, en el
// layout raíz (app/layout.tsx). El atributo lang="en" real se corrige del
// lado del cliente vía <LangHtmlSync> en cada página (ver lib/i18n.ts).
export const metadata: Metadata = pageMetadata({
  path: "/",
  lang: "en",
  title: "_luma — modern, custom-built websites",
  description:
    "We design and build modern, fast, custom websites that grow your business: landing pages, e-commerce, and corporate sites with hosting and maintenance included.",
});

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
