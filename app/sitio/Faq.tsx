"use client";

import { Accordion } from "radix-ui";
import { ChevronDown } from "lucide-react";

// Mismas animaciones de apertura/cierre que el FAQ de /planes (keyframes en globals.css).
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <Accordion.Root type="single" collapsible className="mt-4 grid items-start gap-x-12 border-t border-white/[0.07] md:grid-cols-2">
      {items.map((item, i) => (
        <Accordion.Item key={item.q} value={`item-${i}`} className="border-b border-white/[0.07]">
          <Accordion.Header>
            <Accordion.Trigger
              className="group flex w-full cursor-pointer items-center justify-between gap-4 py-3 text-left text-white/75 transition-colors hover:text-white"
              style={{ fontSize: 14.5 }}
            >
              {item.q}
              <ChevronDown size={15} className="shrink-0 text-[#6aa9ff] transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:[animation:luma-accordion-down_0.25s_ease-out] data-[state=closed]:[animation:luma-accordion-up_0.2s_ease-in]">
            <p className="pb-3 text-white/50" style={{ fontSize: 14, lineHeight: 1.6 }}>{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
