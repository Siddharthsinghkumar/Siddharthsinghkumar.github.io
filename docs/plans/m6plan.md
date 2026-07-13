# M6 Plan — Fix Batch + Certification + Launch (site done = live)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m6plan.md`
> **STATUS: FROZEN 2026-07-12; REWRITTEN 2026-07-13 after ⛔ STOP M5-B was REJECTED-FORWARD.**
> Sid judged `:4173` and rejected three things (M6.1–M6.3 below). They are fixed HERE, by
> **DeepSeek v4 Flash @ HIGH** (Batch 1), then cert + launch run **Sid+Claude ONLY** as frozen.
> **m6 is the LAST milestone. Sid pushes after it. Nothing lands after launch** except the
> post-launch queue (m5plan §7 + hero image drops per M6.3 + the 4 missing project summaries).
> An executor must NEVER continue past a ⛔ marker.

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js
   you know." Read the relevant `site/node_modules/next/dist/docs/` guide before any Next API.
3. **This plan, top to bottom.** m0plan §3 (N1–N13), m1plan §2 (N14–N16), m2plan §2 (N17–N18),
   m3plan §3 (N19), m4plan §3 (N20), m5plan §3 (N21–N23) remain law verbatim.
4. Per-task: ONLY files named in the task block.

## 1. FROZEN VERDICTS (Sid, 2026-07-13 — from his :4173 taste pass + answers)

| # | Verdict |
|---|---|
| M6.1 | **Knowme first-load break is REAL and root-caused** (Claude repro, evidence in `docs/qa/m6/repro/`): (a) `FirstFrameGate` fires on the canvas's first rAF tick while card.glb/WASM still load → `sceneReady` goes true early → white Environment flash (M3-A wash back in prod); (b) on scene error/WebGL-context-loss the boundary renders `null` AND the stuck-true `sceneReady` keeps the fallback at opacity 0 → dead/white region ~70% of page; reload works from cache. Fix per F1: first-frame fired from INSIDE the suspense-resolved scene, an explicit `sceneError` state that forces the designed fallback, context-loss handled. Never an empty or white region — card OR the designed monogram fallback, always. |
| M6.2 | **Knowme layer restack:** the `translateX(18%)` wrapper clips the canvas at an invisible edge (probe: canvas rect starts x=230 on 1280w) — the card vanishes when dragged left, and the canvas intercepts pointer events over ALL text/links. Fix per F2: canvas true full-bleed `inset-0`, card anchored right INSIDE the scene (no DOM transform), canvas `pointer-events: none` with R3F `eventSource` on the page root so links click through and the card still drags — across the WHOLE page, no invisible walls (Sid's explicit spec). Scrim = **text-hugging rounded panel** (Sid's pick), not the full-height inset-0 slab. D56 (lanyard above nav) stays honored. |
| M6.3 | **Case heroes: PaperInk is OUT** (Sid: "not 4 light illumination blobs and cursor illuminates"). Replaced by a static full-bleed **ImageBackdrop** reading `/images/prospect-hero.webp` and `/images/travel-planner-hero.webp` — file-slot design: Sid overwrites those two files with images he finds LATER (even post-launch via the D70 flow), zero code change. Interim art ships from existing repo assets + token gradient and MUST pass the visual gate (≥10% scene / ≥1.5% orange / h1 ≥4.5:1). No shader, no rAF, no cursor effects. PaperInk component FILES stay in the repo (D69/D75 restore-hatch lesson) — only usage is removed. |
| M6.4 | Fix batch executor: **DeepSeek v4 Flash @ HIGH** (Sid: "either v4 flash or 3.1 pro"; Flash chosen because the tasks below are specified at diff precision). ⛔ STOP M6-A = Sid judges the three fixes on `:4173` before cert starts. Cert + launch stay Sid+Claude. |
| M6.5 | m6 is FINAL. After ⛔ FINAL STOP and the snapshot, **Sid pushes**. Post-launch queue only after live. |

## 2. Execution order

