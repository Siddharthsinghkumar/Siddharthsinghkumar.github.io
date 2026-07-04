# EXECUTION-PLAN.md — Portfolio Website Master Build Plan

> **You (the executor) are cold-starting.** Everything you need is in this file and
> the absolute paths it lists. Do not rely on any planning conversation.
> Planned by Claude Fable 5 with Sid, 2026-07-04. Address the user as **Sid**.

---

## 0. GOAL

Build and deploy Sid's personal portfolio — a fully static site at
`https://Siddharthsinghkumar.github.io` whose single job is **getting Sid hired
as an AI Backend Engineer**, and whose look/feel sits in the
**$10,000+ commissioned-website category** (benchmark in §2).

Success = all of: (a) every T-task's done-criteria verified, (b) the §2 benchmark
checklist fully ticked, (c) Lighthouse perf ≥ 0.9 / a11y ≥ 0.95 / SEO ≥ 0.95 on
all 4 pages, (d) Sid approves the visual result.

---

## 1. REQUIRED READING — absolute paths, in this exact order

| # | File (absolute path) | Why | When to load |
|---|---|---|---|
| 1 | `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` | Binding rules incl. component-donor rule | Always in context |
| 2 | `/home/sidd/project/freelance/portfolio-website/CONTEXT.md` | The facts; wins all contradictions | Always in context |
| 3 | `/home/sidd/project/freelance/portfolio-website/COPY.md` | Every word of every page | Load per page-task |
| 4 | `/home/sidd/project/freelance/portfolio-website/DESIGN.md` | Tokens, components, motion, budgets, decision log | Always in context |
| 5 | `/home/sidd/project/freelance/portfolio-website/docs/learned.md` | 974 lines of prior mistakes | Skim §1 + §5 once; §"Gotchas" below is the distilled binding subset |
| 6 | `/home/sidd/project/freelance/portfolio-website/ui-component-1.md` | DecryptedText donor source | Only during T5 |
| 7 | `/home/sidd/project/freelance/portfolio-website/ui-component-2.md` | TextPressure donor source | Only during T5 gate |
| 8 | `/home/sidd/project/freelance/portfolio-website/portfoli-card.md` | Profile-card donor (optional contact card) | Only if used |
| 9 | `/home/sidd/project/freelance/portfolio-website/profile-pic-card.md` | Lanyard 3D — **DO NOT BUILD at launch** (DESIGN.md D6) | Never at launch |
| 10 | Reference teardowns (feel only, never copy): `/home/sidd/project/freelance/portfolio-website/reference-website-1.md` (igloo), `-2.md` (NOFace), `-4.md` (Glyphic/VANTA), `-5.md` (Raycast). `-3.md` is empty — ignore. | Layout/feel grounding | Optional, per section |

Working directory for the app: `/home/sidd/project/freelance/portfolio-website/site/`
(create it; keep planning .md files at the folder root, outside the app).

---

## 2. THE $10,000 BENCHMARK — what the site must feel like (web-researched 2026-07-04)

Synthesis of premium-web research (sources at bottom of this file). A $10k+ site is
recognized by these signals; each maps to something already specified in this plan.
**This checklist is a T6 merge gate — verify every row.**

