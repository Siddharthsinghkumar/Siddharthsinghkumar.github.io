"use client";

import { useEffect, useState } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";

export default function KnowMeBackground() {
  const [dimensions, setDimensions] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
      <FlutedGlass
        width={dimensions.width}
        height={dimensions.height}
        image="/test/pic_idea.png"
        colorBack="#00000000"
        colorShadow="#000000"
        colorHighlight="#ffffff"
        size={0.66}
        shadows={0.6}
        highlights={0.23}
        shape="lines"
        angle={0}
        distortionShape="prism"
        distortion={0.5}
        shift={0}
        stretch={0}
        blur={0.12}
        edges={0.29}
        margin={0}
        grainMixer={0}
        grainOverlay={0}
        fit="cover"
      />
    </div>
  );
}
