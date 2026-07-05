# T8 — Post-Verification Hardening (executor handoff)

> For DeepSeek v4 Pro (effort HIGH) or GLM 5.2. Cold-start: read
> `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` first (donor rule,
> commit rules, address the user as Sid), then this file. App lives in
> `/home/sidd/project/freelance/portfolio-website/site/`.
>
> Context: Claude's verification pass (2026-07-05, commits `52d6bdb` + `4bec72d`)
> fixed launch-critical bugs and added a regression suite. Verified state:
> 26/26 Playwright tests green, `npm run guards` green, Lighthouse (observed
> devtools throttling, mobile): perf 98 / a11y 100 / seo 100, LCP 1.8s, CLS 0.
> This task wires the remaining plumbing and documentation. **Small, exact edits
> only — do not refactor, do not touch page copy or components.**

## Verify-first rule
Before starting: `cd site && npm run build && npm run guards && npx playwright test`
must all pass. If not, STOP and report — do not "fix forward".

## Task 1 — Replace `site/.github/workflows/deploy.yml` (whole file)

Replace its `jobs:` section so the pipeline is: one `quality` job (typecheck →
lint → build → guards → playwright → lighthouse gate → upload artifact) and a
`deploy` job needing it. Keep the existing `on:`, `permissions:`, `concurrency:`
blocks unchanged. Exact quality job steps (all `working-directory: site` except
checkout/setup):

1. `actions/checkout@v4`; `actions/setup-node@v4` (node 20, npm cache,
   `cache-dependency-path: site/package-lock.json`); `npm ci`
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build` with `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`
   (prebuild fetches the contributions count and generates OG PNGs)
5. `npm run guards`
6. `npx playwright install --with-deps chromium`
7. `npx playwright test`
8. `node scripts/lighthouse-gate.mjs` (script already committed; it finds
   Playwright's chromium itself)
9. `actions/upload-pages-artifact@v3` with `path: site/out`

`deploy` job: unchanged from current file but `needs: quality`.
**Done when:** YAML parses (`python3 -c "import yaml,sys;yaml.safe_load(open('site/.github/workflows/deploy.yml'))"`)
and step order matches the list above.

## Task 2 — Append decision-log rows to `/home/sidd/project/freelance/portfolio-website/DESIGN.md`

Append these rows to the §6 table (before the executor-note line), verbatim:

```
| D17 | 2026-07-05 | h1 semantics fixed: headline is the home h1; TextPressure name is a decorative <p aria-label>; 404's NO SIGNAL is an h1 | Verification: TextPressure rendered the only h1; recruiter crawlers and SEO need the claim line as h1. |
| D18 | 2026-07-05 | JS budget amended 150→200 KB gzip/page (actual: 195 KB) | Next 16 + React 19 framework floor ≈115 KB; removed dead `motion` dep (−40 KB). Guard enforces 200. |
| D19 | 2026-07-05 | OG images are PNG rendered with bundled TTFs (Space Grotesk/Inter/Plex Mono via resvg) | SVG og:image is ignored by LinkedIn/WhatsApp/Twitter; system-font fallback rendered serif (off-brand). |
| D20 | 2026-07-05 | `trailingSlash: true` | Next exports page.html + RSC directory of same name; GitHub Pages resolves the directory → case-study URLs 404'd. |
| D21 | 2026-07-05 | Button renders plain <a> for file/external hrefs | next/link prefetched the resume PDF as a route (console 404s on every page). |
| D22 | 2026-07-05 | Diagram overflow containers: tabIndex=0 + role=region + aria-label | axe serious: scrollable region must be keyboard-accessible. |
| D23 | 2026-07-05 | TextPressure gate RESOLVED: kept. SSR sizes via container-query units (cqi) so hydration is a no-op | Measured: CLS 0, TBT ≤40 ms, LCP 1.8 s slow-4G — passes D7's bar. |
```

**Done when:** rows appear once, table renders (pipe-count matches header).

## Task 3 — Update `/home/sidd/project/freelance/portfolio-website/docs/qa/qa-report.md`

- B7 row: `⏳` → `✅` with evidence:
  `Lighthouse (devtools throttling, mobile emulation, 2026-07-05): / 98/100/96/100 · /prospect/ 98/100/100/100 · /travel-planner/ 98/98/100/100; LCP 1.8s; CLS 0; TBT ≤40ms; home JS 195KB gzip`
- Remove the stale `/scratch` line from "Pages Generated"; note pages are now
  `prospect/index.html` + `travel-planner/index.html` (trailingSlash).
- Under "Pending": replace with "Sid's launch checklist items only (resume PDF,
  4 screenshots)". Add a line: "Regression suite added — see site/TESTING.md."

## Task 4 — Create `site/TESTING.md`

Sections (keep it ~60 lines, plain prose + commands):
1. **What protects the site** — table: guards (`npm run guards`) = content/token/
   SEO/budget invariants vs built out/; Playwright (`npx playwright test`) =
   smoke + axe, desktop + mobile; Lighthouse gate
   (`node scripts/lighthouse-gate.mjs`) = perf ≥90 / a11y ≥95 / seo ≥95 / CLS ≤0.05.
2. **Run everything locally** — `npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs`.
3. **Before ANY future upgrade** (Next major, dep bumps, new sections): run the
   trio; if adding a page, add it to guards' `pages` map, smoke PAGES list,
   axe list, and lighthouse-gate PAGES.
4. **Invariants encoded** — one line each: copy verbatim from COPY.md; forbidden
   strings (phone/education/"6 months"/lorem/stock); tokens only from DESIGN.md;
   og:image must stay PNG; only 4 pages ship; JS ≤200 KB gzip.
5. **Known allowances** — GitHub API console errors are filtered in CI;
   contributions counter shows "GitHub →" fallback when GraphQL/token absent.

## Task 5 — Replace `site/README.md`

~15 lines: what this is (Sid's portfolio, static export, GitHub Pages),
`npm run dev` from `site/`, build/test commands (the trio), pointer to
`../CLAUDE.md`, `../DESIGN.md`, `../COPY.md`, `TESTING.md`, and the deploy
model (push main → quality gates → Pages; nightly rebuild refreshes stats).

## Task 6 — Commit

Two commits, no attribution trailers, build green first:
1. `ci: wire guards, playwright, and lighthouse gates into deploy pipeline`
2. `docs: TESTING.md, README, qa-report B7 evidence, decision log D17-D23`
**Never push** — Sid pushes.

## Kickoff prompt (Sid: paste to DeepSeek/GLM)

```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then execute
/home/sidd/project/freelance/portfolio-website/T8-HANDOFF.md exactly, task by
task. Verify-first rule applies. Small exact edits only — no refactors, no copy
changes. Two commits as specified, no attribution trailers, never push.
Address the user as Sid.
```
