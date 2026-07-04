# DESIGN.md — Design System & Decision Log

> Merged 2026-07-04 from: Sid's brand pick (Graphite + Signal Orange), the four
> reference-site teardowns (`reference-website-1/2/4/5.md`), the research papers
> (`references_research_paper/`), and the React Bits component files.
> **Precedence: this file's brand tokens WIN over any reference or donor component.
> References win on layout and feel. COPY.md supplies every word.**
> Quality bar (Sid, binding): **the site must read as a $10,000 commission.**

---

## 1. Brand tokens (THE BRAND — wins all conflicts)

### 1.1 Colour

Defined in HSL (research: HSL tracks human perception best — `Color_Perception.md`).
Hex given for convenience; HSL is canonical.

| Token | HSL | Hex | Use |
|---|---|---|---|
| `--bg` | `240 8% 5%` | `#0B0B0D` | Page background. Matte near-black. |
| `--surface` | `240 5% 8%` | `#141416` | Cards, panels, raised strips |
| `--surface-2` | `240 5% 11%` | `#1B1B1E` | Hover states of surfaces, code blocks |
| `--line` | `246 5% 16%` | `#26262A` | Hairline borders (1px), dividers |
| `--text` | `43 13% 90%` | `#E8E6E1` | Primary text. Warm off-white. |
| `--muted` | `240 4% 56%` | `#8A8A93` | Secondary text, captions, labels |
| `--accent` | `17 100% 55%` | `#FF5C1A` | Signal orange. CTAs, links, status dots, hover underlines, selection |
| `--accent-dim` | `17 90% 45%` | `#DB4A0F` | Accent hover/pressed |
| `--ok` | `145 60% 45%` | — | `SHIPPED` status only |
| `--warn` | `43 90% 55%` | — | `IN DEVELOPMENT` status only |

Rules:
- **One accent.** Orange carries all emphasis. No gradients as decoration; a single
  subtle radial glow behind the hero is the only permitted gradient.
- **No pure `#000` / no pure `#FFF`** — matte, not glossy (NOFace "everything is
  matte, on purpose").
- Dark theme ONLY, no toggle (learned.md: one theme = one QA surface).
- Contrast: body text pairs must pass WCAG AA (4.5:1); accent-on-bg reserved for
  large text/labels/icons (≥3:1). CI runs axe checks (learned.md Day-9 pattern).
- Text selection: orange background, near-black text.

### 1.2 Typography

Self-hosted via `next/font` (learned.md 1.15: never manual preload tags).

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Space Grotesk** | Tight tracking on H1 (−2%), sizes step by 1.25 modular scale |
| Body | **Inter** | 16px base, 1.6 line-height, max line length 68ch |
| System labels / code / status / numbers | **IBM Plex Mono** | UPPERCASE, +8% letter-spacing for labels (igloo evidence: Plex Mono = precision-lab signature) |

Type scale (rem): 0.75 · 0.875 · 1 · 1.25 · 1.563 · 1.953 · 2.441 · 3.052 · 4.5 (hero clamp).
Hero H1: `clamp(2.4rem, 6vw, 4.5rem)`.

### 1.3 Spacing, radius, depth

- Spacing scale: 4px base — 4/8/12/16/24/32/48/64/96/128. Sections breathe:
  ≥96px vertical padding desktop, ≥64px mobile ("oversized negative space", igloo).
- Radius: `--r-sm 6px` (pills, tags), `--r-md 10px` (cards), `--r-lg 16px` (feature
  panels). Never fully round buttons.
- Depth: borders over shadows. Elevation = `--line` border + slightly lighter
  surface. One permitted shadow: `0 16px 48px rgb(0 0 0 / 0.45)` for hover-lifted
  cards. No glassmorphism blur-stacks.

---

## 2. Layout & feel (references win here)

- **Full-viewport hero** (igloo): 100svh first screen, name + headline + dual CTA,
  content below the fold scrolls normally. NOT an overflow-hidden app shell —
  this is a content site; recruiters must be able to scroll and ctrl-F.
- **System language everywhere** (NOFace): section eyebrows are mono labels —
  `SYSTEM / 01`, `PROOF`, `STATUS: RUNNING LOCAL`. Buttons say what happens:
  "Email me", "Resume ↓", "Read the system breakdown →".
- **Named-system storytelling** (Glyphic): Prospect page = hero claim → why →
  architecture diagram → component board → proof → honest notes. Explain the
  mechanism, name the stages.
- **Modular nouns** (Raycast): skills and sections use short system nouns, not
  marketing adjectives.
- **Spec-sheet blocks** (NOFace): component board and stat rows rendered like
  hardware spec sheets — mono labels left, values right, hairline rules.
- Grid: 12-col, max-width 1200px, 24px gutters. Mobile-first; test at 375/768/1280.
- Navigation: sparse — wordmark left ("SS" or "SIDDHARTH SINGH" mono), three links
  (Prospect / Travel Planner / Contact), resume button right. Sticky, bg blur-free:
  solid `--bg` at 92% opacity.
- Footer: contact block (COPY.md), mono meta line: `BUILT BY HAND · DEPLOYED VIA
  GITHUB ACTIONS · LAST BUILD {date}` — build date injected at build time
  (live-system feel, honest).

---

## 3. Motion system

Principle: **engineered, not playful** (igloo teardown). Nothing bounces.

| Token | Value |
|---|---|
| `--dur-fast` | 150ms (hover, focus) |
| `--dur-med` | 300ms (reveals, fades) |
| `--dur-slow` | 600ms (hero entrance, decrypt) |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint family) |

