"use client";

// TextPressure — F2 fixed: space rendered as 0.35em inline-block spacer excluded
// from variation; fit-to-width scaling after mount; overflow hidden wrapper;
// SSR via cqi so no hydration jump. Falls back to static Space Grotesk on
// reduced-motion / !pointer:fine.

import { useEffect, useRef, useState, useCallback } from "react";

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance: number, maxDist: number, minVal: number, maxVal: number) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

interface TextPressureProps {
  text?: string;
  fontFamily?: string;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  alpha?: boolean;
  flex?: boolean;
  stroke?: boolean;
  className?: string;
  minFontSize?: number;
}

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
  className = "",
  minFontSize = 24,
}: TextPressureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const enabledRef = useRef(false);

  const [fontSize, setFontSize] = useState<number | null>(null);
  const [lineHeight, setLineHeight] = useState(1);
  const [fitted, setFitted] = useState(false);

  // Split chars — preserve spaces as-is for array but render them specially
  const chars = text.split("");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isFine = window.matchMedia("(any-pointer: fine)").matches;
    enabledRef.current = !mq.matches && isFine;
  }, []);

  useEffect(() => {
    if (!enabledRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // F2(b): fit-to-width — measure, scale down until fits, max 3 iterations
  const fitToWidth = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;
    const containerW = containerRef.current.getBoundingClientRect().width;
    const baseSize = containerW / ((chars.length - chars.filter(c => c === " ").length) / 1.8);
    let trial = Math.max(baseSize, minFontSize);

    for (let i = 0; i < 3; i++) {
      titleRef.current.style.fontSize = `${trial}px`;
      const actual = titleRef.current.getBoundingClientRect();
      const margin = containerW * 0.02;
      if (actual.width <= containerW - margin) break;
      trial *= 0.88;
    }
    setFontSize(trial);
    setLineHeight(1);
    setFitted(true);
  }, [chars, minFontSize]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const debounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fitToWidth, 80);
    };
    debounced();
    window.addEventListener("resize", debounced);
    return () => {
      window.removeEventListener("resize", debounced);
      clearTimeout(timeoutId);
    };
  }, [fitToWidth]);

  useEffect(() => {
    if (!enabledRef.current) return;
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
          const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          const d = dist(mouseRef.current, charCenter);
          const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : "0";
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : "1";
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          if (alpha) span.style.opacity = alphaVal;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha]);

  if (!TEXTPRESSURE_ENABLED) {
    return <p className={`font-display text-[--text] ${className}`} aria-label={text}>{text}</p>;
  }

  const dynamicClassName = [className, flex ? "flex" : "", stroke ? "stroke" : ""].filter(Boolean).join(" ");

  // F2(c): overflow hidden on wrapper
  return (
    <div ref={containerRef} className="relative w-full" style={{ background: "transparent", height: "auto", containerType: "inline-size", overflow: "hidden" }}>
      <p
        aria-label={text}
        ref={titleRef}
        className={dynamicClassName}
        style={{
          fontFamily,
          textTransform: "uppercase",
          fontSize: fontSize ?? `calc(100cqi / ${chars.length / 2})`,
          lineHeight,
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
        {chars.map((char, i) => {
          // F2(a): space gets a 0.35em inline-block spacer — excluded from font variation
          if (char === " ") {
            return (
              <span
                key={i}
                className="inline-block"
                style={{ width: "0.35em", color: "var(--text)" }}
                aria-hidden="true"
              >
                {" "}
              </span>
            );
          }
          return (
            <span
              key={i}
              ref={(el) => { spansRef.current[i] = el; }}
              data-char={char}
              className="inline-block"
              style={{ color: "var(--text)" }}
            >
              {char}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export { TEXTPRESSURE_ENABLED };
