"use client";

import { useEffect, useSyncExternalStore } from "react";
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

export default function LanyardLoader(props: { frontImage: string; backImage: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const mounted = useSyncExternalStore(subscribeMount, getIsMounted, () => false);
  const cachedWebglOk = useSyncExternalStore(subscribeMount, getWebglSupported, () => null);

  // Signal mount + probe WebGL — runs once per session, idempotent
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
    <LanyardErrorBoundary frontImage={props.frontImage} backImage={props.backImage}>
      <Lanyard {...props} />
    </LanyardErrorBoundary>
  );
}
