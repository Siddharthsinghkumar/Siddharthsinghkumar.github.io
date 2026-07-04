"use client";

// Scroll choreography — staged, masked entrances.
// Replaces the previous uniform fade-up with Glyphic-grade sequenced reveals:
// - Hero: name→headline→sub→CTAs staggered 80ms (transform/clip only, h1 opacity=1)
// - Headings: clip-path inset reveal, 500ms --ease
// - Body: fade-up 60ms stagger per child
// - Rows: cascade 40ms per row
// - Reduced-motion: all content visible instantly (no animations)

import { useEffect, useRef, useState, type ReactNode, Children } from "react";

interface ChoreoProps {
  children: ReactNode;
  className?: string;
  /** "hero-item" keeps opacity:1 on content (LCP-safe) */
  variant?: "hero-item" | "heading" | "body" | "row";
  /** Stagger delay in ms per child (for body/row variants) */
  staggerMs?: number;
  /** Index for hero sequence (0=name, 1=headline, 2=sub, 3=CTAs) */
  heroIndex?: number;
}

export default function ChoreoReveal({
  children,
  className = "",
  variant = "body",
  staggerMs = 60,
  heroIndex = 0,
}: ChoreoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const heroDelay = heroIndex * 80;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = variant === "hero-item" ? heroDelay : 0;
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: variant === "hero-item" ? 0 : 0.1 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [variant, heroDelay]);

  const baseClasses = variant === "heading"
    ? "transition-all duration-[500ms] ease-[--ease]"
    : "transition-all duration-[--dur-med] ease-[--ease]";

  const hiddenClasses = variant === "heading"
    ? "opacity-100" // heading opacity stays 1
    : variant === "hero-item"
    ? "opacity-100" // LCP protection — never hide hero text
    : "opacity-0 translate-y-[12px]";

  const visibleClasses = variant === "heading"
    ? "opacity-100"
    : variant === "hero-item"
    ? "opacity-100"
    : "opacity-100 translate-y-0";

  // For hero items: clip-path reveal instead of opacity
  const clipStyle: React.CSSProperties =
    variant === "hero-item" || variant === "heading"
      ? {
          clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        }
      : {};

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${visible ? visibleClasses : hiddenClasses} ${className}`}
      style={clipStyle}
    >
      {children}
    </div>
  );
}

// Helper: wrap each child in a staggered reveal
export function StaggerChildren({
  children,
  staggerMs = 60,
  className = "",
}: {
  children: ReactNode;
  staggerMs?: number;
  className?: string;
}) {
  const childrenArr = Children.toArray(children);
  return (
    <>
      {childrenArr.map((child, i) => (
        <ChoreoReveal
          key={i}
          variant="body"
          staggerMs={staggerMs}
          heroIndex={i}
          className={className}
        >
          {child}
        </ChoreoReveal>
      ))}
    </>
  );
}

// Helper: cascade rows (for spec-sheets and timelines)
export function CascadeRows({
  children,
  staggerMs = 40,
  className = "",
}: {
  children: ReactNode;
  staggerMs?: number;
  className?: string;
}) {
  const childrenArr = Children.toArray(children);
  return (
    <>
      {childrenArr.map((child, i) => (
        <ChoreoReveal
          key={i}
          variant="row"
          staggerMs={staggerMs}
          heroIndex={i}
          className={className}
        >
          {child}
        </ChoreoReveal>
      ))}
    </>
  );
}
