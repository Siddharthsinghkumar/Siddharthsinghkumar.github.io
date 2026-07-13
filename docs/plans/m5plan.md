# M5 Plan — The Not-Forgettable Upgrade (FULL, 2026-07-12)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md`
> Follows [`m4plan.md`](m4plan.md) — **⛔ STOP M4-A was REJECTED-FORWARD** (m4plan §9): m4's
> engineering is gates-green and stands; Sid's two visual rejects land HERE as binding scope.
> Feeds [`m6plan.md`](m6plan.md) (cert + launch). Nothing lands after launch except the
> post-launch queue in §7.
> Executors: **DeepSeek v4 Flash @ HIGH** (Batch 1 — mechanical) and **Gemini 3.1 Pro @ HIGH**
> (Batch 2 — perceptual). Same-model tasks bunched per Sid. Sid switches at every **⛔** marker
> himself. An executor must NEVER continue past one.
> **STATUS: FROZEN — verdicts M5.1–M5.11 taken by Sid 2026-07-12.**
> **REV 2026-07-12 (Sid):** M5.1 + M5.4 amended — pipeline changed to frame-sequence scrub.
> **REV 2026-07-13 (Sid, SUPERSEDES the 2026-07-12 REV): generated media REJECTED for launch.**
> Sid ran the pipeline; output = high-resolution generic AI slop (bad colors, bad design). The
> ENTIRE generated-asset scope + D2/D3 wiring moves POST-LAUNCH (§7 / M5.12). m5 is re-cut to
> exactly the mistakes Sid showed via screenshots at STOP M4-A. Originals in git history.

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you
   know." Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
3. **This plan, top to bottom.** m0plan §3 (N1–N13), m1plan §2 (N14–N16), m2plan §2 (N17–N18),
   m3plan §3 (N19), m4plan §3 (N20) remain law verbatim; §3 below adds N21–N23.
4. Advisory input (if present): `docs/plans/inputs/uiuxpromax-portfolio.md` — recommendations
   only; DESIGN.md tokens win every conflict.
5. Per-task: ONLY files named in the task block.

## 1. Mission & definition of DONE

**Fix the two mistakes Sid showed via screenshots at STOP M4-A, with what already ships.**

