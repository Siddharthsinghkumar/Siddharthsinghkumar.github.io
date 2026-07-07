# Phase 2.2 — Remaining Layer Fixes

> Part of plan-heropage-layers.md. Execute after Phase 2.1 is committed.
> **STATUS: ❌ NOT STARTED** — all 20 edits pending (verified 2026-07-07 14:00).

## Goal

Fix all remaining questions across Layers 1, 3, 4, 5, 7, 8 per Sid's answers.

---

## Clarifications Log (2026-07-07)

| # | Question | Sid's Answer |
|---|----------|--------------|
| C1 | A11: Glitch interval — 240ms = constant glitching? | **2000ms interval** (2 seconds) — periodic but not overwhelming |
| C2 | A6: How to merge Experience + Skills visually? | **Simple merge** — put Skills content below Experience Timeline inside one `<Section>` wrapper |
| C3 | A6: How to merge Publication/OSS + Contact? | **Simple merge** — Publication text + OSS text + GitHub + "Know Me →" button all in one section |
| C4 | A6: Section naming? | **Reuse existing eyebrow text** — Section 4: "Where the systems shipped" + "Stack", Section 5: "Verifiable elsewhere" + "Know Me →" |
| C5 | A6: Re-map 3D camera waypoints after merge? | **Yes** — waypoints A–E need re-mapping to match the new 5 DOM sections |
| C6 | Q17: Scroll blocking method? | **body overflow:hidden** — simple and effective |
| C7 | Post-Phase 2.1 tuning values — source of truth? | **Yes** — keep manual tuning values (Core 2.9, StageNodes 4.0/0.50/1.1, Satellite [-5.616, 0.5616, 2.457]) |
| C8 | Phase 2.1 edit 24 DataStream TEMP residual? | **Already clean** — values are normal (0.24/0.18, 0.85). No action needed. |
| C9 | Mobile responsiveness (X1–X3) in Phase 2.2? | **No** — defer to separate Phase 3 plan |
| C10 | Waypoint re-mapping strategy? | **Measure first** — merge DOM sections, measure heights, then calculate p-values in follow-up commit |
| C11 | Commit strategy? | **Split into 2–3 commits by layer group** |

---

## Post-Phase 2.1 Source of Truth (manual tuning commits `e51f7e1`, `a488f75`)

> These values override Phase 2.1 plan values. Do NOT revert.

