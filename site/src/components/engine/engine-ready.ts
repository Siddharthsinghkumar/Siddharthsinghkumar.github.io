// Shared ready signal + real-asset-progress milestones (B2/D43).
// IntroScreen waits on engineReady to dismiss; the counter tracks
// monotonically-increasing progress from multiple load sources.

let readyResolve: (() => void) | null = null;

export const engineReady = new Promise<void>((r) => {
  readyResolve = r;
});

export function signalEngineReady() {
  if (readyResolve) {
    readyResolve();
    readyResolve = null;
  }
  reportProgress(85);
}

// ── Real-asset progress (monotonic, 0→100) ──────────────
let progressListeners: Array<(p: number) => void> = [];
let currentProgress = 0;

export function reportProgress(p: number) {
  if (p > currentProgress) currentProgress = p;
  for (const fn of progressListeners) fn(currentProgress);
}

export function onEngineProgress(fn: (p: number) => void) {
  progressListeners.push(fn);
  fn(currentProgress); // fire immediately with current value
  return () => {
    progressListeners = progressListeners.filter((f) => f !== fn);
  };
}

export function getEngineProgress(): number {
  return currentProgress;
}