- Scroll reveals: fade + 12px translate-up, staggered 60ms, once only
  (IntersectionObserver; no scroll-jacking, native scroll always).
- **DecryptedText** (ui-component-1): used on (a) the contributions counter
  ("400+"), (b) section eyebrow labels on first view, (c) 404 heading. `animateOn:
  "view"`, sequential, speed tuned ≤600ms total. Not on body copy.
- **TextPressure** (ui-component-2): optional hero name treatment — decision gate
  at build: only if it holds 60fps on mid-range mobile; otherwise static Space Grotesk.
- **GridMotion** (ui-component-3): NOT used at launch (heavy, decorative). Logged
  as rejected-for-now.
- **Lanyard 3D card** (profile-pic-card.md): deferred to post-launch enhancement.
  Physics + three.js + .glb on a recruiter-facing static site violates the perf
  budget; learned.md 1.10/Day-10: feature correctness and LCP first. If added
  later: error boundary + static image fallback mandatory (learned.md: WebGL
  error boundaries).
- **Smooth scroll (Lenis)** — web research 2026-07-04: smooth scroll is the single
  most-cited "expensive feel" ingredient on award-tier sites. Use Lenis,
  **desktop `pointer:fine` only**, disabled under reduced-motion and on mobile
  (native scroll there is already smooth and cheaper). Native scroll APIs
  (anchor jumps, ctrl-F) must keep working.
- **Page transitions** — cross-document **View Transitions API** (pure CSS
  `@view-transition`, zero JS): subtle 250ms crossfade + 8px slide between the 4
  pages. Progressive enhancement — browsers without support get instant loads.
  No JS transition library (Barba/GSAP class) — budget stays intact.
- **Custom cursor** — small accent-orange dot (6px) with trailing ring that
  expands over interactive elements; `pointer:fine` devices only; native cursor
  remains visible underneath (never `cursor: none` — accessibility); pure
  transform-based, no rAF when idle.
- `prefers-reduced-motion: reduce` → all animation off (including Lenis, view
  transitions, cursor trail), content visible immediately (research: wellbeing +
  throttled-CPU kindness).
- Battery/CPU kindness (`Web_Performance_UX.md`): no rAF loops at idle; animations
  are CSS/IO-driven; any canvas work pauses when tab hidden.

---

## 4. Components

| Component | Spec |
|---|---|
| **Button / primary** | Accent bg, near-black text, mono uppercase label, `--r-sm`, hover → `--accent-dim` + 1px lift; focus ring 2px accent offset 2px (always visible) |
| **Button / ghost** | Transparent, `--line` border, text `--text`; hover → border-accent + text-accent |
| **Status pill** | Mono 11px uppercase; dot + label. Colors: SHIPPED `--ok`, RUNNING LOCAL `--accent`, IN DEVELOPMENT `--warn`, RESEARCH/CONCEPT `--muted`. Dot pulses 2s on RUNNING LOCAL only. |
| **Project card** | `--surface`, `--r-md`, `--line` border; name (Grotesk) + one-liner (Inter) + tag row (mono) + live GitHub stats row (stars ★, last push) with skeleton → fetched swap; hover: border-accent + shadow lift; whole card clickable |
| **Component board row** | Spec-sheet style: mono component name, role text, status pill, code link or `PRIVATE` label |
| **Timeline entry** | Left mono date column, hairline connector, role + facts right |
| **Skills row** | Category mono label + noun pills (`--surface-2`, `--r-sm`); AI/Backend row visually first and widest |
| **Stat/proof figures** | IBM Plex Mono, accent-colored numerals |
| **Diagram** | Custom SVG, `--line` strokes, mono labels, accent for data-flow arrows; must be legible at 375px (horizontal scroll container allowed) |
| **FreelancerProfileCard donor** (portfoli-card.md) | Structural donor ONLY per CLAUDE.md rule — if used for a contact card: real copy from COPY.md, tokens from here, no Unsplash images, strip rating/rate/bookmark (irrelevant to hiring) |

