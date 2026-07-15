"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import LanyardErrorBoundary from "./LanyardErrorBoundary";
import LanyardFallback from "./LanyardFallback";
import { markLanyardSettled } from "./lanyard-ready";

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

export default function LanyardLoader(props: {
  frontImage: string;
  backImage: string;
  anchor?: [number, number];
  anchorFraction?: number;
  cardScale?: number;
  forceFallback?: boolean;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const mounted = useSyncExternalStore(subscribeMount, getIsMounted, () => false);
  const cachedWebglOk = useSyncExternalStore(subscribeMount, getWebglSupported, () => null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneError, setSceneError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const retriedRef = useRef(false);

  const handleFirstFrame = useCallback(() => {
    setSceneReady(true);
  }, []);

  // Scene failed (boundary error, context loss, or watchdog timeout):
  // remount the canvas once; a second failure settles on the static fallback.
  const failScene = useCallback(() => {
    if (!retriedRef.current) {
      retriedRef.current = true;
      setSceneReady(false);
      setRetryKey((k) => k + 1);
    } else {
      setSceneError(true);
    }
  }, []);

  // Show fallback only after 400ms if scene isn't ready yet (fast loads skip it)
  useEffect(() => {
    if (props.forceFallback || prefersReduced || !mounted || !cachedWebglOk) return;
    const timer = setTimeout(() => setShowFallback(true), 400);
    return () => clearTimeout(timer);
  }, [props.forceFallback, prefersReduced, mounted, cachedWebglOk]);

  // Tell the intro overlay when this region has reached a stable state — the
  // 3D card, the settled fallback, or the static path (reduced motion / no
  // WebGL / forced fallback). The knowme intro holds until this fires.
  useEffect(() => {
    if (props.forceFallback || sceneReady || sceneError || prefersReduced || (mounted && cachedWebglOk === false)) {
      markLanyardSettled();
    }
  }, [props.forceFallback, sceneReady, sceneError, prefersReduced, mounted, cachedWebglOk]);

  // Watchdog: a mounted scene that never reaches its first model frame is a
  // silent stall (intermittent warm-load race) — recover instead of hanging.
  useEffect(() => {
    if (props.forceFallback || prefersReduced || !mounted || !cachedWebglOk || sceneReady || sceneError) return;
    const timer = setTimeout(failScene, 6000);
    return () => clearTimeout(timer);
  }, [props.forceFallback, prefersReduced, mounted, cachedWebglOk, sceneReady, sceneError, retryKey, failScene]);

  useEffect(() => {
    if (!isMounted) {
      webglSupported = supportsWebGL();
      isMounted = true;
      listeners.forEach(fn => fn());
    }
  }, []);

  if (props.forceFallback || prefersReduced || !mounted || !cachedWebglOk) {
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
          // Sit at the same horizontal spot as the 3D card's anchor.
          transform: `translateX(${((props.anchorFraction ?? 0.68) - 0.5) * 100}%)`,
        }}
        aria-hidden={!sceneError && (sceneReady || !showFallback)}
      >
        <LanyardFallback frontImage={props.frontImage} />
      </div>
      {!sceneError && (
        <div
          key={retryKey}
          className="lanyard-canvas-wrap"
          style={{
            opacity: sceneReady ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
            transitionDelay: sceneReady ? "250ms" : "0ms",
          }}
        >
          <LanyardErrorBoundary key={retryKey} frontImage={props.frontImage} backImage={props.backImage} fallback={null} onError={failScene}>
            <Lanyard
              frontImage={props.frontImage}
              backImage={props.backImage}
              anchor={props.anchor}
              cardScale={props.cardScale}
              onFirstFrame={handleFirstFrame}
              onContextLost={failScene}
            />
          </LanyardErrorBoundary>
        </div>
      )}
    </div>
  );
}
