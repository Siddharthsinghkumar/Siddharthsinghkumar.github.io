"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ScrollRevealContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export default function ScrollRevealContainer({
  children,
  className = "",
  staggerDelay = 0,
}: ScrollRevealContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = ref.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = staggerDelay;
          setTimeout(() => {
            setVisible(true);
          }, delay);
          observer.unobserve(current);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [staggerDelay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[--dur-med] ease-[--ease] ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-[12px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
