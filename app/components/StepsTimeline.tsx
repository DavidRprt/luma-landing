"use client";

import { motion } from "motion/react";
import { ListChecks, PenTool, RefreshCcw, type LucideIcon } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const ICONS: LucideIcon[] = [ListChecks, PenTool, RefreshCcw];
const GLOW = "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(106,169,255,0.6) 55%, transparent 100%)";

interface Step {
  num: string;
  title: string;
  desc: string;
}

/** A connected sequence (numbered nodes + a line drawn between them on scroll,
 * with a small light that keeps traveling along it afterwards) instead of three
 * isolated bordered cards — the line is what makes it read as a process instead
 * of three unrelated facts. Vertical rail on mobile, a single horizontal line
 * across fixed-position nodes on desktop; no scroll-jacking. */
export default function StepsTimeline({ steps }: { steps: readonly Step[] }) {
  return (
    <div className="relative">
      {/* ===== Mobile: vertical rail, one line segment per item ===== */}
      <div className="flex flex-col md:hidden">
        {steps.map((s, i) => {
          const Icon = ICONS[i] ?? ListChecks;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.num} className="flex gap-5">
              <div className="flex flex-col items-center shrink-0" style={{ width: 34 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px 0px" }}
                  transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 34, height: 34, background: "#6aa9ff" }}
                >
                  <Icon size={15} style={{ color: "#06122a" }} strokeWidth={2.25} />
                </motion.div>
                {!isLast && (
                  <div className="relative flex-1" style={{ width: 34, minHeight: 30 }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-40px 0px" }}
                      transition={{ duration: 0.5, delay: i * 0.12 + 0.15, ease: EASE }}
                      className="absolute inset-0 w-px mx-auto origin-top"
                      style={{ background: "linear-gradient(to bottom, rgba(106,169,255,0.55), rgba(255,255,255,0.12))" }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-40px 0px" }}
                      transition={{ duration: 0.3, delay: i * 0.12 + 0.55 }}
                      className="absolute inset-0 overflow-hidden"
                    >
                      <motion.div
                        className="absolute rounded-full"
                        style={{ left: "50%", width: 7, height: 20, marginLeft: -3.5, filter: "blur(2px)", background: GLOW }}
                        animate={{ top: ["-20%", "120%"] }}
                        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.3, delay: i * 0.4 }}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px 0px" }}
                transition={{ duration: 0.45, delay: i * 0.12 + 0.05, ease: EASE }}
                className="pb-9"
              >
                <p className="font-mono text-white/30 uppercase mb-1.5" style={{ fontSize: 10.5, letterSpacing: 2 }}>
                  {s.num}
                </p>
                <h3 className="text-white font-semibold mb-1.5" style={{ fontSize: 18 }}>{s.title}</h3>
                <p className="text-white/45" style={{ fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ===== Desktop: fixed-height nodes on a single horizontal line ===== */}
      <div className="hidden md:block relative">
        <div className="absolute z-0" style={{ top: 14, left: "16.6667%", right: "16.6667%", height: 12 }}>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute left-0 right-0 origin-left"
            style={{ top: "50%", height: 1, marginTop: -0.5, background: "linear-gradient(to right, rgba(106,169,255,0.55), rgba(255,255,255,0.14), rgba(106,169,255,0.55))" }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px 0px" }}
            transition={{ duration: 0.3, delay: 0.95 }}
            className="absolute inset-0 overflow-hidden"
          >
            <motion.div
              className="absolute rounded-full"
              style={{ top: "50%", width: 68, height: 8, marginTop: -4, filter: "blur(3px)", background: GLOW }}
              animate={{ left: ["-10%", "108%"] }}
              transition={{ duration: 2.3, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }}
            />
          </motion.div>
        </div>
        <div className="relative z-10 flex">
          {steps.map((s, i) => {
            const Icon = ICONS[i] ?? ListChecks;
            return (
              <div key={s.num} className="flex-1 flex flex-col items-center text-center px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{ duration: 0.4, delay: i * 0.15, ease: EASE }}
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 40, height: 40, background: "#6aa9ff" }}
                >
                  <Icon size={17} style={{ color: "#06122a" }} strokeWidth={2.25} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px 0px" }}
                  transition={{ duration: 0.45, delay: i * 0.15 + 0.1, ease: EASE }}
                  className="mt-5 max-w-[240px]"
                >
                  <p className="font-mono text-white/30 uppercase mb-1.5" style={{ fontSize: 10.5, letterSpacing: 2 }}>
                    {s.num}
                  </p>
                  <h3 className="text-white font-semibold mb-2" style={{ fontSize: 18.5 }}>{s.title}</h3>
                  <p className="text-white/45" style={{ fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
