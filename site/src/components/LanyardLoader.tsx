"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LanyardErrorBoundary from "./LanyardErrorBoundary";
import LanyardFallback from "./LanyardFallback";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
});

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function LanyardLoader(props: { frontImage: string; backImage: string }) {
  const [canRender, setCanRender] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const _coarse = window.matchMedia("(pointer: coarse)").matches;
    void _coarse;

    if (reduced || !supportsWebGL()) {
      setUseFallback(true);
      return;
    }

    setCanRender(true);
  }, []);

  if (useFallback) {
    return <LanyardFallback frontImage={props.frontImage} />;
  }

  if (!canRender) return null;

  return (
    <LanyardErrorBoundary frontImage={props.frontImage} backImage={props.backImage}>
      <Lanyard {...props} />
    </LanyardErrorBoundary>
  );
}
