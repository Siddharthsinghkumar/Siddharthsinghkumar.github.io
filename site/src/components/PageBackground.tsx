"use client";

// T14: PaperTexture full-page background using @paper-design/shaders-react.
// Applied to all pages except KnowMe (which uses FlutedGlass).

import { useEffect, useState } from "react";
import { PaperTexture } from "@paper-design/shaders-react";
import { TOKEN_HEX } from "@/lib/token-hex";

interface PageBackgroundProps {
  image?: string;
  className?: string;
}

export default function PageBackground({ image, className = "" }: PageBackgroundProps) {
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setEnabled(false);
  }, []);

  if (!enabled) {
    return (
      <div
        className={`fixed inset-0 pointer-events-none select-none -z-10 opacity-[0.05] ${className}`}
        style={{ backgroundColor: "var(--bg)" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none select-none -z-10 opacity-15 ${className}`}
      aria-hidden="true"
    >
      <PaperTexture
        width={dimensions.width}
        height={dimensions.height}
        image={image || "/images/bg-graphite.webp"}
        colorBack={TOKEN_HEX.white}
        colorFront={TOKEN_HEX.paperFront}
        contrast={0.2}
        roughness={0.45}
        fiber={0.44}
        fiberSize={0.18}
        crumples={0.3}
        crumpleSize={0.35}
        folds={0.65}
        foldCount={5}
        drops={0.2}
        fade={0}
        seed={5.8}
        scale={0.5}
        fit="cover"
      />
    </div>
  );
}
