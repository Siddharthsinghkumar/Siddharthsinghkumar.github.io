# M5 Plan — The Not-Forgettable Upgrade (scroll-video, textured renders, real assets)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m5plan.md`
> Runs after ⛔ STOP M4-A is accepted ([`m4plan.md`](m4plan.md)). Feeds [`m6plan.md`](m6plan.md)
> (cert + launch). **Nothing lands after launch — Batch P (from m2–m4) is DEAD; D2/D3 land here.**
> **STATUS: SCOPE FROZEN 2026-07-12 (verdicts M5.1–M5.9). Task blocks + kickoff prompts get
> frozen at m5 kickoff, AFTER m4 lands (anchors shift with the L0 restore).**

## 1. Mission & definition of DONE

**Bring the case pages to hatom/km-grade craft** — directed motion, textured atmosphere, real
assets — without touching what already works.

1. `/prospect` + `/travel-planner` heroes: **scroll-EVENT video** (scrub tied to scroll position,
   NOT an autoplay background loop) from Sid's generated media. Poster = the seed image.
2. Final L0/underlay art on the 3 big pages (supersedes m4's interim default).
3. **D2 real screenshots** (Sid's captures — NEVER generated) in the case-page frames;
   **D3 tiles** (generated brand art allowed) in `/projects`.
4. Every media element: poster + `prefers-reduced-motion` static + mobile/lite fallback (device
   detect). 60fps feel on mid-range mobile is a review criterion, not a wish.
5. Suite green (floors unchanged 55/72 via lazy-mount; red at cert = N18 STOP).
6. Sid taste-accepted every ⛔ STOP on `:4173` (N20).

DONE is NOT: home changes (its 3D engine stays king), knowme changes (accepted state), any new or
edited copy (M5.6), the v2 parking lot (ripple donor, GridMotion, authored .glb, merlin-cli-bridge).

## 2. FROZEN VERDICTS (Sid, 2026-07-12)

| # | Verdict |
|---|---|
| M5.1 | **Video = scroll event, not background.** `video.currentTime` scrubbing (2026 default over image sequences), keyframe-dense encode (all-intra or near, e.g. `ffmpeg -g 1`-class), webm+mp4, target ≤4 MB per hero, 5–8 s master. Mapping via rAF/scrollTimeline; backward-scrub must be smooth or the demo fails. |
| M5.2 | **Scope: the two case heroes only.** Scroll-video REPLACES PaperInk in those heroes (D37 upheld per-region: hero = video, text sections below = L0 paper). Knowme/home/projects get NO video. |
| M5.3 | **Lazy-mount, floors keep (N7 verdict in writing):** poster is the LCP; video assets fetch on idle/approach. Lighthouse floors stay 55/72; <72 at cert = N18 STOP with numbers, Sid decides then. |
| M5.4 | **Asset pipeline:** Claude authors a PROMPT PACK — per asset: image prompt (high-detail, token-hex palette accents, research-backed, D60 not-forgettable) + paired Seedance 2.0 video prompt using that image as seed frame + encode spec. Sid generates (GPT Image 2 / Nano Banana Pro → Seedance 2.0 / Veo 3.1) and drops files. Executors wire; they never generate. |
| M5.5 | **Generated media = ambience/brand art ONLY.** Never fake UI, screenshots, or metrics of Sid's tools (verified-claims rule). D2 screenshots are real captures by Sid. |
| M5.6 | **Copy untouched.** The km/hatom quality Sid wants is craft (art direction + directed motion), not ad CTAs. Zero new words. |
| M5.7 | **Skills:** `ui-ux-pro-max` audit runs BEFORE task freeze (Sid runs it; output → `docs/plans/inputs/uiuxpromax-portfolio.md`; advisory — DESIGN.md tokens win). **Taste Skill** (tasteskill.dev anti-slop) attaches to the perceptual batch if installed. **ponytail** attaches to mechanical batches only, never perceptual. |
| M5.8 | **Cheapest-demo-first:** Claude builds a THROWAWAY scrub demo on ONE hero (prospect) with placeholder media → ⛔ STOP M5-A feel check on `:4173` BEFORE Sid burns model credits on finals. Reject = technique rethink; no sunk assets. |
| M5.9 | Model split per M4.4 precedent: mechanical wiring = DeepSeek v4 Flash @ MAX; perceptual tuning = Gemini 3.1 Pro @ HIGH; same-model tasks bunched. |

## 3. Execution shape (task blocks frozen at kickoff)

```
B0 — INPUTS (parallel):
   Sid: run ui-ux-pro-max audit → docs/plans/inputs/ · confirm Taste Skill installed
   Claude: scrub demo on /prospect hero (throwaway) + the full prompt pack
→ ⛔ STOP M5-A: demo feel on :4173 + prompt-pack approval (accept/reject/adjust)
→ Sid generates + drops: hero videos + seeds, final underlays, D2 captures, D3 tiles
B1 — DeepSeek v4 Flash @ MAX (mechanical): ScrollVideo component (error boundary, poster,
   reduced-motion, device detect, lazy-mount) · hero wiring per layer schema (video = the hero
   layer, PaperInk retired there) · L0 art swap · D2 frames · D3 tiles → cert 1×
→ ⛔ SWITCH MODEL
B2 — Gemini 3.1 Pro @ HIGH (perceptual, + Taste Skill): scrub mapping curve + easing feel ·
   light/contrast pass · spacing/type polish vs the audit → evidence set under docs/qa/m5/
→ ⛔ STOP M5-B: full taste pass, all 6 pages on :4173 → accept ⇒ m6plan
```

## 4. Rules

N1–N20 verbatim, plus:

| # | Rule |
|---|---|
| N21 | A media element without poster + reduced-motion static + mobile fallback is REJECTED regardless of how good it looks. |
| N22 | No generated imagery that depicts UI, screenshots, data, or metrics of Sid's tools — ambience and brand art only. |

Playwright floor 36/36. One task = one commit. NEVER push. Evidence per N19, judged per N20.

## 5. Confidence: scope 9/10 — execution TBD at kickoff

Grounded in today's research (scrub-over-sequences is the settled 2026 technique; award juries
score art direction + directed motion + mid-range-mobile 60fps — exactly D60). The two real risks
are gated early by design: technique feel (STOP M5-A demo before assets) and asset quality (Sid
holds the generators; prompt pack is iterable without code churn).

**SCOPE FREEZE: 2026-07-12.** M5.1–M5.9 frozen; task blocks may not reinterpret them.
