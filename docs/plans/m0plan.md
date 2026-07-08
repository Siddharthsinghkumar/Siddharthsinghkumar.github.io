# M0 Plan — Phase 5 Launch Execution (2026-07-08)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m0plan.md`
> Executors: **DeepSeek v4 Flash @ MAX** (mechanical batches 1–4, 7) and
> **Gemini 3.1 Pro @ HIGH** (perceptual batches 5–6). Sid switches models at every
> **⛔ SWITCH MODEL** marker himself. An executor must NEVER continue past one.
> Companion docs: [`phase5-roadmap.md`](phase5-roadmap.md), [`phase5-todolist.md`](phase5-todolist.md).

---

## 0. Cold-start reading list (read in this exact order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/AGENTS.md` — knowledge graph. **Known defect:** its rule 7 says "Deploy via Coolify" — that is stale; CLAUDE.md's GitHub Pages constraint wins (fixed by T4 below).
3. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — **"This is NOT the Next.js you know."** Before touching ANY Next.js API (`<Link>` in T15, metadata in T20, page files), read the relevant guide in `site/node_modules/next/dist/docs/` — this Next version has breaking changes vs your training data. Heed deprecation notices.
4. **This plan, top to bottom.** The N-rules table (§3) and frozen verdicts (§4) are the operative guardrails — they distill `docs/learned.md`; consult that file only if a rule here seems ambiguous, and it wins.
5. Per-task: ONLY the files named in the task block. Do NOT read `reference-website-*.md`, `ui-component-*.md`, `references_research_paper/`, or any file not named in your current batch. They are not needed and burn context.

`DESIGN.md` and `COPY.md` are consulted per-task where a task names them. Tokens come from `site/src/app/globals.css`; copy comes from `COPY.md` — never invented.

## 1. Mission & definition of DONE

Get the portfolio to a launch-ready state where **Sid pushes** to
`Siddharthsinghkumar/Siddharthsinghkumar.github.io`. The site's goal (Sid, 2026-07-08):

> **"It's a portfolio — its goal is to be memorable enough to revisit, not fast or
> professional. It needs to define me."**

DONE means ALL of:
1. Full gate suite (§7) green **3× consecutively** in Batch 7.
2. Every A, B, C, E item from `phase5-todolist.md` closed with evidence.
3. Sid said **yes** at STOP 1 (visual), STOP 2 (only fires if perf red), and the FINAL STOP. Silence ≠ yes (N8).
4. `git status` clean, decision rows D60–D66 appended to `DESIGN.md` §6, **nothing pushed**.

DONE is NOT: pushing (Sid only, M9), the D1–D8 manual asset/account items (Sid only, M7/M9), ripple-donor evaluation, GridMotion, merlin-cli-bridge publication, authored .glb swap — all v2 parking lot.

## 2. THE WANT LIST (Sid's words, frozen 2026-07-08)

- **Memorable enough to revisit** — distinctiveness beats polish; "not fast or professional" is the explicit ranking.
- **The site must define Sid** — real projects, verified claims, his taste.
- Confident, specific, never desperate tone (CLAUDE.md).
- The 3s link auto-pulse **stays** — the site stays alive at rest (M0.2 verdict).
- Travel-planner atmosphere **plainly visible** — the flagship case page must land its mood (A7).
- Launch with clean history — this repo stays the private working copy (M0.4).

## 3. THE DON'T-WANT LIST (binding; violating one = rejected work even with green gates)

| # | Rule |
|---|---|
| N1 | **No imperceptible effects.** Spec numbers are floors. If it cannot be plainly SEEN, it is NOT done — make it visible or STOP. Never ship invisible work as complete. |
| N2 | **No layout/content changes** beyond the tasks named here. No copy rewrites, no section reordering, no new pages. |
| N3 | **No new dependencies.** `npm install` of anything new is forbidden. If a dep seems unavoidable: STOP and ask. |
| N4 | No phone number anywhere. No education section. No stock images. No invented copy — words come from COPY.md or a task block below. |
| N5 | No status-label upgrades (RESEARCH stays RESEARCH). No invented metrics about Sid. |
| N6 | No attribution trailers in commits (no Co-Authored-By, no "Generated with", no AI mentions). **Never push.** |
| N7 | Never edit gate scripts or thresholds beyond the three edits Sid approved in §4 (M0.6). Anything further needs his written approval pasted in the STOP thread. |
| N8 | Never continue past a ⛔ STOP or ⛔ SWITCH MODEL without Sid's explicit yes. Silence ≠ yes. |
| N9 | No fake/stalling progress indicators. Loaders track real signals, min 1000ms, max 10s failsafe. |
| N10 | Don't relitigate decided items: graphite `#0B0B0D` bg, AMPED 240ms glitch, `AUTO_INTERVAL` 3000ms, dark-only, borders-over-shadows — and now the §4 verdicts. |
| N11 | `useRef<T>(null)` — never bare `useRef<T>()`. Fonts via `next/font` only. WebGL needs error boundary + static fallback + tab-hidden pause. `prefers-reduced-motion` disables animation, content stays visible. |
| **N12** | **Never trade a visible, distinctive effect away for performance without Sid's explicit verdict.** Memorability outranks perf (Want list). Perf reds go to a STOP, not to effect-deletion. |
| **N13** | **Touch only the files named in your current task block.** Read-only greps are fine anywhere in `site/`; edits outside named files = rejected work. |

