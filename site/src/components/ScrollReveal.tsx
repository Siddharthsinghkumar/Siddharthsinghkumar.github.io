"use client";

import { ReactNode, useEffect } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  stagger = 60,
}: ScrollRevealProps) {
  return (
    <div
      className={`scroll-reveal opacity-0 translate-y-[12px] ${className}`}
      style={
        {
          "--stagger": `${stagger}ms`,
          viewTimeline: "--reveal",
          animationTimeline: "--reveal",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