Every interactive element: rest / hover / active / focus-visible states defined —
no default-blue focus, no missing states (learned.md: shadcn-grade states).

---

## 5. Performance & quality budget (premium = fast)

- LCP < 1.5s (hero H1 is the LCP — server-rendered text, no priority images).
- JS < 150KB gzip on `/` (React Bits components tree-shaken; no three.js at launch).
- CLS < 0.05; fonts `font-display: swap` with metric-compatible fallbacks.
- Lighthouse CI (learned.md Day 9): perf ≥ 0.9, a11y ≥ 0.95, SEO ≥ 0.95 on all 4 pages.
- Images: AVIF/WebP, sized, no CSS resizing (learned.md perf table).
- Semantic HTML: one h1/page, landmark elements, alt text everywhere, OG images
  per page, JSON-LD `Person` schema on `/` (beats jp-plumbing benchmark pattern).

---

## 6. Decision log

| # | Date | Decision | Why |
|---|---|---|---|
| D1 | 2026-07-04 | Brand = Graphite + Signal Orange; Space Grotesk / Inter / IBM Plex Mono | Sid picked from 3 derived directions. Orange = Prospect/mining story; distinct from AI-portfolio blue. |
| D2 | 2026-07-04 | Dark only, no theme toggle | learned.md: two themes = double QA. |
| D3 | 2026-07-04 | Palette canonical in HSL | Color_Perception.md: HSL best matches human perception. |
| D4 | 2026-07-04 | Full-viewport hero but normal document scroll (no app-shell overflow:hidden) | igloo feel without killing recruiter ctrl-F/SEO. |
| D5 | 2026-07-04 | DecryptedText: counters + eyebrows only | Live-system feel (Sid asked for it on contributions); body copy stays readable. |
| D6 | 2026-07-04 | GridMotion rejected at launch; Lanyard deferred post-launch | Perf budget + learned.md over-optimization lesson; WebGL needs error boundaries. |
| D7 | 2026-07-04 | TextPressure = build-time decision gate (60fps mobile or drop) | Premium bar vs perf budget. |
| D8 | 2026-07-04 | Borders-over-shadows, no glassmorphism | Matte industrial (NOFace); avoids sindhey glass-drift history. |
| D9 | 2026-07-04 | ui-ux-pro-max skill runs as design-system generator during build; its output is ADVISORY — this file wins conflicts | Sid requested the skill; single source of truth preserved. |
| D10 | 2026-07-04 | Status-pill state system (5 states) as a first-class component | Honest living-system presentation (CONTEXT.md §4). |
| D11 | 2026-07-04 | Build-date + live GitHub stats in UI | "$10k feel" via genuine live-system details, not decoration. |

| D12 | 2026-07-04 | Lenis smooth scroll, desktop-only, reduced-motion off-switch | Web research: smooth scroll = #1 cited "expensive" signal; mobile keeps native. |
| D13 | 2026-07-04 | Cross-document View Transitions (CSS-only) for page changes | Award-tier page-transition feel at zero JS cost; progressive enhancement. |
| D14 | 2026-07-04 | Custom cursor dot+ring, `pointer:fine` only, native cursor kept visible | Award-tier detail without the a11y sin of hiding the cursor. |

| D15 | 2026-07-04 | ui-ux-pro-max skill unavailable in harness; design system implemented directly from DESIGN.md tokens per D9 | Per plan: "DESIGN.md wins every conflict." Advisory file written to site/design-system/ADVISORY.md as placeholder. |

*(Executor: append new rows here for every design choice made during build.)*
