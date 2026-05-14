"use client";

const Button = ({ text, className, id }: { text: string; className?: string; id?: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("counter");
    if (target && id) {
      const offset = window.innerHeight * 0.15;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <a
      onClick={handleClick}
      className={`${className ?? ""} group relative inline-flex items-center gap-2 cursor-pointer w-fit border border-white/20 hover:border-white/60 rounded-full px-8 py-3 pr-5 transition-all duration-300 hover:bg-white/5`}
    >
      <span className="text-white text-sm font-medium tracking-widest uppercase">
        {text}
      </span>
      <svg
        className="group-hover:rotate-45 transition-transform duration-300"
        width="14" height="14" viewBox="0 0 14 14" fill="none"
      >
        <path d="M2 7h10M7 2l5 5-5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
};

export default Button;
