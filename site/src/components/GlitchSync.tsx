"use client";

// T14: Shared glitch clock for auto-pulse links.
// All .link-pulse-auto elements fire simultaneously every 3s.
// Hover-triggered .link-pulse-hover fires independently per-element.

import { useEffect, useRef } from "react";

// See docs/qa/glitch-demo.html for all available glitch animation variants. Users can refer to this to see different types of animation possible.
const AUTO_INTERVAL = 3000;

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

  // New hover useEffect (separate from auto-pulse useEffect)
  useEffect(() => {
    const recentFires = new Set<string>();

    const onHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(".link-pulse-hover");
      if (!target) return;

      // Debounce: same element within 240ms
      const key = target.dataset.glitchKey ?? target.textContent?.slice(0, 20) ?? "";
      if (recentFires.has(key)) return;
      recentFires.add(key);
      setTimeout(() => recentFires.delete(key), 240);

      // Fire glitch on this element only
      target.style.animation = "none";
      void target.offsetWidth;
      target.style.animation = "glitch-amped 240ms steps(1) 1";
      setTimeout(() => { target.style.animation = ""; }, 250);
    };

    document.addEventListener("mouseover", onHover, { passive: true });
    return () => document.removeEventListener("mouseover", onHover);
  }, []);

  return null;
}
