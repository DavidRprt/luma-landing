import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/planes",
  lang: "en",
  title: "Plans & Pricing",
  description:
    "Landing pages and corporate sites by monthly subscription, starting at $89/month. Hosting, domain, and maintenance included — no big upfront payment.",
});

export default function PlanesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
