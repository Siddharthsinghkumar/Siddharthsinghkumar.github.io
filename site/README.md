# Site — Sid's Portfolio

Static-export Next.js app deployed to GitHub Pages at
`Siddharthsinghkumar.github.io`. One job: get Sid hired as an AI Backend Engineer.

```bash
npm run dev          # dev server at localhost:3000
npm run build        # produces out/
npm run guards       # content/token/SEO/JS invariants
npx playwright test  # 26 smoke + a11y tests (desktop + mobile)
node scripts/lighthouse-gate.mjs  # perf ≥90 / a11y ≥95 / seo ≥95
```

Design tokens, copy, and build rules live at the repo root:
[../CLAUDE.md](../CLAUDE.md), [../DESIGN.md](../DESIGN.md),
[../COPY.md](../COPY.md). Testing docs: [TESTING.md](TESTING.md).

Deploy: push to `main` → CI runs quality gates (typecheck → lint → build →
guards → Playwright → Lighthouse) → deploys `out/` to GitHub Pages. Nightly
`30 22 * * *` rebuild refreshes live GitHub stats.
