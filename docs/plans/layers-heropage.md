# Hero Page Layers

As defined by Sid, 2026-07-06.

| Layer # | Name | What Lives Here | Status |
|---------|------|-----------------|--------|
| **0** | Base | Graphite background only (`--bg: hsl(240 8% 5%)`, `#0B0B0D`). No textures, no images. | Active |
| **1** | 3D Fallback | Static poster image if WebGL fails or JS is disabled. | Active |
| **2** | 3D Background | Dust field, grid floor, data streams, satellite, ambient glow sprites. Everything in the 3D scene except the core ball and its rings. | Active |
| **2.1** | 3D Core | The central core ball + its glow rings + StageNodes ring. Foreground 3D elements. | Active |
| **3** | Text | ALL hero page text: name, headline, sub, stat strip, location, graph images. Nothing else overlaps text — text must always be readable. | Active |
| **4** | Links & Effects | Glitch animations, future effects, all buttons and links from the hero page. Sits ON TOP of text layer so effects (glitch shadows, hover states) render above text without clipping. | Active |
| **5.1** | Nav Base | Nav glass effects (FlutedGlass shader), border, backdrop. | Active |
| **5.2** | Nav Links | All navigation links, DecryptedText hover effects, Resume button. | Active |
| **6** | Future | Reserved — currently empty, available for future ideas. | Reserved |
| **7** | Loading Screen | IntroScreen overlay that fades out after page load. | Active |
| **8** | Custom Cursor | The `[--accent]` cursor dot. Topmost element on the page. | Active |

## Important Note on Layers 2 & 2.1

Both live inside a single Three.js `<canvas>` element — they share one CSS z-index. These are NOT separate DOM layers. The distinction is **render order within the Three.js scene**:

- **Layer 2** (background): `DustField`, `GridFloor`, `DataStream`, `Satellite`, glow sprites — rendered first
- **Layer 2.1** (core): `Core` mesh + `StageNodes` ring — rendered last so they appear "on top" of dust/streams

If Sid wants them at different CSS z-indices, we would need two separate canvases, which doubles GPU memory. The Three.js render order approach achieves the same visual result more efficiently.