1. **Full-bleed heroes (reject #1):** hero media renders at section level, full viewport width —
   the existing **PaperInk shader** on `/prospect` + `/travel-planner`, the existing
   **GridBackdrop** on `/projects`. No more media clamped to the 1200px text column.
2. **Lanyard swap polish (reject #2):** no placeholder flash on fast loads — fallback appears
   only if the scene needs >400ms; the swap reads as ONE settle, never two cards at once.
3. Suite green (floors 55/72; case <72 at cert = N18 STOP). Sid said yes at every ⛔.

DONE is NOT: ANY generated media or asset wiring (post-launch, §7 — hero sequences, D3 tiles,
L0 art, D2 capture wiring), ScrollSequence/scroll-video work (post-launch), home changes, knowme
layout changes (only the swap polish), any copy change, audio (v2), the v2 parking lot (ripple
donor, GridMotion, authored .glb, merlin-cli-bridge).

## 2. FROZEN VERDICTS (Sid, 2026-07-12; M5.12 + parking 2026-07-13)

| # | Verdict |
|---|---|
| M5.1 | **PARKED post-launch (M5.12).** Was: canvas image-sequence scroll-scrub heroes (REV'd from `video.currentTime` 2026-07-12). Full spec in git history; retry lives in §7. |
| M5.2 | **PARKED post-launch (M5.12).** Case heroes keep PaperInk (D37 per-region stands) — now full-bleed per M5.9. |
| M5.3 | Floors 55/72 remain the binding cert gate; <72 at cert = N18 STOP, Sid decides with numbers. (The video lazy-mount clause travels with the parked scope.) |
| M5.4 | **PARKED post-launch (M5.12).** The pipeline survives for the retry: `product-teardown-scroll` skill (`~/.claude/skills/`) + `docs/plans/inputs/m5-prompt-pack.md` (marked PARKED). |
| M5.5 | Stands as LAW for any future generated media: ambience/brand art ONLY — never UI, screenshots, data, or metrics of Sid's tools. D2 screenshots are real captures by Sid. |
| M5.6 | Copy untouched — craft, not ad CTAs. |
| M5.7 | Skills: `ui-ux-pro-max` audit as advisory input; **Taste Skill** on the Gemini batch IF installed; **ponytail** on the DeepSeek batch only. |
| M5.8 | **PARKED post-launch (M5.12)** with the pipeline — the throwaway demo existed to gate generation credits; there is no pre-launch generation. |
| M5.9 | **Full-bleed hero is a binding spec** (STOP M4-A reject): hero media renders at section level (`absolute inset-0`, full viewport width), text stays in the 1200px column. Applies to prospect, travel-planner, projects — delivered with EXISTING media (PaperInk / GridBackdrop). |
| M5.10 | **Lanyard delay-show:** fallback hidden for the first ~400ms after mount+webgl-ok (fast loads never see it); crossfade offset so the fallback is faded OUT before the canvas reaches full opacity — never two cards visible at once. Slow-load behavior (fallback while assets download) stays. |
| M5.11 | Model split: **DeepSeek v4 Flash @ HIGH** = Batch 1 mechanical; **Gemini 3.1 Pro @ HIGH** = Batch 2 perceptual; bunched, one ⛔ SWITCH MODEL between. Launch stays Sid+Claude (m6). |
| M5.12 | **(Sid, 2026-07-13)** Generated media REJECTED for launch: first generation run = high-resolution generic AI slop (bad colors, bad design). ALL asset work moves post-launch: hero teardown sequences, D3 tiles, optional L0 art, AND D2 real-capture wiring (launch ships the styled placeholder SVGs). m5 = fix exactly the screenshot-shown STOP M4-A mistakes: full-bleed heroes with existing media + lanyard swap polish. |

## 3. DON'T-WANT — N1–N20 binding, plus:

| # | Rule |
|---|---|
| N21 | A media element without poster + reduced-motion static + mobile fallback is REJECTED regardless of how it looks. |
| N22 | No generated imagery depicting UI, screenshots, data, or metrics of Sid's tools — ambience and brand art only. |
| N23 | **Evidence discipline (post-breach):** every claimed screenshot is md5-unique per page, captured on `:4173` ≥5 s after load (idle-mounts settled). A duplicate or blank frame = false report, whole report suspect. Certification commits happen ONLY on a fully green suite — a red gate in a "cert" commit is a protocol breach even if disclosed. |

## 4. Execution order

```
B1 (DeepSeek v4 Flash @ HIGH; ponytail attached):
   T1 Section backdrop slot → T2 projects full-bleed → T3 case-hero PaperInk full-bleed →
   T4 lanyard swap polish → T5 cert 1× + D-rows
→ ⛔ SWITCH MODEL
   Sid in parallel (optional, before B2): ui-ux-pro-max audit → docs/plans/inputs/
B2 (Gemini 3.1 Pro @ HIGH; Taste Skill if installed): T6 polish vs audit → T7 evidence set
→ ⛔ STOP M5-B: Sid full taste pass, all 6 pages on :4173 → accept ⇒ m6plan
```

One task = one commit. Build green before every commit. No attribution trailers. **NEVER push.**

---

## BATCH 1 — Mechanical (DeepSeek v4 Flash @ HIGH; ponytail attached)

### T1 — Section backdrop slot (M5.9 root fix)
- **File:** `site/src/components/Section.tsx`. Add optional `backdrop?: ReactNode`; when present,
  render `<div className="absolute inset-0">{backdrop}</div>` INSIDE the `<section>` BEFORE the
  `max-w-[1200px]` div. Section must have `relative` when backdrop is used (hero Sections already
  do; add a safe default). Content div keeps `relative z-[20]`.
- **Done:** build green; no visual change yet (no caller). Commit: `feat(layout): Section backdrop slot for full-bleed hero media`

### T2 — Projects full-bleed (M5.9)
- **File:** `site/src/app/projects/page.tsx` — move `<GridBackdrop />` from Section children into
  `backdrop={<GridBackdrop />}` on the hero Section. GridBackdrop fills its parent; verify it
  spans the viewport on `:4173` (N23 screenshot under `docs/qa/m5/`).
- **Done:** backdrop spans full width behind the grid; links clickable; build green.
  Commit: `fix(projects): full-bleed grid backdrop per M5.9`

### T3 — Case-hero PaperInk full-bleed (M5.9 + M5.12)
- **Files:** `site/src/app/prospect/page.tsx`, `site/src/app/travel-planner/page.tsx` ONLY.
  Hero Section gets `backdrop={<PaperInkLoader />}`; the child `<PaperInkLoader />` line inside
  the Section is DELETED (import stays). Verify the ink canvas fills the section-level
  `absolute inset-0` wrapper; if making it fill requires editing
  `PaperInkLoader.tsx`/`PaperInkCanvas.tsx`, STOP and report — those files are out of scope.
  Text/readability: keep the existing text z-layers; if contrast suffers, a token-only scrim div
  inside the backdrop is allowed (no new hexes).
- **Perf tripwire:** full-bleed = more shader pixels than the old 1200px clamp. The 0.75× DPR cap
  (D27) stays. If cert lighthouse <72 on either case page → N18 STOP with the numbers, no
  retries, no threshold edits.
- **Done:** on `:4173` both case heroes show ink edge-to-edge across the full viewport width, h1
  contrast gate passes; N23 screenshots. Commit: `fix(cases): full-bleed PaperInk hero backdrops per M5.9`

### T4 — Lanyard swap polish (M5.10)
- **File:** `site/src/components/LanyardLoader.tsx` ONLY. Add a 400ms delay-show: the fallback
  renders `opacity-0` until a 400ms timer fires (then fades in) — if `sceneReady` lands first,
  it never appears. Offset the swap: fallback fade-out (~200ms) completes BEFORE the canvas
  container fades in (~300ms, slight delay). Server/hydration render byte-identical (all timers
  client-side, initial classes unchanged). #418 regression = instant STOP.
- **Done:** on `:4173`: hard-reload (fast) shows NO fallback flash, card fades in once; with
  devtools Slow 4G the fallback appears after ~400ms, then swaps without both cards visible.
  Playwright 36/36. Commit: `fix(knowme): lanyard fallback delay-show + offset crossfade`

### T5 — Certification 1× + D-rows
- DESIGN.md §6 rows (after D77, no blank line): D78 full-bleed hero spec (M5.9/M5.12, STOP M4-A
  reject #1, existing media), D79 lanyard delay-show (M5.10, reject #2).
- Full suite: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate.
  Visual-gate baselines will change (full-bleed heroes) — regenerate + commit; if the gate's
  DETECTION logic needs changes, that is N7: STOP and ask Sid, never edit it yourself.
  Case <72 = N18 STOP with numbers. Cert commit ONLY if all green (N23).
- **Done:** suite summary + qa-report 3-liner. Commit: `docs(qa): M5 batch 1 certification`

## ⛔ SWITCH MODEL — DeepSeek done permanently.

---

## BATCH 2 — Perceptual (Gemini 3.1 Pro @ HIGH; Taste Skill if installed)

### T6 — Polish vs the audit
- Apply accepted `ui-ux-pro-max` recommendations that are token-compatible (spacing, type scale,
  contrast). DESIGN.md tokens win; no copy changes (M5.6); list every applied/rejected item.
  If `docs/plans/inputs/uiuxpromax-portfolio.md` is absent, report "no audit input" and proceed
  to T7 — do NOT invent polish work.
### T7 — Evidence set
- `docs/qa/m5/`: all 6 pages at p0 + both full-bleed heroes + lanyard fast/slow series, every
  file md5-unique, `:4173`, ≥5 s waits (N23). Full suite 1× green.
  Commit: `docs(qa): M5 perceptual pass + evidence`

## ⛔ STOP M5-B — Sid's full taste pass (all 6 pages, `:4173`). Accept ⇒ [`m6plan.md`](m6plan.md).
Reject ⇒ full stop, re-planned with Claude.

## 5. KICKOFF PROMPTS

**Batch 1 — DeepSeek v4 Flash @ HIGH:**
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3, m1plan.md §2,
m2plan.md §2, m3plan.md §3, m4plan.md §3, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md.
Execute Batch 1 (T1–T5) strictly in order. Non-negotiables: edit only files named in the current
task; no new dependencies; NO generated-media or video/sequence work of any kind (M5.12 — that
scope is post-launch); every claimed screenshot md5-unique from the served prod build :4173
after ≥5s settle (N23) — a duplicate or blank frame is a false report; certification commits only
on a fully green suite; any case-page lighthouse <72 = STOP with the number, no retries, no
threshold edits; never edit gate scripts (N7) — if visual-gate detection needs changes, STOP and
ask Sid; build green before every commit; one task = one commit; no attribution trailers; NEVER
push. If a fix isn't clean in ONE attempt, STOP and report. STOP COMPLETELY at ⛔ SWITCH MODEL
after T5. Address the user as Sid.
```

**Batch 2 — Gemini 3.1 Pro @ HIGH:**
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3, m1plan.md §2,
m2plan.md §2, m3plan.md §3, m4plan.md §3, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md, plus the advisory audit at
docs/plans/inputs/uiuxpromax-portfolio.md if present.
Execute Batch 2 (T6–T7) strictly in order. Non-negotiables: perceptual tuning only — no
structural or copy changes; NO generated-media or video/sequence work (M5.12); DESIGN.md tokens
win over any audit recommendation; every screenshot md5-unique from :4173 after ≥5s settle (N23);
full suite green before your final commit; build green before every commit; one task = one
commit; no attribution trailers; NEVER push. STOP COMPLETELY at ⛔ STOP M5-B, post the
completeness table with real evidence paths (N19), and wait — launch is not executor work.
Address the user as Sid.
```

## 6. Confidence: 9.3/10 — frozen

Both M4-A rejects are root-caused in code (Section's `max-w-[1200px]` clamps all hero media; the
crossfade shows both cards), and the fixes now use ONLY media that already ships — no generation,
no new components, no new dependencies. Residual: PaperInk shader cost at full viewport width vs
the 72 floor (DPR cap stays; N18 STOP with numbers if breached), Gemini's taste vs Sid's (STOP
M5-B is accept/reject only).

## 7. POST-LAUNCH QUEUE (M5.12 — parked 2026-07-13, in priority order, NOT launch-blocking)

1. **Teardown scroll-sequence heroes retry:** pipeline = `product-teardown-scroll` skill;
   prompts = `docs/plans/inputs/m5-prompt-pack.md` (PARKED banner). First run produced generic
   slop — iterate object/style/model before burning more credits. Component (ScrollSequence,
   canvas scrub, no GSAP per N3) and the pin-vs-free-scroll question travel with it.
2. **D2 real screenshots:** Sid captures (Grafana, Telegram, SSE, pipeline) → replace the 4
   `public/placeholders/*.svg` references in the case-page ScreenshotFrames.
3. **D3 project tiles:** `public/tiles/` + scan-tiles.mjs manifest (generated art or real
   captures — Sid decides at retry time; M5.5/N22 bind).
4. **Optional L0 art:** only on Sid's explicit verdict; D77 bake + rollback flag stay.

**SCOPE FREEZE: 2026-07-12, re-cut 2026-07-13 (M5.12).** Executors may not add, merge, reorder,
or reinterpret tasks; STOPs are accept/reject only.

## 8. VERIFICATION RECORD — check-verify by Claude, 2026-07-13

- **Commits real, scopes exact:** c17f0af (T1) → 887beb7 (T2) → 796550b (T3) → 0129d0f (T4) →
  b308eec (T5 cert) → 00b0b8e (B2 evidence). Every diff confined to the task's named files;
  gate scripts, package.json, CI, and this plan byte-untouched across the whole range. No
  attribution trailers. Nothing pushed.
- **Suite independently re-run GREEN (not trusted from the report):** lint 0 errors · guards ✅ ·
  build ✅ · playwright 36/36 ✅ · lighthouse prospect 75 / travel-planner 75 (floor 72 — the
  full-bleed PaperInk perf risk did NOT materialize) · visual-gate all pages, h1 contrast 7–15:1.
- **Evidence real:** 11 files in `docs/qa/m5/`, zero md5 duplicates, key frames visually
  inspected — ink spans the full viewport on both case heroes.
- **BREACH (logged; work ratified only because independently re-verified):** b308eec's qa-report
  entry cites three evidence filenames that never existed in the tree, and the cert commit
  contained zero m5 images (N19/N23). The real evidence landed only in B2's 00b0b8e. Correction
  appended to qa-report.md — original lines preserved.
- **Minor deviations:** Section.tsx skipped the "safe default `relative`" sub-spec (all three
  callers pass `relative`; holds today — noted for any future backdrop caller). Gemini created
  untracked `site/scripts/capture-m5.mjs` (not task-named) — Sid ruled 2026-07-13: commit as QA
  tooling. Stray `site/docs/qa/` duplicate output deleted per Sid. `docs/qa/t10/*.png` churn is
  benign: visual-gate.mjs overwrites them on every run.
- **T6:** no `uiuxpromax-portfolio.md` input existed → legitimately zero polish items. B2
  committed no suite summary of its own (chat-only claim) — moot, suite re-verified above.
- **⛔ STOP M5-B: PENDING — Sid judges all 6 pages on `:4173`.** m6plan is authored and
  reconciled but executes only on his accept.
