// Shared ready signal: resolved when the 3D engine has rendered its first frame.
// IntroScreen waits on this instead of a hardcoded timer.

let resolve: (() => void) | null = null;

export const engineReady = new Promise<void>((r) => {
  resolve = r;
});

export function signalEngineReady() {
  if (resolve) {
    resolve();
    resolve = null;
  }
}
