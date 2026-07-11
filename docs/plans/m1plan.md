# M1 Plan — Launch Completion + Lint Zero (2026-07-08)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m1plan.md`
> Successor to [`m0plan.md`](m0plan.md) (Phase 5, certified 2026-07-08 — independently re-verified in
> [`../qa/phase5/claude-verification-2026-07-08.md`](../qa/phase5/claude-verification-2026-07-08.md)).
> Executors: **DeepSeek v4 Flash @ MAX** (Batches 1–3, 5) and Sid+Claude (M9 push, Batch 4 verdicts).
> Sid switches models at every **⛔** marker himself. An executor must NEVER continue past one.
> **STATUS: DRAFT — awaiting Sid's verdicts on §3 before scope freeze.**

---

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you know." Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
3. **This plan, top to bottom.** M0's N-rules (m0plan §3, N1–N13) remain law verbatim; §2 below adds M1's N14–N16.
4. Per-task: ONLY files named in the task block. Reference/research files stay unread.

## 1. Mission & definition of DONE

Two independent tracks; neither blocks the other:

- **Track L (lint, runs NOW):** `npm run lint` → **0 errors** with zero behavior change, plus the src/ dead-code warnings gone.
- **Track A (launch, gated on Sid's asset drop):** placeholder tree retired → certification → **Sid pushes at M9** → site live at `siddharthsinghkumar.github.io`, post-deploy verified (D6–D8).

DONE means ALL of: lint 0 errors; assets real (no `/test/`, real resume PDF); full gate suite green 3× on the final tree; Sid pushed; live-site verification pasted; docs truthful. DONE is NOT: new features, GridMotion, merlin-cli-bridge, authored .glb — still parked for v2.

## 2. Additional N-rules for M1 (on top of m0plan §3 N1–N13, all still binding)

| # | Rule |
|---|---|
| N14 | **A lint fix that changes observed behavior = failed task.** Proof per batch: visual-gate numbers unchanged (±2% tolerance), Playwright green, and for motion components a before/after screen recording in `docs/qa/m1/`. |
| N15 | **ESLint config is untouchable.** No rule downgrades, no file ignores. Per-line `eslint-disable-next-line` ONLY within the §3 M1.1 budget, each carrying a one-line justification comment. Exceeding the budget = STOP. |
| N16 | **Case pages are perf-fragile (76 vs floor 75).** Any src edit touching `/prospect` or `/travel-planner` re-runs `lighthouse-gate.mjs` before commit. A drop below 75 reverts the commit — no threshold talk. |

## 3. OPEN VERDICTS — Sid answers these at plan approval; they freeze like m0plan §4

| # | Question | Recommendation |
|---|---|---|
| M1.1 | **Per-line disable budget** for `react-hooks/immutability` false-positives on three.js/R3F idioms (mutating `camera.fov` in `useFrame`, `useTexture` texture params) where no declarative alternative exists. | Approve **≤5 lines total**, each as `// eslint-disable-next-line react-hooks/immutability -- R3F imperative idiom: <one-line reason>`. Everything else gets a real fix. |
| M1.2 | **Post-launch update mechanism.** D64 launched with fresh-history single-commit. How do subsequent updates (e.g. Track L landing after launch) reach the public repo? | Keep public history at one commit: rebuild the snapshot and **force-push a fresh single commit** each release (same D64 privacy guarantees re-verified each time). Sid executes every push. |
| M1.3 | **PageBackground: restore or delete?** D62 commented it out for the perf floor with "can restore later if visuals require." Final images (D5) change the perf picture. | Decide at Batch 4 with data: re-run lighthouse with PageBackground restored on final assets. If it can't hold ≥75, **delete** the commented mounts + imports (git history keeps it); if it holds and Sid prefers the look, restore. No third state — the zombie imports go either way. |
| M1.4 | **Warning policy.** 26 warnings: ~11 src dead-code, 2 deliberate `<img>` (static export — next/image optimization doesn't apply), 13 in gate scripts (N7-protected). | Errors to 0 (hard). Src dead-code warnings to 0 (Batch 1). The 2 `<img>`: scoped disable with justification. Gate-script warnings: **leave** — not worth an N7 exception. |

## 4. Execution order

```
TRACK L (now):   BATCH 1 (types+dead code) → BATCH 2 (effect patterns) → BATCH 3 (WebGL surgery)
                 → ⛔ STOP L (Sid judges motion unchanged)
TRACK A (on Sid's drop): BATCH 4 (asset swap + D62 revisit + doc residue) → BATCH 5 (cert 3×)
                 → ⛔ FINAL STOP → M9 (Sid pushes, Claude verifies) → D6–D8 post-deploy
```

Strictly T-order within a batch. If the asset drop lands mid–Track L, finish the current batch, then run Batch 4–5; Track L resumes after.

---

## BATCH 1 — Types & dead code (DeepSeek v4 Flash @ MAX, ~2–3 h) — kills 20 errors + ~9 warnings

### T1 — Type the Lanyard donor code (16 `no-explicit-any`)
- **File:** `site/src/components/Lanyard.tsx` (anchors verified 2026-07-08, re-grep before editing: lines 32, 74–75 ×7, 78, 87, 97 ×2, 125, 165, 182–183).
- **Do:** replace every `any` with real types from `three`, `@react-three/fiber`, `@react-three/rapier` (all installed — import types, don't redeclare). No `unknown as X` laundering (m0plan T15 rule). The `(curve as any).curveType` cast: `MeshLineGeometry`-style donor typing — type the object properly; the *mutation itself* moves in T7.
- **Why safe:** types are erased at build; runtime cannot change. tsc is the reviewer.
- **Done:** `npx tsc --noEmit` exit 0; Lanyard `any` count 0; `npm run build` green. Commit: `fix(lint): type Lanyard donor code`

### T2 — Type IntroScreen + EngineCanvas `any`s (4 errors)
- **Files:** `site/src/components/IntroScreen.tsx` (43:18, 68:35, 98:35 — likely event/timeout types), `site/src/components/engine/EngineCanvas.tsx` (266:47).
- **Done:** zero `no-explicit-any` errors repo-wide: `npm run lint 2>&1 | grep -c no-explicit-any` → 0. Commit: `fix(lint): type intro + engine remnants`

### T3 — Src dead-code warnings (~9 warnings)
- **Files/targets (each verified unused 2026-07-08; re-verify with grep before deleting):** `SceneObjects.tsx` `SpriteGlow` (93:10) + `DataStream` (236:10) — delete the components if truly unreferenced; `ChoreoReveal.tsx` `staggerMs` (24:3); `GridBackdrop.tsx` `index` ×2 (11:27, 26:27 — drop the param); `EngineCanvas.tsx` `totalScrollable` (51:9); `TextPressure.tsx` `fitted` (62:10); the 2 unused `eslint-disable` directives (`Lanyard.tsx:1`, one more — grep "Unused eslint-disable"). Do NOT touch the 3 `PageBackground` unused imports — they are M1.3's (Batch 4). Do NOT touch `scripts/*.mjs` (N7).
- **Done:** src warnings reduced to: 3 PageBackground imports + 2 `<img>` only. Commit: `chore(lint): delete dead code behind warnings`

### T4 — The 2 `<img>` warnings (per M1.4 verdict)
- **Files:** `GridBackdrop.tsx:32`, `ScreenshotFrame.tsx:17`. Static export ships unoptimized images by design; add `{/* eslint-disable-next-line @next/next/no-img-element -- static export: next/image optimization unavailable */}` above each.
- **Done:** `npm run lint` shows zero warnings under `site/src/` except the 3 PageBackground imports. Commit: `chore(lint): justify static-export img usage`

**Batch 1 gate state:** lint errors 48→24, all remaining are hook-pattern; build/tsc/guards/playwright/visual/lighthouse unchanged (spot-check visual-gate once).

---

## BATCH 2 — Effect patterns (DeepSeek v4 Flash @ MAX, ~3–5 h) — kills 10 `set-state-in-effect`

**The pattern:** 8 of 10 are `matchMedia(...)` read + synchronous `setState` in a mount effect. The honest fix is one shared hook.

### T5 — `useMediaQuery` via `useSyncExternalStore`
- **Create:** `site/src/lib/useMediaQuery.ts`:
  - `useMediaQuery(query: string): boolean` — `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`; `subscribe` adds a `change` listener on `window.matchMedia(query)`; `getSnapshot` returns `.matches`; `getServerSnapshot` returns `false` (SSR/prerender).
  - Export `usePrefersReducedMotion()` = `useMediaQuery("(prefers-reduced-motion: reduce)")`.
- **SSR-default check (do this per component before converting):** the current code's pre-effect render uses the state's default value; `getServerSnapshot=false` must reproduce it. Verified for `PageBackground` (enabled defaults true; reduced=false → enabled) — verify the other seven the same way; if one differs, match its current default, don't invent.
- **Convert (one commit per file, anchors verified 2026-07-08):** `ChoreoReveal.tsx:38`, `Eyebrow.tsx:24`, `GridBackdrop.tsx:108` (also the `(any-pointer: fine)` check at 110 → second `useMediaQuery`), `PageBackground.tsx:33`, `ProspectDiagram.tsx:30`, `IntroScreen.tsx:29–32` (both the `intro-skip` class check and reduced-motion — the class check is read-once, may live in a lazy `useState` initializer reading `document` guarded by `typeof document`), `LanyardLoader.tsx:31` (reduced-motion via hook; the `supportsWebGL()` probe result may be cached at module level and read in a snapshot — it's deterministic per session), `EngineLoader.tsx:74` (three pointer/motion queries → three hook calls + `useMemo` for the profile object; verify the effect had no other job before deleting it).
- **N16:** ProspectDiagram + PageBackground sit on case pages — lighthouse re-run before those commits.
- **Done:** 8 files, zero `set-state-in-effect` outside Nav/IntroScreenGate; playwright green; visual-gate unchanged; reduced-motion smoke test green (it exists: smoke.spec.ts "reduced motion" test).

### T6 — The two non-mediaQuery cases
- **`Nav.tsx:27`** (reset decrypt state on pathname change): standard fix is a `key={pathname}` remount of the stateful nav-links subtree instead of the reset effect — remount IS the reset. The decrypt-on-view behavior and the D67 press effect must survive; record before/after of a route change (nav re-decrypt) to `docs/qa/m1/`.
- **`IntroScreenGate.tsx:16`**: restructure so `show` derives from a `useSyncExternalStore` over a tiny module store wrapping `isIntroShown()` storage; the effect keeps ONLY the `markIntroShown()` write. `setWaitForEngine(pathname === "/")` becomes derived state (compute from `pathname` directly — check it's not needed as state).
- **One-attempt rule (m0plan §10.4):** if either fix isn't clean in one attempt, STOP and report — these two gate the intro and nav, the site's first impression.
- **Done:** `npm run lint 2>&1 | grep -c set-state-in-effect` → 0; intro plays correctly on hard load, skips correctly on second nav (record both). Commits: `fix(lint): key-based nav reset`, `fix(lint): intro gate derives from storage store`

**Batch 2 gate state:** lint errors 24→14. Full suite green except lint.

---

## BATCH 3 — WebGL surgery (DeepSeek v4 Flash @ MAX, ~3–5 h) — kills last 14 errors

### T7 — Lanyard mutations (3 `immutability`)
- **File:** `site/src/components/Lanyard.tsx:165–166`. `curve.curveType = 'chordal'` and `texture.wrapS = texture.wrapT = RepeatWrapping` execute in render body.
- **Do:** move the curve mutation into the `useMemo` where the curve is constructed (rule's own suggestion — verify construction site first). The texture comes from a hook (`useTexture`): set wrap via the hook's config/onLoad if this drei version supports it; else per-line disable from the M1.1 budget (texture params are load-time config, not render-time state).
- **Done:** lanyard renders + drags identically (recording to `docs/qa/m1/lanyard-after.mp4` or GIF); knowme visual-gate row unchanged.

### T8 — EngineCanvas fog + camera (4 `immutability`)
- **File:** `site/src/components/engine/EngineCanvas.tsx`.
- **Fog (164–165):** replace the effect's `scene.fog = new THREE.FogExp2(...)` with declarative `<fogExp2 attach="fog" args={[COLORS.bg, 0.012]} />` in the canvas tree — standard R3F, kills the whole flagged effect pair (camera init `position.copy`/`lookAt` at 168–169 isn't flagged; keep it, in its own effect if needed).
- **Camera fov in `useFrame` (174/189):** THE R3F frame-loop idiom; no declarative equivalent for per-frame fov lerp → per-line disable from the M1.1 budget.
- **Done:** homepage scene visually identical (recording + `home-wp-*` visual-gate rows within tolerance); home lighthouse ≥55.

### T9 — SceneObjects purity + refs (6 purity + 4 refs) and IntroScreen `Date.now` (1 purity)
- **File:** `site/src/components/engine/SceneObjects.tsx`:
  - `Math.random()` ×6 (131–136) inside array-building `useMemo` → **seeded PRNG** (inline mulberry32, fixed seed constant). Pure + idempotent = rule satisfied honestly; bonus: the particle field becomes deterministic across loads. Pick a seed whose cloud looks as good — eyeball it, N1.
  - `driftOffsets.current = offsets` write during render (138) → return `{ positions, offsets }` from the same `useMemo`; consumers (frame loop) read the memo value; the ref dies.
  - Ref reads in the `geo` useMemo (271–273): `posArray`/`tValues`/`sizeArray` — convert those refs to `useMemo` values (they're build-once arrays), then `geo` depends on them.
- **File:** `site/src/components/IntroScreen.tsx:20` — `useRef(Date.now())` → `useRef<number | null>(null)` (N11: never bare) + `startRef.current ??= Date.now()` at the top of the existing mount effect. Verify every read handles the pre-effect null (or reads only inside effects/callbacks — check all `startRef` uses).
- **Done:** `npm run lint` **exit 0** (errors 0; remaining warnings = 3 PageBackground + gate scripts, per M1.4). Homepage scene recording; intro timing unchanged (the 4s dismiss + max-timer failsafe still fire — recording).

## ⛔ STOP L — Sid's eyes on motion (do not pass without explicit yes)
Present: lint output (0 errors); disable-budget ledger (each of the ≤5 lines quoted with its justification); recordings in `docs/qa/m1/` — intro hard-load + skip, nav route-change decrypt + press, homepage scene, lanyard drag; visual-gate + lighthouse summaries. Sid confirms nothing FEELS different (N1/N14 — gates can't judge motion feel).

---

## BATCH 4 — Asset drop & placeholder retirement (BLOCKED until Sid's drop; DeepSeek + Sid verdict)

**Precondition:** Sid says the drop landed. Then verify yourself: `file site/public/resume-siddharth-singh.pdf` says PDF; new finals present where Sid says they are. If not: STOP.

### T10 — Swap finals, kill `/test/` forever
- Run the finals through the same AVIF/WebP pipeline as T23 (m0plan); re-point any refs Sid's drop changes; **delete the 3 commented `/test/final-df-h.webp` mounts** in `prospect/travel-planner/projects` pages (they reference a file that doesn't even exist — only `.jpg` does) — the D62 restore path is git history, not zombie comments (resolution per M1.3 verdict); **`git rm -r site/public/test/`** (contains the personal photo — this is the privacy-critical deletion); `grep -rn "/test/" site/src` → empty, `ls site/public/test` → error. Paste both.
### T11 — M1.3 decision data (PageBackground)
- With finals in: restore PageBackground on one case page locally, `lighthouse-gate.mjs` ×3, present numbers + screenshots to Sid. Apply his verdict everywhere: restore (if ≥75 holds and he likes it) or delete mounts + the 3 imports. Either way the 3 warnings die. Commit per verdict; fill a D69 row in DESIGN.md §6.
### T12 — Doc residue
- `DESIGN.md` §5 line ~163: "perf ≥ 0.9, a11y ≥ 0.95, SEO ≥ 0.95" → the real floors (home ≥55, case ≥75 — or the D68/T24 state if M1.3 changed it), a11y ≥95, SEO ≥95. `docs/LAUNCH-CHECKLIST.md` line ~120: delete the vestigial "/about references above are stale" note (grep shows zero refs above it). Re-grep anchors first. Commit: `docs: retire stale thresholds + vestigial notes`

## BATCH 5 — Certification & launch (DeepSeek for cert; Sid+Claude for M9)

### T13 — Full suite 3× consecutive on the final tree (m0plan §7 block verbatim). All green incl. lint. Paste summaries.
### T14 — qa-report addendum: `docs/qa/qa-report.md` gains an "M1 certification" section from observed output only.
### T15 — M9 runbook execution (Sid pushes, Claude verifies; executors NEVER):
- Per D64 + M1.2: fresh-history single commit, MINIMAL tree (`site/` + `.github/` + README). Pre-push verification (Claude): no `docs/`, no plans, no `local-resume-references.md`, no `.commandcode/`, no `site/public/test/` (deleted anyway), zero `/test/` refs, resume PDF opens, `git log --oneline` on the public branch shows exactly 1 commit.
- Post-push (D7): Pages source = Actions, Enforce HTTPS. Then D8 on the live URL: all 6 routes 200, resume downloads and opens, OG cards render (knowme + home), one nightly cron redeploy observed green in Actions, LinkedIn URL clicked (D6).

## ⛔ FINAL STOP
Completeness table (T1–T15 + D6–D8 + M1.1–M1.4 verdict outcomes), `git log --oneline` since `cae9cc0`, live URL, and the sentence **"Live and verified. Lint zero."**

---

## 5. Gate suite, proof rules, context rules, commit protocol
m0plan §7, §8, §10, §11 apply verbatim (same thresholds, same tee-off: only Sid-approved gate edits, one task = one commit, build green before every commit, no trailers, NEVER push except Sid at T15). New evidence dir: `docs/qa/m1/` (`mkdir -p` at first use). Statuses remain verified / failed / not-run.

## 6. KICKOFF PROMPTS

### Kickoff L — DeepSeek v4 Flash @ MAX (Batches 1–3)
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13) and §7–§11,
then the ENTIRE plan at /home/sidd/project/freelance/portfolio-website/docs/plans/m1plan.md.
Execute Batches 1–3 (T1–T9) strictly in order. Non-negotiables: a lint fix that changes observed
behavior is a FAILED task (N14) — prove with visual-gate + playwright + recordings in docs/qa/m1/;
eslint config untouchable, per-line disables only within the approved M1.1 budget with justification
comments (N15); case pages are perf-fragile — lighthouse before committing anything touching them (N16);
edit only files named in the current task; re-grep every anchor; build green before every commit; one
task = one commit; no attribution trailers; NEVER push. If a fix isn't clean in ONE attempt, STOP and
report. STOP COMPLETELY at ⛔ STOP L and post the report with lint output, disable ledger, and recording
paths. Address the user as Sid.
```

### Kickoff M — DeepSeek v4 Flash @ MAX (Batches 4–5, after Sid's asset drop)
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m1plan.md. Execute Batches 4–5 (T10–T14).
Precondition: verify the asset drop yourself (file must say PDF; finals present) — placeholders = STOP.
site/public/test/ contains a personal photo: its deletion is privacy-critical, paste proof. T11 is a
Sid decision gate — present numbers, apply his verdict, never your own. T15 (push) is Sid+Claude only —
you stop at the end of T14 with the 3× certification summaries. No attribution trailers. NEVER push.
Address the user as Sid.
```

## 7. Confidence: 8.8/10 — grill me before freezing

Grounded: every lint error's file:line:rule verified against a real run today (`docs/qa/phase5/claude-verification-2026-07-08.md`); the gate suite re-run 1× green end-to-end; anchors quoted from the actual output. Residual risks: (1) `useSyncExternalStore` conversions must reproduce each component's pre-effect default — the per-component SSR-default check + reduced-motion smoke test covers it, but Nav/IntroScreenGate are the two with real regression surface (one-attempt STOP rule applies); (2) the drei `useTexture` wrap-config path may not exist in this version → budget line; (3) seeded-PRNG particle cloud is a one-time visual dice-roll → N1 eyeball at STOP L; (4) M1.2 force-push update model needs Sid's explicit comfort — it rewrites public history by design.

**SCOPE FREEZE: pending Sid's M1.1–M1.4 verdicts.**