## 4. FROZEN VERDICTS — Sid answered these 2026-07-08. Do not reopen (N10).

| # | Decision | Sid's verdict |
|---|---|---|
| M0.1 | Nav ripple | **(a) REMOVE for launch.** Donor evaluation → v2 parking lot. Kills the idle-rAF violation. → T12 |
| M0.2 | D54 3s auto-pulse | **KEEP.** "Memorable, not professional." Zero code change; do not touch `link-pulse` anything. |
| M0.3 | Case-page ambient diet (D37) | **Deferred to STOP 1** — decided after A7 makes the scene visible. → T22 |
| M0.4 | Push privacy strategy | **(a) fresh-history single-commit push, MINIMAL tree:** the public repo contains `site/` + `.github/` + a README only. All planning docs, QA history, and research stay in this private working repo. Sid executes at M9. |
| M0.5 | Dead GitHub repo links | **Re-point to the correct, live repos:** `https://github.com/Siddharthsinghkumar/firefighting-robot-public` (HTTP 200, 3★) and `https://github.com/Siddharthsinghkumar/mtk-firmware-unlock-root` (HTTP 200, 8★) — both verified 2026-07-08. → T13, T14 |
| M0.6 | Gate-script edits (N7) | **APPROVED, all three** — Sid's written approval, 2026-07-08: A2 guards hex (via token-hex centralization, §T10), A3 link check against `out/`, A8 visual-gate `/about`→`/knowme`. Thresholds untouched. |
| M0.7 | Playwright stability | **Pin `workers: 2`** in config. Smoke budget stays 15s. → T11 |
| M0.8 | Asset ETA (D1–D5) | **Later — don't block on Sid.** Batches 1–6 proceed now; Gemini converts the interim `/test/` images in T23; Batch 7 stays BLOCKED until Sid's drop. Nothing pushes regardless. |
| M0.9 | Nav press feedback after ripple removal | **Add a CSS-only press effect now** (grilled 2026-07-08): token-colored `:active` scale/glow on nav links, no WebGL, no rAF, judged by Sid at STOP 1. → T12b |
| M0.10 | Perf floor pre-authorization | **≥70 pre-authorized** (grilled 2026-07-08): if honest optimization lands case pages 70–74 across 3 runs, ship it — T24 lowers the lighthouse-gate case min to the achieved floor (never below 70) with this row as Sid's written N7 approval. Below 70 → STOP 2 fires. Home ≥55 and CLS ≤0.05 unchanged. |

## 5. Execution order

```
BATCH 1 (DeepSeek, plumbing)  → BATCH 2 (DeepSeek, gates/tests) → BATCH 3 (DeepSeek, correctness)
→ BATCH 4 (DeepSeek, docs)    → ⛔ SWITCH → BATCH 5 (Gemini, design diet) → ⛔ STOP 1 (Sid's eyes)
→ BATCH 6 (Gemini, perf)      → (⛔ STOP 2 only if perf red) → ⛔ SWITCH
→ BATCH 7 (DeepSeek, certification — BLOCKED until Sid's M7 asset drop, per M0.8) → ⛔ FINAL STOP → M9 (Sid pushes)
```

Strictly in T-number order within a batch. Never start a task from another batch. Batches 1–6 run now; the pipeline then parks until Sid's assets land — nothing pushes in the meantime.

---

## BATCH 1 — Tree & plumbing (DeepSeek v4 Flash @ MAX, ~30 min)

### T1 — Commit the verified IntroScreen fix (B4)
- **File:** `site/src/components/IntroScreen.tsx` (uncommitted working-tree diff: dismiss immediately when `document.readyState === "complete"`). Already probe-verified: overlay dismisses ~4s, zero console errors. Do NOT re-edit it.
- **Do:** `cd /home/sidd/project/freelance/portfolio-website/site && npm run build` (must exit 0), then commit exactly this one file.
- **Commit:** `fix(intro): dismiss overlay when document already complete`
- **Done:** `git status --short` no longer lists IntroScreen.tsx. Paste `git log --oneline -1`.

### T2 — Commit sweep artifacts + append decision rows D60–D66
- **Files:** `docs/LAUNCH-CHECKLIST.md`, `docs/qa/t10/*.png` (9 modified), `docs/plans/phase5-roadmap.md`, `docs/plans/phase5-todolist.md`, `docs/plans/m0plan.md` (this file), and `DESIGN.md` (append to §6 decision log, after D59):

