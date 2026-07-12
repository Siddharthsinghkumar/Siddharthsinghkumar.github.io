# M4 Plan — STOP M3-A Fixes (SLIMMED 2026-07-12)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m4plan.md`
> Successor to [`m3plan.md`](m3plan.md) (Batch 1 verified; **⛔ STOP M3-A REJECTED by Sid** — see
> m3plan §9). **AMENDED same day:** Sid consolidated all remaining work into three plans —
> **m4 = these fixes · [`m5plan.md`](m5plan.md) = the visual upgrade · [`m6plan.md`](m6plan.md) =
> cert + launch. Nothing lands after launch.** The original m4 Gemini demo batch and launch batch
> are superseded by m5/m6.
> Executor: **DeepSeek v4 Flash @ MAX** (Batch 1 only). Sid switches at every **⛔** marker himself.
> An executor must NEVER continue past one.
> **STATUS: FROZEN — M4.1–M4.4 taken 2026-07-12 (M4.2/M4.4 amended same day, see §4).**

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you
   know." Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
   (No task below touches one — tripwire, not homework.)
3. **This plan, top to bottom.** m0plan §3 (N1–N13), m1plan §2 (N14–N16), m2plan §2 (N17–N18),
   m3plan §3 (N19) remain law verbatim; §3 below adds N20.
4. Per-task: ONLY files named in the task block.

## 1. Mission & definition of DONE

**Fix the two STOP M3-A rejections; Sid accepts on the served prod build.**

1. L0 PageBackground restored full-bleed on `/prospect`, `/travel-planner`, `/projects`
   (D56/W4 schema). Interim underlay = component default; final art is m5's job.
2. /knowme first load NEVER shows a washed canvas or an empty card area — fallback card visible
   from first paint until the 3D scene's first rendered frame, then crossfade.
3. Suite green (playwright 36/36; lighthouse 55/72, N18 applies).
4. Sid said yes at ⛔ STOP M4-A. → then m5.

## 2. WANT list (Sid's words, frozen 2026-07-12)

- "Why did I spend hours to make a reasonable layers structure" — L0 comes back.
- Knowme after reloads "works as I planned" — fix scoped to first load ONLY; working layout untouched.
- Slim m4; all underlay/video taste decided together in m5.

## 3. DON'T-WANT — N1–N19 binding, plus:

| # | Rule |
|---|---|
| N20 | **Visual verdicts happen on the served prod build** (`cd site && npm run build && node scripts/serve-out.mjs` → `:4173`), never the dev server. The M3-A grey-wash screenshot was dev-only; evidence and judging use `:4173`. |

## 4. FROZEN VERDICTS

| # | Verdict |
|---|---|
| M4.1 | ⛔ STOP M3-A = REJECTED. (a) knowme first-load wash / empty card window; (b) L0 layer regression (D62 → M1.3 → m2 T3 destroyed the restore hatch). Both fixed here. |
| M4.2 | *(amended)* L0 restored with the component-default paper-grain underlay as INTERIM. The A/B art demo is superseded — final underlay/video art is decided in m5 with the full media pass. |
| M4.3 | Knowme fix = fallback-until-first-frame: LanyardFallback stays visible, canvas at opacity 0 until the scene's first rendered frame, ~400ms crossfade. Kills the dev wash AND the slow-network empty window (card.glb = 2.4 MB). |
| M4.4 | *(amended)* Batch 1 = DeepSeek v4 Flash @ MAX only. Gemini's perceptual work moves to m5. Launch = m6, Sid+Claude only. Optionally attach the **ponytail** skill to this batch (mechanical code-diet; Sid's call at kickoff). |

Perf tripwire (D68/D71/N18): any case page <72 after the restore → report the number and STOP.
No threshold edits, no retry loops.
**Tripwire FIRED 2026-07-12** (prospect 60 / travel-planner 63; executor stopped correctly
mid-T4). **Sid's written verdict: T2b idle-mount, floors keep** — the M5.3 lazy-mount doctrine
extended to L0. Executor resumes at T2b → T4 full recert.

## 5. Execution order

```
BATCH 1 (DeepSeek v4 Flash @ MAX): T1 → T2 → T3 → T2b (tripwire fix) → T4 (cert)
   → ⛔ STOP M4-A (Sid accepts/rejects both fixes on :4173) → m5plan takes over
```

