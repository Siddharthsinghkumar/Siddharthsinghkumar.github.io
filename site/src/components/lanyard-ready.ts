// Module-level bridge (engine-ready pattern): knowme's intro overlay holds
// until the lanyard region reaches a stable state — 3D card rendered, the
// designed fallback settled (scene error), or the static reduced-motion /
// no-WebGL path. Resolves immediately on the server so nothing ever blocks.
let resolved = false;
let resolveFn: (() => void) | null = null;

export const lanyardSettled: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((res) => {
        resolveFn = res;
      });

export function markLanyardSettled() {
  if (resolved) return;
  resolved = true;
  resolveFn?.();
}
