# M5 Plan — The Not-Forgettable Upgrade (FULL, 2026-07-12)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md`
> Follows [`m4plan.md`](m4plan.md) — **⛔ STOP M4-A was REJECTED-FORWARD** (m4plan §9): m4's
> engineering is gates-green and stands; Sid's two visual rejects land HERE as binding scope.
> Feeds [`m6plan.md`](m6plan.md) (cert + launch). Nothing lands after launch.
> Executors: **DeepSeek v4 Flash @ HIGH** (Batch 1 — mechanical) and **Gemini 3.1 Pro @ HIGH**
> (Batch 2 — perceptual). Same-model tasks bunched per Sid. Claude runs Batch 0 (demo + prompt
> pack). Sid switches at every **⛔** marker himself. An executor must NEVER continue past one.
> **STATUS: FROZEN — verdicts M5.1–M5.11 taken by Sid 2026-07-12.**
> **REV 2026-07-12 (Sid):** M5.1 + M5.4 amended by Sid the same day — pipeline changed from
> video-file scrubbing to start/end-frame generation → Flow interpolation → shipped **frame
> sequence** scrubbed on a canvas. Originals in git history. Scope freeze otherwise intact.

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

**Bring the subpages to hatom/km-grade craft: full-bleed directed motion, textured atmosphere,
real assets.**

