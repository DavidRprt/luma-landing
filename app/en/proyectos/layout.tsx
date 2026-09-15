import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/proyectos",
  lang: "en",
  title: "Projects",
  description:
    "Websites, e-commerce, and custom systems we've built for our clients. Real cases, real results.",
});

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
