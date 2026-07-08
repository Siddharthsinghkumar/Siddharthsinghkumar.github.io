"use client";

// Scroll choreography — staged, masked entrances.
// T14 FIX: Once content is revealed, it stays revealed — even across React remounts.
// Uses DOM data-attribute to persist visibility state through parent re-renders.

import { useEffect, useRef, useState, type ReactNode, Children } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

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
  heroIndex = 0,
}: ChoreoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const wasRevealed = useRef(false);
  const heroDelay = heroIndex * 80;
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Restore visibility if this DOM node was already revealed in a
    // previous render cycle — survives React Strict Mode double-mount.
    if (el.dataset.revealed === "true") {
      setVisible(true);
      wasRevealed.current = true;
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = variant === "hero-item" ? heroDelay : 0;
          setTimeout(() => {
            setVisible(true);
            wasRevealed.current = true;
            el.dataset.revealed = "true";
          }, delay);
          obs.unobserve(el);
        }
      },
      { threshold: variant === "hero-item" ? 0 : 0.1 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [variant, heroDelay]);

  const isVisible = prefersReduced || visible;

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
          clipPath: isVisible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        }
      : {};

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${isVisible ? visibleClasses : hiddenClasses} ${className}`}
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
