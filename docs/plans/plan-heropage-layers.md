# Hero Page Layer Restack — Implementation Plan v3 (Final)

> 2026-07-06. All 8 layers with full scope. Self-grilled against actual code.

## Scope

| Layers | Scope |
|--------|-------|
| **0–4** | Entire hero page — waypoints A→E, full scroll, top to bottom |
| **5.1** | Nav bar area only — visible during scrollY 0→100 |
| **5.2** | Nav bar area only — always visible |
| **6** | Entire hero page — reserved for future |
| **7** | Waypoint 1 (initial load) — covers first render, dismisses before user scrolls |
| **8** | Entire hero page + all subpages — topmost element everywhere |

---

## Layer 0 — Base Background (Graphite Only)

**Z-index:** `z-0` (implicit — CSS `background-color` on `<body>`, no stacking context needed)
**DOM:** `<body className="bg-[--bg]" style="backgroundColor: #0B0B0D">` in `layout.tsx:79`
**Contents:** Dark graphite `#0B0B0D` fill. No PaperTexture, no shader, nothing else.
**Code change:** None. Documentation-only.
**Rationale:** Already exists. This is the deepest visible layer — everything renders on top.

---

## Layer 1 — Fallback (Poster)

**Z-index:** `z-[1]`, `position: fixed`, `pointer-events: none`
**DOM:** `PosterDiv` in `EngineLoader.tsx`, `<noscript>` inline div in `EngineLoader.tsx`
**Contents:** Static `poster-home.webp` image, `background-size: cover`
**Behavior (per Sid):**
- Show IF 3D engine fails (WebGL context creation error) **OR** JS is turned off
- Once shown → stays shown. Does NOT toggle back and forth.
- Resets on page reload or navigation to subpage (component remounts)
- This is already enforced by React error boundary semantics — `EngineErrorBoundary` catches error once, renders fallback permanently until remount
- `<noscript>` poster covers JS-off case — browser shows it automatically when JS disabled, hides when JS runs

**Open Questions:**
- **Q1:** I tried to test Layer 1 — turned off JS, loaded localhost, and only saw Layer 0 (graphite background), not the poster fallback. Why didn't Layer 1 appear?

**Answers:**
- **A1:** The `<noscript>` poster is rendered inside a `"use client"` React component (`EngineLoader.tsx`). When JS is off, React never executes — the entire `EngineLoader` component never hydrates/render. The `<noscript>` tag is never injected into the DOM. It needs to be in the server-rendered HTML to work without JS. Currently it's trapped inside a client component. **Fix:** Move the `<noscript>` block into the root layout (`layout.tsx`) which IS server-rendered, or into the page itself outside the client boundary.
 yes impliment 
**Code changes:**
1. `EngineLoader.tsx:30` — `PosterDiv`: `z-0` → `z-[1]`
2. `EngineLoader.tsx:95` — `<noscript>` inline: `z-index:0` → `z-index:1`

---

## Layer 2 — 3D Engine

**Z-index:** `z-[2]`, `position: fixed`, `pointer-events: none`
**DOM:** `<div className="fixed inset-0 z-[2]"><Canvas>` in `EngineCanvas.tsx:295`
**Contents:** ALL Three.js scene objects. Single DOM layer with internal scene-graph ordering:

| Sub-order | Category | Objects | Role |
|-----------|----------|---------|------|
| **Background** (renders first) | Environment | `DustField` ×2, `Satellite`, ambient glow sprites (×2, opacity 0.08–0.12), `GridFloor` | Atmospheric backdrop — dust, satellite node, subtle glow, grid plane |
| **Foreground** (renders on top) | Core | `Core` (icosahedron + 4 `SpriteGlow` halos), `StageNodes` (6 octahedrons on counter-rotating ring, each with glows), `DataStream` ×8 (CatmullRom particle curves — 5 orange + 2 grey + 1 exit) | Focal elements — glowing core ball, orbital nodes, particle streams |

**Code change:**
1. `EngineCanvas.tsx:295` — Container `<div>`: `z-0` → `z-[2]`

**Open Questions — Background (Environment) objects:**

