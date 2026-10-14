"use client";

import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";
import s from "./sitio.module.css";

// Mismas animaciones de apertura/cierre que el FAQ de /planes (keyframes en globals.css).
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className={s.faq}>
      {items.map((item, i) => (
        <Accordion.Item key={item.q} value={`item-${i}`} className={s.faqItem}>
          <Accordion.Header style={{ margin: 0 }}>
            <Accordion.Trigger className={s.faqBtn}>
              {item.q}
              <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:[animation:luma-accordion-down_0.3s_ease-out] data-[state=closed]:[animation:luma-accordion-up_0.2s_ease-in]">
            <p className={`${s.body} ${s.faqRes}`}>{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
