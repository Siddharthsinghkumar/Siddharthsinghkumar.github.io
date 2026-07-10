"use client";

// B4: fires AMPED rgb-split micro-glitch once on first intersection.
// 240ms, 3px, double flicker — brand-constrained orange/grey.
// Reduced-motion: fire skipped, content visible immediately.

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

interface EyebrowProps {
  children: string;
  className?: string;
}

export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [observed, setObserved] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed) {
          setObserved(true);
          el.classList.add("eyebrow-glitch");
          el.addEventListener("animationend", () => {
            el.classList.remove("eyebrow-glitch");
          }, { once: true });
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [observed, prefersReduced]);

  return (
    <p
      ref={ref}
      className={`font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-3 ${className}`}
    >
      {children}
    </p>
  );
}
