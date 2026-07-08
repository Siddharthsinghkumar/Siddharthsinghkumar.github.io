import { useSyncExternalStore } from "react";

function getServerSnapshotFalse() {
  return false;
}

export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => serverFallback;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
