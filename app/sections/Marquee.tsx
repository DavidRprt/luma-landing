"use client";

import { t, type Lang } from "../constants/translations";

const Marquee = ({ lang }: { lang: Lang }) => {
  const words = t[lang].marquee;
  const all = [...words, ...words, ...words];

  return (
    <div
      className="relative overflow-hidden bg-[#080810] border-t border-b border-white/[0.05]"
      style={{
        padding: "16px 0",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 100% at 50% 50%, rgba(106,169,255,0.05), transparent)" }}
      />
      <div className="relative flex w-fit items-center" style={{ animation: "luma-marquee 40s linear infinite" }}>
        {all.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-2 shrink-0 rounded-full whitespace-nowrap uppercase transition-colors"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.22em",
              padding: "7px 16px",
              margin: "0 5px",
              color: "rgba(255,255,255,0.32)",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.025), transparent)",
            }}
          >
            <span
              aria-hidden="true"
              className="shrink-0 rounded-full"
              style={{ width: 4, height: 4, background: "#6aa9ff", boxShadow: "0 0 6px rgba(106,169,255,0.55)" }}
            />
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
