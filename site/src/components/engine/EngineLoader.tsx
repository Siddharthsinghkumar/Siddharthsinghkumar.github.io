"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { DeviceProfile } from "./EngineCanvas";

const EngineCanvas = dynamic(() => import("./EngineCanvas"), {
  ssr: false,
  loading: () => null,
});

function scheduleIdle(cb: () => void, timeoutMs: number) {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(cb, { timeout: timeoutMs });
  } else {
    setTimeout(cb, 200);
  }
}

export default function EngineLoader() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setProfile({
      isFine: fine,
      isReducedMotion: reduced,
      isCoarse: coarse,
    });
  }, []);

  useEffect(() => {
    if (!profile || profile.isReducedMotion) return;
    scheduleIdle(() => setCanvasReady(true), 1500);
  }, [profile]);

  if (!canvasReady || !profile) return null;

  return <EngineCanvas deviceProfile={profile} />;
}