- **Q2:** The Satellite is not visible at waypoint C. What shape is the satellite? What color? Why do the 2 red laser/interaction elements behave differently at waypoint D?
- **Q3:** The Core has glow around it but I don't see 4 distinct SpriteGlow halos. Are they there but blending together? 
- **Q4:** StageNodes — document says 6 octahedrons on a counter-rotating ring, but I only see 2 or 3 at some viewing angles. Is this because of their size relative to the core, their orbital radius relative to screen space, or occlusion?
- **Q5:** DataStream ×8 (CatmullRom particle curves — 5 orange + 2 grey + 1 exit) — are these the big orange square cubes I'm seeing? Or are those something else?

**Answers:**

- **A2 — Satellite visibility:** The code confirms satellite is only visible at `p > 0.28 && p < 0.48` (waypoint C range). At waypoint D (p 0.48–0.72) it's explicitly invisible. The satellite is a central octahedron (radius 0.49, accent orange `#ff5c1a`) with 2 orbiting octahedrons (one accent orange, one grey-white `#d4d4d8`) on orbital radii 1.6 and 2.0. The "2 red laser elements" you see are the two orbiting fallback nodes — one red/orange, one grey/white. At waypoint D, the satellite group is hidden, but you may see the torus ring or the particle arc (`DataStream` with 100 particles on a CatmullRom curve) rendered separately in scene. The satellite also has a thin particle arc connecting the two orbiting nodes, and a torus ring at radius 1.6.
sid - "0.28 < p < 0.48" include
  make .28 .20 and the .50 ivisible at waypoint 5 ok make satalight radious  .7x of current make sure orbiting nodes comes with it and  Option B — Hide all at D (runtime logic wins):

  ┌──────────────────────────────────┬─────────────────────────────────┐
  │ Pros                             │ Cons                            │
  ├──────────────────────────────────┼─────────────────────────────────┤
  │ Clean fade-out — satellite       │ Abrupt disappearance at p=0.48  │
  │ vanishes with scene dim (opacity │ feels broken if user scrolls    │
  │ 0.45)                            │ slowly                          │
  ├──────────────────────────────────┼─────────────────────────────────┤
  │ Text sections get full visual    │ Empty space where satellite was │
  │ priority — no background clutter │ — no replacement visual at WP-D │
  ├──────────────────────────────────┼─────────────────────────────────┤
  │ Matches current runtime behavior │ Waypoint config has stale       │
  │ — zero code change for this      │ satelliteVisible: true          │
  │ issue                            │                                 │
  └──────────────────────────────────┴─────────────────────────────────┘

  My recommendation: Go with Option B but add a smooth fade instead of a
  hard cut. The satellite group's opacity should lerp toward zero between
   p 0.44–0.48 instead of visible = false snapping. That way it
  gracefully exits instead of vanishing mid-scroll. 

- **A3 — SpriteGlow halos:** 4 halos ARE present (`SceneObjects.tsx` lines 96–99). They're positioned at `[0,0,-0.3]`, `[radius*0.6, radius*0.3, 0.2]`, `[-radius*0.4, -radius*0.5, 0]`, `[0, radius*0.2, radius*0.3]` with sizes proportional to radius (×6, ×4.5, ×3.5, ×2.5). Opacities are 0.32, 0.18, 0.14, 0.10 — all use `AdditiveBlending`, so they blend into one seamless glow. You won't see 4 distinct circles; you'll see one soft gradient glow. That's intentional.
put these currently as ivsible and may be depriciated and removed but do not remove just comment all code 
- **A4 — StageNodes visibility:** 6 nodes are created (for loop i=0..5, `SceneObjects.tsx` line 223). They're arranged at radius 5.5 on a tilted ring (`sin(angle*2)*0.6` y-offset). The counter-rotation (`rotation.y -= 0.15 * delta`) and sequential pulse cycle means only 1 node is "active" (scale 1.5×, opacity 0.5) at a time while the other 5 are dim (scale 1×, opacity 0.2). Combined with the camera angle and the ring tilt, you typically see 2–3 at once. Also, half the ring may be behind the core from any viewing angle. This is expected behavior.
sid - ok nut make them .7 the current size the base size as i feel they are a bit big and some look like cube some onlu square and some octahedran does these have differet shape or are rotationf on axis all 6 should match each other 
- **A5 — DataStream particles:** NO, these are NOT orange cubes. Each DataStream uses `ShaderMaterial` with `gl_Point` rendering — they are circular point-sprites (570–640 particles per stream) flowing along CatmullRom curves. The shader has head-bright/tail-faint falloff with additive blending. The "big orange square cubes" you see might be the StageNodes octahedrons (radius 0.66, orange, 6 of them on the ring) or the Core icosahedron itself. Or you could be seeing the Core edges (icosahedron wireframe with `lineBasicMaterial` at opacity 0.85). DataStreams are smooth, flowing particle trails — not cubes.
sid - i have seen this element i dont like it we permanently remove it 
---

