"use client";

import { useEffect, useState, Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { DeviceProfile } from "./EngineCanvas";
import { reportProgress } from "./engine-ready";

// B2: report milestone 45 when the engine chunk actually loads.
// Dynamic import returns the module — our resolver fires once on resolution.
let chunkResolve: (() => void) | null = null;
const engineChunkImport = new Promise<void>((r) => { chunkResolve = r; });

const EngineCanvas = dynamic(() => import("./EngineCanvas").then((mod) => {
  chunkResolve?.();
  return mod;
}), {
  ssr: false,
  loading: () => null,
});

const POSTER_URL = "/poster-home.webp";

// B1/D45: static scene poster shown when the live canvas is NOT rendering —
// reduced-motion, WebGL-unavailable, or no-JS. Normal (JS, motion-enabled)
// users never fetch it: the IntroScreen covers the rIC wait and waits for the
// canvas's first frame before lifting, so no poster is needed on that path.
function PosterDiv() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${POSTER_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      aria-hidden
    />
  );
}

// Catches WebGL-unavailable (context creation throws during render) → poster.
class EngineErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

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
    // rIC timeout (1500ms) guarantees canvasReady flips — no rIC-never-fires gap.
    scheduleIdle(() => setCanvasReady(true), 1500);
    // B2 milestone 45: engine chunk resolved (dynamic import completed)
    engineChunkImport.then(() => { reportProgress(45); });
  }, [profile]);

  return (
    <>
      {/* No-JS fallback: scene poster. Browsers ignore <noscript> content when
          JS runs, so this costs normal users nothing (no fetch, no LCP shift). */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<div style="position:fixed;inset:0;z-index:0;background-image:url('${POSTER_URL}');background-size:cover;background-position:center;pointer-events:none" aria-hidden="true"></div>`,
        }}
      />
      {/* Reduced motion: poster only — canvas never mounts. */}
      {profile?.isReducedMotion ? <PosterDiv /> : null}
      {/* Normal path: live canvas once rIC fires; poster on WebGL failure. */}
      {profile && !profile.isReducedMotion && canvasReady ? (
        <EngineErrorBoundary fallback={<PosterDiv />}>
          <EngineCanvas deviceProfile={profile} />
        </EngineErrorBoundary>
      ) : null}
    </>
  );
}
