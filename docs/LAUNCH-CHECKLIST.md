# LAUNCH-CHECKLIST.md — Launch Day Steps for Sid

> Generated 2026-07-04 by build executor. Sid: work through this checklist before
> going live. Each item below is a post-build action only you can perform.

---

## 1. Resume PDF

- [ ] Export AI-Backend resume as PDF from your source document
- [ ] **Fix "6 months" → "six weeks"** for Sindhey claim — site says six weeks, resume must match
- [ ] Save as `resume-siddharth-singh.pdf`
- [ ] Replace placeholder at: `site/public/resume-siddharth-singh.pdf`
- [ ] Verify: open `https://Siddharthsinghkumar.github.io/resume-siddharth-singh.pdf` returns the PDF

## 2. Screenshots (4 captures needed)

- [ ] Prospect page: "Telegram alert arriving with ranked matches" screenshot
  - Replace placeholder frame in site/src/app/prospect/page.tsx (search `Sid to capture`)
- [ ] Prospect page: "pipeline run — pages OCR'd, blocks extracted" screenshot
  - Replace placeholder frame in Prospect page
- [ ] Travel Planner page: "Grafana dashboards during a planning session" screenshot
  - Replace placeholder frame in site/src/app/travel-planner/page.tsx
- [ ] Travel Planner page: "SSE stream surviving a forced provider failure" screenshot
  - Replace placeholder frame in Travel Planner page
- Format: AVIF or WebP, crop to 16:9, place in `site/public/screenshots/`
- Update component paths accordingly

## 2b. Assets for Sid to supply

- [ ] **Tile screenshots** — drop images into `site/public/tiles/` (auto-picked next build, scan-tiles.mjs → GridBackdrop renders them)
- [ ] **Card face photo** — replace monogram on /knowme Lanyard card: update `frontImage` data URI in `site/src/app/knowme/KnowMeClient.tsx`
- [ ] **Replace all `site/public/test/` images with final assets** — personal photo currently public on /knowme, /prospect, /projects, /travel-planner. Re-point PageBackground `image` props to final images.
- [ ] **Re-verify KnowMe text tone after image swap** — text color is statically chosen per current image; may need adjustment.
- [ ] **Capture + drop in the four real screenshots** — frames + captions ready in ScreenshotFrame.

## 3. LinkedIn Verification

- [ ] Verify `https://www.linkedin.com/in/siddharth-singh-735340296` resolves
- [ ] If changed, update CONTEXT.md, COPY.md, Footer, and JSON-LD

## 4. GitHub Profile

- [ ] Add site URL (`https://Siddharthsinghkumar.github.io`) to GitHub profile website field
- [ ] Pin relevant repos on GitHub profile

## 5. LinkedIn Update

- [ ] Add site URL to LinkedIn profile

## 6. Push & Deploy

- [ ] Push to `Siddharthsinghkumar/Siddharthsinghkumar.github.io` repo, `main` branch
- [ ] GitHub Actions: verify deploy workflow runs green (typecheck → lint → build → deploy)
- [ ] Verify: `https://Siddharthsinghkumar.github.io` loads all 6 pages (/, /prospect, /travel-planner, /projects, /about, /404)
- [ ] Verify: resume PDF link works
- [ ] Verify: nightly cron fires and redeploys

## 7. Post-Launch (optional)

- [ ] **merlin-cli-bridge**: if publishing — ⚠️ `auth.json` holds real cookies, scrub before pushing
- [x] **Lanyard 3D card**: shipped on /about page (2026-07-05 T12-A8) — error boundary + static fallback
- [ ] **GridMotion**: reconsider if wanted later (heavy, decorative — DESIGN.md D6 rejected at launch)
- [ ] Performance: run Lighthouse against live URL, verify perf ≥ 55 (home), ≥ 75 (case), a11y ≥ 95, SEO ≥ 95


---

## T12 exit state (2026-07-05)

### What shipped

- 6 pages: `/`, `/prospect/`, `/travel-planner/`, `/projects/`, `/about/`, `/404`
- 3D home scene (Prospect Engine): icosahedron core, data streams, stage ring, satellite, dust, grid floor, 5 scroll waypoints
- GooeyLoader intro screen with real asset-progress counter
- PaperInk WebGL atmosphere on case-study pages (autonomous ink blobs)
- GridBackdrop tiles on /projects
- CSS dust + glow void on /about with draggable Lanyard physics card
- CSS grain + glow on /404 with DecryptedText
- AMPED RGB micro-glitch (240ms) on section eyebrows
- FlutedGlass nav (@paper-design/shaders-react)
- CSS View Transitions between pages
- Lenis smooth scroll (desktop pointer:fine only)
- Custom cursor dot+ring (pointer:fine only)
- OG images (PNG) for all 6 pages + twitter cards
- Sitemap, robots.txt, JSON-LD Person schema
- Guard suite: content invariants, hex-color check, OG PNG check, page inventory, JS budgets, link integrity, poster existence
- Playwright: 32 tests (6 page smoke + 6 axe + nav/CTA/404/reduced-motion/forbidden/link-integrity)
- Lighthouse gate (simulate): home ≥55, case ≥75, a11y ≥95, seo ≥95, CLS ≤0.05
- Visual gate: 6 pages ≥10% scene / ≥1.5% orange / h1 contrast ≥4.5:1

### Only remaining human steps

1. Replace resume PDF (fix "6 weeks" claim)
2. 4 screenshots for placeholder frames
3. Drop tile images into `site/public/tiles/`
4. Supply photo for /about card face
5. Push to `Siddharthsinghkumar/Siddharthsinghkumar.github.io` main
6. GitHub Pages → Settings → Enforce HTTPS

### Gate suite final

```
build ✅ | guards ✅ | 32/32 PW ✅ | lighthouse ✅ | visual-gate 6/6 ✅
home: 50.4% scene, 3.5% orange | prospect: 38.6%/9.0% | travel-planner: 39.1%/9.1%
projects: 29.9%/2.1% | about: 63.7%/1.6% | 404: 27.6%/2.3%
```

---

## Phase 5 pre-push sweep (2026-07-08) — CURRENT STATE

The T12 exit state above no longer describes the tree. A full signoff sweep on
2026-07-08 found the gate suite red (lint ❌ 52 errors, guards ❌ 21, Playwright ❌ 4,
lighthouse ❌ case pages 56<75, visual ❌ travel-planner invisible), the deploy
workflow in a location GitHub Actions cannot read (`site/.github/`), no git remote,
and privacy-sensitive files tracked in git (personal photos, phone number in
`local-resume-references.md`). **Do not push until the Phase 5 list is worked
through: [`docs/plans/phase5-todolist.md`](plans/phase5-todolist.md).**
Note: `/about` references in the sections above are stale — the page is `/knowme`
since D51 (2026-07-07).

---

## Quick Reference

| What | Where |
|------|-------|
| Site code | `/home/sidd/project/freelance/portfolio-website/site/` |
| Build output | `site/out/` |
| Repo | `Siddharthsinghkumar/Siddharthsinghkumar.github.io` |
| Live URL | `https://Siddharthsinghkumar.github.io` |
| Planning docs | `CONTEXT.md`, `COPY.md`, `DESIGN.md`, `CLAUDE.md`, `EXECUTION-PLAN.md` |
| QA report | `docs/qa/qa-report.md` |
| Decision log | `DESIGN.md` §6 |