## Layer 3 — Text

**Z-index:** `z-[20]`, `position: relative`
**DOM:** Applies to ALL text across waypoints A→E (full page scroll). Not limited to the hero `<section>`.
**Contents:** ALL text and text-supporting elements across the entire hero page, every section:

| Waypoint | Section | Text elements |
|----------|---------|--------------|
| 1 | Hero | Name: "SIDDHARTH SINGH", Headline, Subtitle, Stat strip, Location |
| 2 | Prospect Teaser | Eyebrow "SYSTEM / 01", Heading, Description paragraphs, Pipeline strip, Status pills, Stats row |
| 3 | Travel Planner Teaser | Eyebrow "SYSTEM / 02", Heading, Description paragraphs, Stats row |
| 4 | Experience Timeline | Eyebrow "Where the systems shipped", Timeline entries (×4), TimelineEntry period/role labels |
| 5 | Skills | Eyebrow "Stack", SkillsRow labels and skill text (×6) |
| 6 | Publication / Open Source | Eyebrow "Verifiable elsewhere", Publication text, OSS text, GitHub contributions |
| 7 | Contact CTA | "Know Me →" (treated as text label, button wrapper is Layer 4) |
| **Future** | Any section | Supporting images, graphs, charts related to text |

**Code change:** Every section's text content needs `relative z-[20]`. Currently only the hero section text has this — the other Sections rely on defaults. Each `Section` wrapper or its inner text container must carry `z-[20]`.

**Open Questions:**

- **Q6:** Plan lists 7 waypoints but I count only 5 sections on the page. Am I missing sections, or are some planned but not built yet?
- **Q7:** Are all waypoints equally divided (scroll = 100% / 7)? Or is scroll distance based on content density, importance, and amount of text at each waypoint?
- **Q8:** Is the scroll progression a dynamic/active scroll event (real-time camera movement), or static pre-calculated snap points?

**Answers:**

- **A6:** The 3D engine has 5 waypoints (A through E), not 7. You're confusing the 3D engine waypoints with the Layer 3 table which listed 7 content sections. The 3D camera has 5 waypoints defined in `EngineCanvas.tsx:63–67`:
  - **A:** p 0.00–0.12 (hero, frontal view)
  - **B:** p 0.12–0.32 (close-up, streams bright)
  - **C:** p 0.32–0.48 (satellite visible, camera pans left)
  - **D:** p 0.48–0.72 (wide shot, scene fades to 0.45 opacity)
  - **E:** p 0.72–1.00 (return, exit stream activates, slow drift hold at p>0.95)
  
  The page has 7 DOM sections (Hero, Prospect Teaser, Travel Planner Teaser, Experience Timeline, Skills, Publication/OSS, Contact CTA) but only 5 3D camera waypoints. The sections and waypoints are independent systems — content is DOM-based, camera is Three.js-based.
sid - combine dom experiance and skills to make 1 dom and combine dom publication oss contact me now the dom in herp page == waypint in heropage 
- **A7:** Waypoints are NOT equally divided. Each has a different scroll range based on content density:
  - A: 12% of scroll (hero — high density, early attention)
  - B: 20% (close-up transition)
  - C: 16% (satellite zone)
  - D: 24% (wide shot — largest range, content-dense sections)
  - E: 28% (exit zone — return + hold)
  
  The division is based on content importance, not equal distribution. Waypoint D has the most scroll real estate (24%) because it covers the most content-heavy sections.
sid ok make sense 
- **A8:** Dynamic and active. The system uses native `window.scrollY` with damped lerp (factor 0.06) to produce `smoothP`. Camera position interpolates in real-time between waypoints using `smoothstep` blending. Additionally, there's pointer parallax (±3° tilt) and idle drift (sin/cos oscillation). The camera is always moving smoothly based on actual scroll position — no snap points, no pre-calculated positions, no scroll-jacking. It's entirely passive: the camera follows your scroll naturally.
sid - good
---