Strictly T-order. One task = one commit. Build green before every commit. No attribution trailers.
**NEVER push.**

## BATCH 1 — Mechanical fixes (DeepSeek v4 Flash @ MAX, ~45 min)

### T1 — DESIGN.md §6: rejoin D72–D74 to the table
- The M3 executor inserted D72–D74 AFTER the blank line that closes the §6 table — they render
  outside it. **Do:** delete the blank line between the D71 row and the D72 row (re-grep first).
  Table runs D1…D74 contiguously, then one blank line, then the `*(Executor: append …)*` note.
- **Done:** `grep -n -A1 "| D71" DESIGN.md` shows D72 on the next line.
  Commit: `docs(design): rejoin D72-D74 rows to the §6 table`

### T2 — Restore L0 PageBackground
- From the repo root: `git checkout 497b338^ -- site/src/components/PageBackground.tsx`.
  Do NOT edit its internals — reduced-motion path, resize handling, `-z-10` fixed positioning and
  the default image `/images/bg-graphite.webp` (exists) are already correct.
- Re-add the three mounts deleted in `24e5143`/`43aed32`: in each of
  `site/src/app/{prospect,travel-planner,projects}/page.tsx` add
  `import PageBackground from "@/components/PageBackground";` and mount `<PageBackground />` as the
  FIRST child of the returned fragment. No `image` prop (M4.2 interim default).
- **Done:** build green; `:4173` shows a full-bleed textured layer behind all content on all 3
  pages (one screenshot path per page under `docs/qa/m4/` — create the dir; N19); every link still
  clickable. Commit: `fix(layers): restore L0 PageBackground on prospect/travel-planner/projects`

### T3 — Lanyard first-frame gate
- **Files:** `site/src/components/Lanyard.tsx`, `LanyardLoader.tsx`, `LanyardErrorBoundary.tsx`. Nothing else.
- `Lanyard.tsx`: add optional `onFirstFrame?: () => void`. Inside the Canvas, sibling of
  `<Environment>` (same suspense scope as `<Band>`, so it mounts only once assets resolve), a tiny
  component fires `onFirstFrame` exactly once from its first `useFrame` tick (ref-guarded).
  Physics, materials, layout stay byte-identical.
- `LanyardErrorBoundary.tsx`: optional `fallback?: ReactNode` prop; when provided (even `null`),
  render it on error instead of the built-in `<LanyardFallback>`. Default behavior unchanged.
- `LanyardLoader.tsx`: in the mounted+webgl-ok branch render BOTH — `<LanyardFallback>` and the
  boundary-wrapped `<Lanyard>` — gated by `sceneReady` state (set by `onFirstFrame`): Lanyard
  container `opacity: sceneReady ? 1 : 0` (~400ms transition), fallback the inverse fade +
  `aria-hidden` once hidden. Pass `fallback={null}` to the boundary (exactly ONE fallback card on
  error). Reduced-motion and pre-mount/no-webgl paths UNCHANGED; server/hydration render stays
  byte-identical to today (`sceneReady` starts false everywhere). Module-level mount store untouched.
- **Done:** build green; `:4173` hard-load of `/knowme/` shows the fallback card immediately, then
  crossfades to the 3D card (state the check method); playwright 36/36 (a #418 regression = instant
  STOP). Commit: `fix(knowme): fallback visible until lanyard first frame, crossfade swap-in`

### T2b — Idle-mount the L0 shader (tripwire fix; Sid's written N18 verdict 2026-07-12)
- **File:** `site/src/components/PageBackground.tsx` ONLY. Add an `idle` state (initially false),
  set true via the existing in-repo idle pattern (`PaperInkCanvas.tsx:40`):
  ```ts
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const schedule = window.requestIdleCallback || ((fn: () => void) => setTimeout(fn, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = schedule(() => setIdle(true));
    return () => cancel(id as number);
  }, []);
  ```
  Widen the existing early-return branch to `if (prefersReduced || !idle)` — the flat graphite div
  is the pre-idle render. NO other changes (no fade-in; Sid adds it at the STOP only if he sees a pop).