| Value | Phase 2.1 Plan | Current (Sid's manual tune) | Status |
|-------|---------------|---------------------------|--------|
| Core radius | 1.6 | **2.9** | ✅ Keep |
| StageNodes orbit radius | 3.85 | **4.0** | ✅ Keep |
| StageNodes octahedron | 0.46 | **0.50** | ✅ Keep |
| StageNodes sprite glow | 1.0 | **1.1** | ✅ Keep |
| Satellite position | (default) | **[-5.616, 0.5616, 2.457]** | ✅ Keep |

---

## Layer 1 — Fallback Poster (Q1: noscript not rendering)

### Already fixed in Phase 1
The `<noscript>` block was moved to `layout.tsx` in Phase 1. No additional changes here.

---

## Layer 3 — Text (A6: Combine DOM sections to match 5 waypoints)

### Goal
Sid: "Combine DOM experience and skills to make 1 DOM, combine DOM publication + OSS + contact CTA now the DOM in heropage == waypoints in heropage."

### Current State (7 DOM sections in `page.tsx`)

| # | Section | Eyebrow | Lines |
|---|---------|---------|-------|
| 1 | Hero `<section>` | "SIDDHARTH SINGH" | raw section |
| 2 | `<Section>` Prospect | "SYSTEM / 01 — PROSPECT" | component |
| 3 | `<Section>` Travel Planner | "SYSTEM / 02 — TRAVEL PLANNER AGENT" | component |
| 4 | `<Section>` Experience Timeline | "Where the systems shipped" | component |
| 5 | `<Section>` Skills | "Stack" | 227–257 (SEPARATE) |
| 6 | `<Section>` Publication/OSS | "Verifiable elsewhere" | (SEPARATE) |
| 7 | `<Section>` Contact CTA | "Know Me →" | 301–305 (SEPARATE) |

### Target State (5 DOM sections)

| New # | Contains | Eyebrow Text | Merge Style |
|-------|----------|-------------|-------------|
| 1 | Hero | (unchanged) | No change |
| 2 | Prospect Teaser | "SYSTEM / 01" (unchanged) | No change |
| 3 | Travel Planner Teaser | "SYSTEM / 02" (unchanged) | No change |
| 4 | Experience Timeline + Skills | "Where the systems shipped" + "Stack" (both eyebrows kept) | Simple merge: Skills content placed below Experience Timeline, one `<Section>` wrapper |
| 5 | Publication/OSS + Contact CTA | "Verifiable elsewhere" + "Know Me →" button | Simple merge: all content in one section |

### Changes: `site/src/app/page.tsx`

| Edit | Change |
|------|--------|
| 1 | Merge Skills `<Section>` INTO Experience Timeline `<Section>` — move `<SkillsRow>` content below timeline entries, keep both eyebrow texts ("Where the systems shipped" as primary, "Stack" as sub-eyebrow), single `<Section>` wrapper |
| 2 | Merge Contact CTA INTO Publication/OSS `<Section>` — move "Know Me →" button below publication/OSS content, single `<Section>` wrapper |
| 3 | Result: 5 DOM sections = 5 3D waypoints |

### Waypoint Re-mapping (per Sid C5, C10)

**Strategy: Measure first.** Merge DOM sections first (edits 1–3), then measure actual section heights in the browser, then calculate new p-values in a **follow-up commit**.

| Waypoint | New mapping | Scroll range |
|----------|-------------|-------------|
| A | Hero | TBD after measuring |
| B | Prospect Teaser | TBD after measuring |
| C | Travel Planner Teaser | TBD after measuring |
| D | Experience & Stack (merged) | TBD after measuring |
| E | Verifiable + Contact (merged) | TBD after measuring |

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change |
|------|--------|
| 4 | Re-calculate WAYPOINTS p-value ranges after DOM merge. **This is a follow-up commit** — not part of the initial DOM merge commit. |

Current waypoint ranges (for reference):
```
A: p 0.00–0.12  (12%)
B: p 0.12–0.32  (20%)
C: p 0.32–0.48  (16%)
D: p 0.48–0.72  (24%)
E: p 0.72–1.00  (28%)
```

---

## Layer 4 — Links/Effects

### A10: SIDDHARTH SINGH name — glitch pulse + TextPressure but NOT a link

### Current State
- `<Link href="/">` wrapper present (line ~54–72 in page.tsx)
- `link-pulse-auto` only on publication/OSS links, NOT on name
- TextPressure is enabled ✅

### Changes: `site/src/app/page.tsx`

| Edit | Change |
|------|--------|
| 5 | Remove the `<Link href="/">` wrapper around "SIDDHARTH SINGH" (it's a no-op self-link) |
| 6 | Add className `link-pulse-auto` to the text container so GlitchSync targets it |
| 7 | TextPressure stays enabled — no change needed ✅ |

### A11: Glitch interval → 2000ms (per Sid C1)

**Resolved:** Sid wants the glitch to fire every **2 seconds** (2000ms), not every 240ms or 5s. The 240ms animation duration stays — it's the interval between pulses that changes.

### Current State
- `AUTO_INTERVAL = 5000` (line 9 in GlitchSync.tsx)

### Changes: `site/src/components/GlitchSync.tsx`

| Edit | Change |
|------|--------|
| 8 | `AUTO_INTERVAL = 5000` → `AUTO_INTERVAL = 2000` |

### A12: Reference glitch-demo.html in source code

### Changes: `site/src/components/GlitchSync.tsx`

| Edit | Change |
|------|--------|
| 9 | Add comment block referencing `docs/qa/glitch-demo.html` for alternative animations. Comment: `// See docs/qa/glitch-demo.html for all available glitch animation variants. Users can refer to this to see different types of animation possible.` |

---

## Layer 5.1 — Nav Glass (A16: Visible from start)

### Current State
- `scrolled` controlled by `setScrolled(window.scrollY > 40)` (line 27 in Nav.tsx)
- FlutedGlass only visible when scrollY > 40

### Changes: `site/src/components/Nav.tsx`

| Edit | Change |
|------|--------|
| 10 | TEMP: Force `scrolled` to true always (comment out scroll listener condition). Per Sid: "make temp to be visible from start regardless of scroll." |
| 11 | Comment the original logic for reversion: `// ORIGINAL: setScrolled(window.scrollY > 40) — commented out, temp always visible per Sid` |

---

## Layer 5.2 — Nav Links

### A14: DecryptedText dual trigger

Sid: "Make it work on 2 triggers — 1st when hero page loads and loading screen is gone then decrypt text starts initially 1 time, then only when cursor hovers. On subpages: no initial decrypt, only on hover."

### Current State
- All DecryptedText components use `animateOn="hover"` only (lines 69, 81, 101 in Nav.tsx)
- No `hasInitialDecrypted` state, no pathname-based logic
- Subpages accidentally correct (hover-only) but no intentional logic

### Changes: `site/src/components/Nav.tsx`

| Edit | Change |
|------|--------|
| 12 | Add state: `hasInitialDecrypted` (tracks if first decrypt has played) |
| 13 | Add useEffect: listen for `engineReady` promise. When it resolves AND pathname === "/", trigger one-time `animateOn="view"` for the DecryptedText, then switch permanently to `animateOn="hover"` |
| 14 | On subpages (pathname !== "/"): always `animateOn="hover"` from start — no initial animation |

### A15: Resume PDF exists

### Validation: `site/public/resume-siddharth-singh.pdf`
✅ **File confirmed present** (92KB). No code change needed.

---

## Layer 7 — Loading Screen

### Current State (actual code vs. parent plan assumptions)

> ⚠️ **Code differs from parent plan description.** The parent plan (from Q18 answer) assumed `MIN_DISPLAY = 500` and `MAX_WAIT = 5000`. Actual code:

| Constant | Parent plan assumed | Actual code | Line |
|----------|-------------------|-------------|------|
| `MIN_DISPLAY` | 500 | **Does NOT exist** — no minimum display time. IntroScreen exits as soon as `engineReady` fires. | N/A |
| `MAX_WAIT` | 5000 | **2500** | 13 |
| Phase 0→1 | Not mentioned | 150ms delay | 80 |
| Phase 2→3 (fade) | 300ms | 300ms ✅ | 98–101 |
| CSS auto-dismiss | Not mentioned | `MAX_WAIT + 300ms` = 2800ms | 116 |

### A17: Block scroll during loading (per Sid C6: overflow:hidden)

Sid: "While the loading screen present no scrolling of underneath hero page."

### Changes: `site/src/components/IntroScreen.tsx`

| Edit | Change |
|------|--------|
| 15 | Add `document.body.style.overflow = 'hidden'` at the start of the main useEffect (when IntroScreen mounts, phases 0–1) |
| 16 | Add `document.body.style.overflow = ''` inside the `phase2()` function (when loading finishes and exit begins) |

### A18: Min display 1000ms, max wait 10s

### Changes: `site/src/components/IntroScreen.tsx`

| Edit | Change |
|------|--------|
| 17 | **Add** `MIN_DISPLAY = 1000` constant (does not currently exist). Modify `engineReady.then()` callback: only call `phase2()` if `Date.now() - startRef.current >= MIN_DISPLAY`, otherwise `setTimeout(phase2, remaining)` |
| 18 | `MAX_WAIT = 2500` → `MAX_WAIT = 10000` |
| 18b | Update CSS auto-dismiss animation: `${MAX_WAIT + 300}ms` will automatically become `10300ms` |

---

## Layer 8 — Custom Cursor (A19: Only custom cursor visible)

### Current State
- CustomCursor renders dot + ring with `pointer-events-none`
- No `custom-cursor-active` class on `<html>`
- No `cursor: none` CSS rule anywhere
- Native cursor and custom cursor are BOTH visible

### Changes: `site/src/components/CustomCursor.tsx` + `site/src/app/globals.css`

| Edit | Change |
|------|--------|
| 19 | Add to `globals.css`: `html.custom-cursor-active, html.custom-cursor-active * { cursor: none !important; }` |
| 20 | In CustomCursor useEffect: when fine pointer detected (`matchMedia('(pointer: fine)')`), add `custom-cursor-active` class to `document.documentElement`. Clean up on unmount. |

---

## ~~TEMP TEST Revert~~ (REMOVED — handled in Phase 2.1)

> **Removed from Phase 2.2.** TEMP TEST color cleanup fully handled by Phase 2.1. DataStream shader values are already clean (0.24/0.18, 0.85) — no Phase 2.1 edit 24 residual exists.

---

## ~~Layer 2 — Core/Satellite Responsiveness (X1–X3)~~ (DEFERRED)

> **Deferred to Phase 3.** Mobile responsiveness (`coarse` pointer detection, mobile fallback sizing) is out of scope for Phase 2.2 per Sid's decision. The parent plan also flagged this as "Deferred: 3D Scene Responsiveness — Not in scope for this layer restack."

---

## Commit Strategy (per Sid C11: split into 2–3 commits)

### Commit 1: Layer 3 + 4 (DOM structure + effects)

```
fix(layers): merge DOM sections 7→5 to match waypoints, fix name link + glitch interval

Layer 3: merge Experience+Skills into one section, merge Publication+Contact into one section
Layer 4: remove <Link> from name, add link-pulse-auto, glitch interval 5s→2s
```

**Files:** `page.tsx`, `GlitchSync.tsx`
**Edits:** 1–3, 5–9

### Commit 2: Layer 5 + 7 + 8 (Nav + Loading + Cursor)

```
fix(layers): nav glass always visible, DecryptedText dual trigger, loading screen improvements, custom cursor only

Layer 5.1: FlutedGlass temp always visible
Layer 5.2: DecryptedText dual trigger (load+hover on hero, hover-only on subpages)
Layer 7: block scroll during loading, min display 1000ms, max wait 10s
Layer 8: hide native cursor when custom cursor active
```

**Files:** `Nav.tsx`, `IntroScreen.tsx`, `CustomCursor.tsx`, `globals.css`
**Edits:** 10–20

### Commit 3: Waypoint re-mapping (follow-up, after measuring)

```
fix(engine): re-map 3D camera waypoints to match new 5-section DOM layout
```

**Files:** `EngineCanvas.tsx`
**Edits:** 4

---

## Files Touched (Phase 2.2)

| File | Edits | Commit |
|------|-------|--------|
| `page.tsx` | 5: merge 2 section pairs, remove name link, add glitch class | 1 |
| `GlitchSync.tsx` | 2: interval 5000→2000, demo reference comment | 1 |
| `Nav.tsx` | 4: temp glass visible, dual trigger DecryptedText | 2 |
| `IntroScreen.tsx` | 4: scroll lock, add MIN_DISPLAY 1000ms, MAX_WAIT 2500→10000 | 2 |
| `CustomCursor.tsx` | 1: add html class toggle | 2 |
| `globals.css` | 1: cursor:none rule | 2 |
| `EngineCanvas.tsx` | 1: waypoint re-mapping (p-values TBD) | 3 |

---

## Edit Summary

| Edit | Layer | Description | Status |
|------|-------|-------------|--------|
| 1 | 3 | Merge Skills INTO Experience section | ✅ Done |
| 2 | 3 | Merge Contact INTO Publication section | ✅ Done |
| 3 | 3 | Verify 5 DOM sections = 5 waypoints | ✅ Done |
| 4 | 3 | Waypoint p-value re-mapping (follow-up commit) | ✅ Done |
| 5 | 4 | Remove `<Link>` from "SIDDHARTH SINGH" | ✅ Done |
| 6 | 4 | Add `link-pulse-auto` to name container | ✅ Done |
| 7 | 4 | TextPressure stays | ✅ Already correct |
| 8 | 4 | Glitch interval 5000→2000 | ✅ Done |
| 9 | 4 | Add glitch-demo.html reference comment | ✅ Done |
| 10 | 5.1 | Force `scrolled` = true (temp) | ✅ Done |
| 11 | 5.1 | Comment original scroll logic | ✅ Done |
| 12 | 5.2 | Add `hasInitialDecrypted` state | ✅ Done |
| 13 | 5.2 | Dual trigger useEffect (engineReady + pathname) | ✅ Done |
| 14 | 5.2 | Subpage hover-only (intentional logic) | ✅ Done |
| 15 | 7 | Add overflow:hidden on body during loading | ✅ Done |
| 16 | 7 | Remove overflow:hidden when loading exits | ✅ Done |
| 17 | 7 | Add MIN_DISPLAY = 1000 (doesn't exist yet) | ✅ Done |
| 18 | 7 | MAX_WAIT 2500→10000 | ✅ Done |
| 19 | 8 | Add cursor:none CSS rule | ✅ Done |
| 20 | 8 | Add custom-cursor-active class toggle | ✅ Done |
