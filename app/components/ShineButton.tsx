"use client";

import Link from "next/link";

interface ShineButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

// Pill con borde/gradiente celeste y un destello diagonal que cruza al hover.
// Se usa como <button> (onClick/type/disabled) o como link (href).
export function ShineButton({ children, href, onClick, type = "button", disabled, className = "" }: ShineButtonProps) {
  const baseClass = `group relative inline-flex items-center justify-center gap-2 rounded-full font-medium overflow-hidden transition-colors duration-300 ${className}`;

  const shine = (
    <>
      <span
        aria-hidden="true"
        className="absolute pointer-events-none transition-transform duration-700 ease-out -translate-x-[60%] skew-x-[-20deg] group-hover:translate-x-[320%] group-hover:skew-x-[-20deg]"
        style={{
          top: -20,
          bottom: -20,
          left: "-40%",
          width: "35%",
          background: "linear-gradient(115deg, transparent, rgba(255,255,255,0.22), transparent)",
        }}
      />
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(135deg, rgba(106,169,255,0.26), rgba(106,169,255,0.06))" }}
      />
    </>
  );

  const style: React.CSSProperties = {
    fontSize: 14,
    padding: "12px 24px",
    border: "1px solid rgba(106,169,255,0.35)",
    color: "#eaf2ff",
    background: "linear-gradient(135deg, rgba(106,169,255,0.14), rgba(106,169,255,0.03))",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  if (href) {
    return (
      <Link href={href} className={baseClass} style={style}>
        {shine}
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClass} style={style}>
      {shine}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
