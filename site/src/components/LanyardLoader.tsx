"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
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

/** Module-level: is the client Mounted state */
let isMounted = false;
let webglSupported: boolean | null = null;
const listeners = new Set<() => void>();
function subscribeMount(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getIsMounted() { return isMounted; }
function getWebglSupported() { return webglSupported; }

export default function LanyardLoader(props: { frontImage: string; backImage: string; anchorX?: number }) {
  const prefersReduced = usePrefersReducedMotion();
  const mounted = useSyncExternalStore(subscribeMount, getIsMounted, () => false);
  const cachedWebglOk = useSyncExternalStore(subscribeMount, getWebglSupported, () => null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleFirstFrame = useCallback(() => {
    setSceneReady(true);
  }, []);

  // Show fallback only after 400ms if scene isn't ready yet (fast loads skip it)
  useEffect(() => {
    if (prefersReduced || !mounted || !cachedWebglOk) return;
    const timer = setTimeout(() => setShowFallback(true), 400);
    return () => clearTimeout(timer);
  }, [prefersReduced, mounted, cachedWebglOk]);

  useEffect(() => {
    if (!isMounted) {
      webglSupported = supportsWebGL();
      isMounted = true;
      listeners.forEach(fn => fn());
    }
  }, []);

  if (prefersReduced || !mounted || !cachedWebglOk) {
    return <LanyardFallback frontImage={props.frontImage} />;
  }

  return (
    <div className="lanyard-stage">
      <div
        className="lanyard-fallback-wrap"
        style={{
          opacity: sceneError ? 1 : sceneReady ? 0 : showFallback ? 1 : 0,
          transition: "opacity 200ms ease-in-out",
          pointerEvents: sceneError ? "auto" : sceneReady || !showFallback ? "none" : "auto",
        }}
        aria-hidden={!sceneError && (sceneReady || !showFallback)}
      >
        <LanyardFallback frontImage={props.frontImage} />
      </div>
      {!sceneError && (
        <div
          className="lanyard-canvas-wrap"
          style={{
            opacity: sceneReady ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
            transitionDelay: sceneReady ? "250ms" : "0ms",
          }}
        >
          <LanyardErrorBoundary frontImage={props.frontImage} backImage={props.backImage} fallback={null} onError={() => setSceneError(true)}>
            <Lanyard {...props} onFirstFrame={handleFirstFrame} onContextLost={() => setSceneError(true)} anchorX={props.anchorX} />
          </LanyardErrorBoundary>
        </div>
      )}
    </div>
  );
}
