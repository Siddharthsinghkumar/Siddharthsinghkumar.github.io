"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    if (!isFinePointer) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Check if hovering over interactive element
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (ringRef.current) {
        ringRef.current.style.transform = interactive
          ? "translate(-50%, -50%) scale(1.6)"
          : "translate(-50%, -50%) scale(1)";
      }
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${currentX}px`;
        ringRef.current.style.top = `${currentY}px`;
        ringRef.current.style.transform = ringRef.current.style.transform.includes("scale(1.6)")
          ? "translate(-50%, -50%) scale(1.6)"
          : "translate(-50%, -50%) scale(1)";
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border border-[--accent]/50 transition-transform duration-[200ms] hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[6px] h-[6px] rounded-full bg-[--accent] hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
