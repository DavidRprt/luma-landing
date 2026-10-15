import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo para probar desde el celular en la misma wifi (sin esto el servidor de desarrollo bloquea el JavaScript y nada se anima).
  allowedDevOrigins: ["192.168.1.246", "192.168.68.54"],
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"], // Chromium para las capturas del analizador: no se empaqueta con el servidor
  compress: true,
  poweredByHeader: false,
  images: {
    // Las capturas de las landings llevan ?v=<fecha> para que el navegador no muestre una versión vieja al actualizarlas.
    localPatterns: [{ pathname: "/**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      { source: "/suscripcion", destination: "/planes", permanent: true },
      { source: "/en/suscripcion", destination: "/en/planes", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:path*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff2|woff)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
