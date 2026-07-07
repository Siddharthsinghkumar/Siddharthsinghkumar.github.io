# Phase 2.2 — Remaining Layer Fixes

> Part of plan-heropage-layers.md. Execute after Phase 2.1 is committed.

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

---

## Layer 1 — Fallback Poster (Q1: noscript not rendering)

### Already fixed in Phase 1
The `<noscript>` block was moved to `layout.tsx` in Phase 1. No additional changes here.

---

## Layer 3 — Text (A6: Combine DOM sections to match 5 waypoints)

### Goal
Sid: "Combine DOM experience and skills to make 1 DOM, combine DOM publication + OSS + contact CTA now the DOM in heropage == waypoints in heropage."

### Merge Strategy (per Sid C2–C4)

| New Section | Contains | Eyebrow Text | Merge Style |
|-------------|----------|-------------|-------------|
| **Section 1** | Hero | (unchanged) | No change |
| **Section 2** | Prospect Teaser | "SYSTEM / 01" (unchanged) | No change |
| **Section 3** | Travel Planner Teaser | "SYSTEM / 02" (unchanged) | No change |
| **Section 4** | Experience Timeline + Skills | "Where the systems shipped" + "Stack" (both eyebrows kept) | Simple merge: Skills content placed below Experience Timeline, one `<Section>` wrapper |
| **Section 5** | Publication/OSS + Contact CTA | "Verifiable elsewhere" + "Know Me →" button | Simple merge: all content in one section |

### Changes: `site/src/app/page.tsx`

| Edit | Change |
|------|--------|
| 1 | Merge Skills `<Section>` INTO Experience Timeline `<Section>` — place `<SkillsRow>` content below timeline entries, keep both eyebrow texts |
| 2 | Merge Contact CTA INTO Publication/OSS `<Section>` — place "Know Me →" button below publication/OSS content |
| 3 | Result: 5 DOM sections = 5 3D waypoints (Hero, Prospect, Travel Planner, Experience & Stack, Verifiable + Contact) |

### Waypoint Re-mapping (per Sid C5)

After merging to 5 DOM sections, the 3D camera waypoints must be re-mapped to align 1:1.

| Waypoint | Old mapping | New mapping | Scroll range |
|----------|-------------|-------------|-------------|
| A | Hero section | Hero section (no change) | TBD — needs recalculation based on new section heights |
| B | Prospect Teaser | Prospect Teaser (no change) | TBD |
| C | Travel Planner + partial Experience | Travel Planner Teaser | TBD |
| D | Experience + Skills + Publication | Experience & Stack (merged) | TBD |
| E | Contact + exit | Verifiable + Contact (merged) | TBD |

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change |
|------|--------|
| 4 | Re-calculate WAYPOINTS scroll ranges to match new 5-section layout. Exact p-values TBD after DOM merge is complete and section heights are measured. |

> **Note:** Waypoint p-value recalculation should happen AFTER the DOM merge (edits 1–3) so we can measure actual section heights.

---

## Layer 4 — Links/Effects

### A10: SIDDHARTH SINGH name — glitch pulse + TextPressure but NOT a link

### Changes: `site/src/app/page.tsx`

