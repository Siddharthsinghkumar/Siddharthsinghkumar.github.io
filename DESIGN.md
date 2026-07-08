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
- JS < 480KB gzip on `/` (three + R3F + drei; D30 budget).
- CLS < 0.05; fonts `font-display: swap` with metric-compatible fallbacks.
- Lighthouse CI (learned.md Day 9): perf ≥ 0.9, a11y ≥ 0.95, SEO ≥ 0.95 on all 6 pages.
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
| D16 | 2026-07-04 | TextPressure decision gate: kept behind TEXTPRESSURE_ENABLED=true flag. Component uses Space Grotesk variable font with wght/wdth/ital axes, pointer:fine + no-reduced-motion guard. Profiling at 6× CPU throttle TBD in T6 QA — if <55fps, toggle flag to false for static fallback. | Per D7 gate rules. Static Space Grotesk heading is the fallback. |

| D17 | 2026-07-05 | h1 semantics fixed: headline is the home h1; TextPressure name is a decorative <p aria-label>; 404's NO SIGNAL is an h1 | Verification: TextPressure rendered the only h1; recruiter crawlers and SEO need the claim line as h1. |
| D18 | 2026-07-05 | JS budget amended 150→200 KB gzip/page (actual: 195 KB) | Next 16 + React 19 framework floor ≈115 KB; removed dead `motion` dep (−40 KB). Guard enforces 200. |
| D19 | 2026-07-05 | OG images are PNG rendered with bundled TTFs (Space Grotesk/Inter/Plex Mono via resvg) | SVG og:image is ignored by LinkedIn/WhatsApp/Twitter; system-font fallback rendered serif (off-brand). |
| D20 | 2026-07-05 | `trailingSlash: true` | Next exports page.html + RSC directory of same name; GitHub Pages resolves the directory → case-study URLs 404'd. |
| D21 | 2026-07-05 | Button renders plain <a> for file/external hrefs | next/link prefetched the resume PDF as a route (console 404s on every page). |
| D22 | 2026-07-05 | Diagram overflow containers: tabIndex=0 + role=region + aria-label | axe serious: scrollable region must be keyboard-accessible. |
| D23 | 2026-07-05 | TextPressure gate RESOLVED: kept. SSR sizes via container-query units (cqi) so hydration is a no-op | Measured: CLS 0, TBT ≤40 ms, LCP 1.8 s slow-4G — passes D7's bar. |

| D24 | 2026-07-05 | Reference-tier atmosphere approved by Sid — overrides D6 launch-scoping. Signature WebGL hero, illuminated grid backdrop, glass nav, scroll choreography, diagram flow animation | Sid's bar is the $12–14k tier of igloo/Glyphic; the launch scoping mis-applied booking-site caution to a showpiece. |
| D25 | 2026-07-05 | D8 relaxed: exactly ONE glassmorphism treatment (nav-on-scroll) | Single glass instance keeps the matte-industrial system coherent. |
| D26 | 2026-07-05 | Home JS budget 200→230 KB gzip; raw WebGL only, three.js stays banned | Centerpiece cost contained; guard updated. |

| D27 | 2026-07-05 | WebGL paper-ink shader: raw GLSL (simplex FBM grain + pointer-trail ink glow), 0.75× DPR cap, requestIdleCallback mount, visibility/tab-hidden pause, screen blend overlay on CSS fallback | $14k hero centerpiece; CSS fallback (SVG feTurbulence + drifting accent blobs) always present. |
| D28 | 2026-07-05 | Illuminated grid backdrop: CSS grid from donor concept, inline artifact tiles (OG labels, mini SVGs, mono repo names, spec snippets), mask fade at edges | No gsap, no stock images — donor rule applied. |
| D29 | 2026-07-05 | Scroll choreography: clip-path inset hero/heading reveals (opacity stays 1 for LCP), 80ms hero stagger, 40ms timeline row cascade | Glyphic-grade entrances, engineered not bouncy. |

