# T10 — THE ENGINE: igloo-class scroll-driven 3D centerpiece

> **This is the definitive visual build.** For DeepSeek v4 Pro at effort **MAX**
> on every task (or GLM 5.2 MAX). Cold-start: read
> `/home/sidd/project/freelance/portfolio-website/CLAUDE.md`, then `DESIGN.md`,
> then `reference-website-1.md` (the igloo teardown — absorb the feel language:
> "full-viewport application canvas", "motion that looks engineered", "calm
> futurism"), then this file. App: `/home/sidd/project/freelance/portfolio-website/site/`.
>
> **Why T9 failed Sid's bar (learn this before coding):** it shipped exactly the
> spec'd numbers — grain ±0.04 luminance, ink ≤0.14 alpha, tiles 0.12 opacity —
> which are imperceptible on real displays. All perf gates passed while the page
> looked unchanged. Two structural fixes in this plan: (1) a **pixel-level
> perceptibility gate** that fails invisible work, (2) **two mandatory Sid
> approval stops** with screenshots. Never ship subtle-to-invisible again: when
> in doubt, make it MORE visible — Sid will dial back, not up.
>
> **The bar:** igloo.inc (~$14k) / Glyphic (~$12k). Their formula: a fixed
> full-viewport WebGL scene, the camera travels through it as you scroll, DOM
> content choreographs over it — and the site still loads fast. Build that.

---

## 0. Stack & hard rules

- **three.js is now ALLOWED** (this supersedes T9/D26's ban): `three` +
  `@react-three/fiber` + `@react-three/drei` (import only what's used).
  **No postprocessing package** — glow is done with additive-blending sprites
  and emissive materials (cheaper, more reliable than UnrealBloom).
- All scene colors from DESIGN.md: `#0B0B0D` void, grey wireframes, ONE orange
  family (`#FF5C1A` and dimmed variants). No rainbow, no purple, no lava-lamp.
- Canvas is `position: fixed; inset: 0; z-index: 0` on the **home page**;
  all DOM content sits above (z≥10). Case-study pages do NOT carry the 3D
  scene (they get the amped PaperInk treatment — Task 6).
- Canvas mounts via dynamic import after first paint (`requestIdleCallback`,
  timeout 1500 ms). Beneath it always: the CSS fallback layer (current radial
  glow + feTurbulence grain **amped to opacity 0.10**) so no-JS/no-WebGL/
  reduced-motion users still see atmosphere. Reduced-motion: canvas never
  mounts; the static poster (Task 7) shows instead.
- rAF pauses on tab-hidden. `pointer:coarse`: half particle counts, DPR 0.6,
  no pointer parallax. `pointer:fine`: DPR ≤ 0.75.

## Gates (run after EVERY task)

```
cd site && npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs && node scripts/visual-gate.mjs
```
- Budgets amended (Task 0): home JS **≤ 480 KB gzip** (three ≈150 + R3F ≈30 +
  drei subset + app). LCP element (h1) unchanged and never overdrawn; CLS ≤ 0.05;
  Lighthouse observed: **perf ≥ 85** (home; was 90 — the 5 points buy the
  scene), a11y ≥ 95, seo ≥ 95. Case-study pages stay perf ≥ 90.
- fps: ≥ 50 fps at 4× CPU throttle on the hero waypoint (record trace to
  `docs/qa/t10/`). Below → reduce particle count → then DPR → never below 40.
- **NEW — perceptibility gate** (`scripts/visual-gate.mjs`, Task 1): fails the
  build if the scene isn't visibly there. Algorithm: Playwright chromium
  1280×800 loads the served build, waits for canvas, screenshots at scroll
  progress 0 / 0.20 / 0.55 / 0.95 into `docs/qa/t10/wp-*.png`; parse PNGs
  (`pngjs` devDep); classify each pixel: *scene pixel* = channel distance from
  bg `(11,11,13)` > 24 AND not near-white text (not all channels > 220).
  Thresholds: hero frame ≥ **18%** scene pixels; every frame ≥ **10%**; orange
  presence in every frame: ≥ **1.5%** pixels with `R > 1.5×G` and `R > 90`.
  Print the percentages; exit 1 below threshold. Screenshots are ALWAYS saved —
  they are Sid's review artifacts.

## THE SCENE — "The Prospect Engine" (all procedural, no .glb)

A dark void containing a living machine — Prospect visualized:

| Element | Spec |
|---|---|
| **The Core** | Icosahedron (detail 2, radius ~1.6) — outer orange wireframe (`LineSegments`, EdgesGeometry, opacity 0.85) over an inner dark solid mesh (near-black, flat) so back edges occlude; slow rotation (0.04 rad/s, two axes); breathing scale ±1.5% (8 s period); pointer parallax tilts the whole scene group ±3°, damped lerp 0.06 |
| **Data streams** | 5–6 `CatmullRomCurve3` paths flowing from off-screen edges INTO the core; ~4500 particles total (`THREE.Points`, custom shader: size attenuation, head-bright/tail-faint alpha along curve t, orange for 70%, grey-white 30%); speeds varied; one **exit stream** leaves the core downward-forward, brighter — ingestion → sorted output, Prospect's story |
| **Stage ring** | 6 nodes orbiting the core (radius ~2.6, slow counter-rotation): small octahedrons + additive-blend glow sprites; each pulses softly in sequence (SCAN→…→DELIVER cadence, 6 s loop) |
| **Satellite system** | Smaller node cluster (~14% core scale) off to the side — one router node with two orbiting fallback nodes exchanging a thin particle arc (the Travel Planner agent) — only resolves clearly at waypoint C |
| **Environment** | 1800-point dust field (tiny, alpha 0.25, slow drift); `THREE.Fog(#0B0B0D, 6, 22)`; a vast thin wireframe grid plane ~4 units below (grey `#26262A`, opacity 0.18) fading into fog — the igloo "floor" depth cue |
| **Glow** | Additive sprites (radial-gradient canvas texture, orange) behind the core (~3 units, opacity 0.22) and at each stage node — this is the visible orange light the perceptibility gate expects |

**Visibility floor:** on the hero frame the scene must be *obviously* present —
wireframe core, moving streams, orange glow — sharing the frame with the text,
core sitting center-right behind/beside the headline. Not a faint texture. If a
screenshot could be mistaken for "black background", it fails.

## Scroll choreography — camera waypoints

Scroll progress `p` = smoothed page scroll (Lenis scroll value / max; fallback
`scrollY/maxScroll`; damped lerp 0.06 per frame). Camera + scene state
interpolate through:

| WP | p range | Home section over it | Camera & scene |
|---|---|---|---|
| A | 0.00–0.12 | Hero | Wide shot, core center-right at (1.8, 0.2, 0), camera z≈7; streams at 60% brightness |
| B | 0.12–0.32 | Prospect teaser | Dolly in to z≈4.2, orbit ~25° so the stage ring resolves; streams 100%, ring pulse prominent |
| C | 0.32–0.48 | Travel Planner teaser | Pan/track left; satellite system enters frame right, core recedes; satellite arc brightens |
| D | 0.48–0.72 | Grid + timeline + skills | Pull back and up to z≈9, y≈2.5; whole scene dims to 45% (content legibility first); grid-plane fills lower frame |
| E | 0.72–1.00 | Pub/OSS + contact | Return head-on to core, z≈5; core pulse intensifies; single bright stream flows TOWARD camera; at p>0.95 slow drift hold |

Transitions ease (smoothstep between waypoints). Nothing snaps. Feels weighted
and engineered — igloo, not a slideshow.

## Tasks (commit each; gates after each)

**T10.0 — Amendments + deps.** Append to DESIGN.md §6:
```
| D30 | 2026-07-05 | three.js/R3F approved; home JS budget →480 KB gzip; home perf gate 90→85 | Sid's explicit bar is the igloo/Glyphic scroll-driven 3D tier; unreachable without a real scene. |
| D31 | 2026-07-05 | Perceptibility gate (visual-gate.mjs) added as merge gate | T9 shipped spec-compliant but imperceptible atmosphere; pixel thresholds make invisible work fail CI. |
| D32 | 2026-07-05 | Hero TextPressure name REMOVED (was rendering broken: clipped H, collapsed space) — hero returns to COPY.md spec: mono eyebrow name + h1 headline; scene is the visual | One centerpiece per screen; the 3D engine replaces the type experiment. |
```
Install `three @react-three/fiber @react-three/drei` + `pngjs` (dev). Update
guards budget to 480 (home) and add `visual-gate` to the CI quality job after
lighthouse-gate. **Done:** build green, deps locked.

**T10.1 — visual-gate.mjs** exactly per the algorithm above. Test it fails on
the CURRENT build (it must — that proves it works), record the failing
percentages in the commit message. **Done:** gate demonstrably red on old look.

**T10.2 — Scene static composition.** Canvas + core + environment + glow + grid
plane at waypoint-A framing, no scroll yet. Hero eyebrow/h1/sub/CTAs unchanged
above it. Remove TextPressure from the hero (D32). **Done:** visual-gate hero
frame passes ≥18%; fps trace recorded; screenshots in `docs/qa/t10/`.

**⛔ STOP 1 — SID APPROVAL.** Present wp-0 screenshot + `npm run dev`. Do not
proceed until Sid approves the composition. His feedback = adjustments here.

**T10.3 — Data streams + stage ring + satellite.** All particles/curves per
spec. **Done:** motion visible in a 3-s screen recording saved to docs/qa/t10/;
fps ≥50 @4×; gates green.

**T10.4 — Scroll rig.** Waypoint camera system A→E with damping; scene dim at D;
pointer parallax (`pointer:fine`). **Done:** all four visual-gate frames pass;
manual scroll-through feels continuous (no snaps); gates green.

**⛔ STOP 2 — SID APPROVAL.** Screenshots at all waypoints + dev walkthrough.

**T10.5 — Mobile + fallbacks.** Coarse-pointer profile (half particles, DPR 0.6,
no parallax); reduced-motion → poster; WebGL-fail → CSS layer; verify Playwright
mobile project green; Lighthouse mobile home ≥85. **Done:** gates green on both
projects.

**T10.6 — Case-study heroes get the amped PaperInk.** Reuse the shipped
`PaperInkCanvas` on /prospect and /travel-planner heroes with VISIBLE settings:
grain `*0.16` centered (±0.08), ink clamp 0.35, pointer trail radius +40%.
**Done:** case pages pass a 10%-scene-pixel visual check (extend visual-gate
with the two URLs at p=0), perf ≥90 kept there.

**T10.7 — Poster + polish.** Capture the wp-0 render as an optimized webp
poster (reduced-motion + no-JS background); grid backdrop tiles opacity
0.12→0.22 with gap glow up; verify glass nav + pipeline particles + transitions
(T9 keepers) still coherent over the new scene. **Done:** full gate suite green;
`docs/qa/qa-report.md` updated with new numbers + screenshot index.

**T10.8 — Final sweep.** `npm run build && npm run guards && npx playwright
test && node scripts/lighthouse-gate.mjs && node scripts/visual-gate.mjs` all
green; commit; **never push**. Report to Sid with the waypoint screenshots
inline.

## ⛔ STOP 1 FEEDBACK (Sid, 2026-07-05) — apply BEFORE T10.3

Sid reviewed the composition. Verdict: the core is good but it reads as **an
object floating on black, not a world**. Apply all of the following, then
re-screenshot and show Sid again (STOP 1 repeats until he approves):

**F1 — Make it an ENVIRONMENT, not a decal.** The camera must feel *inside*
the scene: (a) streams enter from ALL frame edges and cross the full viewport,
not just near the core; (b) dust field spans the entire frame with slight
z-parallax layers; (c) grid floor visible across the lower third at waypoint A,
receding into fog; (d) glow sprites bleed wider (soft orange light reaching
mid-frame); (e) core scaled/positioned so it occupies ~45–55% of frame height,
center-right, partially cropped by frame edge is acceptable and igloo-like;
(f) constant subtle idle camera drift (±0.15 units, 20 s loop) so the world
never sits still. The visual-gate hero threshold rises to **≥ 35%** scene
pixels (was 18) — codify in visual-gate.mjs.

**F2 — Restore the BIG display name.** Sid wants the giant name back (D32's
removal reversed — log as D34). Hero layout: giant decorative name (a `<p
aria-label>`, NOT the h1 — h1 stays the headline) at
`clamp(3.5rem, 10vw, 8rem)` Space Grotesk. Treatment, in preference order:
1. **TextPressure, FIXED**: (a) preserve the word gap — render the space char
   as an inline-block spacer of `0.35em` width, excluded from the variation
   loop; (b) fit-to-width: after mount, measure rendered width and scale
   font-size down until it fits the container with 2% margin (loop max 3
   iterations), plus `overflow: hidden` on the wrapper as a safety; (c) SSR
   size via the existing cqi formula but with divisor tuned so nothing clips
   before hydration. Two honest attempts; if it still misrenders at any
   viewport (375/768/1280 screenshot check),
2. **fall back to DecryptedText** on the same giant type: decode-on-load,
   sequential, ≤900 ms, then static. Either way: name overlays the 3D scene —
   scene glow behind type is the composition (igloo hero grammar).

**F3 — Lanyard ID card ships (new Task T10.9, after T10.7).** Sid's
profile-pic-card research (`profile-pic-card.md` donor) joins the build now
that three.js is in the bundle anyway. Placement: the **contact section** —
the physics lanyard card drops in and hangs, draggable, when the visitor
reaches p ≈ 0.75. Rules: deps `@react-three/rapier` + `meshline` +
`card.glb`/`lanyard.png` from the React Bits repo assets; **lazy-mount only
when the contact section is within one viewport** (dynamic import on approach)
so it costs nothing at load; donor rule applies — card face redesigned with
DESIGN.md tokens (front: orange band, mono name + "AI BACKEND ENGINEER", back:
QR to the site or GitHub); use a **generated monogram card face until Sid
supplies his photo** (placeholder frame listed in the launch checklist);
error boundary → static card image; reduced-motion → static card image;
mobile: rendered but physics timestep 1/30, drag enabled. Budget: home ceiling
600 KB gz **only when the contact chunk loads** — the initial-load budget
stays 480 (assert both in guards: initial chunks ≤480, total ≤620). Log D35.

**F4 — For the record (Sid's questions, answered in-plan):** orange is Sid's
own brand decision D1 (Prospect = prospecting story, distinct from AI-blue
portfolios, NOFace black-on-orange lineage) — it stays. GridMotion lives as
the illuminated backdrop behind the home project grid (amped in T10.7). The
PaperInk shader lives on the case-study heroes (T10.6) — home carries the 3D
engine; one ambient system per page.

**F5 — Intro/loading screen (Sid-approved concept: "core assembles").**
New task, runs before T10.4. igloo-style real-time intro that flows seamlessly
into the scene: black overlay → orange particles converge and assemble into
the wireframe core → `SIDDHARTH SINGH` decrypts (DecryptedText, mono) with a
mono percent counter → overlay lifts and **the assembled core stays as the
hero scene** (same scene graph — no swap, no cut). Rules: (a) the overlay is
SSR'd with a CSS keyframe auto-dismiss at 2.2 s as the no-JS/failure safety;
(b) JS dismisses earlier when scene-ready (max 1.6 s); (c) the big decrypting
name paints within ~0.4 s so it is the LCP — verify LCP does not regress past
2.0 s observed; (d) skipped entirely on reduced-motion and on repeat visits
(sessionStorage flag); (e) **use the counter time honestly**: warm shaders,
prime particle buffers, and prefetch the grid-backdrop images during the
preloader (the actual igloo loading strategy, per the case study).

**F6 — Lanyard moves OFF home → new `/about` page (supersedes F3 placement).**
Sid's taste call: the physics ID card must not clutter home. Create a 5th
page `/about`: the draggable Lanyard card (donor `profile-pic-card.md`, token
skin, monogram face until Sid's photo arrives) + a 5-line first-person bio
composed from CONTEXT.md §3's three identities (**education still excluded**)
+ email/GitHub/LinkedIn links. Clicking the nav wordmark name AND the hero
name routes to `/about`. Housekeeping (all mandatory): add /about to
sitemap.xml, guards' page map + allowed list, smoke + axe test lists,
visual-gate URL list (≥10% scene pixels — the card + void), OG image + title
per COPY.md conventions. Amend CONTEXT.md §1: "no About section" is
superseded by Sid 2026-07-05 (log decision D36). Home JS budget unaffected —
rapier/meshline/glb load only on /about.

**F7 — Grid tiles: Sid supplies rough screenshots (his pick).** Sid will drop
unpolished screenshots (Prospect runs, terminals, dashboards) into
`site/public/tiles/` — the GridBackdrop auto-picks up every image in that
folder at build time, applies blur(8px) + brand tint + **0.30–0.35 opacity**
(visible!), and falls back to branded generated tiles (OG crops, mono repo
names) for empty slots. Listed in the launch checklist as a Sid asset.

**F8 — Case-study-informed craft rules (from `Igloo Inc Case Study.md`):**
(a) hero copy block gets a subtle radial scrim (≤30% darkening) behind the
text so the 35%-scene-pixel world never costs legibility — add a text-region
contrast check to visual-gate (sample the h1 bounding box: text/background
contrast must stay ≥ 4.5:1); (b) optional tasteful RGB-split micro-glitch
(CSS, ≤120 ms) on the section eyebrow when a waypoint transition completes —
one accent, not a theme; (c) **no sound** — deliberate: recruiters open sites
in offices; autoplay audio is hostile (igloo's soundtrack is the one reference
element we consciously reject); (d) previs discipline: every STOP presents
screenshots BEFORE polish continues, matching abeto's grey-mockup process.

**F9 — Ambition calibration (Sid-approved): AI-max now, artist step later.**
This build targets the best procedural scene an executor can produce (world +
camera journey + intro + particles ≈ level 70 of igloo's 99). A future task
**T11 — authored centerpiece** is reserved: one artist-made .glb (Sid in
Blender, or commissioned) drops in to replace the procedural core; everything
else (camera rig, particles, preloader, gates) is built to survive that swap
unchanged. Do not fake authored-art quality procedurally — coherent and alive
beats overreaching and broken.

## ⛔ STOP 1 FEEDBACK — ROUND 2 (Sid, 2026-07-05, from live dev review) — apply F10–F16

**Process failure first (F10-zero):** Sid saw a React console error
(duplicate key) and a half-baked loading screen at a STOP presentation. The
smoke suite catches console errors — meaning **gates were not run before
presenting**. New hard rule: `npm run build && npm run guards && npx
playwright test` must be GREEN before every STOP presentation, and the STOP
message must paste the test summary line as proof. A STOP presented with
failing/unrun gates is itself a failure.

**F10 — Loading screen: rebuild to this exact spec** (Sid's verdict on the
current one: unacceptable). Sequence, precisely:
1. 0–150 ms: black `#0B0B0D` overlay; mono eyebrow `INITIALIZING — PROSPECT
   ENGINE` fades in (200 ms).
2. 150–1200 ms: ~600 orange particles fly in from frame edges along eased
   curves (`--ease`, staggered) and assemble the wireframe core
   silhouette center-frame; simultaneously `SIDDHARTH SINGH` decrypts
   (sequential, center-out, ≤900 ms) at display size below it; mono counter
   `00 → 100` bottom-left, monotonic, tied to REAL asset progress (never
   fake-stalls, jumps to 100 when ready).
3. 1200–1600 ms: counter hits 100 → one soft core pulse → overlay text exits
   (fade+8 px up, 250 ms) → the assembled core *continues seamlessly* as the
   hero scene (same scene graph, camera eases from intro framing to
   waypoint A over 800 ms). No cut, no flash, no layout shift.
4. Skips: reduced-motion, repeat visit (sessionStorage), >2.2 s failsafe.
**Done when:** a screen recording of the full sequence is saved to
`docs/qa/t10/` and Sid approves it at STOP — the recording is mandatory.

**F11 — IA restructure (Sid's call): home = 2 flagships, grid moves to /projects.**
- Home sections become: hero → SYSTEM/01 Prospect (RICHER: teaser copy + the
  6-stage pipeline strip + 2–3 live-status pills + a small stat row) →
  SYSTEM/02 Travel Planner (same richness) → condensed timeline → skills →
  contact CTA. The 4-card grid LEAVES home.
- New page `/projects`: the 4 cards (Sindhey, Robot, MTK, TrueNAS) with the
  GridBackdrop illuminated-tile treatment behind them (it moves here too),
  live GitHub stats, room to grow. Title/description/OG per COPY.md
  conventions; add to nav (`Projects`), sitemap, guards page-map + allowed
  list, smoke/axe/visual-gate lists.
- **Contact must visibly work:** the nav `Contact` link scrolls to the footer
  contact block — fix the anchor (`id="contact"` on the section, verified
  scroll), Lenis-aware. Every nav item must do something observable.
- Site is now 6 pages: `/`, `/prospect`, `/travel-planner`, `/projects`,
  `/about` (F6), `/404`. Log D37.

**F12 — Nav glass: replace backdrop-blur with Sid's fluted-glass shader.**
Sid rejects the blur. Use **`@paper-design/shaders-react`** → `FlutedGlass`
(or the library's closest equivalent) as the nav background layer, mapped to
his exact reference
(https://shaders.paper.design/fluted-glass#colorBack=000000eb&colorShadow=ff59004f&colorHighlight=e8e8e8&size=0.62&shadows=0.25&highlights=0.1&shape=lines&angle=0&distortionShape=prism&distortion=0.5&shift=0&stretch=0&blur=0&edges=0.25&margin=0&grainMixer=0&grainOverlay=0&scale=1&fit=cover):
`colorBack rgba(0,0,0,0.92)`, `colorShadow #FF5900 @ 0.31`, `colorHighlight
#E8E8E8`, `size 0.62`, `shadows 0.25`, `highlights 0.1`, `shape lines`,
`angle 0`, `distortionShape prism`, `distortion 0.5`, `blur 0`, `edges 0.25`.
Nav-strip canvas only (~64 px tall — cheap). Check the package's actual prop
API and bundle cost first; fallback (package unusable or >25 KB gz): CSS
`repeating-linear-gradient` fluted-lines approximation over 92% solid — NOT
the old blur. Log the choice.

**F13 — Bug & warning fixes (all from Sid's dev console):**
1. `ProspectDiagram.tsx` duplicate React key `merlin-cli/bridge` — the label
   is used as key and appears twice; key by `${label}-${x}` or index. Same
   audit on TravelPlannerDiagram and every `.map` in both diagrams.
2. `next.config.ts`: set `turbopack.root` to the site directory (kills the
   multi-lockfile workspace warning).
3. Add `data-scroll-behavior="smooth"` to the `<html>` element (Next 16
   route-transition warning).
4. `THREE.Clock` deprecation — comes from R3F/drei internals; verify it's not
   OUR code using Clock (if ours, switch to `THREE.Timer`; if internal,
   record as known-upstream in TESTING.md).

**F14 — Case-study pages are "lifeless" (Sid):** apply T10.6 (amped PaperInk
hero) NOW, plus: scroll choreography on their sections, the scroll-lit
pipeline + particles verified working, hover states on every component-board
row, a mono stat strip under each hero (e.g. `11 STAGES · 15–20 GB/DAY ·
RUNNING LOCAL` from verified claims only), and the RGB-split micro-accent on
eyebrow arrival. These pages must pass the same visual-gate ≥10% scene-pixel
check. STOP presentation includes both case pages.

**F15 — Link-integrity guard (new, in guards.mjs):** parse every built page's
internal `href`s; every one must resolve to an existing exported page, file,
or an anchor id present in the target page. Dead nav items = red gate.
(This catches "Contact does nothing" class bugs forever.)

**F16 — Sid-supplied reference links are binding inputs.** When Sid drops a
URL (like the fluted-glass link above), the executor must open/read it and
implement from its actual parameters/API — never approximate from the URL
text alone. If it can't be fetched, say so at the STOP and ask.

## ⛔ STOP 2 FEEDBACK — ROUND 3 (Sid, 2026-07-05) — apply F17–F24

Sid approved the scene direction ("it is good now") — the 3D world stays as
built. Everything below is about what surrounds it. His words, now doctrine:
**"Understanding what I want is important, but understanding what I DON'T
want is more important."**

### F17 — THE DON'T-WANT LIST (binding anti-requirements — check EVERY task against this)

Compiled from every piece of Sid feedback across T9–T10. Violating any row at
a STOP = rejected work, regardless of green gates:

| # | Sid does NOT want | Origin |
|---|---|---|
| N1 | Invisible/imperceptibly-subtle effects ("spec-compliant but can't see it") | T9 failure |
| N2 | A 3D object floating on black posing as a world | STOP 1 |
| N3 | Generic filler copy; thin, timid, small text on showcase sections | Round 3 |
| N4 | Dead scroll space: no stretch of home > ~40vh with neither content nor a deliberate scene moment | Round 3 |
| N5 | Pages that are structurally complete but FEEL like wireframes — structure ≠ done; a page without its atmosphere layer + choreography is unfinished and must not be presented | Round 3 |
| N6 | Backdrop-blur glass (the fluted-glass shader replaced it — never regress) | Round 2 |
| N7 | shadcn boilerplate, `lib/utils`/`cn` imports, lucide icons, Unsplash/stock images arriving via donor snippets — take mechanics, strip their ecosystem | Donor rule |
| N8 | Fake or stalling progress counters | F10 |
| N9 | Sound/autoplay audio | F8 |
| N10 | STOP presentations without green gates + pasted proof | F10-zero |
| N11 | Dead links or nav items that do nothing observable | Round 2 |
| N12 | Education, phone number, invented metrics — anywhere, ever | Founding rules |
| N13 | Colors outside black/grey/orange (no rainbow, no purple, no lava-lamp) | T10 rules |
| N14 | Scroll-jacking that breaks native scroll, ctrl-F, or anchors | DESIGN.md |
| N15 | Toys cluttering the home page (physics card lives on /about only) | Round 1 |
| N16 | "Gates green" offered as proof of visual quality — for visual work the proof is screenshots/recordings | T9 lesson |

### F18 — Loading screen v3: Sid-supplied GooeyLoader (replaces F10's particle assembly — that concept is dead after two failures)

Sid supplied the component. Donor mechanics (SVG gooey filter + two blobby
circles rolling along a baseline) — adapt EXACTLY this, skinned to brand.
Essential donor code (self-contained; the snippet's shadcn/unsplash/lucide
instructions are VOID per N7 — no `cn`, no `lib/utils`, plain template class
strings):

- SVG filter: `feGaussianBlur stdDeviation=12` → `feColorMatrix` alpha matrix
  `18 -7`-class goo → `feComposite atop` (use the donor's exact values:
  `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -7`).
- `.gooey-loader`: `12em × 3em`, overflow hidden, `border-bottom: 8px solid
  var(--line)` (#26262A), `filter: url(#gooey-loader-filter)`.
- `::before`: 22em×18em circle, **`--accent` #FF5C1A**, `wee1` 2 s linear
  infinite (translateX −10em→7em, rotate 0→180°).
- `::after`: 16em×12em circle, **`--accent-dim` #DB4A0F**, `wee2` 2 s linear
  infinite 0.75 s delay (translateX −8em→8em, rotate 0→180°).
- `role="status" aria-label="Loading"`.

Overlay composition (keeps F10's non-visual rules): black `#0B0B0D` overlay →
mono eyebrow `INITIALIZING — PROSPECT ENGINE` (top-left, fades in 200 ms) →
**GooeyLoader centered** (sized ~0.9em base font so ≈11 rem wide) →
`SIDDHARTH SINGH` decrypting below it (DecryptedText, display size) → mono
counter `00→100` bottom-left tied to REAL progress (N8). Dismiss when
scene-ready (≤1.6 s target): overlay fades 250 ms, loader scales out 0.96,
scene already rendering beneath. Skips: reduced-motion, repeat visit
(sessionStorage), 2.2 s failsafe. LCP rule unchanged (big name paints early).
**Done when:** recording saved to `docs/qa/t10/` AND Sid approves it — a
loading screen without his explicit yes does not ship (third strike rule).

### F19 — Every page gets its atmosphere BEFORE any further STOP (kills N5)

Current state per Sid: subpages have **no background** and read as wireframes.
Mandatory layers (most already specced — this makes them blocking):
- `/prospect`, `/travel-planner`: amped PaperInk hero (T10.6/F14 settings) +
  scroll choreography + scroll-lit pipeline/particles + hover states + mono
  stat strips (F21 copy).
- `/projects`: GridBackdrop illuminated tiles (F7/F11) behind the cards.
- `/about`: the void treatment (dust + subtle glow, reuse scene environment
  elements cheaply or CSS variant) behind the Lanyard card + bio.
- `/404`: existing decrypt treatment + CSS grain.
Visual-gate extends to ALL pages: every page ≥10% scene pixels + ≥1.5% orange
at p=0. A page failing this is unfinished (N5) and cannot be presented.

### F20 — Typography & density pass (kills N3/N4: "so much empty space, text too small, not optimized")

- Section lead paragraphs: `1.25rem` minimum, `1.563rem` on ≥768 px (not body
  1rem). Leads max 60ch; body stays 68ch.
- SYSTEM/01 and SYSTEM/02 sections must FILL their viewport: expanded copy
  (F21), the 6-stage pipeline strip, live status pills, mono stat row,
  "Read the system breakdown →" CTA — composed so no >40vh gap exists (N4).
  Where space IS intentionally open, the 3D scene must be doing something
  there (a waypoint moment), or it's a violation.
- Timeline/skills/contact: tighten vertical rhythm (section padding stays,
  but intra-section dead gaps close); skills rows get their category labels
  at eyebrow scale, items at 1rem minimum.
- Audit at 1280 AND 375: screenshot every section; any frame that is mostly
  empty black with a small text island fails (N3/N4).

### F21 — Copy enrichment (verbatim-usable; append to COPY.md §Home / §Prospect / §Travel-Planner / §Projects / §About in the same commit — COPY.md stays the single copy source)

All lines below use ONLY verified claims (V1–V8 register). Executor may not
alter or extend them:

- **Hero stat strip** (mono, under the sub-paragraph):
  `11-STAGE PIPELINE · 15–20 GB SCANNED DAILY · RUNS ON MY OWN HARDWARE`
- **SYSTEM/01 second paragraph** (after the existing lead):
  "No job boards, no third-party crawlers. Prospect reads the same newspapers
  a human would — then does the part humans skip. It OCRs every page, extracts
  each posting with an LLM, embeds and scores it against persona-scoped
  resumes, and writes the ranked shortlist to my phone. Eleven stages, running
  unattended on hardware I own."
- **SYSTEM/02 second paragraph**:
  "Cloud APIs degrade. Rate limits hit. This agent is built for that moment: a
  deterministic memory layer so retries never repeat work, a router that picks
  the right model per task, and an async circuit breaker that swaps to local
  Ollama inference mid-stream — the response never stops. Deployed on a
  k3s multi-node cluster with Prometheus and Grafana watching every request."
- **`/prospect` hero stat strip**: `11 STAGES · 15–20 GB / DAY · RUNNING LOCAL`
- **`/travel-planner` hero stat strip**:
  `K3S MULTI-NODE · CIRCUIT-BREAKER FALLBACK · SSE STREAMING`
- **`/projects` intro** (under an `INDEX / ALL SYSTEMS` eyebrow):
  "Systems beyond the flagships — a shipped client platform, published
  hardware, security research, and the lab work that taught me the most."
- **`/about` bio** (first person, 5 lines, education excluded per N12):
  "I'm Siddharth — an AI backend engineer in Noida. I build agentic systems
  that keep working when no one's watching: pipelines that read, match, and
  deliver on their own schedule, and agents that survive their own failures.
  Before that I led the build of an autonomous firefighting robot, and took a
  healthcare platform from zero to production in six weeks. I like honest
  status labels, observable systems, and tools that earn their place.
  The card is real — drag it."

### F22 — Page-completeness table at every STOP

Every STOP presentation includes this table, one row per page:
`page | sections present | atmosphere layer | choreography | visual-gate % | gates`.
"Not all subpages built" must never again be a question Sid has to ask — the
table answers it before he does.

### F23 — Approval cadence (Sid's explicit demand)

After EVERY task that changes anything visible, the executor asks Sid to look
(dev URL + screenshots; recording for motion work) and waits. Small tasks may
be batched into one presentation ONLY if none of them touch the hero, the
loader, or a page's atmosphere. The ask must state in one line what changed
since the last look.

### F24 — Decision-log rows for this round

```
| D38 | 2026-07-05 | Don't-want list (N1–N16) codified as binding anti-requirements | Sid: knowing what he doesn't want matters more than what he wants. |
| D39 | 2026-07-05 | Loading screen v3 = Sid-supplied GooeyLoader, brand-skinned (orange/dim-orange goo, --line baseline); particle-assembly concept retired after two failed attempts | Sid's explicit pick; donor mechanics kept, shadcn ecosystem stripped (N7). |
| D40 | 2026-07-05 | Typography density floor: leads ≥1.25rem, no >40vh dead scroll gaps, per-section screenshot audit at 1280+375 | Sid: "so much empty space, text too small, no richness." |
| D41 | 2026-07-05 | Visual-gate extended to all 6 pages (≥10% scene / ≥1.5% orange each) | Sid: subpages have no background and feel like wireframes. |
```

## Kickoff prompt (Sid: paste to DeepSeek/GLM)

```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md, DESIGN.md, and
reference-website-1.md, then execute
/home/sidd/project/freelance/portfolio-website/T10-ENGINE.md at maximum
effort: the base tasks plus ALL THREE feedback rounds (F1–F24), in order,
skipping anything already shipped and approved. Before writing any code, read
the F17 DON'T-WANT LIST — every task is checked against it, and violating it
rejects the work even with green gates. The approved 3D scene stays as-is;
this round is the loading screen (F18 — Sid's GooeyLoader, his explicit
pick), atmosphere on every subpage (F19), typography/density (F20), and the
new copy (F21 — verbatim, no edits). Gates green + pasted proof before every
presentation; screenshots/recordings are the proof for visual work; ask Sid
to look after every visible change (F23). One commit per task, no attribution
trailers, never push. Address the user as Sid.
```