## Layer 4 — Links / Effects

**Z-index:** `z-[30]`, `position: relative`
**DOM:** Applies to ALL interactive elements and effects across waypoints A→E (full page scroll). Not limited to the hero `<section>`.
**Contents:**

| Waypoint | Section | Interactive elements |
|----------|---------|---------------------|
| 1 | Hero | CTA buttons ("Email me", "Resume ↓") |
| 2 | Prospect Teaser | "Read the system breakdown →" button |
| 3 | Travel Planner Teaser | "Read the system breakdown →" button |
| 4 | Experience Timeline | TimelineEntry links (href to external sites) |
| 5 | Skills | (none currently) |
| 6 | Publication / OSS | Publication link, GitHub PR link, GitHub contributions link |
| 7 | Contact CTA | "Know Me →" button |
| **All** | Global | GlitchSync effect provider (context, no visual DOM), any future visual effects, hover effects, link animations |

**Code change:**
1. Ensure every link/button across ALL sections has `z-[30]` or sits inside a `z-[30]` wrapper
2. Extract hero CTA buttons from Layer 3 text div — wrap in `z-[30]` container
3. Audit all `<Button>`, `<Link>`, `<a>` elements across Sections for z-index consistency

**Open Questions:**

- **Q9:** Does GlitchSync apply to ALL links on the entire hero page (excluding nav bar buttons)?
- **Q10:** The big "SIDDHARTH SINGH" text in waypoint 1 — is glitch applied there too? And does the hover-to-enlarge-letter effect still work while glitch is active?
- **Q11:** For the flicker animation — are we using Setting 2 — AMPED (240ms, 3px, double flicker)?
- **Q12:** Is `file:///home/sidd/project/freelance/portfolio-website/docs/qa/glitch-demo.html` saved/referenced in the code comments so future agents know to ask which glitch style the user wants?
- **Q13:** The skills in waypoint 5 — are they filler/placeholder text, or real skills? Are there filler effects or animations occupying that space?

**Answers:**

- **A9:** GlitchSync (`GlitchSync.tsx`) fires on elements with CSS class `.link-pulse-auto` every 5 seconds (with 2s initial delay). It does NOT target all links. Only links explicitly marked with `.link-pulse-auto` or `.link-pulse-hover` get the glitch. From the page code, the publication link and GitHub links use `link-pulse-hover` and `link-pulse-auto`. Nav bar links use `className="group"` — they are NOT targeted by GlitchSync. So: only page-content links with those specific CSS classes get the glitch.
sid - ok 
- **A10:** The "SIDDHARTH SINGH" name uses `TextPressure` (variable font weight/width/italic axes on pointer move) when `TEXTPRESSURE_ENABLED` is true, or falls back to static `<p>`. It is wrapped in a `<Link href="/">` but has NO `.link-pulse-auto` or `.link-pulse-hover` class. GlitchSync does NOT target it. The TextPressure hover effect (letter enlargement based on pointer position) is independent of glitch — they're different systems. The name only glitches if we add the glitch CSS class to it. Currently: no glitch on the name, TextPressure handles the interactive scaling.
sid - make sure it has pulse and text pressure but no links
- **A11:** YES. The code confirms AMPED: `GlitchSync.tsx:24` fires `"glitch-amped 240ms steps(1) 1"` and `globals.css:124` defines `@keyframes glitch-amped` with the double-flicker pattern. The decision log in `T12-FINISH.md:152` records Sid's verdict: "AMPED (240ms, 3px, double-flicker variant)." This is the active setting.
sid - then why i see a flicker evr 5 sec inted of 2400ms make sure flicker evry 240ms
- **A12:** The file exists at `docs/qa/glitch-demo.html`. It is referenced in `T12-FINISH.md` (a build/decision log file, not an AGENTS.md or source code comment). It is NOT referenced in any source code comments (`GlitchSync.tsx` has no mention of it, `globals.css` has no mention). No future agent would discover this from code alone — they'd need to read `T12-FINISH.md`. The reference exists in build documentation only, not in the codebase.
sid - add to the souce code as comments and sy can refer user to use this to see different types animation possible
- **A13:** The skills in the Skills section are REAL skills, not filler. From `page.tsx` lines 214–241, they are explicitly listed: Python, FastAPI, LangGraph, LangChain, LLM tool calling, RAG pipelines, Ollama, llama.cpp, Pydantic, Node.js, PyTorch, OpenCV, OCR & layout detection, CNN training, Stable Diffusion/LoRA, Next.js, React, TypeScript, Tailwind, Zustand, Three.js, PostgreSQL, Redis, MongoDB, Pinecone, ChromaDB, FAISS, SQLite, Linux, Docker, k3s, AWS, GCP, Prometheus/Grafana, ZFS, CI/CD, C++, ESP32, Arduino, FPGA (Xilinx), I2C/SPI/UART, BLE. These are organized into 6 categories (AI/Backend, ML/CV, Frontend, Data, Systems/Ops, Embedded). The `SkillsRow` component renders them — no filler effects or placeholder animations occupy that space. The `ChoreoReveal` staggered entrance effect may animate them on scroll, but the content is real.
sid - ok
---