| # | $10k signal (research) | Where our plan delivers it | Verify by |
|---|---|---|---|
| B1 | Exceptional typography: premium faces, generous sizing, tuned tracking/leading | DESIGN.md §1.2 (Space Grotesk/Inter/Plex Mono, modular scale, tracking rules) | Visual pass: no default fonts, no orphan sizes off the scale |
| B2 | Whitespace & simplicity — nothing crammed | DESIGN.md §2 (≥96px sections, 68ch line length, sparse nav) | Screenshot review at 1280px: every section breathes |
| B3 | Restrained palette: neutral base + 1–2 accents used sparingly | DESIGN.md §1.1 (near-black + ONE orange accent) | Grep built CSS: no colors outside the token set |
| B4 | No generic stock imagery — real, brand-specific visuals | CLAUDE.md donor rule §3 (real screenshots + custom SVG diagrams only) | Audit every `<img>`: source is Sid's capture or generated diagram/OG |
| B5 | Microinteractions everywhere: hover, focus, load, scroll cues | DESIGN.md §3 + §4 (state specs per component, reveals, DecryptedText, status pulse) | Tab + hover through every interactive element |
| B6 | Cohesive story from first scroll | COPY.md (Prospect narrative, system language throughout) | Read the rendered home top-to-bottom: one voice |
| B7 | Speed as a feature: CWV green, no jank | DESIGN.md §5 budgets, LCP<1.5s, JS<150KB | Lighthouse CI numbers |
| B8 | Smooth scroll (the #1 cited "expensive" tell) | DESIGN.md §3 Lenis (desktop, reduced-motion aware) | Manual scroll feel + reduced-motion check |
| B9 | Page transitions between views | DESIGN.md §3 View Transitions (CSS-only crossfade) | Navigate between pages in Chrome: smooth, no flash |
| B10 | Custom cursor detail | DESIGN.md §3 dot+ring, pointer:fine only | Desktop hover test; touch devices unaffected |
| B11 | Text treated as design element (animated reveals) | DecryptedText on eyebrows/counter; hero entrance | View home first-load |
| B12 | Show don't tell; specific skills, real proof | COPY.md proof sections, live GitHub stats, status board | Every claim traces to COPY.md register |
| B13 | Storytelling sequence guiding the visitor | Home flow: hero → systems → proof → timeline → skills → CTA | Scroll-through review |
| B14 | Flawless finishing details: favicon, OG images, selection color, focus rings, 404 | T4 + T5 micro-details | Check each explicitly |

**Anti-signals to avoid** (research: what makes sites look cheap): template look,
cluttered sections, more than 2 accent colors, unstyled focus states, stock photos,
lorem ipsum, broken mobile layouts, slow loads, default cursors on "premium" claims,
scroll-jacking that breaks native behavior.

---

## 3. STACK (decided — do not relitigate)

- **Next.js latest stable + TypeScript strict + Tailwind CSS v4**, App Router,
  `output: 'export'`. User site → **no basePath**. Deploy: GitHub Pages via Actions.
- Fonts via `next/font/google` (self-hosts at build): Space Grotesk, Inter, IBM Plex Mono.
- Motion: CSS-first; `motion` package only where needed; **Lenis** for smooth scroll;
  CSS View Transitions. **No three.js/physics at launch** (DESIGN.md D6).
- Repo: `Siddharthsinghkumar/Siddharthsinghkumar.github.io`, branch `main`.

---

## 4. MODEL SPLIT & EFFORT (who does what)

Default executor: **DeepSeek v4 Pro (1M ctx)**. Alternative: **GLM 5.2 (1M ctx)**.

| Tasks | Effort | Why |
|---|---|---|
| T0, T1, T4, T7 (scaffold, primitives, SEO plumbing, deploy) | **HIGH** | Mechanical, spec is exact; MAX wastes credits |
| T2, T3 (pages: layout craft, diagrams) | **MAX** | Taste-heavy; the $10k feel is won or lost here |
| T5 (motion & polish pass) | **MAX** | Timing/easing judgment; perf gates |
| T6 (QA) | **HIGH** | Checklist execution |

Rules: one task per session/run where possible (context stays sharp). If a MAX task
produces mediocre visual output, redo it — do not "fix forward" with patches on a
weak layout. **Verify DeepSeek's self-reports against the file tree — its commit
messages have previously claimed edits that didn't land** (Sid's standing rule).

---

## 5. CONTEXT MANAGEMENT (for the executor)

- **Always-loaded core (~small):** CLAUDE.md, CONTEXT.md, DESIGN.md, this file.
- **Load per task:** only the COPY.md page-section being built; only the donor
  component file the task names. Do NOT preload all reference teardowns or
  learned.md in full — the distilled gotchas are in §8.
