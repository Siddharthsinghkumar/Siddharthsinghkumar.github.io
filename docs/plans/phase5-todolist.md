# Phase 5 Todolist — Pre-Push Launch Sweep (2026-07-08)

> Milestone plan for working these items: [`phase5-roadmap.md`](phase5-roadmap.md)
> (M0 Sid-decision gate first — 8 verdicts block all code work).

> Full signoff sweep run 2026-07-08 by Claude. Every gate was executed against the
> current tree (working tree = master @ 5466250 + uncommitted IntroScreen fix).
> **Verdict: NOT ready to push yet.** The CI pipeline itself would fail at 4 of its
> 7 gates today. Everything found is listed below with evidence. Nothing has been
> pushed; no code was changed during the sweep.

## Gate suite — actual results (2026-07-08)

| Gate | Result | Evidence |
|---|---|---|
| `next build` | ✅ pass | 6 routes, exit 0 |
| `tsc --noEmit` | ✅ pass | exit 0 |
| `npm run lint` | ❌ **52 errors** (+32 warnings) | exit 1 — CI blocks here first |
| `npm run guards` | ❌ **21 violations** | 17 rogue-hex + 4 placeholder "dead links" |
| `npx playwright test` | ❌ 9 failed (default), **4 failed at --workers=2** | 2× stale `/about`, 2× `/projects` console 404s |
| `lighthouse-gate` | ❌ prospect 56 & travel-planner 56 (min 75) | regression from T12's 76–77 |
| `visual-gate` | ❌ travel-planner scene 2.2% (min 10%), orange 0.2% (min 1.5%) | N1 violation: invisible |

---

## A. CI/gate blockers (pipeline fails before deploy)

- [ ] **A1 — Lint: 52 errors.** New react-hooks rules (setState-in-effect, refs-during-render)
  across `IntroScreen`, `IntroScreenGate`, `Nav`, `NavRipple`, `PageBackground`,
  `ChoreoReveal`, `Eyebrow`, `GridBackdrop`, `LanyardLoader`, `ProspectDiagram`,
  `EngineCanvas`; ~20 `no-explicit-any` in `Lanyard.tsx` (donor code); `@ts-ignore`→
  `@ts-expect-error` ×2; `<a href="/">` in `Nav.tsx:101` should be `<Link>`.
  Fix code properly — do NOT weaken eslint config without Sid's written OK.
- [ ] **A2 — Guards: 17 rogue-hex violations.** `src/app/knowme/KnowMeClient.tsx`
  (data-URI SVG card faces), `src/components/PageBackground.tsx:54-55`,
  `src/components/KnowMeBackground.tsx:24-26` (shader color props). Data-URI SVGs and
  shader props genuinely cannot read CSS vars. ⛔ Needs Sid's decision: extend
  `allowedHexFiles` in `scripts/guards.mjs` (gate-script edit = Sid approval per N7)
  vs. centralize token hex constants in one allowlisted file.
- [ ] **A3 — Guards: 4 "dead link" flags** for `/placeholders/*.svg`. The files DO exist
  in `out/placeholders/` — they're `<link rel="preload">` tags the guard's link check
  can't classify (it only knows pages). ⛔ Gate-script fix (check file existence in
  `out/`) needs Sid approval per N7.
- [ ] **A4 — Playwright: stale `/about` tests.** `tests/smoke.spec.ts:11` (`/about`,
  `/About/i` → `/knowme`, `/Know Me/i`) and `:95` (F15 route list). `/about` was
  deleted in D51; these two fail deterministically on both viewports.
- [ ] **A5 — Playwright: `/projects` console-error failures (real bug, see B2).**
  GitHub API 404s for two nonexistent repos surface as console errors; Chrome's
  message text omits the URL so the test's `api.github.com` filter doesn't catch it.
  Fix the root cause (B2), not the filter.
- [ ] **A6 — Lighthouse: case pages 56 vs min 75.** Regression caused by Phase 4:
  entry loader on subpages (≥1s content occlusion), PaperInk/paper shaders, and raw
  `/test/` images (`final-df-h.jpg` 143KB jpg, `pic_idea.png` 342KB png — DESIGN.md §5
  requires AVIF/WebP). Optimization first; threshold changes are Sid-only (N7).
