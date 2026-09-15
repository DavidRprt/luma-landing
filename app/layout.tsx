import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://underluma.com";

const HOME_TITLE = "_luma — sitios web modernos y a medida";
const HOME_DESCRIPTION =
  "Diseñamos y desarrollamos sitios web modernos, rápidos y a medida que hacen crecer tu negocio: landing pages, e-commerce y sitios corporativos con hosting y mantenimiento incluidos.";

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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "_luma",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  email: "hello@underluma.com",
  description: HOME_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