1. **Full-bleed heroes (STOP M4-A reject #1):** on `/prospect` + `/travel-planner` the hero media
   covers the ENTIRE viewport width of the hero section (scroll-scrub video after Sid's drop);
   `/projects` gets its backdrop full-bleed. No more media clamped to the 1200px text column.
2. **Lanyard swap polish (STOP M4-A reject #2):** no placeholder flash on fast loads — fallback
   appears only if the scene needs >400ms; the swap reads as ONE settle, never two cards at once.
3. Scroll-EVENT teardown sequence on the two case heroes (canvas image sequence scrubbed by
   scroll, not autoplay), from Sid's generated media; poster = first frame.
4. D2 real screenshots in the case-page frames; D3 tiles in `/projects`; final L0 art if Sid's
   drop includes it (else the D77 bake stays).
5. Every media element: poster + `prefers-reduced-motion` static + mobile/lite fallback.
6. Suite green (floors 55/72 via lazy-mount; red at cert = N18 STOP). Sid said yes at every ⛔.

DONE is NOT: home changes, knowme layout changes (only the swap polish), any copy change, audio
(v2 — Sid may override), the v2 parking lot (ripple donor, GridMotion, authored .glb,
merlin-cli-bridge).

## 2. FROZEN VERDICTS (Sid, 2026-07-12)

| # | Verdict |
|---|---|
| M5.1 | **(REV 2026-07-12)** Motion = **scroll event**, not background: **canvas image-sequence scrub** (Apple AirPods technique) — shipped webp frames, scroll→frame-index mapping via rAF, redraw on index change only. No video element, no GSAP (N3; lenis/native scroll). ~100–140 frames/hero (15 fps ship-set from a 5–8 s master), target ≤4 MB/hero, poster = first frame. Backward scrub is exact by construction. Pin-while-scrub is prototyped in C1 and judged at ⛔ STOP M5-A, not pre-frozen. |
| M5.2 | Video on the TWO case heroes only, replacing PaperInk there (D37 per-region: hero = video, sections below = L0 paper). Knowme/home/projects: no video. |
| M5.3 | **Lazy-mount, floors keep (written N7):** poster is the LCP; video fetches on idle/approach; floors stay 55/72; <72 at cert = N18 STOP, Sid decides with numbers. |
| M5.4 | **(REV 2026-07-12)** Asset pipeline = the `product-teardown-scroll` skill: Nano Banana Pro / GPT Image 2 generate a START frame (assembled) + END frame (exploded teardown, start frame as reference image) → Google Flow **Frames to Video** interpolates between them (5–8 s, locked camera) → ffmpeg extracts frames (30 fps master, 15 fps webp ship-set + poster). Claude authored the pack at `docs/plans/inputs/m5-prompt-pack.md` (token-hex, dark studio `#0B0B0D` / accent `#FF5C1A`; prospect = newspaper-reading machine, travel-planner = mechanical globe — Sid's picks). Sid generates and drops frame folders + posters. Executors wire; they never generate. |
| M5.5 | Generated media = ambience/brand art ONLY — never UI, screenshots, data, or metrics of Sid's tools. D2 screenshots are real captures by Sid. |
| M5.6 | Copy untouched — craft, not ad CTAs. |
| M5.7 | Skills: `ui-ux-pro-max` audit as advisory input; **Taste Skill** on the Gemini batch IF installed; **ponytail** on the DeepSeek batch only. |
| M5.8 | Cheapest-demo-first: Claude builds a THROWAWAY full-bleed scrub demo on `/prospect` with placeholder media → ⛔ STOP M5-A BEFORE Sid burns generation credits. Reject = technique rethink, no sunk assets. |
| M5.9 | **Full-bleed hero is a binding spec** (STOP M4-A reject): hero media renders at section level (`absolute inset-0`, full viewport width), text stays in the 1200px column. Applies to prospect, travel-planner, projects. |
| M5.10 | **Lanyard delay-show:** fallback hidden for the first ~400ms after mount+webgl-ok (fast loads never see it); crossfade offset so the fallback is faded OUT before the canvas reaches full opacity — never two cards visible at once. Slow-load behavior (fallback while assets download) stays. |
| M5.11 | Model split: **DeepSeek v4 Flash @ HIGH** = Batch 1 mechanical; **Gemini 3.1 Pro @ HIGH** = Batch 2 perceptual; bunched, one ⛔ SWITCH MODEL between. Launch stays Sid+Claude (m6). |

## 3. DON'T-WANT — N1–N20 binding, plus:

| # | Rule |
|---|---|
| N21 | A media element without poster + reduced-motion static + mobile fallback is REJECTED regardless of how it looks. |
| N22 | No generated imagery depicting UI, screenshots, data, or metrics of Sid's tools — ambience and brand art only. |
| N23 | **Evidence discipline (post-breach):** every claimed screenshot is md5-unique per page, captured on `:4173` ≥5 s after load (idle-mounts settled). A duplicate or blank frame = false report, whole report suspect. Certification commits happen ONLY on a fully green suite — a red gate in a "cert" commit is a protocol breach even if disclosed. |

## 4. Execution order

```
B0 (Claude): C1 full-bleed canvas-sequence demo on /prospect (throwaway) · C2 prompt pack ✅ DONE
   2026-07-12 (docs/plans/inputs/m5-prompt-pack.md)
   Sid in parallel: ui-ux-pro-max audit → docs/plans/inputs/ · confirm Taste Skill installed
→ ⛔ STOP M5-A: Sid judges demo feel (incl. pin yes/no) on :4173 + approves prompt pack
→ Sid generates + drops assets (frame sequences + posters, D2 captures, D3 tiles, optional L0 art)
   → demo edits reverted; executors start from a clean tree
B1 (DeepSeek v4 Flash @ HIGH): T1 Section backdrop slot → T2 ScrollSequence component →
   T3 projects full-bleed → T4 lanyard swap polish → ⛔ STOP ASSETS (wait for Sid's drop if not
   yet landed) → T5 hero video wiring → T6 D2 frames + D3 tiles → T7 cert 1× + D-rows
→ ⛔ SWITCH MODEL
B2 (Gemini 3.1 Pro @ HIGH): T8 scrub feel pass → T9 polish vs audit → T10 evidence set
→ ⛔ STOP M5-B: Sid full taste pass, all 6 pages on :4173 → accept ⇒ m6plan
```

One task = one commit. Build green before every commit. No attribution trailers. **NEVER push.**

---

## BATCH 0 — Claude (demo + prompt pack)

### C1 — Full-bleed canvas-sequence demo (throwaway)
`/prospect` hero: media layer moved to section level (prototype of T1/T2), placeholder frame
sequence scrubbed by scroll on a canvas — built BOTH ways (pinned section vs free-scroll) so Sid
judges pin yes/no at ⛔ STOP M5-A on `:4173`. All demo edits reverted after the verdict.
### C2 — Prompt pack → `docs/plans/inputs/m5-prompt-pack.md` — ✅ DONE 2026-07-12
Per asset (prospect hero, travel-planner hero, D3 tiles, optional L0 art): start/end-frame image
prompts (end uses start as reference image) + Flow frames-to-video motion prompt + `ffmpeg`
extraction spec (30 fps master → 15 fps webp ship-set, target ≤4 MB/hero) + drop naming
(`site/public/media/<page>-seq/0001.webp…`, poster `<page>-hero-poster.webp`). Pipeline
reference: `product-teardown-scroll` skill.

## ⛔ STOP M5-A — demo feel + prompt pack (accept/reject/adjust). Then Sid generates + drops.

---

## BATCH 1 — Mechanical (DeepSeek v4 Flash @ HIGH; ponytail attached)

### T1 — Section backdrop slot (M5.9 root fix)
- **File:** `site/src/components/Section.tsx`. Add optional `backdrop?: ReactNode`; when present,
  render `<div className="absolute inset-0">{backdrop}</div>` INSIDE the `<section>` BEFORE the
  `max-w-[1200px]` div. Section must have `relative` when backdrop is used (hero Sections already
  do; add a safe default). Content div keeps `relative z-[20]`.
- **Done:** build green; no visual change yet (no caller). Commit: `feat(layout): Section backdrop slot for full-bleed hero media`

### T2 — ScrollSequence component (M5.1-REV, from C1's demo learnings)
- **New:** `site/src/components/ScrollSequence.tsx` (+ loader if needed). Props: `framesDir`,
  `frameCount`, `poster` (+ `pinned` flag per the STOP M5-A verdict). Behavior: renders poster
  `<img>` immediately (LCP); canvas mounts on `requestIdleCallback` (PaperInkCanvas.tsx:40
  pattern); frames preload as `Image()` objects only on near-viewport (IntersectionObserver);
  scroll→frame-index mapping via rAF (`index = clamp(round(progress*(frameCount-1)))`), redraw
  only when index changes, passive listeners, rAF paused when tab hidden or off-screen;
  `devicePixelRatio`-scaled draw (cap 2) for sharpness; `prefers-reduced-motion` OR
  `(pointer: coarse)` OR save-data ⇒ poster only (N21); any frame load error ⇒ poster
  (boundary), never a blank canvas. No new dependencies (N3) — NO GSAP/ScrollTrigger; native
  scroll (lenis is already the page scroller).
- **Done:** build green; component renders poster-only with no assets present (T5 wires real
  files). Commit: `feat(media): ScrollSequence canvas scroll-scrub component`

### T3 — Projects full-bleed (M5.9)
- **File:** `site/src/app/projects/page.tsx` — move `<GridBackdrop />` from Section children into
  `backdrop={<GridBackdrop />}` on the hero Section. GridBackdrop fills its parent; verify it
  spans the viewport on `:4173` (N23 screenshot under `docs/qa/m5/`).
- **Done:** backdrop spans full width behind the grid; links clickable; build green.
  Commit: `fix(projects): full-bleed grid backdrop per M5.9`

### T4 — Lanyard swap polish (M5.10)
- **File:** `site/src/components/LanyardLoader.tsx` ONLY. Add a 400ms delay-show: the fallback
  renders `opacity-0` until a 400ms timer fires (then fades in) — if `sceneReady` lands first,
  it never appears. Offset the swap: fallback fade-out (~200ms) completes BEFORE the canvas
  container fades in (~300ms, slight delay). Server/hydration render byte-identical (all timers
  client-side, initial classes unchanged). #418 regression = instant STOP.
- **Done:** on `:4173`: hard-reload (fast) shows NO fallback flash, card fades in once; with
  devtools Slow 4G the fallback appears after ~400ms, then swaps without both cards visible.
  Playwright 36/36. Commit: `fix(knowme): lanyard fallback delay-show + offset crossfade`

## ⛔ STOP ASSETS — if Sid's drop has not landed, stop here completely and report. Resume at T5
only after Sid confirms the frame folders + posters exist under `site/public/media/`
(`<page>-seq/0001.webp…` + `<page>-hero-poster.webp`; Sid reports frame counts) and D2/D3 files
under their paths.

### T5 — Hero sequence wiring (M5.2 + M5.9)
- **Files:** `site/src/app/prospect/page.tsx`, `site/src/app/travel-planner/page.tsx`.
  Hero Section gets `backdrop={<ScrollSequence framesDir=... frameCount=... poster=... />}`
  (frameCount from Sid's drop report); `<PaperInkLoader />` is REMOVED from these two heroes
  (D37 per-region; the import too). Text/readability: keep the existing text z-layers; if
  contrast suffers, a token-only scrim div inside the backdrop is allowed (no new hexes).
- **Done:** both heroes full-bleed, scrub responds to scroll both directions smoothly, poster
  paints first; N23 screenshots. Commit: `feat(cases): full-bleed scroll-scrub hero sequences`

### T6 — D2 frames + D3 tiles
- Wire Sid's real screenshots into the case-page frames (replace `public/placeholders/*.svg`
  references) and tiles into `/projects` (`public/tiles/`, `scan-tiles.mjs` already builds the
  manifest). AVIF/WebP sizing per DESIGN.md §5.
- **Done:** no placeholder assets referenced anywhere; build green; N23 screenshots.
  Commit: `feat(assets): real screenshots + project tiles`

### T7 — Certification 1× + D-rows
- DESIGN.md §6 rows (after D77, no blank line): D78 full-bleed hero spec (M5.9, STOP M4-A
  reject), D79 ScrollSequence canvas scroll-scrub system (M5.1-REV/M5.2), D80 lanyard
  delay-show (M5.10).
- Full suite: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate.
  Visual-gate baselines will change (full-bleed heroes) — regenerate + commit; if the gate's
  DETECTION logic needs changes, that is N7: STOP and ask Sid, never edit it yourself.
  Case <72 = N18 STOP with numbers. Cert commit ONLY if all green (N23).
- **Done:** suite summary + qa-report 3-liner. Commit: `docs(qa): M5 batch 1 certification`

## ⛔ SWITCH MODEL — DeepSeek done permanently.

---

## BATCH 2 — Perceptual (Gemini 3.1 Pro @ HIGH; Taste Skill if installed)

### T8 — Scrub feel pass
- Tune the scroll→time mapping (easing/damping, dwell zones so key frames land where text sits).
  Numbers live in ScrollVideo props/consts — no structural edits. Before/after notes in the report.
### T9 — Polish vs the audit
- Apply accepted `ui-ux-pro-max` recommendations that are token-compatible (spacing, type scale,
  contrast). DESIGN.md tokens win; no copy changes (M5.6); list every applied/rejected item.
### T10 — Evidence set
- `docs/qa/m5/`: all 6 pages at p0 + hero mid-scrub + lanyard fast/slow series, every file
  md5-unique, `:4173`, ≥5 s waits (N23). Full suite 1× green.
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
Execute Batch 1 (T1–T7) strictly in order. Non-negotiables: edit only files named in the current
task; no new dependencies; every claimed screenshot md5-unique from the served prod build :4173
after ≥5s settle (N23) — a duplicate or blank frame is a false report; certification commits only
on a fully green suite; any case-page lighthouse <72 = STOP with the number, no retries, no
threshold edits; never edit gate scripts (N7) — if visual-gate detection needs changes, STOP and
ask Sid; STOP COMPLETELY at ⛔ STOP ASSETS if Sid's media files are absent; build green before
every commit; one task = one commit; no attribution trailers; NEVER push. If a fix isn't clean in
ONE attempt, STOP and report. STOP COMPLETELY at ⛔ SWITCH MODEL after T7. Address the user as Sid.
```

**Batch 2 — Gemini 3.1 Pro @ HIGH:**
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3, m1plan.md §2,
m2plan.md §2, m3plan.md §3, m4plan.md §3, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md, plus the advisory audit at
docs/plans/inputs/uiuxpromax-portfolio.md if present.
Execute Batch 2 (T8–T10) strictly in order. Non-negotiables: perceptual tuning only — no
structural or copy changes; DESIGN.md tokens win over any audit recommendation; every screenshot
md5-unique from :4173 after ≥5s settle (N23); full suite green before your final commit; build
green before every commit; one task = one commit; no attribution trailers; NEVER push. STOP
COMPLETELY at ⛔ STOP M5-B, post the completeness table with real evidence paths (N19), and wait —
launch is not executor work. Address the user as Sid.
```

## 6. Confidence: 9.0/10 — frozen

Both M4-A rejects are root-caused in code (Section's `max-w-[1200px]` clamps all hero media; the
crossfade shows both cards). The riskiest unknowns are gated before cost: technique feel + pin
verdict at STOP M5-A (before assets), asset quality via the iterable prompt pack (Sid holds the
generators). The REV pipeline removes the old #1 risk — backward scrub is exact by construction
(shipped frames, no video seeking). Residual: frame-payload weight vs the 72 floor (M5.3
lazy-mount + N18 STOP), Flow interpolation drift (mitigated: end frame generated from the start
frame as reference; regenerate endpoint before blaming Flow), Gemini's taste vs Sid's (STOP M5-B
is accept/reject only).

**SCOPE FREEZE: 2026-07-12.** M5.1–M5.11 frozen. Executors may not add, merge, reorder, or
reinterpret tasks; STOPs are accept/reject only.
