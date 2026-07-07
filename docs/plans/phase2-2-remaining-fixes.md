# Phase 2.2 — Remaining Layer Fixes (VERIFIED)

> Part of plan-heropage-layers.md. Execute after Phase 2.1 is committed.
> **STATUS: ✅ ALL 20 EDITS VERIFIED COMPLETE** (verified 2026-07-07)

## Verification Date & Method

- **Date**: 2026-07-07
- **Method**: Code readback of all 6 targeted files against the 20-edit plan
- **Result**: All 20 edits match the plan specification exactly. No regressions detected.

---

## Edit-by-Edit Verification

### Commit 1: Layer 3 + 4 (DOM structure + effects)

| Edit | Layer | Description | Status | Evidence |
|------|-------|-------------|--------|----------|
| 1 | 3 | Merge Skills INTO Experience section | ✅ Done | `page.tsx` — SkillsRow blocks appear inside same `<Section>` as TimelineEntry blocks, one Section wrapper |
| 2 | 3 | Merge Contact INTO Publication section | ✅ Done | `page.tsx` — "Know Me →" button inside same `<Section>` as publication/OSS content |
| 3 | 3 | Verify 5 DOM sections = 5 waypoints | ✅ Done | Confirmed: Hero / Prospect / Travel Planner / Experience+Stack / Verifiable+Contact |
| 4 | 3 | Waypoint p-value re-mapping | ✅ Done | `EngineCanvas.tsx` — waypoints re-mapped: A(0.00-0.15), B(0.15-0.35), C(0.35-0.55), D(0.55-0.85), E(0.85-1.00) |
| 5 | 4 | Remove `<Link>` from "SIDDHARTH SINGH" | ✅ Done | `page.tsx` L59 — plain `<div className="block link-pulse-auto cursor-default select-none">`, no Link |
| 6 | 4 | Add `link-pulse-auto` to name container | ✅ Done | Same div has `link-pulse-auto` class |
| 7 | 4 | TextPressure stays | ✅ Already correct | TextPressure component remains enabled |
| 8 | 4 | Glitch interval 5000→2000 | ✅ Done | `GlitchSync.tsx` L10: `const AUTO_INTERVAL = 2000;` |
| 9 | 4 | Add glitch-demo.html reference comment | ✅ Done | `GlitchSync.tsx` L8: `// See docs/qa/glitch-demo.html for all available glitch animation variants...` |

**Commit 1 file**: `2b9071f docs: mark all Phase 2.2 edits as completed` (all edits squashed into one commit, not split into 2 as originally planned)

### Commit 2: Layer 5 + 7 + 8 (Nav + Loading + Cursor)

| Edit | Layer | Description | Status | Evidence |
|------|-------|-------------|--------|----------|
| 10 | 5.1 | Force `scrolled` = true (temp) | ✅ Done | `Nav.tsx` L21: `const [scrolled, setScrolled] = useState(true);` |
| 11 | 5.1 | Comment original scroll logic | ✅ Done | `Nav.tsx` L30-36: scroll listener commented out with `// ORIGINAL: ...` |
| 12 | 5.2 | Add `hasInitialDecrypted` state | ✅ Done | `Nav.tsx` L24: `const [hasInitialDecrypted, setHasInitialDecrypted] = useState(pathname !== "/");` |
| 13 | 5.2 | Dual trigger useEffect (engineReady + pathname) | ✅ Done | `Nav.tsx` L38-49: imports engineReady, resolves promise, triggers initial DecryptedText |
| 14 | 5.2 | Subpage hover-only (intentional logic) | ✅ Done | `Nav.tsx` L24: subpages start with `hasInitialDecrypted = true`, always hover-only |
| 15 | 7 | Add overflow:hidden on body during loading | ✅ Done | `IntroScreen.tsx` L95-104: separate useEffect sets `document.body.style.overflow = "hidden"` when `phase < 3` |
| 16 | 7 | Remove overflow:hidden when loading exits | ✅ Done | Same effect — restores `""` when phase reaches 3 |
| 17 | 7 | Add MIN_DISPLAY = 1000 | ✅ Done | `IntroScreen.tsx` — `engineReady.then()` enforces `Math.max(0, 1000 - elapsed)` before calling `phase2()` |
| 18 | 7 | MAX_WAIT 2500→10000 | ✅ Done | `IntroScreen.tsx` L13: `const MAX_WAIT = 10000;` |
| 19 | 8 | Add cursor:none CSS rule | ✅ Done | `globals.css` L130: `html.custom-cursor-active, html.custom-cursor-active * { cursor: none !important; }` |
| 20 | 8 | Add custom-cursor-active class toggle | ✅ Done | `CustomCursor.tsx` L18: adds class on mount, L62: removes on cleanup |

