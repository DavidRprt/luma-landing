import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { pageMetadata, SITE_URL, HOME_COPY } from "@/lib/seo";
import { OrganizationJsonLd } from "./components/OrganizationJsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const HOME_TITLE = HOME_COPY.es.title;
const HOME_DESCRIPTION = HOME_COPY.es.description;

const home = pageMetadata({ path: "/", lang: "es", title: HOME_TITLE, description: HOME_DESCRIPTION });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | _luma",
  },
  description: HOME_DESCRIPTION,
  keywords: [
    "diseño web", "desarrollo web", "sitios corporativos",
    "Next.js", "e-commerce", "landing page", "SEO técnico",
    "sitios web modernos", "agencia web", "suscripción mensual",
  ],
  authors: [{ name: "_luma", url: SITE_URL }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "_luma",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: HOME_TITLE }],
    ...home.openGraph,
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
    ...home.twitter,
  },
  alternates: home.alternates,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <head>
        <OrganizationJsonLd />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
