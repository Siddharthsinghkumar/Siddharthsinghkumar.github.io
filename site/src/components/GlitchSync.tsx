"use client";

// T14: Shared glitch clock for auto-pulse links.
// All .link-pulse-auto elements fire simultaneously every 5s.
// Hover-triggered .link-pulse-hover fires independently per-element.

import { useEffect, useRef } from "react";

// See docs/qa/glitch-demo.html for all available glitch animation variants. Users can refer to this to see different types of animation possible.
const AUTO_INTERVAL = 2000;

export default function GlitchSync() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fireAll = () => {
      const links = document.querySelectorAll<HTMLElement>(".link-pulse-auto");
      // Use rAF to batch all into the same frame -> synced
      rafRef.current = requestAnimationFrame(() => {
        links.forEach((el) => {
          el.style.animation = "none";
          void el.offsetWidth;
          el.style.animation = "glitch-amped 240ms steps(1) 1";
          setTimeout(() => {
            el.style.animation = "";
          }, 250);
        });
      });
    };

    // Fire once after mount, then on interval
    const startDelay = 2000;
    const initialTimer = setTimeout(() => {
      fireAll();
      const interval = setInterval(fireAll, AUTO_INTERVAL);
      return () => clearInterval(interval);
    }, startDelay);

    return () => {
      clearTimeout(initialTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return null;
}
