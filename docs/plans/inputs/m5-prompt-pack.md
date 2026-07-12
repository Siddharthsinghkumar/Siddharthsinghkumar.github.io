# M5 Prompt Pack (C2) — generation prompts + specs for Sid's asset drop

> Authored by Claude 2026-07-12 under the REV'd M5.4 pipeline (see m5plan §2):
> start/end frames (Nano Banana Pro or GPT Image 2) → Google Flow **Frames to
> Video** → ffmpeg frame export → webp sequence + poster. Full pipeline
> reference: the `product-teardown-scroll` skill (`~/.claude/skills/`).
> Approved/adjusted by Sid at ⛔ STOP M5-A before any credits burn.

## Global rules (every asset)

- Ambience/brand art ONLY — never UI, screenshots, data, or metrics of the
  tools (M5.5 / N22). D2 screenshots are Sid's real captures, not generated.
- Palette anchors: background matte near-black `#0B0B0D`, accent signal
  orange `#FF5C1A`, warm off-white `#E8E6E1` highlights. No other saturated
  colours.
- No text or lettering anywhere, no watermarks, no hands, no props, no brand
  logos, no legible map/dial labels. Landscape 16:9.
- Workflow per hero: generate START frame → generate END frame **with the
  start frame attached as reference image** → Flow Frames-to-Video (start =
  first frame, end = last frame, 5–8 s, motion prompt below) → export at max
  resolution → extraction spec at the bottom.

---

## Asset 1 — `/prospect` hero (teardown sequence)

