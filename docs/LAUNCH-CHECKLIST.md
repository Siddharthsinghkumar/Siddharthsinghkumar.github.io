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
- [ ] Verify: `https://Siddharthsinghkumar.github.io` loads all 4 pages
- [ ] Verify: resume PDF link works
- [ ] Verify: nightly cron fires and redeploys

## 7. Post-Launch (optional)

- [ ] **merlin-cli-bridge**: if publishing — ⚠️ `auth.json` holds real cookies, scrub before pushing
- [ ] **Lanyard 3D card**: implement behind error boundary + static image fallback per DESIGN.md D6
- [ ] **GridMotion**: reconsider if wanted later (heavy, decorative — DESIGN.md D6 rejected at launch)
- [ ] Performance: run Lighthouse against live URL, verify perf ≥ 0.9, a11y ≥ 0.95, SEO ≥ 0.95

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
