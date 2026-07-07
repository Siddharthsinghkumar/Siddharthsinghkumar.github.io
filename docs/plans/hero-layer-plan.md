# Hero Page Layer Implementation Plan

## Current State

```css
body                    ─ bg-[--bg] (graphite)
├── EngineCanvas        ─ position:fixed, z-0 (all 3D in one canvas)
├── <section z-10>      ─ relative, stacking context
│   ├── EngineLoader    ─ renders the z-0 canvas as child
│   ├── scrim divs      ─ absolute, no z-index (darkening gradients)
│   └── text div z-[20] ─ ALL text + buttons mixed together
├── <Nav z-50>          ─ FlutedGlass + links
├── <IntroScreen z-100> ─ loading overlay
└── <CustomCursor z-9999>
```

## Target State (Sid's Layers)

| Layer | z-index | Element | Notes |
|-------|---------|---------|-------|
| 0 | body bg | Graphite `#0B0B0D` | No texture, no image |
| 1 | z-0 (noscript) | Poster fallback | Already handled by EngineLoader |
| 2 | z-0 (canvas) | Dust, grid, streams, satellite, ambient glows | ← SAME canvas as 2.1 |
| 2.1 | z-0 (canvas) | Core ball, StageNodes ring | ← SAME canvas as 2 |
| 3 | z-[30] | TEXT ONLY — name, headline, sub, stat strip, location, graph images | No buttons, no links |
| 4 | z-[40] | Buttons, links, glitch effects, future effects | Sits above text so hover shadows/glitch don't clip |
| 5.1 | z-50 within nav | FlutedGlass backdrop, border | Already z-[-1] inside nav |
| 5.2 | z-50 within nav | Nav text links, DecryptedText, Resume button | Already z-10 inside nav |
| 6 | TBD | Future — empty | Need to pick z-range |
| 7 | z-[100] | IntroScreen loading overlay | Already correct |
| 8 | z-[9999] | CustomCursor | Already correct |

## What Needs to Change

### 1. Restructure hero text wrapper → split text (L3) from buttons/links (L4)

Currently everything is in one `z-[20]` div. Need two separate wrappers:

```tsx
{/* Layer 3: Text */}
<div className="mx-auto max-w-[1200px] w-full relative z-[30]">
  <ChoreoReveal>name</ChoreoReveal>
  <ChoreoReveal>headline</ChoreoReveal>
  <ChoreoReveal>sub</ChoreoReveal>
  <ChoreoReveal>stat strip</ChoreoReveal>
  {/* location line stays here */}
</div>

{/* Layer 4: Buttons & effects */}
<div className="mx-auto max-w-[1200px] w-full relative z-[40]">
  <ChoreoReveal>buttons</ChoreoReveal>
  {/* glitch effects layer */}
</div>
```

### 2. Layers 2 & 2.1 — CANNOT be separate CSS layers

**Hard fact**: Both are in ONE `<canvas>` element. CSS z-index works on DOM elements, not WebGL draw calls. Splitting them would require a second canvas (doubles VRAM, adds compositing overhead).

**What IS achievable**: Three.js render order. The Core and StageNodes render LAST in the `useFrame` loop, meaning they paint on top of dust/streams within the same canvas. You get the visual separation without the CSS separation.

### 3. Z-index values for new layers

- Layer 3 (text): `z-[30]` — above canvas (z-0), above section stacking context
- Layer 4 (links/effects): `z-[40]` — above text
- Layer 6 (future): `z-[60]` — between Nav (z-50) and IntroScreen (z-100)? Or below Nav?

## Questions for Sid (the grilling)

**Q1**: Layers 2 & 2.1 cannot be separate CSS layers because they share one canvas. Is the Three.js render-order approach acceptable? (Core/rings render after dust/streams — they paint on top visually.)

**Q2**: What z-index range should Layer 6 (Future) occupy? Between Nav (42-50) and IntroScreen (100)? Or above IntroScreen but below Cursor (9999)? I need a number.

**Q3**: When you say "graph images" in Layer 3 — do you mean images inside the text content (like inline diagrams), or are these separate hero background images that should be below text? Currently there are no graph images in the hero. Clarify.

**Q4**: The ChoreoReveal wrapper currently groups heroIndex 0-5 in one div. If I split into two wrappers (L3 text + L4 buttons), should the ChoreoReveal sequence maintain its stagger across both layers (index 0-3 text, index 4-5 buttons)? Or reset indices within each layer?