- [ ] **A7 — Visual gate: travel-planner scene invisible.** 2.2% scene / 0.2% orange at
  p0 — the Phase 4 restack (17194d4) buried the atmosphere. N1: if you can't see it,
  it's not done. Needs investigation + fix + Sid's eyes.
- [ ] **A8 — Visual gate script scans dead `/about`.** Its "about-p0" numbers are
  byte-identical to 404-p0 (27.6%/2.3%) — it's been measuring the 404 page and passing
  by coincidence. ⛔ Gate-script edit (`/about`→`/knowme`) needs Sid approval per N7.
- [ ] **A9 — Playwright flaky at default parallelism.** 9 failures at 7 workers vs 4 at
  2 workers: subpage loader (MAX_WAIT 10s) + 15s test budget + WebGL contention.
  ⛔ Decide with Sid: pin `workers` in config, or raise smoke-test budget. CI runners
  (2-core) are slower than this machine.

## B. Product bugs (visitor-facing, would ship broken)

- [ ] **B1 — Wrong link on homepage timeline.** `src/app/page.tsx:211`: the
  "Lead Developer, Autonomous Firefighting Robot" entry links to
  `github.com/Siddharthsinghkumar/ai-travel-planner-agent`. Copy-paste bug.
- [ ] **B2 — Two project cards link to 404 GitHub repos.** Verified by HTTP today:
  `autonomous-firefighting-robot` → 404, `mtk-firmware-unlock` → 404 (public);
  `truenas-zfs-recovery-lab`, `ai-travel-planner-agent`, `jobboard-api`,
  `smart-job-scanner-v2`, `interviewstreet/hiring-agent` → all 200.
  ⛔ Sid decision: publish/create those two repos, or re-point/remove the card links.
  Also: `src/data/projects-snapshot.json` ships star counts (2★, 8★) for repos no
  visitor can see — collides with the verified-claims rule.
- [ ] **B3 — a11y suite never scans `/projects` or `/knowme`.** `tests/a11y.spec.ts:7`
  covers only `/`, `/prospect`, `/travel-planner`, `/404.html`. Add both pages.
- [ ] **B4 — Uncommitted IntroScreen fix.** Working-tree diff on
  `site/src/components/IntroScreen.tsx` (dismiss immediately when
  `document.readyState === "complete"`). Verified working by live probe (overlay
  dismisses ~4s on /prospect, h1 correct, zero console errors). Commit it.

## C. Deploy plumbing (push would do nothing / expose private data)

- [ ] **C1 — No git remote configured.** `git remote -v` is empty. Target:
  `Siddharthsinghkumar/Siddharthsinghkumar.github.io`, branch `main` (local branch is
  `master` — rename or push `master:main`).
- [ ] **C2 — Deploy workflow can never run.** It lives at
  `site/.github/workflows/deploy.yml`; GitHub Actions only reads `.github/workflows/`
  at repo root. The workflow's own paths (`working-directory: site`) already assume
  repo root = this directory, so the fix is `git mv site/.github .github`.
- [ ] **C3 — ⛔ PRIVACY DECISION before any push.** A `github.io` user-site repo is
  PUBLIC, and pushing publishes full git history. Currently tracked in git:
  - `site/public/test/` — Sid's personal photos (D58 says swap before launch, but
    history keeps them forever once pushed)
  - `local-resume-references.md` — contains Sid's **phone number** (site rule: no
    phone anywhere)
  - `.commandcode/taste/taste.md` — planner artifact (ignored now, but already tracked)
  - All planning docs, executor plans, QA reports, reference research
  Options: (a) fresh-history push (orphan branch / squash to one clean commit with
  private files removed), (b) separate deploy-only repo containing `site/` + workflow,
  (c) accept full exposure. Recommendation: (a) — keep this repo as the private
  working repo, push a clean single-commit history.
- [ ] **C4 — `howtodeploy.md` contradicts the deploy plan** (describes Coolify;
  CLAUDE.md hard constraint is GitHub Pages static export). Delete or rewrite.

## D. Sid-only manual items (assets & accounts — Claude/executor cannot do these)

- [ ] **D1 — Real resume PDF.** `site/public/resume-siddharth-singh.pdf` is a 4KB
  **text placeholder** (`file` says "UTF-8 text"). Export the real PDF; fix the
  "6 months" → "six weeks" Sindhey claim inside it.
