import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/planes/empezar",
  lang: "en",
  title: "Confirm your plan",
  description: "Confirm your subscription details and get your site started in minutes.",
  noindex: true,
});

export default function EmpezarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