| Edit | Change |
|------|--------|
| 5 | Remove the `<Link href="/">` wrapper around "SIDDHARTH SINGH" (it's a no-op self-link) |
| 6 | Add className `link-pulse-auto` to the text container so GlitchSync targets it |
| 7 | TextPressure stays enabled — hover letter-enlarge still works independently |

### A11: Glitch interval → 2000ms (per Sid C1)

**Resolved:** Sid wants the glitch to fire every **2 seconds** (2000ms), not every 240ms or 5s. The 240ms animation duration stays — it's the interval between pulses that changes.

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

### Changes: `site/src/components/Nav.tsx`

| Edit | Change |
|------|--------|
| 10 | TEMP: Force `scrolled` to true always (comment out scroll listener condition). Per Sid: "make temp to be visible from start regardless of scroll." |
| 11 | Comment the original logic for reversion: `// ORIGINAL: setScrolled(window.scrollY > 40) — commented out, temp always visible per Sid` |

---

## Layer 5.2 — Nav Links

### A14: DecryptedText dual trigger

Sid: "Make it work on 2 triggers — 1st when hero page loads and loading screen is gone then decrypt text starts initially 1 time, then only when cursor hovers. On subpages: no initial decrypt, only on hover."

### Changes: `site/src/components/Nav.tsx`

| Edit | Change |
|------|--------|
| 12 | Add state: `hasInitialDecrypted` (tracks if first decrypt has played) |
| 13 | Add useEffect: listen for engineReady promise, set `animateOn="view"` for the DecryptedText until first decrypt plays, then switch to `animateOn="hover"` |
| 14 | On subpages (pathname !== "/"): always `animateOn="hover"` from start |

### A15: Resume PDF exists

### Validation only: `site/public/resume-siddharth-singh.pdf`
File confirmed present — no code change unless missing, in which case create placeholder.

---

## Layer 7 — Loading Screen

### A17: Block scroll during loading (per Sid C6: overflow:hidden)

Sid: "While the loading screen present no scrolling of underneath hero page."

### Changes: `site/src/components/IntroScreen.tsx`

| Edit | Change |
|------|--------|
| 15 | Add `document.body.style.overflow = 'hidden'` when IntroScreen is mounted (Phases 0–2) |
| 16 | Remove with `document.body.style.overflow = ''` when Phase 3 (done/dismissed) |

### A18: Min display 1000ms, max wait 10s

### Changes: `site/src/components/IntroScreen.tsx`

| Edit | Change |
|------|--------|
| 17 | `MIN_DISPLAY = 500` → `MIN_DISPLAY = 1000` |
| 18 | `MAX_WAIT = 5000` → `MAX_WAIT = 10000` |

---

## Layer 8 — Custom Cursor (A19: Only custom cursor visible)

### Changes: `site/src/components/CustomCursor.tsx` + `site/src/app/globals.css`

| Edit | Change |
|------|--------|
| 19 | Add `html.custom-cursor-active, html.custom-cursor-active * { cursor: none !important; }` to globals.css |
| 20 | Add `custom-cursor-active` class to `<html>` when fine pointer detected (via useEffect in CustomCursor) |

---

## ~~TEMP TEST Revert~~ (REMOVED — handled in Phase 2.1)

> **Removed from Phase 2.2.** TEMP TEST color cleanup (neon yellow streams, neon pink SpriteGlow, boosted DataStream sizes) is fully handled by Phase 2.1 edits 22–24. No duplicate work here.

---

## Layer 2 — Core/Satellite Responsiveness

### Goal
Sid manually verified the Satellite position `[-5.616, 0.5616, 2.457]`, Core radius `2.9`, and StageNodes radius `4.0` are perfect for 16:9 desktop. Now we need to implement `coarse` (mobile) fallback sizing so they don't break on small screens.

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change |
|------|--------|
| X1 | Update `Core` to scale down on mobile: `<Core radius={coarse ? 2.0 : 2.9} />` (adjust 2.0 as needed) |
| X2 | Update `Satellite` position to move closer on mobile: `<Satellite position={coarse ? [-3.6, 0.4, 1.8] : [-5.616, 0.5616, 2.457]} ... />` |
| X3 | Update `StageNodes` orbit to scale down on mobile: `<StageNodes radius={coarse ? 3.0 : 4.0} />` (adjust 3.0 as needed) |

---

## Files Touched (Phase 2.2)

| File | Edits |
|------|-------|
| `page.tsx` | 5: merge 2 section pairs, remove name link, add glitch class |
| `GlitchSync.tsx` | 2: interval 5000→2000, demo reference comment |
| `Nav.tsx` | 4: temp glass visible, dual trigger DecryptedText |
| `IntroScreen.tsx` | 4: scroll lock (overflow:hidden on/off), min display 1000ms, max wait 10s |
| `CustomCursor.tsx` | 1: add html class toggle |
| `globals.css` | 1: cursor:none rule |
| `EngineCanvas.tsx` | 1: waypoint re-mapping (p-values TBD after DOM merge) |

---

## Commit Message

```
fix(layers): Phase 2.2 — Layer 1,3,4,5,7,8 fixes per Sid's answers

Layer 1: noscript already fixed in Phase 1
Layer 3: merge 7 DOM sections → 5 (== waypoints), re-map camera waypoints
Layer 4: name gets glitch pulse (2s interval), is NOT a link, TextPressure stays
Layer 5.1: FlutedGlass temp always visible
Layer 5.2: DecryptedText dual trigger (load + hover on hero, hover-only on subpages)
Layer 7: block scroll during loading (overflow:hidden), min 1000ms, max 10s
Layer 8: hide native cursor, custom only (cursor:none when fine pointer)
```
