import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://underluma.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "_luma — sitios web modernos con IA",
    template: "%s | _luma",
  },
  description:
    "Diseñamos y desarrollamos sitios web modernos, rápidos e inteligentes que hacen crecer tu negocio. Diseño web, e-commerce, IA integrada y SEO técnico.",
  keywords: [
    "diseño web", "desarrollo web", "inteligencia artificial",
    "Next.js", "e-commerce", "landing page", "SEO", "chatbot IA",
    "sitios web modernos", "agencia web",
  ],
  authors: [{ name: "_luma", url: SITE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_AR",
    url: SITE_URL,
    siteName: "_luma",
    title: "_luma — sitios web modernos con IA",
    description:
      "Diseñamos y desarrollamos sitios web modernos, rápidos e inteligentes que hacen crecer tu negocio.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "_luma — sitios web modernos con IA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "_luma — sitios web modernos con IA",
    description: "Diseñamos y desarrollamos sitios web modernos, rápidos e inteligentes.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