- [ ] **D2 — 4 real screenshots** for ScreenshotFrame placeholders: Prospect Telegram
  alert, Prospect pipeline run, Travel Planner Grafana, Travel Planner SSE failure.
  AVIF/WebP, 16:9, into `site/public/screenshots/`, re-point the frames.
- [ ] **D3 — Tile images.** `site/public/tiles/` is empty (0 tiles found).
  GridBackdrop degrades gracefully, but /projects is running on generated tiles only.
- [ ] **D4 — Card face photo** for /knowme lanyard (currently "SS" monogram data-URI
  in `KnowMeClient.tsx` `frontImage`).
- [ ] **D5 — Swap `/test/` images for final assets** (D58: TEMP-approved, must swap
  before launch) — 5 reference sites: `PageBackground` default, `projects`, `prospect`,
  `travel-planner`, `KnowMeBackground`. Then re-verify /knowme text tone.
- [ ] **D6 — Verify LinkedIn URL by hand.** `linkedin.com/in/siddharth-singh-735340296`
  returns 999 to bots — only a human browser check counts.
- [ ] **D7 — GitHub settings after first push:** Pages source = Actions; Enforce
  HTTPS; profile website field; pin repos (decide together with B2).
- [ ] **D8 — After deploy:** verify live URL on all 6 pages, resume link, nightly cron
  (`30 22 * * *` UTC) fires and redeploys.

## E. Docs truthfulness (stale claims = defects)

- [ ] **E1 — `docs/LAUNCH-CHECKLIST.md`**: 6 stale `/about` references (lines 55, 62,
  73, 78, 97, 106); page list must read `/knowme`.
- [ ] **E2 — `site/TESTING.md`**: says "only 4 pages ship", "all 4 pages",
  "perf ≥ 90 on all 3 real pages" — all wrong vs today's 6 pages and 55/75 thresholds.
- [ ] **E3 — `site/README.md`**: page list says "About"; test count says 32.
- [ ] **E4 — `DESIGN.md` §5 line 163**: "on all 4 pages" stale.
- [ ] **E5 — `docs/qa/qa-report.md`**: T12 all-green claims no longer describe the
  tree (see gate table above). Regenerate after Phase 5 fixes land.
- [ ] **E6 — OG naming**: `/knowme` page uses `/og/about.png` (works, but
  `generate-og.mjs:13` still lists "about"). Rename to `knowme` end-to-end and check
  the card's rendered title says Know Me, not About.

## F. Verified DONE (no action)

- Build + typecheck green; 6 routes (`/`, `/prospect`, `/travel-planner`, `/projects`,
  `/knowme`, 404) all render with correct H1s.
- No phone number / education / banned strings in built HTML (only benign
  `format-detection` meta + "shortlist to my phone" copy).
- Sitemap (knowme listed), robots.txt, JSON-LD, `.nojekyll`, OG PNGs with absolute
  URLs via `metadataBase` — all present in `out/`.
- Contributions fetch: graceful null-fallback with no token/network (verified in code
  + offline grid test passes).
- Empty `tiles/` degrades gracefully (generated tiles + orange haze).
- JS budget: home 200KB gzip vs 480KB budget. Home lighthouse 63/100/100, CLS 0.005.
- Reduced-motion test passes; email CTA consistent with COPY.md everywhere.
- Workflow CONTENT is correct (quality gates → artifact → deploy-pages, nightly cron)
  — only its location is wrong (C2).

## Suggested order (shortest path to a polished push)

1. **Sid decision batch (blocks everything):** C3 privacy strategy; B2 repo links;
   A2/A3/A8 gate-script edit approvals; A9 workers policy.
2. **Code batch (Claude or executor):** B4 commit, B1, A4, B3, A1, A2/A3/A8 per
   approvals, C2, C4, E1–E6.
3. **Perf/visual batch:** A6 + A7 (needs Sid's eyes at a STOP — taste + N1 gates).
4. **Sid asset batch:** D1–D5 (can overlap with 2–3).
5. Full gate suite 3× consecutive green → C1 remote → **Sid pushes** → D6–D8.

Realistic: pushing TODAY requires all of batch 1 decided now, batch 2 lands clean,
and A6/A7 turn out shallow. Otherwise this is a solid tomorrow-push.
