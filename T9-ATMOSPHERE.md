# T9 — Atmosphere & Centerpiece Layer (reference tier: Glyphic ≈ $12k, igloo ≈ $14k)

> For DeepSeek v4 Pro at effort **MAX** (all tasks — this is the taste layer) or
> GLM 5.2 MAX. Cold-start: read
> `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` (donor rule, commit
> rules, address the user as **Sid**), then `DESIGN.md` (tokens win), then this
> file. App: `/home/sidd/project/freelance/portfolio-website/site/`.
>
> **Mission:** the launch build is correct and fast but visually static — it was
> scoped to "safe premium" (decisions D6/D8) when Sid's explicit bar is the
> $12–14k reference tier of his research (igloo.inc, Glyphic). That tier =
> **one signature interactive centerpiece + ambient atmosphere + choreographed
> motion, while staying fast** (igloo itself loads in ~283 ms — speed IS part of
> the tier). Sid has overridden the scoping. Build the feel. Keep the gates.

## Non-negotiable gates (run after EVERY task)

```
cd site && npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs
```
- Lighthouse (observed): perf ≥ 90, a11y ≥ 95, seo ≥ 95, CLS ≤ 0.05.
- Home JS budget: **≤ 230 KB gzip** (amended from 200 — grants ~35 KB for the
  shader + atmosphere; raw WebGL, NO three.js — three.js alone would blow it).
- Every atmosphere element: error boundary → CSS fallback; OFF under
  `prefers-reduced-motion` and `saveData`; rAF pauses when tab hidden and when
  off-viewport; the LCP element (home h1) must never be delayed — the canvas
  mounts AFTER first paint (`requestIdleCallback`/dynamic import).
- An element failing gates after two honest attempts → ship its specified CSS
  fallback and log it. **Never weaken a gate to pass it.**

## Task 0 — Decision-log + budget amendments
Append to `DESIGN.md` §6 (verbatim):
```
| D24 | 2026-07-05 | Reference-tier atmosphere approved by Sid — overrides D6 launch-scoping. Signature WebGL hero, illuminated grid backdrop, glass nav, scroll choreography, diagram flow animation | Sid's bar is the $12–14k tier of igloo/Glyphic; the launch scoping mis-applied booking-site caution to a showpiece. |
| D25 | 2026-07-05 | D8 relaxed: exactly ONE glassmorphism treatment (nav-on-scroll) | Single glass instance keeps the matte-industrial system coherent. |
| D26 | 2026-07-05 | Home JS budget 200→230 KB gzip; raw WebGL only, three.js stays banned | Centerpiece cost contained; guard updated. |
```
Update `site/scripts/guards.mjs` §6 budget to 230. **Done when:** guards pass.

## Task 1 — THE CENTERPIECE: pointer-reactive paper-ink shader hero  `[the $14k moment]`
A full-hero WebGL canvas behind the hero content — living "paper" with slow
ink-grain drift that **reacts to the cursor**: moving the pointer blooms a
subtle signal-orange ink/refraction trail that decays over ~2s. On touch
devices: autonomous slow drift only (no pointer input, gravity-slow).
- **Raw WebGL fragment shader, handwritten** (~150 lines GLSL): 2–3 octave
  simplex/fbm noise for paper grain; a pointer-trail uniform (last N pointer
  positions with age) driving local brightness/refraction in `--accent` hue;
  everything in the site palette — output must read as *paper and ink*, not
  lava-lamp slop. Palette clamp: base `#0B0B0D`, grain within ±4% luminance,
  ink glow capped at `hsl(17 100% 55% / 0.14)`.
- Canvas: capped at 0.75× DPR, `filter: contrast()` free, sized to hero only.
  Mount via dynamic import after first paint; `<noscript>`/failure fallback =
  Task 1b CSS variant. Pause off-screen + tab-hidden. Target 60fps at 4×
  throttle, hard floor 40fps at 6× (else reduce octaves, then DPR, then drop).
- **Task 1b (fallback, build it first):** SVG `feTurbulence` grain overlay
  (opacity 0.05, `mix-blend-mode: overlay`) + two drifting blurred `--accent`
  radial gradients (transform-only keyframes, 120s/90s). Reduced-motion gets
  this, static.
- **Done when:** on `npm run dev`, the hero visibly lives within 2s and answers
  the cursor; fps trace recorded in `docs/qa/`; gates pass; before/after
  screenshots in `docs/qa/`.