Object (Sid's pick 2026-07-12): **retro-futuristic mechanical
newspaper-reading machine** — ties to "It reads the morning papers before I
wake up."

**START frame:**

> High-end studio product photograph of a retro-futuristic mechanical
> newspaper-reading machine — a compact desktop device in matte black metal
> with brass detailing, a large circular scanning lens on its front face, a
> paper-feed slot holding the edge of a folded newspaper, and small precision
> dials — fully assembled and intact, floating dead center against a seamless
> matte near-black charcoal studio background (#0B0B0D). Straight-on view,
> perfectly level camera, soft even studio lighting with a faint warm rim
> light and a restrained ember-orange (#FF5C1A) accent glow along the edges,
> one subtle soft grounding shadow directly beneath the machine.
> Photorealistic, ultra sharp, high detail. The machine occupies roughly one
> third of the frame height, with generous empty space on every side. No text
> or lettering anywhere, no watermark, no hands, no props, no brand logos.
> Landscape 16:9.

**END frame** (attach the start frame as reference image):

> High-end studio product photograph of the exact same mechanical
> newspaper-reading machine as in the reference image, now as a clean
> exploded view: the matte-black outer casing panels separated and every
> major internal component pulled apart and floating in an organized, evenly
> spaced arrangement along the horizontal axis, like a technical teardown
> render — scanning lens assembly, brass rollers, gear train, small type
> plates, and a single folded newspaper sheet among the parts. Same
> straight-on view, same perfectly level camera, same soft even studio
> lighting with the same faint warm rim light and restrained ember-orange
> (#FF5C1A) accent glow, same seamless matte near-black charcoal studio
> background (#0B0B0D), same subtle grounding shadow beneath. The core body
> of the machine stays in the exact center at the exact same size, with the
> parts spreading outward around it, every part fully inside the frame with
> margin. Photorealistic, ultra sharp, high detail. No text or lettering
> anywhere, no watermark, no hands, no props, no brand logos. Landscape 16:9.

**Flow motion prompt:**

> The machine disassembles smoothly and mechanically: the outer casing panels
> lift away and every internal component glides outward along the horizontal
> axis into an evenly spaced exploded arrangement. Camera completely locked —
> no zoom, no pan, no rotation. Lighting and background constant throughout.
> Motion even and continuous, like a precision technical animation. No part
> ever leaves the frame.

**Drop paths:** `site/public/media/prospect-seq/0001.webp…` + poster
`site/public/media/prospect-hero-poster.webp`. Report the frame count with
the drop.

---

## Asset 2 — `/travel-planner` hero (teardown sequence)

Object (Sid's pick 2026-07-12): **mechanical desktop globe**.

**START frame:**

> High-end studio product photograph of an antique-style mechanical desktop
> globe — a matte-black sphere with engraved unlabeled continents, held in a
> brass armillary frame with meridian rings, an internal gear mechanism
> faintly visible at its base, standing on a compass-rose pedestal — fully
> assembled and intact, floating dead center against a seamless matte
> near-black charcoal studio background (#0B0B0D). Straight-on view,
> perfectly level camera, soft even studio lighting with a faint warm rim
> light and a restrained ember-orange (#FF5C1A) accent glow along the edges,
> one subtle soft grounding shadow directly beneath the globe.
> Photorealistic, ultra sharp, high detail. The globe occupies roughly one
> third of the frame height, with generous empty space on every side. No text
> or lettering anywhere, no watermark, no hands, no props, no brand logos.
> Landscape 16:9.

**END frame** (attach the start frame as reference image):

> High-end studio product photograph of the exact same mechanical desktop
> globe as in the reference image, now as a clean exploded view: the globe's
> hemisphere shells separated and every major component pulled apart and
> floating in an organized, evenly spaced arrangement along the horizontal
> axis, like a technical teardown render — hemisphere shells, brass meridian
> rings, internal gear train, axis spindle, and the compass-rose pedestal
> dial. Same straight-on view, same perfectly level camera, same soft even
> studio lighting with the same faint warm rim light and restrained
> ember-orange (#FF5C1A) accent glow, same seamless matte near-black charcoal
> studio background (#0B0B0D), same subtle grounding shadow beneath. The core
> sphere stays in the exact center at the exact same size, with the parts
> spreading outward around it, every part fully inside the frame with margin.
> Photorealistic, ultra sharp, high detail. No text or lettering anywhere, no
> watermark, no hands, no props, no brand logos. Landscape 16:9.

**Flow motion prompt:**

> The globe disassembles smoothly and mechanically: the hemisphere shells
> separate and the rings, gears, and pedestal components glide outward along
> the horizontal axis into an evenly spaced exploded arrangement. Camera
> completely locked — no zoom, no pan, no rotation. Lighting and background
> constant throughout. Motion even and continuous, like a precision technical
> animation. No part ever leaves the frame.

**Drop paths:** `site/public/media/travel-planner-seq/0001.webp…` + poster
`site/public/media/travel-planner-hero-poster.webp`. Report the frame count
with the drop.

---

## Asset 3 — D3 project tiles (static images, no video)

Four tiles for `/projects` (grid per COPY.md: Sindhey, Firefighting Robot,
MTK Unlock, TrueNAS ZFS). One image each, generated in Nano Banana Pro / GPT
Image 2. Shared style clause for all four:

> Abstract brand-art tile, matte near-black background (#0B0B0D), restrained
> ember-orange (#FF5C1A) accents, warm off-white (#E8E6E1) highlights, subtle
> paper-grain texture, minimal composition, high detail, no text, no
> watermark, no logos, no UI elements. Square format.

Per-tile subject line (prepend to the shared clause):

1. **Sindhey** — "Soft overlapping geometric paper shapes suggesting a daily
   rhythm — layered rounded rectangles and a small rising-sun arc."
2. **Firefighting Robot** — "A stylized thermal-gradient terrain seen from
   above, ember glow concentrated in one region, a single clean traversal
   line crossing it."
3. **MTK Unlock** — "Macro view of dark circuit-board traces with exactly one
   trace glowing ember-orange, running edge to edge."
4. **TrueNAS ZFS** — "An abstract lattice of stacked translucent storage
   planes with one highlighted block, deep depth of field."

**Drop path:** `site/public/tiles/` (scan-tiles.mjs builds the manifest).
AVIF/WebP sizing per DESIGN.md §5.

---

## Asset 4 — optional L0 art (only if the drop includes it; else D77 bake stays)

> Ultra-subtle handmade paper texture, matte near-black (#0B0B0D), extremely
> low contrast fiber grain, no visible pattern repetition, no vignette, no
> text, no marks. Even edge-to-edge tone suitable for a full-page background.
> Landscape, high resolution.

**Drop path:** replaces `site/public/images/l0-paper.webp` only on Sid's
explicit verdict; D77 rollback flag stays available.

---

## Extraction & encode spec (both hero sequences)

```bash
# archive master: every frame, full res
ffmpeg -i flow-export.mp4 -vf "fps=30" master/frame_%04d.png

# ship set: 15fps, 1600px wide, webp (~120 frames for 8s)
ffmpeg -i flow-export.mp4 -vf "fps=15,scale=1600:-2" -c:v libwebp -lossless 0 -q:v 70 seq/%04d.webp

# poster = first frame, higher quality
ffmpeg -i flow-export.mp4 -vf "select=eq(n\,0),scale=1600:-2" -frames:v 1 -c:v libwebp -q:v 80 poster.webp
```

Budget: target ≤4 MB per hero sequence (dark-studio webp ≈ 15–35 KB/frame at
1600w). If over: 12 fps → q60 → 1280w, in that order. The binding gate stays
M5.3's lighthouse floors (55/72), enforced by lazy-mount — poster is the LCP,
frames load on approach.
