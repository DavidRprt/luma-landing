import { t, type Lang } from "../constants/translations";

const Footer = ({ lang }: { lang: Lang }) => {
  const c = t[lang].footer;

  return (
    <footer className="bg-black px-5 md:px-20 py-7" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1300px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold" style={{ fontSize: 13, letterSpacing: "-0.03em" }}>
            <span style={{ color: "rgba(96,165,250,1)" }}>_</span>luma
          </span>
          <span className="text-white/[0.15] mx-2">·</span>
          <span className="text-white/20" style={{ fontSize: 11, letterSpacing: "0.05em" }}>{c.tagline}</span>
        </div>
        <span className="font-mono text-white/[0.18]" style={{ fontSize: 11 }}>{c.copy}</span>
      </div>
    </footer>
  );
};

export default Footer;
