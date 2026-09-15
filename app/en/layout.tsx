import type { Metadata } from "next";
import { pageMetadata, HOME_COPY } from "@/lib/seo";

// No <html>/<body> acá — Next.js solo permite declararlos una vez, en el
// layout raíz (app/layout.tsx). El atributo lang="en" real se corrige del
// lado del cliente vía <LangHtmlSync> en cada página (ver lib/i18n.ts).
export const metadata: Metadata = pageMetadata({
  path: "/",
  lang: "en",
  title: HOME_COPY.en.title,
  description: HOME_COPY.en.description,
});

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
