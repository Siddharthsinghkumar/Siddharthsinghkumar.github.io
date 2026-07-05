"use client";

// CSS fallback hero — SVG feTurbulence paper-grain overlay + drifting accent
// radial gradients. Used when WebGL is unavailable, on reduced-motion, or on
// saveData/slow devices. Also serves as a noscript fallback.

import { useRef, useEffect, useState } from "react";

export default function CssHeroAtmosphere() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setEnabled(false);
      return;
    }
    // Respect saveData header if present
    if ("connection" in navigator) {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) {
        setEnabled(false);
        return;
      }
    }
  }, []);

  return (
    <>
      {/* Paper-grain SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ opacity: 0.10, mixBlendMode: "overlay" as React.CSSProperties["mixBlendMode"] }}
        aria-hidden="true"
      >
        <filter id="paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feComponentTransfer in="gray" result="grain">
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-grain)" />
      </svg>

      {/* Drifting accent blobs — only when motion enabled */}
      {enabled && (
        <>
          <div
            className="absolute pointer-events-none select-none blur-[120px]"
            style={{
              width: "60vw",
              height: "60vw",
              maxWidth: "800px",
              maxHeight: "800px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsl(17 100% 55% / 0.08), transparent 70%)",
              top: "20%",
              left: "10%",
              animation: "drift-1 120s linear infinite",
            }}
          />
          <div
            className="absolute pointer-events-none select-none blur-[100px]"
            style={{
              width: "50vw",
              height: "50vw",
              maxWidth: "600px",
              maxHeight: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, hsl(17 100% 55% / 0.06), transparent 70%)",
              top: "40%",
              right: "5%",
              animation: "drift-2 90s linear infinite",
            }}
          />
        </>
      )}
    </>
  );
}
