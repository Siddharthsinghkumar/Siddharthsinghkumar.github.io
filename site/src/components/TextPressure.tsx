"use client";

// TextPressure — donor from ui-component-2.md
// Adapted per CLAUDE.md donor rule: skeleton from donor, skin from DESIGN.md, words from COPY.md.
// Feature-flagged — decision gate: keep only if ≥55fps at 6× CPU throttle on mobile.
// If disabled, falls back to static Space Grotesk heading.

import { useEffect, useRef, useState, useMemo, useCallback } from "react";

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number,
) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

interface TextPressureProps {
  text: string;
  fontFamily?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  scale?: boolean;
  className?: string;
  minFontSize?: number;
}

// Feature flag — set to false to disable TextPressure
const TEXTPRESSURE_ENABLED = true;

export default function TextPressure({
  text = "SIDDHARTH SINGH",
  fontFamily = "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  if (!TEXTPRESSURE_ENABLED) {
    return (
      <h1 className={`font-display text-[--text] ${className}`}>{text}</h1>
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    // Reduced-motion gate
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const isFine = window.matchMedia("(any-pointer: fine)").matches;
    if (!isFine) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW } = containerRef.current.getBoundingClientRect();
    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);
  }, [chars.length, minFontSize]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedSetSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setSize, 100);
    };
    debouncedSetSize();
    window.addEventListener("resize", debouncedSetSize);
    return () => {
      window.removeEventListener("resize", debouncedSetSize);
      clearTimeout(timeoutId);
    };
  }, [setSize]);

  useEffect(() => {
    let rafId: number;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const d = dist(mouseRef.current, charCenter);
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight
            ? Math.floor(getAttr(d, maxDist, 100, 900))
            : 400;
          const italVal = italic
            ? getAttr(d, maxDist, 0, 1).toFixed(2)
            : "0";
          const alphaVal = alpha
            ? getAttr(d, maxDist, 0, 1).toFixed(2)
            : "1";

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          if (alpha) span.style.opacity = alphaVal;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    // Check reduced motion and pointer type before starting
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isFine = window.matchMedia("(any-pointer: fine)").matches;
    if (!mq.matches && isFine) {
      animate();
    }

    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  const dynamicClassName = [className, flex ? "flex" : "", stroke ? "stroke" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ background: "transparent", height: "auto" }}
    >
      <h1
        ref={titleRef}
        className={`${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "center top",
          margin: 0,
          textAlign: "left",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
          color: "var(--text)",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            className="inline-block"
            style={{ color: "var(--text)" }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}

export { TEXTPRESSURE_ENABLED };