## Layer 5.1 — Nav Glass & Effects

**Z-index:** `z-[40]`, `position: fixed`, `top: 0`, `left: 0`, `right: 0`, `height: 64px`
**Scope:** Nav bar area only — visible during scrollY 0→100
**DOM:** Sibling of `<nav>`, extracted from Nav component
**Contents:**

| Element | Current position | Action |
|---------|-----------------|--------|
| `FlutedGlass` backdrop | Child of `<nav>` at `z-[-1]` (line 41) | **Extract** to sibling element at layout/component level |
| Visibility: currently `scrolled` (scrollY > 40) | `scrolled` state in Nav.tsx | Change to scrollY 0→100 range |

**Code change:**
1. In `Nav.tsx`: split return into fragment with two siblings:
   - FlutedGlass backdrop at `z-[40]` (visible scrollY 0→100)
   - `<nav>` at `z-[50]` (links only, no FlutedGlass child)
2. Update scroll listener: glass visible when scrollY ≥ 0 and scrollY ≤ 100

**Open Questions:**

- **Q16:** When does the FlutedGlass effect become visually visible — from page load (start), or only after scrolling past a threshold?

**Answers:**

- **A16:** Currently the FlutedGlass is visible only when `scrolled` is true (`scrollY > 40` in `Nav.tsx:24`). It's NOT visible at page load — the `<nav>` has `bg-transparent` initially. When the user scrolls past 40px, `scrolled` flips to true, the `bg-[--bg]/92` class appears on the nav AND the FlutedGlass backdrop renders (conditional: `{scrolled && (...)}` at line 41). So: only after scrolling past 40px threshold. The FlutedGlass stays visible thereafter because `scrolled` is a one-way toggle (it never resets to false even when scrolling back to top — but checking the code: `setScrolled(window.scrollY > 40)` is called on every scroll event, so it DOES toggle back to false when scrollY < 40). So FlutedGlass appears at scroll > 40px and disappears at scroll < 40px. Your new requirement (visible during scrollY 0→100) would change this to always show from start.
sid - comment in code making temp to be vissible from start regarless of scroll and make changes in code 
---

## Layer 5.2 — Nav Links

**Z-index:** `z-[50]`, `position: fixed`, `top: 0`, `left: 0`, `right: 0`, `height: 64px`
**DOM:** `<nav>` element, cleaned of FlutedGlass child
**Contents:**

| Element | Current position |
|---------|-----------------|
| Logo: "Siddharth Singh" / "SS" with DecryptedText | `Nav.tsx` lines 59–79 |
| Nav links: Prospect, Travel Planner, Projects, KnowMe | `Nav.tsx` lines 82–100 |
| Resume button | `Nav.tsx` lines 103–110 |
| Scroll-based bg: `bg-[--bg]/92` when scrolled | `Nav.tsx` className |

**Code change:**
1. Remove FlutedGlass div from inside `<nav>`
2. Change nav `z-50` stays (already correct)
3. Remove `z-[-1]` and `z-10` from inner elements (no longer needed without FlutedGlass nesting)

**Open Questions:**

- **Q14:** When does the DecryptedText animation for "Siddharth Singh" start — after the loading screen finishes fading out, or from page load (overlapping with loading screen)?
- **Q15:** The nav Resume button — does it link to a real PDF, or a placeholder file?

**Answers:**