---

## Previously Flagged — NOW RESOLVED

### Phase 2.1 Edit 24 (DataStream shader revert)

| Edit | Description | Status | Evidence |
|------|-------------|--------|----------|
| 24 | DataStream shader uSize/uOpacity revert | ✅ Done | `SceneObjects.tsx` — values restored: `uSize: 0.24` (bright) / `0.18` (dim), `uOpacity: 0.85`. Also confirmed DataStream 8-stream block fully commented out in EngineCanvas.tsx. |

---

## Overall Status

| Category | Count | Status |
|----------|-------|--------|
| Phase 2.2 planned edits | 20 | ✅ All 20 verified complete |
| Phase 2.1 residual (edit 24) | 1 | ✅ Verified resolved |
| Untracked post-2.2 work | several | ⚠️ See below |

### Untracked/uncommitted items (post-Phase 2.2 work in progress)

These are NOT part of Phase 2.2. They represent work in progress or new features:

| Path | Type | Notes |
|------|------|-------|
| `site/src/app/knowme/` | New page | `/knowme` route — not in original 4-page scope |
| `site/src/components/KnowMeBackground.tsx` | Component | Companion to /knowme |
| `site/src/components/PageBackground.tsx` | Component | Background component for subpages |
| `site/public/placeholders/` | Assets | Placeholder images |
| `site/public/test/` | Assets | Test assets |
| `docs/hero-layer-plan.md` | Docs | Planning document |
| `docs/layers-heropage.md` | Docs | Planning document |
| `docs/t14-answers-and-plan.md` | Docs | Planning document |
| `layers-heropage.md` | Root doc | Planning document |
| `phase1-layer-restack.md` | Root doc | Planning document |
| `questions/` | Directory | Planning Q&A |

### Plan file header inconsistency

The plan file still says `**STATUS: ❌ NOT STARTED**` in the header but the edit summary table at bottom correctly shows all `✅ Done`. The code readback confirms completion — the header is just stale text.

---

## Files Modified (actual — from code readback)

| File | Edits Verified | Key Lines |
|------|---------------|-----------|
| `page.tsx` | 5 (L3 dom merge, L4 name + glitch) | L59, L215-269 |
| `GlitchSync.tsx` | 2 (interval, comment) | L8, L10 |
| `Nav.tsx` | 4 (glass, dual trigger) | L21, L24, L38-49 |
| `IntroScreen.tsx` | 4 (scroll lock, timing) | L13, L95-104, engineReady block |
| `CustomCursor.tsx` | 1 (class toggle) | L18, L62 |
| `globals.css` | 1 (cursor rule) | L130 |
| `EngineCanvas.tsx` | 1 (waypoints) | L62-68 |

---

## Commits

A single commit was used instead of the originally planned 2–3 commits:

```
2b9071f docs: mark all Phase 2.2 edits as completed
```

The commit squashed all Phase 2.2 edits (plus prior commits from Phase 2.1) into earlier commits. The actual code changes live in commits:
- `f24ff79 feat(cursor): layer 8 hide native cursor when custom active`
- `b4f8b32 feat(loader): layer 7 scroll lock and timing adjustments`
- `ac3e592 feat(nav): layer 5 dual trigger decrypt and static glass`
- `1855d11 feat(hero): layer 4 hero name glitch pulse and interval`
- `1d191e8 feat(hero): layer 3 merge DOM sections to match 5 waypoints`

All are present in the git log.
