"use client";

import { motion } from "motion/react";
import { Wifi, BatteryFull, Volume1, ChevronLeft, ChevronRight, Share, BookOpen, Copy, RotateCw } from "lucide-react";
import { MockLandingDesktop, MockLandingMobile } from "./MockLandingScreen";
import type { Lang } from "../constants/translations";

const EASE = [0.16, 1, 0.3, 1] as const;

/** A preview of the site: a browser-window mockup on larger screens, a phone-shaped
 * mockup below `sm`. The content inside is real, live React/CSS (not a screenshot) —
 * it's meant to demonstrate the kind of finished, animated site we build, so it needs
 * to actually move (the carousel really rotates) rather than just look like one. */
export default function MacbookShowcase({ lang }: { lang: Lang }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative w-full max-w-2xl flex flex-col items-center"
      style={{ maxHeight: "100%" }}
    >
      {/* Desktop / tablet: browser window */}
      <div
        className="hidden sm:block w-full overflow-hidden rounded-2xl"
        style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)" }}
      >
        <div className="flex items-center gap-1.5" style={{ height: 28, padding: "0 12px", background: "#141414", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#ff5f57" }} />
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#febc2e" }} />
          <span style={{ width: 7, height: 7, borderRadius: 999, background: "#28c840" }} />
        </div>
        <MockLandingDesktop lang={lang} />
      </div>

      {/* Mobile: phone frame — sized to the ~19.5:9 aspect ratio modern iPhone Pro
          screens share (has held from the iPhone X through the 16 Pro; nothing suggests
          the 17 Pro breaks that). The Dynamic Island lives INSIDE the screen area (not
          positioned off the outer bezel), inset from its top edge with a real pill
          aspect-ratio (~3.2:1), so it reads as a cutout in the glass, not a shape stuck
          to the frame. */}
      <div
        className="sm:hidden relative mx-auto w-full"
        style={{ maxWidth: 208, aspectRatio: "9 / 19.5", background: "#0a0a0a", borderRadius: "2.4rem", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }}
      >
        <div
          className="absolute overflow-hidden flex flex-col"
          style={{ inset: 5, borderRadius: "2.1rem", background: "#000" }}
        >
          {/* Status bar: a solid, opaque black band (real iOS Safari doesn't blend this
              with page content) with the Dynamic Island cut into it. Real Safari (iOS 15+)
              keeps its own chrome at the BOTTOM of the screen, not up here — this is just
              the OS status row. */}
          <div className="relative shrink-0 z-20" style={{ paddingTop: "3.6%", paddingBottom: 4, background: "#000" }}>
            <div className="flex items-center justify-between" style={{ padding: "0 20px", fontSize: 11, fontWeight: 600, color: "white" }}>
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Volume1 size={11} />
                <Wifi size={11} />
                <BatteryFull size={14} />
              </div>
            </div>
            <div
              className="absolute z-10"
              style={{ top: "6%", left: "50%", transform: "translateX(-50%)", width: "30%", aspectRatio: "3.2 / 1", borderRadius: 999, background: "#000", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
            />
          </div>
          <div className="relative flex-1 min-h-0">
            <MockLandingMobile lang={lang} />
            {/* Safari chrome: on real iOS this floats at the BOTTOM as two stacked
                translucent pills — a URL bar, then the nav toolbar below it — overlaying
                the page rather than pushing it up. */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1" style={{ padding: "0 8px 6px" }}>
              <div
                className="flex items-center justify-center gap-1.5 w-full rounded-xl backdrop-blur"
                style={{ padding: "6px 10px", background: "rgba(40,40,42,0.82)", fontSize: 10.5, color: "rgba(255,255,255,0.85)" }}
              >
                <span className="truncate">underluma.com</span>
                <RotateCw size={9} className="text-white/50 shrink-0" />
              </div>
              <div
                className="flex items-center justify-between w-full rounded-xl backdrop-blur"
                style={{ padding: "7px 16px", background: "rgba(40,40,42,0.82)" }}
              >
                <ChevronLeft size={15} className="text-white/30" />
                <ChevronRight size={15} className="text-white/85" />
                <Share size={14} className="text-white/85" />
                <BookOpen size={14} className="text-white/85" />
                <Copy size={14} className="text-white/85" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
