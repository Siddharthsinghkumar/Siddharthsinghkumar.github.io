# Site — Sid's Portfolio

Static-export Next.js app deployed to GitHub Pages at
`Siddharthsinghkumar.github.io`. 6 pages: home, Prospect, Travel Planner,
Projects, About, 404.

```bash
npm run dev          # dev server at localhost:3000
npm run build        # produces out/
npm run guards       # content/token/SEO/JS invariant checks
npx playwright test  # 32 smoke + a11y tests (desktop + mobile)
node scripts/lighthouse-gate.mjs  # perf ≥55 home / ≥75 case, a11y ≥95, seo ≥95
node scripts/visual-gate.mjs       # scene + orange pixel perceptibility gates
```

Design tokens, copy, and build rules at repo root:
[../CLAUDE.md](../CLAUDE.md), [../DESIGN.md](../DESIGN.md),
[../COPY.md](../COPY.md). Testing docs: [TESTING.md](TESTING.md).

## How deploy works

Push to `main` → CI runs `tsc → lint → build → guards → Playwright →
lighthouse-gate → visual-gate` → deploys `out/` to GitHub Pages.
A scheduled rebuild at `30 22 * * *` UTC refreshes live GitHub stats nightly.

## How to update content

- **Resume PDF**: replace `public/resume-siddharth-singh.pdf`
- **Tile screenshots**: drop images into `public/tiles/` — run
  `node scripts/scan-tiles.mjs && npm run build` to pick them up
- **Card photo**: replace the monogram on `/about` by updating the SVG
  data-URI in `src/app/about/page.tsx`

## Gate suite one-liner

```
npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs && node scripts/visual-gate.mjs
```
