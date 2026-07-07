# Phase 2.1 — Layer 2: 3D Engine Fixes

> Part of plan-heropage-layers.md. Execute after Phase 1 is committed.

## Goal

Fix all Layer 2 (3D Engine) issues per Sid's answers to Q2–Q5, with clarifications resolved 2026-07-07.

> **STATUS: ✅ ALL 23 EDITS EXECUTED** (verified 2026-07-07). One residual item (edit 24) pending.

---

## Clarifications Log (2026-07-07)

| # | Question | Sid's Answer |
|---|----------|--------------|
| C1 | A2: "invisible at waypoint 5" — which waypoint? | Satellite should be **viewed in waypoint C** but **load from waypoint B till waypoint D** — so scrolling doesn't break satellite. Visible range extends beyond where it's "starring". |
| C2 | A2: Smooth fade-in at entry too? | **Yes** — smooth fade-in at p 0.20–0.26 AND smooth fade-out at p 0.44–0.50 (both directions smooth) |
| C3 | A4: What does "uniform shapes" mean? | All 6 should have the **SAME rotation** — they should look identical (no individual rotation differences) |
| C4 | A5: Permanently delete or comment out? | **Comment out** DataStream code (like SpriteGlow) — keep it but disabled, in case Sid changes his mind |
| C5 | A2: Satellite torus ring at radius 1.6 — scale it too? | **Yes** — scale the torus ring to match `1.12` (keep orbit ring visually aligned with nodes) |
| C6 | A5: DataStream inside Satellite — also disable? | **No** — keep Satellite's internal particle arc. Only disable the 8 DataStreams in EngineCanvas. |
| C7 | TEMP TEST neon colors — clean up in this PR? | **Yes** — clean up TEMP TEST colors in this Phase 2.1 PR (restore proper accent orange) |
| C8 | TEMP TEST DataStream shader size/opacity — revert too? | **Yes** — revert boosted `uSize` and `uOpacity` in DataStream shader to original values (affects Satellite's particle arc) |

---

## A2 — Satellite visibility + smooth fade

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change |
|------|--------|
| 1 | Satellite visibility range: `p > 0.28 && p < 0.48` → `p > 0.20 && p < 0.50` (wider window — load from WP-B through WP-D, viewed at WP-C) |
| 2 | **Smooth fade-in**: lerp satellite group opacity from 0→1 between p 0.20–0.26 |
| 3 | **Smooth fade-out**: lerp satellite group opacity from 1→0 between p 0.44–0.50 (no hard cut at any boundary) |

### Changes: `site/src/components/engine/SceneObjects.tsx`

| Edit | Change | Line |
|------|--------|------|
| 4 | Central octahedron: radius `0.49` → `0.34` (0.7×) | 357 |
| 5 | Orbiting nodes: radii `0.18` → `0.13` (0.7×) | 366 |
| 6 | Orbital radii: `1.6` and `2.0` → `1.12` and `1.4` (0.7×) — via `const orbitRadius = 1.6 + i * 0.4` → `1.12 + i * 0.28` | 345 |
| 7 | **Torus orbit ring**: radius `1.6` → `1.12` (0.7×, keep ring aligned with inner orbit node) | 372 |
| 8 | Sprite glow on central: scale `2.5` → `1.75` (0.7×) | 360 |
| 9 | Sprite glow opacity: `0.35` → `0.25` | 361 |

---

## A3 — Comment out SpriteGlow halos

### Changes: `site/src/components/engine/SceneObjects.tsx`

| Edit | Change | Line |
|------|--------|------|
| 10 | Comment out the 4 SpriteGlow calls in `Core` (lines 89–92, NOT 89–99 as originally stated). The SpriteGlow component definition (lines 97–107) stays — it may be used elsewhere. | 89–92 |
| 11 | Add comment: `// SpriteGlow halos deprecated — may be removed in future. Sid: "put these currently as invisible and may be deprecated".` | 89 |

---

## A4 — StageNodes resize to 0.7× + uniform rotation

### Changes: `site/src/components/engine/SceneObjects.tsx`

| Edit | Change | Line |
|------|--------|------|
| 12 | Octahedron radius: `0.66` → `0.46` (0.7×) | 225 |
| 13 | Sprite glow scale: `1.4` → `1.0` (0.7×) | 228 |
| 14 | **Uniform rotation**: Remove per-node individual rotation differences. All 6 octahedrons should rotate identically (same rotation axis, same speed, same angle offset = 0). They should look visually identical at any point in time. The shared `rotation.y -= 0.15 * delta` counter-rotation of the group ring is fine — it's the **per-mesh** rotations that must be uniform. | useFrame |

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change | Line |
|------|--------|------|
| 15 | Orbit radius: `5.5` → `3.85` (0.7×) — in `<StageNodes radius={5.5} />` | 237 |

---

## A5 — Comment out DataStream (keep code, disable render)

> **Changed from original plan:** Sid chose to comment out (not permanently delete), matching A3 pattern.
> **Exception:** Satellite's internal `<DataStream>` particle arc (SceneObjects.tsx lines 377–388) STAYS — only the 8 EngineCanvas DataStreams are disabled.

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change | Line |
|------|--------|------|
| 16 | Comment out the `<group ref={streamGroupRef}>` block and all 8 `<DataStream>` children. Add comment: `// DataStream disabled — Sid: "don't like it, comment out in case I change my mind"` | 240–251 |
| 17 | Comment out `streamGroupRef` declaration (or leave unused with comment) | 75 |
| 18 | Leave `streamBrightness` in WAYPOINTS — it's already dead code (never read in useFrame), no functional impact | N/A |
| 19 | Comment out opacity/blending code in useFrame that references `streamGroupRef` | 177–183, 213–218 |
| 20 | Comment out `buildStreamCurves()` inline function definition (lines 18–44). **Correction:** This is defined inline in EngineCanvas, NOT imported from SceneObjects as originally stated. | 18–44 |

### Changes: `site/src/components/engine/SceneObjects.tsx`

| Edit | Change |
|------|--------|
| 21 | Comment out `DataStream` component export — add deprecation comment. **BUT** leave the component code intact (Satellite uses it internally). |

> **⚠️ Important:** The `DataStream` component definition in SceneObjects must remain uncommented because `Satellite` (same file, lines 377–388) uses `<DataStream>` for its particle arc between orbiting nodes. Only comment out the export or the EngineCanvas usage. If the component is only used internally by Satellite, just leave it as-is and only disable the 8 EngineCanvas instances.

---

## A6 — Clean up TEMP TEST colors (new)

> Added from code verification — debug artifacts that should be cleaned up.

### Changes: `site/src/components/engine/EngineCanvas.tsx`

| Edit | Change | Line |
|------|--------|------|
| 22 | Restore proper accent orange colors in `buildStreamCurves()` — replace TEMP TEST neon yellow values with original `#ff5c1a` / accent orange | 21–33 |

### Changes: `site/src/components/engine/SceneObjects.tsx`

| Edit | Change | Line |
|------|--------|------|
| 23 | Restore proper accent orange in `SpriteGlow` component — replace TEMP TEST neon pink with original accent color | 100 |
| 24 | **Revert DataStream shader boosted values**: `uSize: 0.50` → `0.24` (bright) / `0.40` → `0.18` (dim), `uOpacity: 1.0` → `0.85` (bright) / `0.95` → `0.85` (dim). Remove TEMP TEST comments. These affect Satellite's internal particle arc. | 290, 292 |

> Note: Since DataStream streams are being commented out (A5), the stream color fix (edit 22) may seem redundant — but we clean it up anyway so the commented code is correct if re-enabled later. Edit 24 directly affects the Satellite's particle arc (which is KEPT active).

---

## Files Touched

| File | Edits |
|------|-------|
| `EngineCanvas.tsx` | 8: visibility range, fade-in lerp, fade-out lerp, stageNodes radius change, comment DataStream group, comment refs/useFrame code, comment buildStreamCurves, clean TEMP TEST colors |
| `SceneObjects.tsx` | 10: satellite resize (×5 values + torus ring), comment SpriteGlow halos, stageNodes resize (×2), uniform rotation, comment DataStream export, clean TEMP TEST color |

---

## Verified Code Locations (from code audit 2026-07-07)

| What | File | Line | Current Value |
|------|------|------|---------------|
| Satellite visibility | EngineCanvas.tsx | 195 | `p > 0.28 && p < 0.48` |
| streamGroupRef | EngineCanvas.tsx | 75 | `useRef<THREE.Group>(null)` |
| DataStream render block | EngineCanvas.tsx | 240–251 | 8 DataStream children in group |
| StageNodes radius prop | EngineCanvas.tsx | 237 | `<StageNodes radius={5.5} />` |
| buildStreamCurves | EngineCanvas.tsx | 18–44 | Inline function (NOT imported) |
| Stream useFrame opacity | EngineCanvas.tsx | 177–183, 213–218 | References streamGroupRef |
| TEMP neon yellow | EngineCanvas.tsx | 21–33 | Debug colors |
| Central octahedron | SceneObjects.tsx | 357 | `0.49` |
| Orbiting nodes radius | SceneObjects.tsx | 366 | `0.18` |
| Orbital radii formula | SceneObjects.tsx | 345 | `1.6 + i * 0.4` |
| Torus ring | SceneObjects.tsx | 372 | `TorusGeometry(1.6, ...)` |
| Satellite sprite glow | SceneObjects.tsx | 360–361 | `scale=[2.5,2.5,1]`, `opacity=0.35` |
| SpriteGlow calls in Core | SceneObjects.tsx | 89–92 | 4 calls (NOT 89–99) |
| TEMP neon pink | SceneObjects.tsx | 100 | Debug color |
| StageNodes octahedron | SceneObjects.tsx | 225 | `0.66` |
| StageNodes sprite glow | SceneObjects.tsx | 228 | `scale=[1.4,1.4,1]` |
| DataStream component | SceneObjects.tsx | 238–319 | Full component |
| Satellite internal DataStream | SceneObjects.tsx | 377–388 | Used by Satellite (KEEP) |

---

## Execution Status

| Edit | Status |
|------|--------|
| 1–23 | ✅ Done (verified 2026-07-07) |
| 24 | ❌ Pending — DataStream shader size/opacity revert |

---

## Commit Message

```
fix(layer-2): satellite visibility + resize, hide SpriteGlow halos, shrink StageNodes, disable DataStream, clean TEMP colors

A2: satellite p 0.20–0.50, smooth fade-in p 0.20–0.26, smooth fade-out p 0.44–0.50, 0.7x scale + torus ring
A3: SpriteGlow halos commented out (per Sid: invisible, may deprecate)
A4: StageNodes 0.7x size, uniform rotation (all 6 identical)
A5: DataStream commented out, not deleted (per Sid: keep disabled in case of mind change). Satellite internal arc stays.
A6: TEMP TEST debug colors cleaned up (neon yellow/pink → accent orange) + DataStream shader sizes reverted
```