- **Re-anchor after any compaction:** re-read this file's task you're on + its
  done-criteria before continuing. Never continue from memory of a summary alone.
- **Between tasks:** commit, then start the next task by re-stating (in one line)
  the task goal and its done-criteria. If the criteria aren't in context, re-read them.
- **Never** paste large binary/base64 or lockfiles into context; reference paths.

---

## 6. SKILLS MAP — what to invoke, where, for what

Skills available in Sid's setup (catalog: `/home/sidd/project/freelance/portfolio-website/reference-skill.md`).
If a named skill isn't installed in your harness, proceed with its intent manually — no skill is a hard blocker.

| Skill | When (task) | For what |
|---|---|---|
| **ui-ux-pro-max** (`npx ui-ux-pro-max-cli init --ai claude`, or plugin `nextlevelbuilder/ui-ux-pro-max-skill`) | T0 once | Generate advisory design system ("AI engineer portfolio, dark premium industrial, Next.js/Tailwind"); persist with `--persist`; cross-check against DESIGN.md. **DESIGN.md wins every conflict** (D9). Also use its pre-delivery anti-pattern checks in T6. |
| **design-taste-frontend** (`Leonxlnx/taste-skill`) | T2, T3 | Anti-slop review of each page after first build: hero, cards, typography |
| **emil-design-eng** | T1, T5 | Component polish: button states, invisible details, animation decisions |
| **animation-vocabulary** | T5 | Naming/choosing exact motion patterns before implementing |
| **review-animations** | T5 (after) | Review implemented motion against design-engineering philosophy |
| **performance-and-web-vitals** | T6 | Lighthouse audit + CWV fixes |
| **wcag-accessibility** | T6 | AA pass on contrast, focus, semantics |
| **semantic-html-and-seo** | T4 | Heading hierarchy, meta, JSON-LD, sitemap |
| **find-bugs** / **code-review** | end of T2, T3, T5 | Bug sweep of changed files |
| **ponytail** (YAGNI) | T6 | Strip dead code/deps before ship |
| **commit** | every commit | Conventional format, no attribution trailers |

**MCP servers: NONE required.** This project has no Supabase/Clerk/Sentry/DB.
Do not connect the sindhey MCPs. GitHub interaction = `gh` CLI + public REST/GraphQL.

---

## 7. PROMPT-FOLLOWING RULES (binding)

1. Copy comes **verbatim** from `/home/sidd/project/freelance/portfolio-website/COPY.md`. Never invent, "improve", or paraphrase copy. If copy is missing for something, STOP and ask Sid.
2. Colors/fonts/spacing come **only** from DESIGN.md tokens. If you type a hex not in §1.1, you are wrong.
3. Component donors follow the CLAUDE.md donor rule: skeleton from donor, skin from DESIGN.md, words from COPY.md, stock images banned, unused parts deleted.
4. Facts come only from CONTEXT.md. Never upgrade a status label (RESEARCH ≠ SHIPPED). No education section. No phone number.
5. Ask Sid **only** at the marked decision gates or on missing copy/assets. Everything else is decided in these files.
6. Every deviation (forced by a real constraint) = one line appended to DESIGN.md's decision log in the same commit.
7. Address the user as Sid. Commits per unit of work, `npm run build` green first, **no Co-Authored-By / generated-by trailers, never push without Sid's explicit instruction.**

---

## 8. GOTCHAS (distilled from `/home/sidd/project/freelance/portfolio-website/docs/learned.md` — binding)

- `useRef<T>(null)` always (React 19 strict TS fails on bare `useRef<T>()`).
- Fonts via `next/font` only; never manual `<link rel="preload">` for fonts.
- Static export: no image-optimization server — `<Image unoptimized>` or `<img>` with explicit width/height everywhere (CLS).
- Client fetch of auth-gated/ratelimited APIs: graceful fallback UI, never an infinite spinner or silent empty state.
- Any WebGL/canvas: error boundary + static fallback (not applicable at launch — no WebGL shipped).
- Docs must match shipped product — update DESIGN.md log when reality diverges.
- Don't trust "Done": run the verify command; look at the rendered page.
- Feature correctness before optimization; budgets are still merge gates.
- Decorative images never get `priority`/preload — the H1 text is the LCP.

