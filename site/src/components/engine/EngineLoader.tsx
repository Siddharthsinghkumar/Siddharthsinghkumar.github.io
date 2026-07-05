"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { DeviceProfile } from "./EngineCanvas";

const EngineCanvas = dynamic(() => import("./EngineCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function EngineLoader() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);

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

  if (!profile || profile.isReducedMotion) return null;

  return <EngineCanvas deviceProfile={profile} />;
}
