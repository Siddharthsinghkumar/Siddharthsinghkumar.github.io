"use client";

import type { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
}

export default function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  return (
    <div
      className={`scroll-reveal opacity-0 translate-y-[12px] ${className}`}
    >
      {children}
    </div>
  );
}