- **A14:** The nav's DecryptedText uses `animateOn="hover"` (`Nav.tsx:66`) — it ONLY triggers when the user hovers over the logo. It does NOT animate on page load or after loading screen. It's purely hover-triggered. The IntroScreen has its own DecryptedText for the name reveal during loading (also `animateOn="view"`, IntroScreen.tsx line 236), which triggers when the phase 1 loading screen renders. The nav DecryptedText is independent — it waits for a hover event. So: the nav name is static until you hover over it, regardless of loading screen state.
sid - make it work on 2 triggers 1st when the hero pages is loaded and the loading screen is gone then the decrypt test start initially 1 time and then only when the curser hovvers over and when the subpages are loaded or selected the decrypt txt animation doesnt happens unlees curesor hovver and if the home page is reloaded then the decrypt txt animation happens only after loading screen ends 
- **A15:** Real PDF. The file exists at `site/public/resume-siddharth-singh.pdf`. The nav Resume button links to `/resume-siddharth-singh.pdf` which resolves to this file. It's a real asset, not a placeholder.
sid - make sure the file exist and if not put a place holder file 
---

## Layer 6 — Future Reserve

**Z-index:** `z-[60]`
**DOM:** None (currently)
**Contents:** Empty. Reserved for future additions without renumbering.
**Code change:** None. Documentation-only.

---

## Layer 7 — Loading Screen

**Z-index:** `z-[100]`, `position: fixed`, `inset: 0`
**Scope:** Waypoint 1 only — covers initial load, dismisses before user can scroll
**DOM:** `<div className="intro-overlay fixed inset-0 z-[100]">` in `IntroScreen.tsx:193`
**Contents:** IntroScreen overlay — "INITIALIZING — PROSPECT ENGINE" eyebrow, GooeyLoader SVG animation, DecryptedText name reveal, progress counter
**Behavior:** Renders during initial load, fades out (250ms), unmounts. Only relevant at waypoint 1 — once dismissed, user proceeds through waypoints 2→E.
**Code change:** None. Already correct.

**Open Questions:**

- **Q17:** What happens if I try to scroll while only the loading screen is visible? Will I see waypoint content and 3D elements loading underneath, or is everything blocked?
- **Q18:** Is the fade-out time-based (fixed 250ms) or progress-based (waits for all 3D elements, effects, and animations to finish loading)? Or is there a minimum display time + extra time if needed for rendering?

**Answers:**

- **A17:** The loading screen overlay is `fixed inset-0 z-[100]` with `bg-[--bg]` (solid graphite `#0B0B0D`) and `pointer-events-none` (`IntroScreen.tsx:193`). Pointer-events-none means the overlay does NOT block mouse/keyboard interaction — scrolling passes through to the page underneath. The 3D engine canvas is `fixed inset-0 z-0 pointer-events-none` — it also doesn't block scroll. So: if you scroll while the loading screen is visible, the page WILL scroll, you WILL reveal waypoint content (sections below the fold), and the 3D camera will move because scroll-based camera tracking is active. The graphite overlay blocks your VIEW (you can't see through it) but not your SCROLL. Everything loads and moves underneath — you just can't see it until the overlay fades.
sid - while the loading screen presennt no scrolling of underneath hero page 
- **A18:** BOTH — minimum display time + progress-based. The system uses a combined approach:
  - **Minimum display:** 500ms (`MIN_DISPLAY = 500`, `IntroScreen.tsx:61`). The overlay will never dismiss before 500ms regardless of load speed.
  sid - make it min 1000ms
  - **Progress-based trigger:** The `engineReady` promise (resolved when Three.js renders its first frame, via `signalEngineReady()`) triggers the actual dismiss.
  sid - ok
  - **Combined logic** (`IntroScreen.tsx:65–80`): When engineReady resolves, if 500ms has passed → dismiss immediately. If 500ms hasn't passed → wait until remaining time elapses, then dismiss.
  sid - ok
  - **Failsafe:** 5 seconds max (`MAX_WAIT = 5000`, line 63). If engineReady never fires, the overlay auto-dismisses at 5s regardless.
  sid - ok can be a problem for swper slow connection and mobile phone and tablets make the max 10 sec 
  - **Exit animation:** 300ms fade-out (`setTimeout(() => setPhase(3), 300)`, line 113). Phase 2 → Phase 3 transition is 300ms.
  - **Total:** Minimum 500ms (display) + 300ms (fade) = 800ms. Maximum 5000ms + 300ms = 5300ms. The counter tracks real asset progress (fonts 15% → engine chunk 45% → first frame 85% → poster 100%) and eases toward the target smoothly.