---

## 9. EXECUTION ORDER — tasks with goal / todo / done-criteria / verification

> Execute strictly T0→T7. Commit at each ✅. Do not start Tn+1 with Tn unverified.

### T0 — Scaffold, tokens, CI skeleton  `[effort: HIGH]`
**Goal:** running Next static-export app with the full token system and deploy pipeline stub.
**Todo:**
1. `npx create-next-app@latest site` (TS, App Router, Tailwind v4) in `/home/sidd/project/freelance/portfolio-website/`.
2. `next.config.ts`: `output: 'export'`; add `.nojekyll` to `public/`.
3. Implement every DESIGN.md §1 token as CSS custom properties + Tailwind theme mapping; global styles (bg, text color, orange selection, focus-visible ring, scrollbar styling subtle).
4. Wire the 3 fonts via `next/font/google` with CSS variables.
5. Run ui-ux-pro-max generator (advisory — §6); save its output to `site/design-system/ADVISORY.md`; note any adopted suggestions in DESIGN.md log.
6. `.github/workflows/deploy.yml`: triggers `push: main` + `schedule: '30 22 * * *'` (≈4:00 IST); jobs: typecheck → lint → build → upload `out/` → deploy-pages.
**Done when / verify:**
- `cd site && npm run build` exits 0 and produces `out/index.html`. ▶ run it.
- Placeholder page shows correct bg #0B0B0D, Space Grotesk heading, orange selection. ▶ open in browser / screenshot.
- Workflow YAML reviewed line-by-line against GitHub Pages Actions docs. ▶ read it.

### T1 — Layout primitives, nav, footer  `[effort: HIGH]`
**Goal:** the reusable skeleton every page uses.
**Todo:** Section wrapper (max-w 1200, grid, §1.3 spacing) · mono eyebrow-label ·
status-pill (5 states, exact §4 colors, pulse only on RUNNING LOCAL) · primary/ghost
buttons (§4 state specs) · sticky nav (wordmark, Prospect/Travel Planner/Contact,
resume button; solid 92%-opacity bg) · footer (COPY.md contact block + mono build-date line injected at build).
**Done when / verify:**
- Storybook-style scratch page renders all primitives; hover/active/focus-visible visibly distinct on each. ▶ tab through with keyboard, screenshot each state.
- 375px: nav fits without hamburger. ▶ devtools responsive check.
- `npm run build` green. ▶ run.

### T2 — Home page  `[effort: MAX]`
**Goal:** the money page — COPY.md §Home rendered to the $10k bar.
**Todo:** Hero (100svh, H1 = server-rendered text = LCP, single radial accent glow) ·
SYSTEM/01 + SYSTEM/02 teasers · 4-card project grid with client-side GitHub stats
(fetch `https://api.github.com/users/Siddharthsinghkumar/repos?per_page=100`;
build-time snapshot JSON fallback; skeleton→swap; Sindhey card links
`https://www.sindheypathology.com`, no repo stats) · timeline · skills (AI/Backend row
dominant) · publication/OSS strip with contributions figure (build script: GitHub
GraphQL `contributionsCollection…totalContributions` via `GH_TOKEN`/Actions token;
round DOWN to nearest 100 → `"{N}00+"`; **no token → omit number, render "GitHub →"**)
· contact footer.
**Done when / verify:**
- Rendered text diff vs COPY.md §Home: verbatim. ▶ manual section-by-section compare.
- Network blocked → cards show snapshot data, no spinner, no layout break. ▶ devtools offline test.
- Lighthouse trace: LCP element is the H1 text. ▶ `npx lighthouse http://localhost:3000 --view` on the exported build served locally (`npx serve out`).
- design-taste-frontend + find-bugs sweeps run; findings addressed. ▶ rerun until clean.

