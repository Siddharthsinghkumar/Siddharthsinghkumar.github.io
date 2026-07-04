"use client";

import { useEffect, useRef } from "react";
import LenisLib from "lenis";

export default function SmoothScroll() {
  const lenisRef = useRef<LenisLib | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouchDevice =
      !window.matchMedia("(any-pointer: fine)").matches;

    // Only enable on desktop pointer:fine, and no reduced motion
    if (reducedMotion || isTouchDevice) return;

    const lenis = new LenisLib({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 0,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Listen for reduced-motion changes
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.destroy();
      }
    };
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
      lenis.destroy();
    };
  }, []);

  return null;
}
