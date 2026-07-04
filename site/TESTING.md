# TESTING.md — Site Quality Gates

## What protects the site

| Layer | Command | What it checks |
|---|---|---|
| **Guards** | `npm run guards` | Content invariants against `out/`: required copy present, forbidden strings absent (phone/education/"6 months"/lorem/stock), no rogue hex colors, OG images are PNG, SEO plumbing exists (JSON-LD, sitemap, robots.txt, .nojekyll), only 4 pages ship, JS ≤200 KB gzip per page |
| **Playwright** | `npx playwright test` | Smoke tests (all 4 pages render correct H1, nav works, CTAs exist, 4 project cards, forbidden content absent, reduced-motion shows content immediately) and axe a11y audits (zero serious/critical violations) on all 4 pages, both desktop and mobile viewports |
| **Lighthouse gate** | `node scripts/lighthouse-gate.mjs` | perf ≥ 90 / a11y ≥ 95 / seo ≥ 95 / CLS ≤ 0.05 on all 3 real pages, devtools throttling |

## Run everything locally

```
cd site
npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs
```

All four must pass. If `build` fails, don't proceed. If `guards` fails, fix the invariant
before testing anything else.

## Before ANY future upgrade

When upgrading Next major, bumping dependencies, adding new sections, or touching
page structure:

1. Run the full trio above — build + guards + playwright + lighthouse.
2. If adding a page:
   - Add it to `scripts/guards.mjs`'s `pages` map
   - Add it to `tests/smoke.spec.ts`'s `PAGES` list
   - Add it to `tests/a11y.spec.ts`'s axe page list
   - Add it to `scripts/lighthouse-gate.mjs`'s `PAGES` array
3. If changing any copy: diff the rendered HTML against `../COPY.md` — copy must
   be verbatim.

## Invariants encoded

- Copy is verbatim from `../COPY.md`. Never invent, "improve", or paraphrase.
- Forbidden strings (checked by guards): phone number, "B.Tech", education section,
  "6 months", "lorem", stock-image sources, "Henrie", exact contribution count.
- Colors come only from `../DESIGN.md` §1.1 token set. No hex values outside
  `globals.css` and `layout.tsx`.
- `og:image` must be PNG (SVG ignored by LinkedIn/WhatsApp/Twitter).
- Only 4 pages ship: `/`, `/prospect/`, `/travel-planner/`, `/404`.
- JS budget: ≤480 KB gzip home (three.js/R3F — D30); ≤230 KB case-study pages.

## Known allowances

- GitHub API `console.error` for rate-limited/offline fetches is filtered in CI
  smoke tests — the snapshot fallback renders instead.
- Contributions counter shows "GitHub →" fallback when the GH_TOKEN/GraphQL
  token is absent.
