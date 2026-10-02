"use client";

import { Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * El script del píxel ya manda el primer PageView solo (fbq('track',
 * 'PageView') en la inicialización) — acá solo se reportan los cambios de
 * ruta posteriores, porque el router de Next no recarga la página.
 *
 * Va en su propio <Suspense>, separado del <Script> y el <noscript>: usar
 * useSearchParams sin aislarlo saca del HTML estático a TODO lo que esté al
 * lado dentro del mismo límite, no solo a este componente.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  // Solo en producción: así el tráfico de desarrollo y de las previews no
  // ensucia las métricas reales.
  if (!PIXEL_ID || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          if (/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(location.hostname)) { window.__lumaNoTrack = true; }
          else {
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
          }
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
