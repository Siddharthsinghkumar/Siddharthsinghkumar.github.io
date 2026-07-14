# Siddharth Singh — AI Backend Engineer

**[siddharthsinghkumar.github.io](https://siddharthsinghkumar.github.io/)**

Personal portfolio built to land AI/ML backend roles. Positioning: AI Backend
Engineer with full-stack range (shipped production products) and embedded/systems
depth (robotics, FPGA, homelab).

6 pages — Home (Three.js 3D scene), Prospect (autonomous job-prospecting
engine), Travel Planner, Projects, Know Me, 404. Graphite + Signal Orange
brand, Space Grotesk/Inter/IBM Plex Mono typography, CSS view
transitions, `prefers-reduced-motion` respected throughout.

## Stack

- **Next.js 16 static export** (`output: "export"`, no server runtime)
- **React Three Fiber** + Drei + Rapier physics + custom shaders for the 3D hero
- **Tailwind CSS v4**, design tokens enforced by scripted guards (no rogue hex)
- **GitHub Actions CI**: `tsc → lint → build → guards → Playwright → lighthouse → visual-gate → deploy`
- **36 automated tests** (smoke + axe-core a11y on desktop Chrome + Pixel 7)
- **8 invariant gates**: copy, privacy, tokens, SEO, page inventory, JS budget, links, poster artifacts

## Source-of-truth files

| File | Purpose |
|---|---|
| `CONTEXT.md` | Facts. Every claim on the site traces here. |
| `COPY.md` | Every word on every page. |
| `DESIGN.md` | Tokens, components, motion, decision log. Brand wins all conflicts. |
| `CLAUDE.md` | Build rules, component-donor rule, hard constraints. |
| `docs/learned.md` | 974 lines of prior-project mistakes as binding guardrails. |

## Run locally

```bash
cd site
npm ci
npm run dev          # localhost:3000
npm run build        # static export to out/
npm run guards       # content + token + SEO invariants
npx playwright test  # 36 smoke + a11y tests
```

## Deploy

Push to `main` triggers the full CI pipeline. Nightly scheduled rebuild
(`30 22 * * *` UTC) refreshes live GitHub contribution stats. Deploys to
GitHub Pages via Actions — source must be set to **GitHub Actions** in
repo settings, not branch deploy.

## Contact

`siddharthsingh8418@gmail.com` — open to remote worldwide, preference for
AI backend roles in India or global remote.
