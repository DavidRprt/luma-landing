"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface Props {
  text: string;
  startDelay?: number;
  duration?: number;
}

const ScrambleText = ({ text, startDelay = 250, duration = 900 }: Props) => {
  const [out, setOut] = useState(() => text.replace(/[^\s]/g, CHARS[0]));
  const rafRef   = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const t0       = performance.now() + startDelay;
    const nonSpace = text.replace(/ /g, "").length;
    frameRef.current = 0;

    const tick = (now: number) => {
      frameRef.current++;
      const p = Math.min(Math.max(0, now - t0) / duration, 1);

      if (p < 1) {
        // update every 3 frames (~20 fps) — reduces CPU load while keeping the glitch feel
        if (frameRef.current % 3 === 0) {
          setOut(
            text
              .split("")
              .map((c, i) => {
                if (c === " ") return " ";
                if (p > i / nonSpace) return c;
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join("")
          );
        }
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setOut(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, startDelay, duration]);

  return <>{out}</>;
};

export default ScrambleText;
