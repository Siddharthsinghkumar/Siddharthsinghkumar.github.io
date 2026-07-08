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
const listeners = new Set<() => void>();
function subscribeMount(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getIsMounted() { return isMounted; }

export default function LanyardLoader(props: { frontImage: string; backImage: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const webglOk = typeof window !== "undefined" && supportsWebGL();
  const mounted = useSyncExternalStore(subscribeMount, getIsMounted, () => false);

  // Signal mount — runs once per session, idempotent
  useEffect(() => {
    if (!isMounted) {
      isMounted = true;
      listeners.forEach(fn => fn());
    }
  }, []);

  if (prefersReduced || !webglOk) {
    return <LanyardFallback frontImage={props.frontImage} />;
  }

  if (!mounted) return null;

  return (
    <LanyardErrorBoundary frontImage={props.frontImage} backImage={props.backImage}>
      <Lanyard {...props} />
    </LanyardErrorBoundary>
  );
}
