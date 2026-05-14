"use client";

const Button = ({ text, className, id }: { text: string; className?: string; id?: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("counter");
    if (target && id) {
      const offset = window.innerHeight * 0.15;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <a
      onClick={handleClick}
      className={`${className ?? ""} group relative inline-flex items-center gap-3 cursor-pointer w-fit bg-white hover:bg-white/90 rounded-full px-7 py-3 transition-all duration-300 shadow-[0_0_28px_rgba(124,47,255,0.35)] hover:shadow-[0_0_42px_rgba(124,47,255,0.6)]`}
    >
      <span className="text-black text-sm font-semibold tracking-widest uppercase">
        {text}
      </span>
      <svg
        className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0"
        width="14" height="14" viewBox="0 0 14 14" fill="none"
      >
        <path d="M2 7h10M7 2l5 5-5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
};

export default Button;
