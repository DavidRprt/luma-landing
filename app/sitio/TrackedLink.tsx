"use client";

import { trackGa, trackMeta } from "@/lib/tracking";

// Link a WhatsApp que, además de abrir el chat, avisa al píxel de Meta y a GA4
// (evento "Contact") y de qué parte de la página salió el click.
export function WhatsAppLink({
  href,
  placement,
  className,
  style,
  children,
}: {
  href: string;
  placement: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => {
        trackMeta("Contact", { content_name: "WhatsApp", placement });
        trackGa("click_whatsapp", { placement });
      }}
    >
      {children}
    </a>
  );
}