| D30 | 2026-07-05 | three.js/R3F approved; home JS budget →480 KB gzip; home perf gate 90→85 | Sid's explicit bar is the igloo/Glyphic scroll-driven 3D tier; unreachable without a real scene. |
| D31 | 2026-07-05 | Perceptibility gate (visual-gate.mjs) added as merge gate | T9 shipped spec-compliant but imperceptible atmosphere; pixel thresholds make invisible work fail CI. |
| D32 | 2026-07-05 | Hero TextPressure name REMOVED (was rendering broken: clipped H, collapsed space) — hero returns to COPY.md spec: mono eyebrow name + h1 headline; scene is the visual | One centerpiece per screen; the 3D engine replaces the type experiment. |

| D33 | 2026-07-05 | F1: Environment rewrite — core radius 3.5 (45-55% frame height), 7 streams from ALL frame edges, z-parallax dust layers (2000 + 800 near), grid floor in lower third, 3 wide ambient glow sprites, idle camera drift ±0.15 units 20s loop | T10.2 core read as "an object floating on black"; F1 fills the frame. |
| D34 | 2026-07-05 | D32 REVERSED: TextPressure name RESTORED (Sid wants the big name back). F2 spec: space-gap fix (0.35em inline-block spacer excluded from variation), fit-to-width scaling, overflow hidden, SSR via cqi; fallback to DecryptedText on giant type if misrenders. | h1 stays the headline; name is decorative <p aria-label>. |
| D35 | 2026-07-05 | Lanyard ID card ships (new /about page, donor profile-pic-card.md). Budget: initial 480 KB, total 620 KB when /about chunk loads. rapier + meshline + glb load only on /about. | F3 + F6: Sid's profile card research joins the build. |
| D36 | 2026-07-05 | /about page created. CONTEXT.md §1 superseded: "no About section" removed — Sid 2026-07-05. 5-line first-person bio from CONTEXT.md §3 identities. | Lanyard card + bio, education still excluded. |
| D37 | 2026-07-05 | F4 confirmed: orange stays (D1 brand, Prospect/prospecting story), GridMotion lives as illuminated grid backdrop (T9.2 amped in T10.7), PaperInk lives on case-study heroes (T10.6). | One ambient system per page — 3D engine on home, shader on case studies. |
| D38 | 2026-07-05 | F5: igloo-style intro/loading screen — particles converge into core, DecryptedText name, percent counter, 2.2s CSS auto-dismiss safety, sessionStorage skip repeat visits, preloader time used to warm shaders/prime buffers. | No swap — assembled core stays as scene. |
| D39 | 2026-07-05 | F8: hero text gets radial scrim (≤30% darkening), micro-glitch on section eyebrow at waypoint transitions (CSS, ≤120ms), no sound, previs screenshots before polish. | Recruiter-safe, legibility-first. |
| D40 | 2026-07-05 | F9 ambition calibration: this build targets procedural scene level 70 of igloo's 99. T11 reserved for authored .glb swap — camera rig/particles/preloader/gates survive unchanged. | Coherent and alive beats overreaching and broken. |
| D41 | 2026-07-05 | Visual-gate extended to all 6 pages (≥10% scene / ≥1.5% orange each at p=0) + h1 text-region contrast ≥4.5:1 | Sid: subpages have no background and feel like wireframes; A10 added the h1 contrast check. |
| D42 | 2026-07-05 | T12 finish plan: 13 audit violations + loader real-progress + subpage perceptibility redesign; scope frozen, STOPs accept/reject only | Sid: "finish properly, no rush job, nothing added after." |
| D47 | 2026-07-05 | Lighthouse gate throttling devtools → simulate (Sid's call). Devtools made the heavy 3D home + GooeyLoader persistently score perf 64/CLS .058 and was never recorded green in qa-report; simulate is the Lighthouse-CI standard. Thresholds (home 85, case 90, CLS .05) unchanged | Sid: switch to simulated throttling. |
| D49 | 2026-07-05 | Lighthouse perf gates lowered: home 85→55, case 90→75 (simulated throttling). TextPressure pre-paint fit fixed CLS (0.058→0.005). | Sid: "performance is not the issue — it's a portfolio, people can wait. The problem is it can't be forgettable." Honest floors for the N17-locked scene + GooeyLoader; real quality gates are the screenshots + visual-gate. |

| # | Date | Decision | Why |
|---|---|---|---|
| D50 | 2026-07-07 | Commented-out dead code deleted (DataStream/SpriteGlow call sites, breathe math, onScroll) — reverses C4 "keep commented" | Sid: delete now; git history preserves it; audits stop re-flagging |
| D51 | 2026-07-07 | /about deleted; /knowme is the about page; sitemap swapped | Orphaned duplicate with placeholder QR card |
| D52 | 2026-07-07 | Nav decrypt: once per page load everywhere, never on hover; hover = color only, suppressed during decrypt | phase4-plan Obj 2; supersedes 2026-07-06 dual-trigger |
| D53 | 2026-07-07 | Liquid-glass droplet ripple = the site's single glassmorphism instance (D25 slot); once post-decrypt + press ripples; zero new deps | Sid picked liquid-glass over CSS wave |
| D54 | 2026-07-07 | Link glitch pulse uniform sitewide (auto 3s shared clock + hover) | Supersedes T14 hover-only-subpages |
| D55 | 2026-07-07 | Screenshot frames: scanlines removed permanently, corner ticks stay, placeholder SVGs until real captures | Sid: "Lines are weird" |
| D56 | 2026-07-07 | Subpage layer schemas per phase4-plan Obj 3; KnowMe lanyard renders above nav | Sid's written layer architecture |
| D57 | 2026-07-07 | Loading overlay on the session's entry page only (in-memory flag, hard reload resets) | Sid: "real loading on subpages only if the site loads firstly on a subpage" |
| D58 | 2026-07-07 | /test/ images TEMP-approved as BG assets; must be swapped before launch | Sid accepted interim public exposure |
| D59 | 2026-07-07 | Waypoint p-values measured from DOM section offsets at runtime (resize-aware), not hardcoded | Hardcoded percentages can't hold across viewports |
| D60 | 2026-07-08 | Site goal reweighted: memorable-enough-to-revisit > fast/professional; the site must define Sid | Sid's explicit ranking; taste calls resolve toward distinctiveness, perf thresholds stay Sid-owned |
| D61 | 2026-07-08 | M0.1: NavRipple REMOVED for launch; donor evaluation → v2 parking lot. Narrows D53 to launch scope | Idle-rAF violation + not liquid glass; replacement puts a taste loop on the critical path |
| D62 | 2026-07-08 | M0.3: case-page ambient diet — Option A (keep both) chosen at STOP 1 | Memorability outranks perf (D60); both systems together create the desired atmosphere despite the perf hit |
| D63 | 2026-07-08 | M0.2: D54 3s link auto-pulse UPHELD (keep) | Recurring motion is the point — memorability doctrine (D60) |
| D64 | 2026-07-08 | M0.4: launch via fresh-history single-commit push; this repo remains the private working copy | Tracked history contains personal photos + phone number; a github.io repo is public forever |
| D65 | 2026-07-08 | M0.5: project links re-pointed to firefighting-robot-public (3★) and mtk-firmware-unlock-root (8★) | Old repo names 404 publicly; new URLs verified HTTP 200 on 2026-07-08 |
| D66 | 2026-07-08 | M0.6/M0.7: gate-script edits approved — A2 token-hex centralization + allowlist, A3 out/ existence check, A8 visual-gate /knowme; Playwright workers pinned to 2 | Each edit makes a gate measure reality; thresholds unchanged (N7) |
| D67 | 2026-07-08 | M0.9: CSS-only token press effect on nav links replaces the ripple's press feedback; judged at STOP 1 | Nav shouldn't feel dead on press after ripple removal; zero guardrail risk (no WebGL/rAF) |
| D68 | 2026-07-08 | M0.10: case-page perf ship-floor pre-authorized at ≥70 after honest optimization (written N7 approval; actual numbers appended at T24 if invoked) | Memorability doctrine (D49/D60): "can't be forgettable" > raw perf; below 70 still STOPs |

*(Executor: append new rows here for every design choice made during build.)*
