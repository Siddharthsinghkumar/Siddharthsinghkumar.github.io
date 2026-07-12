# M4 Plan — Layer Restore + Lanyard First-Frame Fix + Launch (2026-07-12)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m4plan.md`
> Successor to [`m3plan.md`](m3plan.md) (Batch 1 executed by DeepSeek 2026-07-11, independently
> verified by Claude 2026-07-12 — see m3plan §9 status ledger; **⛔ STOP M3-A was REJECTED by Sid**,
> so m3plan Batch 2 is superseded by this plan's Batch 3).
> Executors: **DeepSeek v4 Flash @ MAX** (Batch 1 — mechanical), **Gemini 3.1 Pro @ HIGH**
> (Batch 2 — perceptual), **Sid+Claude ONLY** (Batch 3 — the push). Same-model tasks are bunched
> per Sid's 2026-07-12 instruction. Sid switches models at every **⛔** marker himself.
> An executor must NEVER continue past one.
> **STATUS: FROZEN — verdicts M4.1–M4.4 taken by Sid 2026-07-12. Scope freeze in effect.**

---

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you
   know." Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
   (No task below touches a Next API — this is a tripwire, not homework.)
3. **This plan, top to bottom.** m0plan §3 (N1–N13), m1plan §2 (N14–N16), m2plan §2 (N17–N18),
   m3plan §3 (N19) remain law verbatim; §3 below adds N20.
4. Per-task: ONLY files named in the task block. Reference/research files stay unread.

## 1. Mission & definition of DONE

**Fix the two STOP M3-A rejections, get Sid's accept, then put the site live.**

DONE means ALL of:
1. L0 PageBackground restored on `/prospect`, `/travel-planner`, `/projects` — full-bleed layer
   behind everything, per Sid's D56/W4 schema. Sid picked the underlay variant at ⛔ STOP M4-A.
2. /knowme first load NEVER shows a washed-out canvas or an empty card area: the static fallback
   card is visible from first paint until the 3D scene's first rendered frame, then crossfades.
3. Full suite green (playwright 36/36 floor; lighthouse floors 55 home / 72 case, N18 applies).
4. Site live at `https://siddharthsinghkumar.github.io`; first Actions run green; D6–D8 pasted;
   docs carry the dated exit sentence **"Live and verified. Lint zero. Playwright 36/36."**
5. Sid said yes at every ⛔ STOP.

DONE is NOT: D2 screenshots / D3 tiles (Batch P — blocked on Sid's drop, post-launch via D70),
the rapier upgrade, GridMotion, merlin-cli-bridge, authored .glb, any copy or section change.

## 2. WANT list (Sid's words, frozen 2026-07-12)

- "Why did I spend hours to make a reasonable layers structure" — the 3 big subpages must follow
  the D56/W4 layer schema again. L0 comes back.
- Knowme first load: "when I first time load the know me page it looks like that [grey image] …
  if I reload few times it fixes itself." After reloads "it works as I planned" — so the fix is
  scoped to the first-load state ONLY; the working layout is accepted and must not change.
- L0 underlay: **"Demo both, I judge"** — paper-grain-over-graphite vs generated ambient art,
  side-by-side screenshots at the STOP.
- Executors: "deepseek v4 flash and gemini 3.1 pro … bunch same models tasks together."
- D60 doctrine unchanged: memorable-enough-to-revisit > fast/professional.

## 3. DON'T-WANT list — N1–N19 all binding, plus:

| # | Rule |
|---|---|
| N20 | **Visual verdicts happen on the served prod build** (`cd site && npm run build && node scripts/serve-out.mjs` → `:4173`), never the dev server. The STOP M3-A grey-wash screenshot came from `localhost:3000`; dev-only artifacts get triaged, but evidence and judging use `:4173`. All Batch 2 screenshots obey this. |

## 4. FROZEN VERDICTS (Sid, 2026-07-12)

| # | Verdict |
|---|---|
| M4.1 | **⛔ STOP M3-A = REJECTED.** Two defects: (a) knowme first-load wash / empty card window; (b) L0 layer regression on the 3 big subpages. Both fixed in m4 BEFORE launch. Root cause of (b): D62 commented L0 out for the then-75 perf floor ("can restore later"), then M1.3 deleted the imports and m2plan T3 deleted the file as dead code — the restore hatch was destroyed by cleanups. |
| M4.2 | **L0 restore, both variants demoed:** (A) restored PageBackground with its default paper-grain over graphite (no new asset) vs (B) generated ambient-art webp underlay (knowme-bg style). Sid picks per-page at ⛔ STOP M4-A. |
| M4.3 | **Knowme fix = fallback-until-first-frame:** LanyardFallback stays visible and the R3F canvas stays at opacity 0 until the 3D scene renders its first frame, then ~400ms crossfade. Kills the dev white-wash (canvas invisible while it paints the lighting Environment) AND the prod slow-network empty window (2.4 MB card.glb). Working-state layout untouched (Sid: "works as I planned"). |
| M4.4 | **Model split:** Batch 1 mechanical → DeepSeek v4 Flash @ MAX; Batch 2 perceptual (art + evidence) → Gemini 3.1 Pro @ HIGH; Batch 3 launch → Sid+Claude ONLY. Same-model tasks bunched; one ⛔ SWITCH MODEL between batches. |

Perf tripwire (D68/D71/N18): if restoring L0 lands any case page <72, report the number and STOP —
no threshold edits, no retry-loops. Sid decides with the D49 doctrine on the table.

## 5. Execution order

```
BATCH 1 (DeepSeek v4 Flash @ MAX): T1 → T2 → T3 → T4 (cert)
   → ⛔ SWITCH MODEL
BATCH 2 (Gemini 3.1 Pro @ HIGH): T5 (ambient art) → T6 (variant demo + knowme proof)
   → ⛔ STOP M4-A (Sid picks L0 variant + re-judges /knowme on :4173; accept/reject)
   → ⛔ SWITCH MODEL — executor work ends permanently
BATCH 3 (Sid+Claude ONLY): T7 (apply pick + D-rows + cert) → T8 (quiet-machine lighthouse)
   → T9 (snapshot + privacy verify) → T10 (Sid pushes + Pages settings) → T11 (D6–D8) → T12 (docs)
BATCH P (BLOCKED until Sid's D2/D3 drop, post-launch): P1 (assets) → P2 (D70 release flow)
```

Strictly T-order. One task = one commit. Build green before every commit. No attribution trailers.
**NEVER push — only Sid, only at T10, only from the snapshot directory.**

---

## BATCH 1 — Mechanical fixes (DeepSeek v4 Flash @ MAX, ~45 min)

### T1 — DESIGN.md §6: rejoin D72–D74 to the table
- The M3 executor inserted D72–D74 AFTER the blank line that closes the §6 table — in rendered
  markdown they fall out of the table. **Do:** delete the blank line between the D71 row and the
  D72 row (re-grep first). The table must run D1…D74 contiguously, then one blank line, then the
  `*(Executor: append …)*` note. Touch nothing else.
- **Done:** `grep -n -A1 "| D71" DESIGN.md` shows D72 on the next line.
  Commit: `docs(design): rejoin D72-D74 rows to the §6 table`

### T2 — Restore L0 PageBackground (M4.2 — variant A wiring)
- **Restore the file verbatim from history:** from the repo root,
  `git checkout 497b338^ -- site/src/components/PageBackground.tsx`. Do not edit its internals —
  it already has the reduced-motion path, resize handling, and `-z-10` fixed positioning, and its
  default image `/images/bg-graphite.webp` exists in `site/public/images/`.
- **Re-add the three mounts** deleted in `24e5143`/`43aed32`. In each of
  `site/src/app/prospect/page.tsx`, `site/src/app/travel-planner/page.tsx`,
  `site/src/app/projects/page.tsx`:
  add `import PageBackground from "@/components/PageBackground";` and mount `<PageBackground />`
  as the FIRST child of the returned fragment (before the first `<Section` / `<div className="pt-24`).
  No `image` prop — variant A is the component default. Variant B is Batch 2's demo edit, NOT yours.
- **Done:** build green; served `:4173` shows a full-bleed textured layer behind all content on all
  3 pages (paste one screenshot path per page under `docs/qa/m4/` — create the dir; N19);
  every link still clickable (the layer is `pointer-events-none`).
  Commit: `fix(layers): restore L0 PageBackground on prospect/travel-planner/projects`

### T3 — Lanyard first-frame gate (M4.3)
- **Files:** `site/src/components/Lanyard.tsx`, `site/src/components/LanyardLoader.tsx`,
  `site/src/components/LanyardErrorBoundary.tsx`. Nothing else.
- `Lanyard.tsx`: add optional prop `onFirstFrame?: () => void`. Inside the Canvas, as a SIBLING of
  `<Environment>` (inside the same suspense scope as `<Band>` so it only runs once assets resolved),
  add a tiny component that calls `onFirstFrame` exactly once from its first `useFrame` tick
  (guard with a ref). No other Lanyard changes — physics, materials, layout stay byte-identical.
- `LanyardErrorBoundary.tsx`: add optional `fallback?: ReactNode` prop; when the prop is provided
  (even as `null`), render it on error instead of the built-in `<LanyardFallback>`. Default
  behavior unchanged for any caller that omits it.
- `LanyardLoader.tsx`: in the mounted+webgl-ok branch, render BOTH — `<LanyardFallback>` and the
  boundary-wrapped `<Lanyard>` — with a `sceneReady` state (initially false, set by `onFirstFrame`):
  the Lanyard container div gets `opacity: sceneReady ? 1 : 0` with a ~400ms opacity transition;
  the fallback gets the inverse fade plus `aria-hidden` once hidden. Pass `fallback={null}` to the
  boundary so an error leaves exactly ONE fallback card visible (the loader's). The
  prefers-reduced-motion and pre-mount/no-webgl paths are UNCHANGED (fallback only, no canvas) —
  and the server/hydration render must stay byte-identical to today (fallback only; `sceneReady`
  starts false everywhere). Do not touch the module-level mount store.
- **Done:** build green; on served `:4173` a hard-load of `/knowme/` shows the fallback card
  immediately and crossfades to the 3D card (state the check method); playwright 36/36 (the /knowme
  hydration tests must stay green — a #418 regression here is an instant STOP).
  Commit: `fix(knowme): fallback visible until lanyard first frame, crossfade swap-in`

### T4 — Certification 1× + D-row
- Append to DESIGN.md §6 (4-column, directly after D74 — no blank line):
  - `| D75 | 2026-07-12 | STOP M3-A rejected: L0 PageBackground restored (D62 regression; restore hatch destroyed by M1.3 + m2 T3 cleanups) and knowme swap-in gated on the scene's first rendered frame | Sid's re-judge 2026-07-11; layer schema D56/W4 is binding; first-load wash was the canvas painting its lighting Environment pre-load |`
- Full suite 1×: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate.
  Visual-gate baselines (`docs/qa/t10/*.png`) will change because L0 is back — regenerate and
  commit them as part of this task (established b238100 pattern). **Environment note:** report
  lighthouse numbers with the environment observation; home <55 with Sid's browser open is known;
  any CASE page <72 = STOP per §4 tripwire (N18 — no retries, no threshold edits).
- **Done:** suite summary pasted (playwright 36/36); `docs/qa/qa-report.md` gains a 3-line
  "M4 Batch 1" note from observed output. Commit: `docs(qa): M4 batch 1 certification`

## ⛔ SWITCH MODEL — Batch 1 executor done permanently.

---

## BATCH 2 — Perceptual demo (Gemini 3.1 Pro @ HIGH, ~45 min)

### T5 — Generate the variant-B ambient underlays
- Generate THREE dark ambient-art webp files (one per page), same family as the existing
  `site/public/images/knowme-bg.webp` (22 KB) but in the site's graphite/orange palette —
  tones from `site/src/lib/token-hex.ts` ONLY (no new hexes; guards will catch violations).
  Method is your choice (node + sharp/canvas script is fine); keep each file ≤80 KB; save as
  `site/public/images/ambient-prospect.webp`, `ambient-travel-planner.webp`, `ambient-projects.webp`.
  **No stock images, no photos** (CLAUDE.md donor rule §3; the purged /test/ photo does NOT return).
- **Done:** 3 files exist (`ls` pasted, N19); build green.
  Commit: `feat(assets): ambient underlay candidates for L0 (variant B)`

### T6 — Variant demo + knowme first-load proof → evidence for the STOP
- **Variant A captures (committed state):** serve `:4173`, screenshot all 3 pages at p0 →
  `docs/qa/m4/<page>-L0-paper.png`.
- **Variant B captures:** edit the 3 mounts to `<PageBackground image="/images/ambient-<page>.webp" />`,
  rebuild, serve, screenshot → `docs/qa/m4/<page>-L0-ambient.png`. Then **revert the 3 page files**
  (`git checkout -- site/src/app/{prospect,travel-planner,projects}/page.tsx`) — the variant choice
  is Sid's, applied in Batch 3. Only the screenshots and the webp assets stay.
- **Knowme first-load series (N20):** fresh browser context against `:4173` with network throttled
  (~2 Mbps via CDP or devtools), hard-load `/knowme/`, capture at ~0s / 2s / 5s / post-swap →
  `docs/qa/m4/knowme-firstload-{0,2,5,swap}.png`. The series must show: fallback card visible from
  first paint, NO white/washed region, crossfade to the 3D card. Then one warm-reload capture.
- **Done:** all paths exist (`ls docs/qa/m4/` pasted). Commit: `docs(qa): M4 variant demo + knowme first-load evidence`

## ⛔ STOP M4-A — Sid judges (do not pass without explicit yes)

Present, per N19 with real paths or "none produced":

| Item | Status | Proof |
|---|---|---|
| T1 D-table fix | | grep output |
| T2 L0 restored (variant A live) | | 3 screenshot paths |
| T3 lanyard first-frame gate | | check method + playwright 36/36 |
| T4 cert 1× | | suite summary |
| T5 ambient assets | | ls output |
| T6 A-vs-B demo + knowme series | | docs/qa/m4/ listing |
| L0 variant pick (per page) | SID'S CALL | A (paper) / B (ambient) |
| /knowme re-judge | SID'S CALL | see ritual |

**Sid's ritual (N20 — prod build, not dev):** `cd site && npm run build && node scripts/serve-out.mjs`
→ `http://localhost:4173/` — visit all 3 big pages (L0 present, full-bleed, text readable), compare
the A/B screenshot pairs, then hard-load `/knowme/` (devtools → Network → Slow 4G to feel the cold
path): fallback card must be there immediately, crossfade in, then drag the card, nav away and back.
**Accept + variant pick** ⇒ Batch 3 with Claude. **Reject** ⇒ full stop; the fix is re-planned with
Claude — never improvised by an executor.

## ⛔ SWITCH MODEL — executor work ends here permanently.

---

## BATCH 3 — Apply pick + launch runbook (Sid+Claude ONLY)

### T7 — Apply Sid's variant pick + close the decision log
- Apply the picked variant per page (one-line `image` prop each, or nothing if A everywhere);
  delete any ambient webp that lost (no orphan assets). Append D76 (variant pick, per page) and —
  if numbers moved — the lighthouse observation to DESIGN.md §6. Full suite 1× green.
  Commit: `feat(layers): apply Sid's L0 underlay pick (D76)`
### T8 — Quiet-machine lighthouse (m3plan T5 verbatim; precondition for the snapshot)
- Sid closes Chromium/dev servers ~10 min; `node scripts/lighthouse-gate.mjs`: home ≥55, cases ≥72.
  Red on a quiet machine = real; STOP and diagnose with Claude before any snapshot.
### T9 — Public snapshot + privacy verification (m2plan T8 / m3plan T6 verbatim)
- `git archive HEAD site/ .github/ README.md | tar -x -C <fresh temp dir>` → `git init` → single
  commit `Initial release`. Claude pastes every line: top level exactly `site/ .github/ README.md`;
  m2plan §6 privacy grep → zero hits; no `site/public/test`; resume PDF opens; exactly 1 commit.
### T10 — Sid pushes + Pages settings (m3plan T7 verbatim)
- From the snapshot dir ONLY: `git push https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git HEAD:main`
- Settings → Pages: source = GitHub Actions; Enforce HTTPS. Watch the first Actions run.
  Red → rerun once; red twice → STOP, Sid decides (N18).
### T11 — Post-deploy verification (D6–D8, m3plan T8 verbatim)
- 6 routes 200 live; resume downloads + opens; OG meta home + knowme; D6 LinkedIn by Sid's browser;
  D7 profile website field + pinned repos per D65; D8 nightly cron (`30 22 * * *` UTC) green next morning.
### T12 — Docs close + knowledge base
- `docs/qa/qa-report.md` + `docs/LAUNCH-CHECKLIST.md`: final dated exit state +
  **"Live and verified. Lint zero. Playwright 36/36."** Claude updates project memory same day.

---

## BATCH P — Post-launch asset drop (BLOCKED until Sid's D2/D3 drop; m2plan Batch P verbatim)

P1: D2 screenshots → `site/public/screenshots/`, D3 tiles → `site/public/tiles/`, AVIF/WebP
pipeline, N16 lighthouse before case-page commits, taste STOP for Sid.
P2: D70 release flow — certify private tree → `git archive` sync onto a public-repo checkout →
m2plan §6 privacy grep (every public commit, forever) → normal commit → **Sid pushes**.

## 6. Gates, proof, context, commit protocol

m0plan §7/§8/§10/§11, m1plan N14–N16, m2plan §5–§6, m3plan N19 apply verbatim; N20 above.
Statuses: verified / failed / not-run. Playwright floor 36/36. Lighthouse floors 55/72 —
case <72 after the L0 restore is a STOP with pasted numbers, never a threshold edit.

## 7. KICKOFF PROMPTS

**Batch 1 — DeepSeek v4 Flash @ MAX:**
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13),
m1plan.md §2 (N14–N16), m2plan.md §2 (N17–N18), m3plan.md §3 (N19), then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m4plan.md.
Execute Batch 1 (T1–T4) strictly in order. Non-negotiables: edit only files named in the current
task; T2 restores PageBackground.tsx from git history VERBATIM (no edits inside it); T3 must keep
the server/hydration render of LanyardLoader byte-identical to today (React #418 regression =
instant STOP); re-grep every anchor before editing; every claimed proof states a real path with
pasted ls output or says "no evidence produced" (N19); all visual evidence from the served prod
build on :4173, never the dev server (N20); build green before every commit; one task = one commit;
no attribution trailers; NEVER push; any case-page lighthouse <72 = STOP with the number, no
retries, no threshold edits (N18). If a fix isn't clean in ONE attempt, STOP and report. STOP
COMPLETELY at ⛔ SWITCH MODEL after T4 and wait. Address the user as Sid.
```

**Batch 2 — Gemini 3.1 Pro @ HIGH:**
```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13),
m1plan.md §2 (N14–N16), m2plan.md §2 (N17–N18), m3plan.md §3 (N19), then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m4plan.md.
Execute Batch 2 (T5–T6) strictly in order. Non-negotiables: ambient art uses ONLY hexes from
site/src/lib/token-hex.ts; no stock images, no photos; keep each webp ≤80 KB; the variant-B page
edits are TEMPORARY for captures and must be reverted before your final commit — the variant choice
is Sid's; all screenshots from the served prod build on :4173 (N20); every claimed proof states a
real path with pasted ls output (N19); build green before every commit; one task = one commit; no
attribution trailers; NEVER push. STOP COMPLETELY at ⛔ STOP M4-A, post the completeness table, and
wait — Batch 3 is not executor work under any circumstances. Address the user as Sid.
```

## 8. Confidence: 9.2/10 — frozen

Grounded: STOP M3-A claims all independently verified (playwright re-run 36/36 on a fresh build);
both defects reproduced/root-caused today — the wash localized to the lanyard canvas layer (its
left edge sits exactly at the wrapper's 18% translate) and shown NOT to reproduce on the prod
build, which instead shows the empty-card window the same fix closes; the L0 regression traced
commit-by-commit (43aed32 → 24e5143 → 497b338) with the component recovered and its default asset
confirmed present. Residual risks: (1) restoring a third WebGL layer may drop case perf below 72 —
covered by the §4 tripwire (Sid decides, D49 on the table); (2) Sid may reject both underlay
variants — by design, taste loop returns to Claude, cost is schedule only; (3) the first-frame
signal rides R3F suspense semantics — if the ready callback misfires, the symptom is a visible
fallback that never swaps, which T3's done-check and T6's capture series would catch immediately.

**SCOPE FREEZE: 2026-07-12.** M4.1–M4.4 frozen. Executors may not add, merge, reorder, or
reinterpret tasks; STOPs are accept/reject only.