### T3 — `/prospect` + `/travel-planner`  `[effort: MAX]`
**Goal:** two case-study pages that read like Glyphic system pages.
**Todo:** exact COPY.md structure · component board as spec-sheet rows w/ status pills
(only smart-job-scanner-v2 + jobboard-api + ai-travel-planner-agent get GitHub links;
others labeled `PRIVATE`) · 2 custom SVG diagrams per DESIGN.md §4 (Prospect:
SCAN→EXTRACT→EMBED→MATCH→GENERATE→DELIVER over the 5 components; Travel Planner:
router→circuit breaker→cloud/Ollama fallback→SSE) · proof sections as labeled
placeholder frames (mono caption "SCREENSHOT — Sid to capture: …", 16:9, `--surface-2`).
**Done when / verify:**
- Both pages in `out/` render statically; diagrams crisp at 1x/2x and usable at 375px (h-scroll container). ▶ browser check at 3 widths.
- Every rendered claim exists in COPY.md. ▶ read-through against file.
- Status pills match CONTEXT.md §4 table exactly. ▶ compare row-by-row.

### T4 — 404, SEO, metadata  `[effort: HIGH]`
**Goal:** finishing plumbing that recruiters and crawlers notice.
**Todo:** `/404` per COPY.md · per-page title/description from COPY.md · branded OG
images 1200×630 per page (bg + Space Grotesk title + orange bar, generated at build)
· JSON-LD `Person` on `/` (name, jobTitle, sameAs: GitHub + LinkedIn from CONTEXT.md §3)
· `sitemap.xml`, `robots.txt` · resume link wired to `public/resume-siddharth-singh.pdf`
(placeholder PDF until Sid supplies) · favicon (orange square, mono "S") · `theme-color`.
**Done when / verify:**
- `npx lighthouse` SEO ≥ 0.95 on all 4 pages. ▶ run against served `out/`.
- OG meta present + image file exists per page. ▶ view page source.
- semantic-html-and-seo skill review passes. ▶ run it.

### T5 — Motion & polish pass  `[effort: MAX]`
**Goal:** the $10k feel — B5, B8–B11, B14.
**Todo:** scroll reveals (fade+12px, 60ms stagger, once) · DecryptedText (donor
`ui-component-1.md`, donor rule applied) on contributions counter + section eyebrows
+ 404 heading · **Lenis smooth scroll** (desktop pointer:fine, off under reduced-motion)
· **CSS View Transitions** between pages (250ms crossfade+slide) · **custom cursor**
dot+ring (pointer:fine only, native cursor stays visible) · link underline slide ·
status-dot pulse · smooth anchor scroll ·
**DECISION GATE — TextPressure hero name:** implement behind a flag, profile at 6×
CPU throttle mobile emulation; ≥55fps keep, else delete donor code entirely; log
outcome in DESIGN.md.
**Done when / verify:**
- `prefers-reduced-motion: reduce` → zero animation, Lenis off, content instantly visible. ▶ toggle in devtools rendering tab and walk all pages.
- 6× CPU-throttled scroll of home: no dropped-frame jank visible in Performance panel. ▶ record trace.
- animation-vocabulary consulted before, review-animations after; emil-design-eng detail pass. ▶ run each.
- Gate outcome logged in DESIGN.md decision log. ▶ check file diff.

### T6 — QA gates  `[effort: HIGH]`
**Goal:** prove the budgets and the benchmark.
**Todo:** Lighthouse CI config (4 URLs, DESIGN.md §5 budgets) wired into deploy workflow
as gate · `@axe-core/playwright` smoke, 4 pages, zero serious/critical ·
manual matrix 375/768/1280 + keyboard-only + offline (API-blocked) pass ·
**§2 benchmark checklist B1–B14 ticked row-by-row with evidence** · anti-signal sweep ·
ponytail YAGNI pass (dead code/deps) · wcag-accessibility + performance-and-web-vitals
skill audits · copy diff: every rendered string exists in COPY.md.
**Done when / verify:**
- CI run green with LHCI + axe gates. ▶ Actions log.
- `docs/qa/` contains: 3-width screenshots, LHCI report links/numbers, filled B1–B14 checklist table. ▶ files exist and are honest.

