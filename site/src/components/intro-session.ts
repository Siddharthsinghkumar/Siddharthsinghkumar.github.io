// Module-scoped in-memory flag: resets on hard reload, persists within a JS session.
// The loading overlay shows only on the first page mounted per session.
// Client-side navigations (soft) skip it. Hard reload or fresh tab restarts the session.
let introShown = false;

export function isIntroShown(): boolean {
  return introShown;
}

export function markIntroShown(): void {
  introShown = true;
}