```
| D60 | 2026-07-08 | Site goal reweighted: memorable-enough-to-revisit > fast/professional; the site must define Sid | Sid's explicit ranking; taste calls resolve toward distinctiveness, perf thresholds stay Sid-owned |
| D61 | 2026-07-08 | M0.1: NavRipple REMOVED for launch; donor evaluation → v2 parking lot. Narrows D53 to launch scope | Idle-rAF violation + not liquid glass; replacement puts a taste loop on the critical path |
| D62 | 2026-07-08 | M0.3: case-page ambient diet — PENDING, decided at Phase 5 STOP 1 after A7 fix | Can't judge the diet while the travel-planner scene is invisible (Gemini fills this row at STOP 1) |
| D63 | 2026-07-08 | M0.2: D54 3s link auto-pulse UPHELD (keep) | Recurring motion is the point — memorability doctrine (D60) |
| D64 | 2026-07-08 | M0.4: launch via fresh-history single-commit push; this repo remains the private working copy | Tracked history contains personal photos + phone number; a github.io repo is public forever |
| D65 | 2026-07-08 | M0.5: project links re-pointed to firefighting-robot-public (3★) and mtk-firmware-unlock-root (8★) | Old repo names 404 publicly; new URLs verified HTTP 200 on 2026-07-08 |
| D66 | 2026-07-08 | M0.6/M0.7: gate-script edits approved — A2 token-hex centralization + allowlist, A3 out/ existence check, A8 visual-gate /knowme; Playwright workers pinned to 2 | Each edit makes a gate measure reality; thresholds unchanged (N7) |
| D67 | 2026-07-08 | M0.9: CSS-only token press effect on nav links replaces the ripple's press feedback; judged at STOP 1 | Nav shouldn't feel dead on press after ripple removal; zero guardrail risk (no WebGL/rAF) |
| D68 | 2026-07-08 | M0.10: case-page perf ship-floor pre-authorized at ≥70 after honest optimization (written N7 approval; actual numbers appended at T24 if invoked) | Memorability doctrine (D49/D60): "can't be forgettable" > raw perf; below 70 still STOPs |
```
  (Four columns — `| D# | date | decision | reasoning |` — matching D58/D59 at DESIGN.md lines 236–237. Before appending, `grep -n "| D59" DESIGN.md` to find §6's end.)
- **Commit:** `docs: phase5 sweep artifacts, m0 plan, decision log D60-D68`
- **Done:** `git status --short` shows none of the above files. Paste it.

### T3 — Move workflows to repo root (C2)
- **Do:** `git mv site/.github .github` from repo root. The workflow's own paths (`working-directory: site`) already assume repo root — verify by reading `.github/workflows/deploy.yml` after the move; change nothing inside it.
- **Commit:** `chore(ci): move workflows to repo root so Actions can run them`
- **Done:** `ls .github/workflows/` shows `deploy.yml`; `ls site/.github 2>&1` errors. Paste both.

### T4 — Delete the Coolify doc; fix AGENTS.md deploy rule (C4)
- **Files:** `howtodeploy.md` (delete via `git rm`), `AGENTS.md` (rule 7 "Deploy via Coolify (self-hosted), not Vercel — see `howtodeploy.md`" → `Deploy via GitHub Pages static export (CLAUDE.md hard constraint); Sid pushes, nightly cron redeploys.`; also delete the `howtodeploy.md` row from its knowledge-graph table).
- **Commit:** `docs: GitHub Pages is the deploy target — remove Coolify doc`
- **Done:** `ls howtodeploy.md 2>&1` errors; `grep -in coolify AGENTS.md` returns nothing. Paste both.

### T5 — Configure the git remote, no push (C1)
- **Do:** `git remote add origin https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git`. Do NOT rename `master`; Sid maps `master`→`main` himself at M9 (N6: never push).
- **Done:** paste `git remote -v`. No commit (config only).

**Batch 1 gate state:** `build` ✅ `tsc` ✅ — lint/guards/playwright/lighthouse/visual still red; that is EXPECTED, they fall in Batches 2–6. Do not fix forward.

---

## BATCH 2 — Test & gate truth (DeepSeek v4 Flash @ MAX, ~1–2 h; M0.6 approval in §4)

### T6 — Smoke tests: `/about` → `/knowme` (A4)
- **File:** `site/tests/smoke.spec.ts`. Anchors (verified 2026-07-08; **re-grep before editing** — all line numbers in this plan drift): line 11 `{ path: "/about", h1: /About/i }` → `{ path: "/knowme", h1: /Know Me/i }`; line 95 route list `"/about"` → `"/knowme"`. The real H1 is literally `Know Me` (`site/src/app/knowme/KnowMeClient.tsx:37`, verified 2026-07-08) — the regex matches it. These are the only two `about` refs in `site/tests/` (verified by grep).
- **Done:** `npx playwright test tests/smoke.spec.ts` — the two former `/about` failures green.

### T7 — a11y suite scans all pages (B3)
- **File:** `site/tests/a11y.spec.ts` line 7: add `"/projects"` and `"/knowme"` to the path array.
- **Done:** `npx playwright test tests/a11y.spec.ts` green on all 6 entries.

### T8 — Visual gate scans `/knowme`, not the dead `/about` (A8 — approved, D66)
- **File:** `site/scripts/visual-gate.mjs` line 138: URL `/about` → `/knowme`, label `about-p0` → `knowme-p0`. Thresholds (`minScene: 10, minOrange: 1.5`) UNCHANGED. The gate writes its screenshots to `docs/qa/t10/` (outDir at line 13) — after a green run produces `knowme-p0.png`, `git rm docs/qa/t10/about-p0.png` (stale artifact of the dead route) in the same commit.
- **Done:** `node scripts/visual-gate.mjs` output shows a `knowme-p0` row with real (non-404) numbers. Paste the row.

### T9 — Guards link check validates against `out/` (A3 — approved, D66)
- **File:** `site/scripts/guards.mjs` only. The link check is section 7 "F15 Link-integrity" (lines ~116–151, verified 2026-07-08): it regexes every `href="…"` out of built HTML (line 128) and fails anything that isn't a known page (line 145) — which wrongly flags the `<link rel="preload">` hrefs for `/placeholders/*.svg`, files that DO exist in `out/placeholders/`. Extend it: before failing a non-page href, pass it when the corresponding file exists in `out/`. No threshold changes.
- **Done:** `npm run guards` — zero dead-link violations; the check still fails on a genuinely missing file (prove it: temporarily reference `/placeholders/nope.svg` in a scratch check or reason from the code path, then revert).

### T10 — Kill the 17 rogue-hex violations via token-hex centralization (A2 — approved, D66)
- **Files:** create `site/src/lib/token-hex.ts` exporting named hex constants (values copied from `site/src/app/globals.css` tokens); import them in `site/src/app/knowme/KnowMeClient.tsx` (data-URI SVG card faces), `site/src/components/PageBackground.tsx` (~lines 54–55), `site/src/components/KnowMeBackground.tsx` (~lines 24–26); then add `token-hex.ts` to `allowedHexFiles` in `site/scripts/guards.mjs` (line ~67: currently `["globals.css", "layout.tsx"]`).
- **Why this shape:** the guard stays strict — ONE allowlisted source file, not three component files.
- **Done:** `npm run guards` exit 0; `npm run build` green; pages render identically (data-URI SVGs still valid — URL-encode `#` inside data URIs as `%23` where required).

### T11 — Pin Playwright workers (A9, verdict M0.7)
- **File:** `site/playwright.config.ts` — add `workers: 2` at config top level (no `workers` key exists today). Do NOT raise the 15s smoke budget; if the suite is still flaky at `workers: 2` across 3 local runs, STOP and report — budget changes are Sid's.
- **Done:** `npx playwright test` — only the `/projects` console-404 failures remain (they fall in T14).
- **Commit (whole batch, one commit per task as they complete):** subjects `test: smoke+a11y cover /knowme and /projects`, `chore(gates): visual-gate scans /knowme`, `chore(gates): link check validates against out/`, `refactor: centralize token hexes for guards`, `test: pin playwright workers to 2`.

**Batch 2 gate state:** build/tsc/guards ✅; playwright red ONLY on `/projects` console-404s; lint still red (T15); lighthouse/visual still red (Gemini). EXPECTED.

---

## BATCH 3 — Code correctness (DeepSeek v4 Flash @ MAX, ~2–4 h)

### T12 — Remove NavRipple (M0.1 verdict, D61) — DO THIS BEFORE T15
- **Files:** `site/src/components/Nav.tsx` — the full ripple wiring, verified 2026-07-08: line 8 import; lines 24–25 `ripples` state + `ripplesRef`; lines 28–32 `emitRipple` callback; lines 40–41 reset; lines 60/66 the decrypt-time `emitRipple(0.5)` call + effect dep; lines 68–83 the click-interception effect (exists ONLY to add press ripple — remove whole effect); line 91 `<NavRipple ripples={ripples} />` mount. `grep -in ripple site/src/components/Nav.tsx` must end empty. Delete `site/src/components/NavRipple.tsx` via `git rm`.
- **DO NOT TOUCH** anything matching `link-pulse` — that is D54/D63 and it stays.
- **Done:** `grep -rin navripple site/src` empty; build green; nav still has rest/hover/active/focus-visible states (read the Nav styles to confirm nothing else depended on ripple state). This also deletes NavRipple's lint errors before T15 counts them.
- **Commit:** `feat(nav): remove NavRipple for launch (D61)`

### T12b — CSS press effect on nav links (M0.9 verdict, D67)
- **Files:** `site/src/components/Nav.tsx` (the nav link elements) and/or `site/src/app/globals.css` — whichever gives the smaller diff.
- **Spec:** on `:active` of each nav link (wordmark included): `transform: scale(0.97)` with a ~120ms transition PLUS a brief glow/underline flash in Signal Orange using the existing CSS token (var from `globals.css` — NO new hex, N-rule/guards). CSS only: no WebGL, no canvas, no rAF, no JS state. `focus-visible` styles unchanged. Under `prefers-reduced-motion`: no transform/transition — an instant color state change only (N11).
- **N1 applies:** the press must be plainly FELT at normal click speed — if 0.97/120ms reads as nothing, increase amplitude until visible and note final values in the commit body. Sid judges it at STOP 1.
- **Done:** build green; short screen recording or before/after screenshots of a nav press saved to `docs/qa/phase5/` (`mkdir -p` it — Batch 5 also uses it). Commit: `feat(nav): token press effect on nav links (D67)`

### T13 — Fix the homepage timeline link (B1)
- **File:** `site/src/app/page.tsx` line ~211: the "Lead Developer, Autonomous Firefighting Robot" `TimelineEntry` href `https://github.com/Siddharthsinghkumar/ai-travel-planner-agent` → `https://github.com/Siddharthsinghkumar/firefighting-robot-public` (M0.5, D65).
- **Done:** `grep -n "firefighting-robot-public" site/src/app/page.tsx` shows the timeline entry. Commit: `fix(home): firefighting-robot timeline links to its real repo`

### T14 — Re-point project cards at the live repos; delete the dead snapshot (B2, D65)
- **Ground truth (verified 2026-07-08):** the GitHub-stats fallback is NOT the JSON file — it's the `fallbackStars`/`fallbackPush` props passed inline in `projects/page.tsx` to `GitHubStats` (via `ProjectCard`). `site/src/data/projects-snapshot.json` has ZERO importers anywhere in `site/` — it is dead code shipping stale claims (2★ vs the real 3★).
- **Files:** `site/src/app/projects/page.tsx` — firefighting card (lines ~42–50): `href`/`repo` → `firefighting-robot-public`, `fallbackStars={2}` → `{3}`; mtk card (lines ~51–59): `href`/`repo` → `mtk-firmware-unlock-root`, `fallbackStars={8}` stays (matches API). Re-check both counts at execution time: `curl -s https://api.github.com/repos/Siddharthsinghkumar/<repo> | grep stargazers`. Then `git rm site/src/data/projects-snapshot.json` (dead code).
- Then `grep -rn "autonomous-firefighting-robot\|mtk-firmware-unlock\|projects-snapshot" site/ --include="*.ts*" --include="*.mjs" --include="*.json" | grep -v unlock-root` — must be empty.
- **Done:** `npx playwright test` — `/projects` console-404 failures green; card stars match the API. Commit: `fix(projects): point cards at live repos, drop dead snapshot`

### T15 — Lint burn-down to zero (A1)
- **Files:** exactly the components ESLint flags — run `npm run lint` first and work from its output. Expected areas (NavRipple already gone via T12): setState-in-effect / refs-during-render in `IntroScreen`, `IntroScreenGate`, `Nav`, `PageBackground`, `ChoreoReveal`, `Eyebrow`, `GridBackdrop`, `LanyardLoader`, `ProspectDiagram`, `EngineCanvas`; the `no-explicit-any` cluster in `Lanyard.tsx` (type the donor code with real three/rapier types — no `any`-laundering via `unknown as`); `@ts-ignore` → `@ts-expect-error` ×2; `Nav.tsx` line ~101 `<a href="/">` → next/link `<Link>` — this is the WORDMARK link wrapping `DecryptedText`; the decrypt-on-view behavior must survive the swap, and this Next version has breaking changes (§0.3: read the Link guide in `site/node_modules/next/dist/docs/` first).
- **Rules:** real fixes only. NO eslint-config edits (Sid's written OK required — he has NOT given it). Behavior must not change: after the hook-pattern fixes run `npm run build && npx playwright test && node scripts/visual-gate.mjs` and compare — if a fix would change animation behavior, STOP and report instead.
- **Done:** `npm run lint` exit 0. Commit per logical group, e.g. `fix(lint): hook patterns in intro/nav/backdrop`, `fix(lint): type Lanyard donor code`.

**Batch 3 gate state:** build/tsc/lint/guards/playwright ALL ✅. lighthouse + visual still red (Gemini's batches). EXPECTED.

---

## BATCH 4 — Docs truth (DeepSeek v4 Flash @ MAX, ~1 h)

One commit per task; `npm run build` before each commit. E5 (qa-report) is NOT here — it regenerates from Batch 7's real gate output.

### T16 (E1) — `docs/LAUNCH-CHECKLIST.md`: `grep -n "/about"` (6 stale refs at sweep time; re-grep, the file changed since) → `/knowme`; page list reads `/knowme`.
### T17 (E2) — `site/TESTING.md`: "only 4 pages ship" / "all 4 pages" / "perf ≥ 90 on all 3 real pages" → 6 pages, real thresholds (home ≥55, case ≥75), current guard list (read `scripts/guards.mjs` to enumerate).
### T18 (E3) — `site/README.md`: page list "About" → Know Me (line ~5); test count "32" → the real number from `npx playwright test --list 2>/dev/null | tail -1` (line ~11); AND lines ~31–32's card-photo instructions still point at `src/app/about/page.tsx` — the SVG data-URI now lives in `src/app/knowme/KnowMeClient.tsx` (verified 2026-07-08).
### T19 (E4) — `DESIGN.md` §5 (line ~163): "on all 4 pages" → "on all 6 pages".
### T20 (E6) — OG rename `about`→`knowme` end-to-end. **Ground truth (verified 2026-07-08):** the card title lives INSIDE the SVG artwork — `generate-og.mjs` only checks SVG existence and converts SVG→PNG via `@resvg/resvg-js` (installed, `^2.6.2`); there is no title map in any script. Steps: (1) `git mv site/public/og/about.svg site/public/og/knowme.svg`, then edit the SVG's text content `About` → `Know Me` (keep fonts/layout untouched); (2) `generate-og.mjs` line 13 pages array `"about"` → `"knowme"`; (3) `site/src/app/knowme/page.tsx` line 11 `/og/about.png` → `/og/knowme.png`; (4) `node scripts/generate-og.mjs` regenerates `knowme.png`; (5) `git rm site/public/og/about.png`; (6) `grep -rn "og/about" site/` must be empty. Prove the rendered title: open/inspect `knowme.png` and paste the SVG title line.

**Done (batch):** `grep -rn "about" docs/LAUNCH-CHECKLIST.md site/TESTING.md site/README.md | grep -vi knowme` has no page-list hits; build green; full suite unchanged from Batch 3 state.

---

# ⛔ SWITCH MODEL — STOP HERE. Sid switches to Gemini 3.1 Pro @ HIGH. Do not continue in this session.

---

## BATCH 5 — Design diet & the flagship's atmosphere (Gemini 3.1 Pro @ HIGH, ~1–2 h)

This is perceptual work. N1 is the law: spec numbers are floors — if a human can't SEE it, it's not done. `mkdir -p /home/sidd/project/freelance/portfolio-website/docs/qa/phase5` first (it does not exist yet); your manual before/after screenshots go there, while the visual-gate's own screenshots land in `docs/qa/t10/`.

### T21 — Make the travel-planner scene plainly visible (A7)
- **Evidence:** visual-gate `travel-planner-p0` = 2.2% scene / 0.2% orange (floors: 10% / 1.5%). The Phase 4 restack commit `17194d4` is only a 4-line diff — it added `<PageBackground>` mounts to the prospect and travel-planner pages (verified 2026-07-08). So the burial lives in `site/src/components/PageBackground.tsx` itself (layer order, z-index, opacity, or its interplay with the page's existing ambient layers), not in a big page rewrite.
- **Investigate:** read `site/src/app/travel-planner/page.tsx` and `PageBackground.tsx` + the shader layers they mount (`PaperInkCanvas`/`PaperInkLoader` — follow the imports). Compare against `/prospect` (same mount, passes its gate) — the delta between the two pages is the lead.
- **Fix:** restore visibility — opacity/z-order/layer wiring, not new systems (N3). If the honest fix implies removing one ambient system, note it as input to T22 rather than deciding unilaterally.
- **Prove:** `node scripts/visual-gate.mjs` — travel-planner-p0 ≥10% / ≥1.5%; save before/after screenshots to `docs/qa/phase5/` (`travel-planner-before.png`, `travel-planner-after.png`). Numbers at the floor but visually weak = NOT done (N1) — make it plainly visible.
- **Commit:** `fix(travel-planner): restore buried atmosphere visibility (A7)`

### T22 — Prepare the ambient-diet decision (M0.3 → D62)
- **Question for Sid:** case pages run paper shader + PaperInk WebGL + the 3s pulse concurrently — D37 says one ambient system per page. Perf fell 76→56.
- **Do:** with A7 now visible, capture the current state (`/prospect`, `/travel-planner` screenshots at p0 to `docs/qa/phase5/`), and note lighthouse numbers per page (`node scripts/lighthouse-gate.mjs`, paste output). If cheap (<30 min), also capture each single-ambient variant via a temporary local toggle — REVERT any toggle before the STOP. Recommend one option with reasons, filtered through D60 (memorability first).
- **No commit** beyond T21's — this task produces the STOP presentation.

## ⛔ STOP 1 — Sid's eyes (do not pass without his explicit yes)

Present: (1) one line — "what changed since your last look"; (2) screenshots: hard-load `/`, `/prospect`, `/travel-planner`; nav press feel with the T12b CSS press effect (Sid judges it here — D67); travel-planner atmosphere; pulse alive per D63; (3) green-gate summary pasted; (4) the T22 ambient options + your recommendation; (5) the completeness table (§9 template). **Sid decides M0.3 here** → fill the D62 row in `DESIGN.md` §6, apply the verdict (remove the losing ambient system if he says so), commit as `feat(cases): ambient diet per D62`, re-run visual-gate + screenshots if anything changed.

## BATCH 6 — Performance, honestly (Gemini 3.1 Pro @ HIGH, ~2–4 h; after STOP 1 yes)

### T23 — Image + loading hygiene (A6)
- **Files:** `site/public/test/` images in use — exactly 5 refs, verified 2026-07-08: `travel-planner/page.tsx:27`, `prospect/page.tsx:61`, `projects/page.tsx:21` (all `final-df-h.jpg`), `PageBackground.tsx:53` default + `KnowMeBackground.tsx:23` (both `pic_idea.png`). Convert to AVIF/WebP properly sized per DESIGN.md §5 and re-point all 5 refs. Sid's finals land LATER (M0.8) — convert the interim images and flag re-check-after-D5 in your handoff notes; the conversion pipeline you use is the same one his finals will go through.
- Verify shader idle-mount behavior (`requestIdleCallback`, tab-hidden pause per D27) on case pages; verify the entry loader is not the LCP element on subpages (lighthouse LCP element audit — paste it).
- **Constraint (N12):** optimize loading, don't delete effects. Effect removal is Sid's call only.
- **Commit:** `perf(cases): AVIF/WebP images, idle-mount + LCP fixes (A6)`

### T24 — Re-run the perf gate
- `npm run build && node scripts/lighthouse-gate.mjs` ×3. Floors: case pages ≥75, home ≥55, CLS ≤0.05.
- **≥75 →** proceed to the SWITCH marker, no threshold edit.
- **70–74 on case pages across all 3 runs, after honest optimization (T23 fully done, all obvious wins taken) →** Sid PRE-AUTHORIZED this (D68, written N7 approval): edit `lighthouse-gate.mjs` case-page min from 75 to the achieved floor (never below 70), append the actual numbers to the D68 row in DESIGN.md §6, state old→new threshold + all 3 runs' scores in the commit body. Home ≥55 / CLS ≤0.05 are NOT covered — they stay untouched. Commit: `chore(gates): case perf floor per D68 pre-authorization`
- **<70 on any case page → ⛔ STOP 2:** paste all three runs and WAIT for Sid. Never lower anything below 70, ever.

---

# ⛔ SWITCH MODEL — STOP HERE. Sid switches back to DeepSeek v4 Flash @ MAX. Do not continue in this session.

---

## BATCH 7 — Certification (DeepSeek v4 Flash @ MAX, ~1 h)

**Precondition:** Sid delivers assets LATER (M0.8) — this batch is BLOCKED until he says his M7 drop landed (D1 resume PDF, D2 screenshots, D3 tiles, D4 card face, D5 final images swapped). At kickoff, verify it yourself: `file site/public/resume-siddharth-singh.pdf` must say PDF (not text) and `grep -rn "/test/" site/src` must be empty. If either fails, STOP and report — do not certify a placeholder tree.

### T25 — Full suite 3× consecutive
- Run the §7 gate block three times end-to-end, all green all three runs. Paste each run's summary lines.
### T26 — Tree hygiene
- `git status --short` empty; `grep -rn "TEMP\|FIXME" site/src` — every hit justified in one line or fixed.
### T27 (E5) — Regenerate `docs/qa/qa-report.md`
- From THIS run's actual gate output (dates, numbers, screenshots from `docs/qa/phase5/`). Never write results you didn't observe. Commit: `docs(qa): phase5 certification report`
### T28 — Completeness table
- All 31 items (A1–A9, B1–B4, C1–C4, D1–D8, E1–E6) with Built / Gate / Sid-verified columns (§9 template), plus rows for D67 (press effect — Sid judged at STOP 1) and D68 (only if T24 invoked it). D-items: mark per Sid's confirmation, never assume.
### T29 — Knowledge-base close-out
- `docs/LAUNCH-CHECKLIST.md` rows updated to reflect reality; confirm D60–D66 all present in DESIGN.md §6 (D62 filled); this plan file gets a final `## Exit state (date)` section appended. Commit: `docs: phase5 close-out`

## ⛔ FINAL STOP
Post: completeness table + `git log --oneline` since `5466250` + the sentence **"Ready pending your visual pass. Nothing pushed."** Then WAIT.

## M9 — Launch (Sid + Claude, NOT executors)
Fresh-history single-commit push per D64: the public repo gets the MINIMAL tree — `site/` + `.github/` + a README, nothing else (Sid's verdict 2026-07-08). Everything private stays here by construction: `local-resume-references.md` (phone number), `.commandcode/`, all `docs/`, plans, research. Within `site/`, verify `site/public/test/` is excluded and zero `/test/` refs remain in src after D5 (its 3 tracked files include the personal photo `photo_5_2025-06-03_22-31-35.jpg`, which nothing in src references). Then `master`→`main` mapping, Pages source = Actions, Enforce HTTPS, D6–D8 manual verifications.

---

## 7. THE GATE SUITE (run from `/home/sidd/project/freelance/portfolio-website/site`)

```bash
npm run build                       # exit 0, 6 routes
npx tsc --noEmit                    # exit 0
npm run lint                        # exit 0
npm run guards                      # exit 0  (JS budget: home ≤480KB gzip — threshold untouchable)
npx playwright test                 # all green (workers pinned to 2 by T11)
node scripts/lighthouse-gate.mjs    # case ≥75, home ≥55, CLS ≤0.05
node scripts/visual-gate.mjs        # every row ≥10% scene / ≥1.5% orange
```

Both gate scripts spawn their own server on `:4173` (as does Playwright's webServer) — never run your own server alongside; if a stray one lingers, `pkill -f serve-out` first. `npm run build` must precede the gates so `out/` is fresh. The ONLY approved gate-script edits are T8, T9, T10 (D66) and T24's conditional case-floor change (D68, never below 70). Everything else in these scripts, including every other threshold, is untouchable (N7).

## 8. Proof rules (no exceptions)

- Every claimed file/deletion: pasted `ls` / `git status --short` output.
- Every commit: pasted `git log --oneline -1`.
- Every gate claim: pasted final summary lines from the actual run.
- Visual work: screenshots saved to `/home/sidd/project/freelance/portfolio-website/docs/qa/phase5/` with the filenames given in the task — "gates green" is never proof of appearance.
- Spec numbers are FLOORS (N1). Spec-compliant-but-invisible = failed task.
- Statuses are: verified / failed / not-run. "Should work" is not a status.

## 9. STOP checkpoint template

```
WHAT CHANGED SINCE YOUR LAST LOOK: <one line>
GATES: build ✅/❌ tsc ✅/❌ lint ✅/❌ guards ✅/❌ playwright ✅/❌ lighthouse ✅/❌ visual ✅/❌  (paste summaries)
SCREENSHOTS: <paths in docs/qa/phase5/>
COMPLETENESS: | Item | Built | Gate | Sid-verified |  ← one row per A1–A9 B1–B4 C1–C4 D1–D8 E1–E6
BLOCKED/OPEN: <anything needing Sid>
Nothing pushed.
```

## 10. Context management rules (re-read THIS section + your current task when confused)

1. Execute strictly in T order inside your batch. Never start another batch's task.
2. Edit ONLY files named in the current task (N13). Read-only greps anywhere in the repo are fine.
3. **Re-grep every anchor before editing** — line numbers were verified 2026-07-08 and will drift as batches land.
4. Gate fails and the fix isn't obvious in ONE attempt → STOP and report. Never fix forward, never widen scope.
5. Tree contradicts this plan (file missing, anchor gone, unexpected diff) → STOP and report what you found.
6. Never continue past ⛔ markers (N8). Sid switches models himself.
7. Don't read reference/research files (§0.4). Don't re-decide §4 verdicts (N10).

## 11. Commit protocol

One task = one commit (T15 may split by logical group). `npm run build` green before EVERY commit. Subject style: `type(scope): what changed` as given per task. **No Co-Authored-By, no "Generated with", no AI/agent mentions (N6). NEVER push (Sid pushes at M9).**

---

## 12. KICKOFF PROMPTS (Sid: paste the block for the model you're starting)

### Kickoff A — DeepSeek v4 Flash @ MAX (Batches 1–4)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/AGENTS.md (its Coolify rule is stale; CLAUDE.md wins),
then the ENTIRE plan at /home/sidd/project/freelance/portfolio-website/docs/plans/m0plan.md.
Execute Batches 1–4 (tasks T1–T20, including T12b) strictly in order. Non-negotiables: edit only files named in the
current task; re-grep every anchor before editing; npm run build green before every commit; one task =
one commit, no attribution trailers, no AI mentions; NEVER push; never edit gate scripts except T8/T9/T10
exactly as specified; if a gate fails and the fix isn't obvious in one attempt, STOP and report; expected-red
gates per batch are listed in the plan — do not fix forward. STOP COMPLETELY at the ⛔ SWITCH MODEL marker
after T20 and post the batch report with pasted proof. Address the user as Sid.
```

### Kickoff B — Gemini 3.1 Pro @ HIGH (Batches 5–6)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/AGENTS.md (its Coolify rule is stale; CLAUDE.md wins),
then the ENTIRE plan at /home/sidd/project/freelance/portfolio-website/docs/plans/m0plan.md.
Execute Batches 5–6 (tasks T21–T24). This is perceptual work: N1 means spec numbers are floors — if a
human can't plainly SEE the travel-planner atmosphere, it is not done. Memorability outranks perf (D60):
optimize loading, never delete a visible effect — effect removal is Sid's call at STOP 1 only. Save all
screenshots to docs/qa/phase5/. Non-negotiables: edit only files named in the current task; build green
before every commit; no attribution trailers; NEVER push; the only threshold you may touch is T24's
pre-authorized case floor (D68, never below 70); STOP 1 after T22 and WAIT for Sid's explicit yes
(silence ≠ yes) — he decides the ambient diet there (fill D62) and judges the nav press effect (D67);
STOP 2 only if a case page lands below 70 after honest optimization. STOP COMPLETELY at the
⛔ SWITCH MODEL marker after T24. Address the user as Sid.
```

### Kickoff C — DeepSeek v4 Flash @ MAX (Batch 7)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m0plan.md. Execute Batch 7 (T25–T29).
Precondition: ask Sid to confirm his M7 assets landed; if any placeholder remains, STOP. Run the full gate
suite three consecutive times and paste every run's summary; regenerate docs/qa/qa-report.md ONLY from
output you actually observed; produce the 31-item completeness table; close out the docs. End at the
⛔ FINAL STOP with the table, git log --oneline since 5466250, and the sentence "Ready pending your visual
pass. Nothing pushed." Then WAIT. NEVER push. No attribution trailers. Address the user as Sid.
```

---

## 13. Confidence: **9.2/10** — and SCOPE FREEZE

Fully grilled 2026-07-08, two rounds. **Round 1 (self-grill against the tree)** killed two wrong assumptions — `projects-snapshot.json` is dead code with zero importers (T14 rewritten around the real `fallbackStars` props) and OG titles live inside the SVG artwork, not a script map (T20 rewritten) — and fixed the D-row format to §6's four columns, added the missing `site/AGENTS.md` Next.js-version warning to the reading list, caught the stale `about-p0.png` gate artifact (T8), README's third stale path (T18), and narrowed A7 to `PageBackground.tsx` (the restack commit is a 4-line diff). **Round 2 (Sid-grill)** froze M0.8 (assets later — Batch 7 blocked, nothing else waits), M0.4 refinement (minimal public tree), M0.9 (CSS press effect now → T12b/D67), M0.10 (case perf floor pre-authorized ≥70 → D68).

Residual risks: (1) A7 is narrowed but the perceptual fix still needs taste — one-attempt STOP rule covers it; (2) a case page could land below 70 → STOP 2, Sid decides; (3) typing `Lanyard.tsx` donor code without behavior change — post-fix visual-gate comparison in T15 covers it.

**SCOPE FREEZE (2026-07-08):** this plan is frozen after the grill. Executors may not add, merge, reorder, or reinterpret tasks at execution time; STOPs are accept/reject only. Anything new goes to the v2 parking lot or a new Sid-approved plan.