```
B1 (DeepSeek v4 Flash @ HIGH): F1 lanyard swap hardening → F2 knowme restack →
   F3 case-hero ImageBackdrop → F4 cert 1× + D-rows + evidence
→ ⛔ STOP M6-A: Sid judges fixes on :4173 (knowme cold+warm+drag-left, both heroes)
→ T1–T6 (Sid+Claude ONLY): 3× cert → ⛔ FINAL STOP → quiet lighthouse → snapshot +
   privacy grep → Sid pushes → live verification (D6–D8) → docs close
```

One task = one commit. Build green before every commit. No new dependencies. No attribution
trailers. **NEVER push.** Verification tool for F1/F2: `node scripts/knowme-repro.mjs`
(committed; serves nothing itself — start `node scripts/serve-out.mjs` first, or it exits).

---

## BATCH 1 — Fixes (DeepSeek v4 Flash @ HIGH)

### F1 — Lanyard swap hardening (M6.1)
- **Files:** `site/src/components/Lanyard.tsx`, `site/src/components/LanyardLoader.tsx` ONLY.
- **Lanyard.tsx:** delete the `FirstFrameGate` component and its `{onFirstFrame && ...}` canvas
  child. Add `onFirstFrame?: () => void` to `BandProps`; pass it through from `Lanyard`'s props
  into `<Band ... onFirstFrame={onFirstFrame} />`. Inside `Band`'s EXISTING `useFrame` callback,
  fire it once, ref-guarded, as the first statement:
  `if (!firedRef.current) { firedRef.current = true; onFirstFrame?.(); }`
  (add `const firedRef = useRef(false);` with Band's other refs). Band renders only after
  `useGLTF`/`useTexture` resolve, so its first tick = the card is genuinely renderable — this is
  what D75 intended.
- **LanyardLoader.tsx:** add `const [sceneError, setSceneError] = useState(false);`.
  (a) Boundary: `LanyardErrorBoundary` gets a new optional `onError?: () => void` prop — add
  `componentDidCatch() { this.props.onError?.(); }` to `LanyardErrorBoundary.tsx` (this file
  edit is allowed for F1) — and LanyardLoader passes `onError={() => setSceneError(true)}`.
  (b) Context loss: on the canvas-wrap div, attach a capture-phase listener via ref for
  `webglcontextlost` → `setSceneError(true)`.
  (c) Render logic: when `sceneError` is true — fallback-wrap `opacity: 1`, `pointerEvents:
  "auto"`, `aria-hidden: false`; canvas-wrap not rendered (unmount the boundary subtree).
  `sceneReady` must NOT override `sceneError`. Initial server/hydration output byte-identical
  (all new state client-side, initial values unchanged). #418 regression = instant STOP.
- **Done:** `node scripts/knowme-repro.mjs` (server running) — BOTH cold and warm screenshots
  show either the 3D card or the designed monogram fallback; never an empty card region, never
  a white wash. Playwright 36/36. Commit: `fix(knowme): scene-ready from model frame + explicit error fallback`

### F2 — Knowme layer restack (M6.2)
- **Files:** `site/src/app/knowme/KnowMeClient.tsx`, `site/src/components/Lanyard.tsx` (one
  prop), `site/src/app/knowme/page.tsx` (root id) ONLY.
- **page.tsx:** give the root div `id="knowme-root"`.
- **KnowMeClient.tsx:** the lanyard wrapper (line ~23) loses `style={{ opacity: 0.8, transform:
  "translateX(18%)" }}` and gains `pointer-events-none` — now plain
  `className="absolute inset-0 z-[60] pointer-events-none"`. The scrim div (line ~29,
  `absolute inset-0 ... maxWidth: 65ch`) is DELETED; instead the existing
  `relative max-w-[60ch]` content div gains the panel styles:
  `bg-[--bg]/60 backdrop-blur-sm rounded-[--r-md] p-8` (text-hugging panel, Sid's pick).
- **Lanyard.tsx:** add `anchorX?: number` prop (default 0); Band's outer group becomes
  `position={[anchorX, 4, 0]}`. In KnowMeClient pass an `anchorX` that places the card visually
  where it sits in `docs/qa/m5/knowme-p0.png` (~right third; expect a value around 2.5–3.5 —
  tune on :4173, one decimal is fine). Pass R3F events through: in Lanyard.tsx, `<Canvas>` gets
  `eventSource={typeof document !== "undefined" ? document.getElementById("knowme-root") ?? undefined : undefined}`
  and `style={{ pointerEvents: "none" }}`. If eventSource does not restore card dragging
  cleanly in ONE attempt, STOP and report — do not invent an alternative event scheme.
- **Done:** repro script stack probe shows the text/links (not CANVAS) as the top hit at
  (20%w, 55%h); card drags across the full viewport with no invisible wall (drag to x≈5%w —
  screenshot proof); email/resume/GitHub/LinkedIn links click-navigate (verify via Playwright or
  a probe click); h1 contrast gate passes. Playwright 36/36.
  Commit: `fix(knowme): full-bleed card layer, click-through canvas, text-hugging scrim`

### F3 — Case-hero ImageBackdrop (M6.3)
- **Files:** NEW `site/src/components/ImageBackdrop.tsx`; `site/src/app/prospect/page.tsx`,
  `site/src/app/travel-planner/page.tsx`; two NEW asset files under `site/public/images/`.
- **ImageBackdrop.tsx (server component, no "use client"):** props `src: string`. Renders:
  full-size div with `backgroundImage: url(src)`, `backgroundSize: cover`,
  `backgroundPosition: center`; above it a token gradient overlay div
  (`linear-gradient` from `--bg` ~85% opacity at the left/top toward transparent right, plus a
  subtle `--accent` tint band) so h1 contrast holds and the visual gate's orange floor is met.
  Tokens only — zero new hexes (use the token-hex module or CSS vars). No motion of any kind.
- **Interim art:** create `site/public/images/prospect-hero.webp` and
  `travel-planner-hero.webp` by COPYING existing repo assets (e.g., `bg-graphite.webp`) —
  executors never generate imagery (M5.4/M5.5). Sid overwrites these two files with his chosen
  images later; the code never changes for that.
- **Pages:** hero Section `backdrop={<PaperInkLoader />}` → `backdrop={<ImageBackdrop
  src="/images/<page>-hero.webp" />}`; remove the PaperInkLoader import from BOTH pages.
  Do NOT delete PaperInk component files (M6.3 restore hatch).
- **Done:** both heroes show the static full-bleed image + gradient (no blobs, no cursor glow);
  visual-gate passes all pages (if interim art fails the scene/orange floors, adjust the
  GRADIENT overlay, never the gate — N7); lighthouse cases ≥72 (should IMPROVE without the
  shader); N23 screenshots to `docs/qa/m6/`. Commit: `feat(cases): static ImageBackdrop heroes, PaperInk retired from cases`

### F4 — Certification 1× + D-rows + evidence
- DESIGN.md §6 rows (after D79, no blank line): D80 lanyard scene-ready/error hardening (M6.1),
  D81 knowme full-bleed layer restack + click-through canvas (M6.2), D82 case-hero static
  ImageBackdrop with file-slot swap, PaperInk retired from cases (M6.3).
- Full suite: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate. Visual
  baselines change on 3 pages — regenerate + commit (N7: never touch gate DETECTION logic).
- Evidence to `docs/qa/m6/`: knowme cold/warm/drag-left series + both heroes at p0, md5-unique,
  `:4173`, ≥5 s settle (N23). qa-report 3-liner with REAL paths (N19 — the m5 false-path breach
  is on record; repeat = the report is void).
- **Done:** suite summary + evidence paths that exist. Commit: `docs(qa): M6 fix batch certification`

## ⛔ STOP M6-A — Sid judges on :4173: knowme cold load, warm reload, drag the card far left,
both hero backdrops. Accept ⇒ T1. Reject ⇒ STOP, Claude re-plans.

---

## T1 — Final certification (Sid+Claude; roadmap M8 discipline)
- Full suite **3× consecutive**: build → tsc → lint → guards → playwright → lighthouse-gate →
  visual-gate. All green, all three runs. `git status` clean (the `.har` +
  `.commandcode/taste/taste.md` stay untracked/dirty, Sid's).
- Completeness table posted: every m4/m5/m6 task + the two M3-A defects + the three M5-B
  rejects, with Built / Gate / Sid-verified columns. **⛔ FINAL STOP:** "Ready pending your
  visual pass. Nothing pushed."

## T2 — Quiet-machine lighthouse (precondition for the snapshot)
- Sid closes Chromium/dev servers ~10 min; `node scripts/lighthouse-gate.mjs`: home ≥55, cases
  ≥72. Red on a quiet machine = real; STOP and diagnose before any snapshot (N18 — no
  threshold edits).

## T3 — Public snapshot + privacy verification (m2plan T8 verbatim)
- `git archive HEAD site/ .github/ README.md | tar -x -C <fresh temp dir>` → `git init` →
  single commit `Initial release` (no trailers). Claude pastes every line: top level exactly
  `site/ .github/ README.md`; m2plan §6 privacy grep → **zero hits** (N17: no docs/, no plans,
  no `local-resume-references.md`, no `.commandcode/`, no `site/public/test`, no `+91`, no
  `downl2160@gmail.com`); resume PDF opens; `git log --oneline` → exactly 1 commit.
- Any failure = fix in the private repo, re-archive. Never hand-edit the snapshot.

## T4 — Sid pushes + Pages settings
- From the **snapshot directory only**:
  `git push https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git HEAD:main`
- Settings → Pages: source = **GitHub Actions**; **Enforce HTTPS**.
- Watch the first Actions run (full gate suite on a GitHub runner, first time). Red → rerun
  once; red twice → STOP, Sid decides (N18).

## T5 — Post-deploy verification (D6–D8)
- All 6 routes 200 on the live URL; resume downloads + opens; OG meta on home + knowme; D6
  LinkedIn URL clicked by Sid's own browser (bots get 999); D7 GitHub profile website field +
  pinned repos per D65; D8 nightly cron (`30 22 * * *` UTC ≈ 04:00 IST) observed green next
  morning.

## T6 — Docs close + knowledge base
- `docs/qa/qa-report.md` + `docs/LAUNCH-CHECKLIST.md`: final dated exit state +
  **"Live and verified. Lint zero. Playwright 36/36."** Claude updates project memory same day.
- Future public updates (hero image drops, D2/D3, teardown retry): D70 flow — certify private
  tree → `git archive` sync → N17 privacy grep → normal commit → **Sid pushes**. This grep runs
  before every public push, forever.

## 3. KICKOFF PROMPT — Batch 1, DeepSeek v4 Flash @ HIGH

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3, m1plan.md §2,
m2plan.md §2, m3plan.md §3, m4plan.md §3, m5plan.md §3, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m6plan.md.
Execute Batch 1 (F1–F4) strictly in order. Non-negotiables: edit only files named in the current
task; no new dependencies; executors NEVER generate imagery — interim hero art is COPIED from
existing repo assets; every claimed screenshot md5-unique from the served prod build :4173 after
≥5s settle (N23); evidence paths must exist exactly as written in any report (N19 — a cited path
that does not exist voids the report); certification commits only on a fully green suite; any
case-page lighthouse <72 = STOP with the number, no retries, no threshold edits; never edit gate
scripts (N7); if the F2 eventSource change does not restore card dragging in ONE attempt, STOP
and report; build green before every commit; one task = one commit; no attribution trailers;
NEVER push. STOP COMPLETELY at ⛔ STOP M6-A after F4 and wait for Sid. Address the user as Sid.
```

## 4. Confidence: 8.8/10

All three defects are root-caused with reproductions, not guesses (repro script committed; the
stacking probe and cold/warm screenshots are in `docs/qa/m6/repro/`). F1/F3 are surgical. The
one genuinely risky edit is F2's `eventSource` switch (R3F event plumbing) — it carries an
explicit one-attempt STOP rule. Residual: interim hero art passing the visual-gate orange floor
may need gradient tuning (bounded, gate-safe); Sid's hero images arrive later by overwriting two
files, no code risk.

**SCOPE FREEZE: 2026-07-13.** F1–F4 + T1–T6 only. STOPs are accept/reject only. m6 is last.