- **Done:** build green; `node scripts/lighthouse-gate.mjs` case pages back ≥72 (paste numbers +
  environment note). Still <72 = STOP again — engineering is then exhausted and the floor becomes
  Sid's decision. Commit: `perf(layers): idle-mount L0 shader per lazy-mount doctrine`

### T4 — Certification 1× + D-rows
- Append to DESIGN.md §6 (4-column, directly after D74 — no blank line):
  - `| D75 | 2026-07-12 | STOP M3-A rejected: L0 PageBackground restored (D62 regression; restore hatch destroyed by M1.3 + m2 T3 cleanups) and knowme swap-in gated on the scene's first rendered frame | Sid's re-judge 2026-07-11; layer schema D56/W4 is binding; first-load wash was the canvas painting its lighting Environment pre-load |`
  - `| D76 | 2026-07-12 | L0 shader idle-mounts (requestIdleCallback, flat graphite pre-idle) — lazy-mount doctrine (M5.3) extended to L0 | N18 tripwire fired at 60/63 vs 72 after eager restore; Sid's written verdict: honest engineering before any floor talk |`
- Full suite 1×: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate.
  Visual-gate baselines (`docs/qa/t10/*.png`) change because L0 is back — regenerate and commit
  (b238100 pattern). Report lighthouse with the environment observation; case <72 = STOP per §4.
- **Done:** suite summary pasted (36/36); qa-report gains a 3-line "M4 Batch 1" note.
  Commit: `docs(qa): M4 batch 1 certification`

## ⛔ STOP M4-A — Sid accepts the fixes (do not pass without explicit yes)

| Item | Status | Proof |
|---|---|---|
| T1 D-table fix | | grep output |
| T2 L0 restored | | 3 screenshot paths (docs/qa/m4/) |
| T3 lanyard first-frame gate | | check method + 36/36 |
| T4 cert 1× | | suite summary |
| Fixes accepted | SID'S CALL | ritual below |

**Sid's ritual (N20):** `cd site && npm run build && node scripts/serve-out.mjs` → visit all 3 big
pages (L0 present, full-bleed, text readable), then hard-load `/knowme/` with devtools Network →
Slow 4G: fallback card immediately, crossfade in, drag the card, nav away and back.
**Accept** ⇒ m5plan. **Reject** ⇒ full stop; re-planned with Claude.

## 6. Gates, proof, commit protocol

m0plan §7/§8/§10/§11, m1plan N14–N16, m2plan §5–§6, m3plan N19 verbatim; N20 above.
Playwright floor 36/36. Lighthouse floors 55/72 (case <72 = STOP, never a threshold edit).

## 7. KICKOFF PROMPT — DeepSeek v4 Flash @ MAX (Batch 1 only)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13),
m1plan.md §2 (N14–N16), m2plan.md §2 (N17–N18), m3plan.md §3 (N19), then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m4plan.md.
Execute Batch 1 (T1–T4) strictly in order. Non-negotiables: edit only files named in the current
task; T2 restores PageBackground.tsx from git history VERBATIM; T3 must keep LanyardLoader's
server/hydration render byte-identical to today (React #418 regression = instant STOP); re-grep
every anchor before editing; every claimed proof states a real path with pasted ls output or says
"no evidence produced" (N19); all visual evidence from the served prod build on :4173, never the
dev server (N20); build green before every commit; one task = one commit; no attribution trailers;
NEVER push; any case-page lighthouse <72 = STOP with the number, no retries, no threshold edits
(N18). If a fix isn't clean in ONE attempt, STOP and report. STOP COMPLETELY at ⛔ STOP M4-A, post
the completeness table, and wait. Address the user as Sid.
```

## 8. Confidence: 9.3/10 — frozen

Slimming removed the two riskiest legs (art taste round, launch coupling). Batch 1 is four
mechanical, fully-specified tasks against verified anchors; both defects reproduced/root-caused
2026-07-12. Residual: L0 may cost case perf (tripwire covers it); the first-frame signal rides R3F
suspense semantics (failure mode = fallback never swaps — caught by T3's done-check and Sid's ritual).

**SCOPE FREEZE: 2026-07-12 (amended same day — demo batch → m5, launch → m6).**