### T7 — Deploy & handoff  `[effort: HIGH]`
**Goal:** live site + Sid's launch checklist.
**Todo:** create/point repo `Siddharthsinghkumar/Siddharthsinghkumar.github.io` —
**push ONLY when Sid explicitly says push** · enable Pages (Actions source) · verify
live URL, nightly cron visible, resume link 200 · write
`/home/sidd/project/freelance/portfolio-website/docs/LAUNCH-CHECKLIST.md` for Sid:
  1. Export AI-Backend resume PDF → replace placeholder; **fix "6 months" → "six weeks"** (Sindhey) so resume matches site.
  2. Capture 4 `[Sid captures]` screenshots (COPY.md) → swap placeholder frames.
  3. Verify `linkedin.com/in/siddharth-singh-735340296` resolves.
  4. Add site URL to GitHub profile + LinkedIn.
  5. Post-launch options: sanitized merlin-cli-bridge publish (⚠️ `auth.json` holds real cookies — scrub first), Lanyard 3D card behind error boundary.
**Done when / verify:**
- Live URL loads all 4 pages (or ready-to-push state documented if unpushed). ▶ curl + browser.
- LAUNCH-CHECKLIST.md exists. ▶ file check.

---

## 10. KICKOFF PROMPT (Sid: paste this to the executor, nothing else needed)

```
Read /home/sidd/project/freelance/portfolio-website/EXECUTION-PLAN.md in full and
execute it exactly. Before any code, load its §1 required-reading core:
/home/sidd/project/freelance/portfolio-website/CLAUDE.md, CONTEXT.md, DESIGN.md
(keep these three + the plan in context at all times), and consult COPY.md per page.
Build the Next.js static-export app in /home/sidd/project/freelance/portfolio-website/site/.
Follow the plan's execution order T0→T7 one task at a time, verify each task's
done-criteria with the listed verification steps before moving on, use the skills
map in §6, obey the prompt-following rules in §7 and gotchas in §8, and hit the
$10,000 benchmark checklist in §2 (it is a merge gate at T6). Copy verbatim from
COPY.md; tokens only from DESIGN.md; facts only from CONTEXT.md. Commit per task
(no attribution trailers). Never push without Sid's explicit instruction. Address
the user as Sid. Ask Sid only at marked decision gates or on missing copy/assets.
```

---

## Research sources for §2 ($10k benchmark)

- EB Media — What makes a website look expensive: https://ebmediasolutions.com/blog/what-makes-a-website-look-expensive
- Hooman — Key design secrets of expensive-looking sites: https://hooman.com/blogs/what-make-websites-expensive
- Webwavers — Premium design elements: https://webwavers.de/en/blog/website-design-elemente-premium
- CXL — Luxurious UX vs looking cheap: https://cxl.com/blog/optimize-luxury-brand/
- Utsubo — Premium website cost guide 2026 ($5k–$200k tiers): https://www.utsubo.com/blog/premium-website-cost-budget-guide
- Connective — Real website costs: https://connectivewebdesign.com/blog/how-much-does-website-cost
- Bogdan Bendziukov — 5 features of Awwwards-winner feel (smooth scroll, transitions, cursor): https://medium.com/@bogdanfromkyiv/5-features-to-make-your-website-look-like-an-awwwards-winner-e34ddd2af352
- Arjun Kumar — Award-winning animation techniques: https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff
- Awwwards portfolio winners (feel reference): https://www.awwwards.com/websites/portfolio/
- Elementor — Best developer portfolios 2026: https://elementor.com/blog/best-web-developer-portfolio-examples/