## Task 2 — Illuminated grid backdrop (Sid's GridMotion research, ui-component-3)
Behind the home project-grid section: a faint drifting grid of tiles with
**illuminated gaps** — Sid's "grid of images with illuminated spaces in between
with gradient".
- Donor: `ui-component-3.md` (GridMotion). Donor rule hard: **no stock images.**
  Tiles = real artifacts: the 3 OG PNGs, crops of both architecture SVGs,
  spec-sheet/status-pill snippets rendered as tiles, mono repo-name tiles on
  `--surface-2`. Swap in Sid's 4 screenshots when delivered.
- Treatment: tiles ~12% opacity with `--line` borders; gaps carry soft
  `--accent` radial glow; whole layer radial-masked to fade at section edges;
  slow autonomous drift (transform-only) + subtle pointer parallax on
  `pointer:fine`. Cards render above, contrast re-verified by axe.
- CSS fallback: static grid, same illumination.
- **Done when:** the section reads depth-lit; gates pass; screenshot in `docs/qa/`.

## Task 3 — Scroll choreography (Glyphic-grade entrances)
Replace the plain fade-up reveals with **staged, masked entrances** — still
engineered, nothing bouncy:
- Hero intro sequence on load: name → headline → sub → CTAs, staggered 80 ms,
  **transform/clip only — opacity stays 1 on the h1** (LCP protection).
- Section headings enter via `clip-path: inset(0 0 100% 0)` → open, 500 ms
  `--ease`; body content follows with the existing fade-up at 60 ms stagger.
- Spec-sheet rows and timeline entries cascade 40 ms per row.
- Mono eyebrows keep DecryptedText on first view.
- Reduced-motion: everything visible instantly (existing behavior).
- **Done when:** scrolling home feels sequenced, not uniform; gates pass.

## Task 4 — Glass nav on scroll (the one glass treatment)
`scrollY > ~40px` → nav becomes `backdrop-filter: blur(14px) saturate(140%)`,
bg `--bg`/55%, bottom border `--line`; returns solid at top; 300 ms `--ease`.
Feature-query fallback: current 92% solid. **Done when:** visible on all pages,
focus states intact, gates pass.

## Task 5 — Prospect pipeline: scroll-lit stages + data-flow particles
On `/prospect`, as the diagram scrolls through the viewport the six stages
(SCAN→…→DELIVER) light in `--accent` sequentially, and **small particles flow
along the connector paths** (SVG `offset-path`/`<animateMotion>`, 3–4 dots per
edge, mono-sized, `--accent`) — the system looks like it's running.
- Primary: CSS scroll-driven animations (`animation-timeline: view()`);
  IntersectionObserver stepwise fallback. Particles run only while the diagram
  is in-viewport. Reduced-motion: all stages lit, no particles.
- **Done when:** scrolling plays the sequence and the pipeline visibly "flows";
  gates pass.

## Task 6 — Page-transition polish
Extend the existing CSS View Transitions: outgoing page fades 200 ms, incoming
slides 8 px up + fades 250 ms with the mono eyebrow decrypting on arrival.
Browsers without support keep instant loads. **Done when:** navigating between
the 4 pages feels authored; gates pass.

## Task 7 — (OPTIONAL — only if Sid supplies the asset)
Scroll-scrubbed or hover-play muted loop (`<video muted loop playsinline
preload="none">`, poster frame, ≤2 MB webm) of a real pipeline run / Telegram
alert in the Prospect proof section.

## Task 8 — Commit + evidence
One commit per task (`feat(atmosphere): …`), gates green before each, no
attribution trailers, **never push**. Final: update `docs/qa/qa-report.md`
(new Lighthouse table, fps trace, screenshot list) and append any in-build
design decisions to `DESIGN.md` §6.

## Kickoff prompt (Sid: paste to DeepSeek/GLM)

```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md and DESIGN.md,
then execute /home/sidd/project/freelance/portfolio-website/T9-ATMOSPHERE.md
task by task at maximum effort. This is the signature visual layer — the bar is
igloo.inc/Glyphic tier. The perf/a11y gates are merge gates: never weaken a
gate to pass it; use the specified fallbacks instead. Raw WebGL only, no
three.js. Donor rule applies to GridMotion. One commit per task, no attribution
trailers, never push. Address the user as Sid.
```