---

## Layer 8 — Custom Cursor

**Z-index:** `z-[9999]`, `position: fixed`
**Scope:** Entire hero page + all subpages — topmost element everywhere
**DOM:** Dot `<div>` + Ring `<div>` in `CustomCursor.tsx`
**Contents:** 
- **Dot:** 6px × 6px accent-filled circle, lerp factor 0.1
- **Ring:** 32px × 32px border circle (`border-[--accent]/50`), scales 1.6× on interactive hover (links, buttons, form elements)
- Only on `md:` breakpoint with fine pointer
**History:** Originally created in `ff412a6` (T5 motion pass) with dot+ring pair. The ring was stripped in an uncommitted working-tree edit (dot downsized to 4px at 40% opacity). **Restored** to original dot+ring with interactive hover scale.
**Code change:** Already restored. No further change.

**Open Questions:**

- **Q19:** With the custom cursor active — is the native mouse pointer visible too, only the custom cursor visible, or both visible at the same time?

**Answers:**

- **A19:** BOTH are visible. The DESIGN.md explicitly states "remains visible underneath (never `cursor: none` — accessibility)." The CustomCursor component NEVER sets `cursor: none`. The dot and ring divs have `pointer-events-none` so they don't interfere with actual clicks. The native mouse pointer remains fully visible and functional underneath the custom cursor elements. You see: native OS cursor + the custom dot + the custom ring — all three simultaneously. On touch devices (coarse pointer), the custom cursor doesn't render at all — only the native OS cursor/pointer is visible.
sid - only custom curson visible 
---

---

## ⚠️ Deferred: 3D Scene Responsiveness

**Not in scope for this layer restack — carry over to next plan.**

The 3D engine has no resize handler and no aspect-ratio adaptation:

- **FOV:** 45°, hardcoded
- **Camera positions:** all hardcoded vectors (WP-A: `[1.8, 0.2, 7]`, etc.)
- **No `resize` listener** anywhere in the engine code
- **Result:** Core ball (7u diameter) bleeds off both edges on phones, satellite vanishes on narrow screens, sprite glow halos only visible on ultrawide. Everything is aspect-ratio dependent with zero adaptation.

**Impact by screen:**
| Screen | Core (7u) | Satellite | SpriteGlow (21u) |
|--------|-----------|-----------|-------------------|
| Phone (375px) | Off-screen edges | Hidden | Hidden |
| Laptop (1440px) | ~68% width | Left edge | Bleed only |
| Ultrawide (3440px) | ~39% width | In-frame | Partially visible |

**Fix in next plan:** Camera FOV or distance must scale with viewport width to keep scene proportions consistent across devices.

---

## Implementation Summary

| File | Line(s) | Change | Layer |
|------|---------|--------|-------|
| `EngineLoader.tsx` | 30 | `z-0` → `z-[1]` (PosterDiv) | 1 |
| `EngineLoader.tsx` | 95 | `z-index:0` → `z-index:1` (noscript) | 1 |
| `EngineCanvas.tsx` | 295 | `z-0` → `z-[2]` (Canvas container) | 2 |
| `page.tsx` | 37 | `z-10` → `z-[3]` (hero section — creates stacking context for Layers 3/4 content) | Section |
| `page.tsx` | Each Section | Audit: all text wrappers need `z-[20]`, all buttons/links need `z-[30]` | 3, 4 |
| `page.tsx` | Hero buttons | Extract CTA buttons from text div to z-[30] wrapper | 4 |
| `Nav.tsx` | 36–57 | Restructure: FlutedGlass as sibling at z-[40] (visible scrollY 0→100), nav at z-[50] with links only | 5.1, 5.2 |
| `CustomCursor.tsx` | All | ✅ Already restored — dot+ring pair from ff412a6, no further change | 8 |

**Files touched:** 4 (`EngineLoader.tsx`, `EngineCanvas.tsx`, `page.tsx`, `Nav.tsx`)
**Effort:** ~7 targeted z-index edits + per-section Layer 3/4 audit in `page.tsx` + Nav structural refactor.
