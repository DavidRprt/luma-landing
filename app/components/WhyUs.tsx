"use client";

import { Fragment } from "react";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px 0px" },
};

// Real brand marks (CC0, simpleicons.org) — rendered monochrome via currentColor
// so the competitors read as muted/neutral, plain fact rather than a rival ad.
const BRAND_ICONS = {
  wordpress: {
    viewBox: "0 0 24 24",
    path: "M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0",
  },
  wix: {
    viewBox: "0 0 24 24",
    path: "m0 7.354 2.113 9.292h.801a1.54 1.54 0 0 0 1.506-1.218l1.351-6.34a.171.171 0 0 1 .167-.137c.08 0 .15.058.167.137l1.352 6.34a1.54 1.54 0 0 0 1.506 1.218h.805l2.113-9.292h-.565c-.62 0-1.159.43-1.296 1.035l-1.26 5.545-1.106-5.176a1.76 1.76 0 0 0-2.19-1.324c-.639.176-1.113.716-1.251 1.365l-1.094 5.127-1.26-5.537A1.33 1.33 0 0 0 .563 7.354H0zm13.992 0a.951.951 0 0 0-.951.95v8.342h.635a.952.952 0 0 0 .951-.95V7.353h-.635zm1.778 0 3.158 4.66-3.14 4.632h1.325c.368 0 .712-.181.918-.486l1.756-2.59a.12.12 0 0 1 .197 0l1.754 2.59c.206.305.55.486.918.486h1.326l-3.14-4.632L24 7.354h-1.326c-.368 0-.712.181-.918.486l-1.772 2.617a.12.12 0 0 1-.197 0L18.014 7.84a1.108 1.108 0 0 0-.918-.486H15.77z",
  },
  shopify: {
    viewBox: "0 0 24 24",
    path: "M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z",
  },
} as const;

type BrandName = keyof typeof BRAND_ICONS;

function BrandIcon({ name, size = 18 }: { name: BrandName; size?: number }) {
  const icon = BRAND_ICONS[name];
  return (
    <svg viewBox={icon.viewBox} width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

interface Row {
  label: string;
  freelance: string;
  platforms: string;
  luma: string;
}

interface WhyUsCopy {
  stackTheirs: string;
  stackOursLabel: string;
  stackOurs: string;
  columns: { freelance: string; platforms: string; luma: string };
  rows: readonly Row[];
}

const THEM: BrandName[] = ["wordpress", "wix", "shopify"];

export default function WhyUs({ c }: { c: WhyUsCopy }) {
  return (
    <div>
      {/* ===== Stack strip: muted competitor logos vs. our own custom-code angle ===== */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, ease: EASE }}
        className="grid sm:grid-cols-2 rounded-2xl overflow-hidden mb-4"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex flex-col items-start gap-4 p-6" style={{ background: "#0d0d13" }}>
          <p className="font-mono text-white/30 uppercase" style={{ fontSize: 10.5, letterSpacing: 2 }}>{c.stackTheirs}</p>
          <div className="flex items-center gap-3">
            {THEM.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 40, height: 40, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
              >
                <BrandIcon name={name} size={18} />
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex flex-col items-start gap-4 p-6 sm:border-l"
          style={{ background: "rgba(106,169,255,0.07)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="font-mono uppercase mb-1" style={{ fontSize: 10.5, letterSpacing: 2, color: "#6aa9ff" }}>{c.stackOursLabel}</p>
          <p className="font-semibold" style={{ fontSize: 22, lineHeight: 1.25, color: "#6aa9ff" }}>{c.stackOurs}</p>
        </div>
      </motion.div>

      {/* ===== Desktop: comparison grid ===== */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr 1fr 1fr" }}>
          <div className="p-4" />
          <div className="p-4">
            <span className="font-mono text-white/40 uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>{c.columns.freelance}</span>
          </div>
          <div className="p-4">
            <span className="font-mono text-white/40 uppercase" style={{ fontSize: 11, letterSpacing: 1.5 }}>{c.columns.platforms}</span>
          </div>
          <div className="p-4" style={{ background: "rgba(106,169,255,0.08)" }}>
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: 1.5, color: "#6aa9ff" }}>{c.columns.luma}</span>
          </div>

          {c.rows.map((row, i) => (
            <Fragment key={i}>
              <div className="p-4 flex items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-white font-medium" style={{ fontSize: 13.5 }}>{row.label}</span>
              </div>
              <div className="p-4 flex items-start gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="rounded-full shrink-0" style={{ width: 5, height: 5, marginTop: 6, background: "rgba(255,255,255,0.25)" }} />
                <span className="text-white/45" style={{ fontSize: 13, lineHeight: 1.5 }}>{row.freelance}</span>
              </div>
              <div className="p-4 flex items-start gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="rounded-full shrink-0" style={{ width: 5, height: 5, marginTop: 6, background: "rgba(255,255,255,0.25)" }} />
                <span className="text-white/45" style={{ fontSize: 13, lineHeight: 1.5 }}>{row.platforms}</span>
              </div>
              <div
                className="p-4 flex items-start gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(106,169,255,0.06)" }}
              >
                <span className="rounded-full shrink-0" style={{ width: 5, height: 5, marginTop: 6, background: "#6aa9ff" }} />
                <span className="text-white" style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>{row.luma}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </motion.div>

      {/* ===== Mobile: stacked per-criterion cards ===== */}
      <div className="md:hidden flex flex-col gap-3">
        {c.rows.map((row, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
            className="rounded-xl p-4"
            style={{ background: "#0d0d13", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-white font-semibold mb-3" style={{ fontSize: 14 }}>{row.label}</p>
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="font-mono text-white/25 uppercase block mb-0.5" style={{ fontSize: 9.5, letterSpacing: 0.5 }}>{c.columns.freelance}</span>
                <span className="text-white/45" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{row.freelance}</span>
              </div>
              <div>
                <span className="font-mono text-white/25 uppercase block mb-0.5" style={{ fontSize: 9.5, letterSpacing: 0.5 }}>{c.columns.platforms}</span>
                <span className="text-white/45" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{row.platforms}</span>
              </div>
              <div className="rounded-lg -mx-1 px-2 py-1.5" style={{ background: "rgba(106,169,255,0.08)" }}>
                <span className="font-mono uppercase block mb-0.5" style={{ fontSize: 9.5, letterSpacing: 0.5, color: "#6aa9ff" }}>{c.columns.luma}</span>
                <span className="text-white" style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 500 }}>{row.luma}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
