# Phase 1 — Layer Restack

> Part of plan-heropage-layers.md. Execute first, stop for Sid review + commit before proceeding to Phase 2.

## Goal

Rename and rearrange all z-index values to match the 8-layer schema. No behavioral changes beyond moving elements between layers.

---

## Changes (4 files, 8 edits)

### Layer 1 — Fallback Poster (z-[1])

**File: `site/src/components/engine/EngineLoader.tsx`**

| Edit | Line | From | To |
|------|------|------|----|
| 1 | 30 | `z-0` | `z-[1]` (PosterDiv className) |
| 2 | 95 | `z-index:0` | `z-index:1` (noscript inline style) |

**File: `site/src/app/layout.tsx`**

| Edit | Line | Change |
|------|------|--------|
| 3 | After `<body>` | Add noscript poster block (moved from EngineLoader.tsx) — server-rendered so it works when JS is off |

**Q1 fix included:** The `<noscript>` poster currently lives inside a `"use client"` component (`EngineLoader.tsx`) and never renders when JS is off. Moving it to `layout.tsx` (server-rendered) fixes this.

---

### Layer 2 — 3D Engine (z-[2])

**File: `site/src/components/engine/EngineCanvas.tsx`**

| Edit | Line | From | To |
|------|------|------|----|
| 4 | 295 | `z-0` | `z-[2]` (Canvas container div className) |

---

### Layer 3 — Text (z-[20]) & Layer 4 — Links/Effects (z-[30])

**File: `site/src/app/page.tsx`**

| Edit | Line | Change |
|------|------|--------|
| 5 | 37 | `z-10` → `z-[3]` (hero section — creates stacking context for Layers 3/4) |
| 6 | 55 | Hero text container stays `z-[20]` (already correct) |
| 7 | 102–107 | Extract hero CTA buttons from text div into new sibling div with `z-[30]` |
| 8 | Each Section | Audit: all `<Section>` text wrappers need `relative z-[20]`, all buttons/links need `relative z-[30]` or equivalent wrapper |

---

### Layer 5.1 — Nav Glass (z-[40]) & Layer 5.2 — Nav Links (z-[50])

**File: `site/src/components/Nav.tsx`**

| Edit | Line | Change |
|------|------|--------|
| 9 | 36 | Nav `<nav>`: `z-50` stays |
| 10 | 41 | Extract FlutedGlass from inside `<nav>` to a sibling `<div>` at `z-[40]` |
| 11 | 58 | Remove `z-10` from inner content div (no longer needed without FlutedGlass nesting) |

Props to pass to sibling: `scrolled` state controls FlutedGlass visibility.

---

### No-Change Layers

| Layer | Reason |
|-------|--------|
| 0 | `body bg-[--bg]` — already correct, documentation-only |
| 6 | Future reserve — no code |
| 7 | `z-[100]` IntroScreen — already correct |
| 8 | `z-[9999]` CustomCursor — already correct |

---

## Commit Message

```
fix(layers): restack hero page z-index per layer schema (Phase 1)

Layer 0: body bg (no change)
Layer 1: fallback poster z-[1], noscript moved to server-rendered layout
Layer 2: 3D engine canvas z-[2]
Layer 3: text z-[20] (page-wide audit)
Layer 4: links/effects z-[30], hero buttons extracted
Layer 5.1: nav glass z-[40]
Layer 5.2: nav links z-[50]
Layer 7: loading screen z-[100] (no change)
Layer 8: custom cursor z-[9999] (no change)
```
