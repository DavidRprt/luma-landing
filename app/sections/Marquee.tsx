"use client";

import { t, type Lang } from "../constants/translations";

const Marquee = ({ lang }: { lang: Lang }) => {
  const words = t[lang].marquee;
  const all = [...words, ...words, ...words];

  return (
    <div
      className="overflow-hidden bg-[#080810] border-t border-b border-white/[0.05]"
      style={{
        padding: "13px 0",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
      }}
    >
      <div className="flex w-fit" style={{ animation: "luma-marquee 35s linear infinite" }}>
        {all.map((w, i) => (
          <span key={i} className="flex items-center">
            <span
              className="whitespace-nowrap uppercase text-white/[0.18]"
              style={{ fontSize: 11, letterSpacing: "0.28em", padding: "0 20px" }}
            >
              {w}
            </span>
            <span style={{ color: "rgba(96,165,250,0.25)", fontSize: 14 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
