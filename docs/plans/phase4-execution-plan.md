# PHASE 4 EXECUTION PLAN — Portfolio Website

> Author: Claude (planning session 2026-07-07, all verdicts grilled from Sid same day).
> Executor: **DeepSeek v4 Pro 1M, effort HIGH** (tasks marked ⬆ MAX run at MAX).
> Source todo: `/home/sidd/.commandcode/plans/phase4-plan.md` (Objectives 1–3 + /about removal) + Sid's scope verdicts below.
> All line anchors verified 2026-07-07. **Re-grep every anchor before editing — anchors go stale.**

---

## 0. Cold-start reading list (READ IN THIS ORDER, before any edit)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules, donor rule, hard constraints
2. `/home/sidd/project/freelance/portfolio-website/AGENTS.md` — knowledge graph + git rules
3. `/home/sidd/project/freelance/portfolio-website/DESIGN.md` — tokens, budgets, decision log §6 (D1–D40)
4. `/home/sidd/project/freelance/portfolio-website/COPY.md` — every word on the site; never invent copy
5. `/home/sidd/project/freelance/portfolio-website/docs/learned.md` — binding guardrails (skim §1 mistakes)
6. `/home/sidd/.commandcode/plans/phase4-plan.md` — Sid's Phase 4 objectives (the todo this plan implements)
7. **This file, fully, before task 4.0.1.**

Do NOT read the other planning docs unless a task points at one. Do not "explore".

---

## 1. Mission + definition of DONE

Align the hero 3D camera waypoints with the real DOM sections; rework nav decrypt +
add the liquid-glass ripple; restack all three subpage groups to Sid's layer schemas;
apply the six audit-report fixes; delete all dead code and the orphaned `/about` page;
make the 3D scene aspect-responsive; land the T14 leftover buttons; leave the repo
fully committed and documented.

**DONE means all of these, numbered and testable:**

1. Every task's gate (`§5`) is green and pasted at its STOP.
2. **Sid said yes at every ⛔ STOP** — visually, on localhost, per the checklist given at that STOP.
3. `git status` clean at close-out: nothing untracked, nothing uncommitted (root `.gitignore` covers tooling dirs).
4. All 8 subphases committed per the commit protocol (§9).
5. `report/`-style re-audit is NOT required (Sid's verdict) — but no NEW dead code may be introduced.

**DONE is NOT:**
- Real screenshots in the screenshot frames (Sid captures those himself, post-Phase-4).
- Final BG images (test images are TEMP by explicit verdict; swap is a LAUNCH-CHECKLIST item).
- Deploying, pushing, or touching CI. **Never push.**
- Any redesign of copy, sections, or pages beyond what a task names.

---

## 2. THE WANT LIST (Sid's verdicts, frozen 2026-07-07)

| # | Sid wants | Source |
|---|---|---|
| W1 | Camera waypoints synced to actual DOM section positions — "camera lands perfectly centered as the text becomes prominent" | phase4-plan Obj 1 |
| W2 | Nav DecryptedText scrambles **once per page load, everywhere** (home: after loading screen dismisses; subpages: on load). **Never on hover.** Hover = orange color only, and hover color is disabled while the initial decrypt runs | phase4-plan Obj 2 + grill |
| W3 | "Droplet in puddle" post-decrypt wave, rendered as **liquid-glass distortion** (real displacement, frosted-capsule look). Fires once after the last nav link finishes decrypting **and** a small ripple on every nav link press. Wave turns hit text orange <100ms, fade back ~200ms | phase4-plan Obj 2 + grill |
| W4 | Subpage layer schemas exactly as written in phase4-plan Obj 3 (Prospect/Travel-Planner 9 layers, Projects 8, KnowMe 6 incl. **Lanyard ABOVE nav**) | phase4-plan Obj 3 + grill |
| W5 | Delete commented-out dead code **now** (reverses the 2026-07-07 "keep commented" C4 decision) | grill |
| W6 | Delete `/about` entirely; `/knowme` is the about page | phase4-plan + grill |
| W7 | Scanlines removed from screenshot frames; **corner ticks stay**; wire `public/placeholders/*.svg` into the frames until real screenshots exist | grill |
| W8 | Link glitch pulse **same as hero everywhere**: shared 3s auto clock + hover (supersedes T14 "hover-only on subpages") | grill |
| W9 | Test images (`site/public/test/`) as TEMP BG assets now, Sid swaps later — swap recorded in LAUNCH-CHECKLIST | grill |
| W10 | Loading overlay on subpages **only when the site's entry load is that subpage** (hard load / deep link). Client-side navigation never shows it | grill (Sid's own words: "real loading on subpages only if the website is loading firstly on a subpage instead of mainpage") |
| W11 | KnowMe text color: **static choice per chosen image + keep the frosted scrim** | grill |
| W12 | 44×44 touch targets (nav Resume, inline text links, knowme footer links) via invisible hit-area expansion; iOS safe-area inset on nav | audit reports + grill |
| W13 | 3D scene adapts to aspect ratio (deferred item from plan-heropage-layers.md) | grill |
| W14 | T14 P7 buttons: left **"Want your own version?"** mailto with project-specific subject, right-aligned cross-link, on both case-study pages | grill |
| W15 | Planning docs committed under `docs/plans/`; tooling dirs (`.agents/`, `.commandcode/`, `.devin/`, `questions/`) gitignored | grill |
| W16 | Sid verifies **visually at every STOP** before the executor continues | grill |

## 3. THE DON'T-WANT LIST (binding N-rules — violating one = rejected work even with green gates)

| # | Never do this |
|---|---|
| N1 | **No imperceptible effects.** Spec numbers are floors. If the ripple / waypoint sync / glitch cannot be plainly SEEN, the task is NOT done — make it visible or STOP and report. Never ship invisible work as complete. |
| N2 | **No layout/content changes** beyond the tasks named here. No copy rewrites, no section reordering, no new pages. (The scoped changes — W7, W14, deletions — are the only exceptions.) |
| N3 | **No new dependencies.** `npm install` of anything new is forbidden. The ripple must be built with what exists: CSS, SVG filters (feTurbulence/feDisplacementMap), raw WebGL, or `@paper-design/shaders-react` / `three` already in package.json. If you believe a dep is unavoidable: STOP and ask. |
| N4 | No phone number anywhere. No education section. No stock images (Unsplash/Pexels/etc.). No invented copy — words come from COPY.md or a task block below. |
| N5 | No status-label upgrades (RESEARCH stays RESEARCH). No invented metrics about Sid. |
| N6 | No attribution trailers in commits (no Co-Authored-By, no "Generated with", no AI mentions). **Never push.** |
| N7 | Never edit gate scripts (`scripts/guards.mjs`, budget thresholds) — Sid's written approval in the STOP thread is required first. |
| N8 | Never continue past a ⛔ STOP without Sid's explicit yes. Silence ≠ yes. |
| N9 | No fake/stalling progress indicators. The subpage loader must track something real and dismiss when ready (min 1000ms, max 10s failsafe — same contract as home). |
| N10 | Don't relitigate decided items: graphite `#0B0B0D` bg stays (not pure black), glitch variant stays AMPED 240ms, `AUTO_INTERVAL` stays 3000ms, dark-only, borders-over-shadows. |
| N11 | `useRef<T>(null)` — never bare `useRef<T>()`. Fonts via `next/font` only. WebGL needs error boundary + static fallback + tab-hidden pause. `prefers-reduced-motion` disables animation, content stays visible. |

---

## 4. Verified baseline (2026-07-07)

- Branch `master`, HEAD `0d57718`. `npm run build` exits 0, 7 static routes (`/`, `/_not-found`, `/about`, `/knowme`, `/projects`, `/prospect`, `/travel-planner`).
- Phases 1 / 2.1 / 2.2 of the layers plan are complete and verified (`phase2-2-remaining-fixes.md`).
- Untracked: `site/src/app/knowme/`, `site/src/components/KnowMeBackground.tsx`, `site/src/components/PageBackground.tsx`, `site/public/placeholders/`, `site/public/test/`, `report/`, `questions/`, `.agents/`, several root/docs planning `.md` files.
- Dead code confirmed: `Footer.tsx`, `CssHeroAtmosphere.tsx`, `ScrollReveal.tsx` + `ScrollRevealContainer.tsx` + `useScrollReveal.ts` (all 0 live references), commented DataStream/SpriteGlow/breathe/onScroll blocks, `/about` page (0 inbound links), Nav `scrolled` state (nothing reads it since FlutedGlass removal `7674b1a`).
- `public/sitemap.xml` still lists `/about/`, does not list `/knowme/`.
- No root `.gitignore`; no `viewport` export in `layout.tsx` (needed for iOS `env(safe-area-inset-*)`).
- Audit reports in `report/` verified accurate by Claude readback; ponytail missed the orphans listed above (they're covered by tasks here).

If the tree contradicts any row above when you start: **STOP and report. Do not improvise.**

---

## 5. Gates (run after EVERY task, from `/home/sidd/project/freelance/portfolio-website/site/`)

```bash
npm run build && npm run lint && npm run guards
```

- All three must exit 0. `guards` enforces the JS budgets (home ≤480 KB gzip per D30). Never touch its thresholds (N7).
- If a gate fails and the fix is not obvious in ONE attempt: revert the attempt, **STOP and report the full output**. Never "fix forward".

## 6. Proof rules

- Every claimed file creation/deletion: paste `ls -la` (or `git status --short`) output in the STOP report.
- Every claimed edit: paste the relevant `git diff --stat` plus 3–5 line excerpt.
- Visual work is proven by **Sid's own eyes at the STOP** (his verdict). Your job at each STOP: paste gate output + diffstat + a "LOOK AT THIS" checklist telling Sid exactly which URL, scroll position, and interaction to check. Never claim visual success yourself; "it should work" is not a status — verified / failed / not-run are.

## 7. ⛔ STOP protocol

At each STOP, post exactly:

```
⛔ STOP <subphase id> — waiting for Sid

WHAT CHANGED SINCE LAST LOOK: <one line>
GATES: build ✅/❌  lint ✅/❌  guards ✅/❌   (paste tails)
COMMITS: <git log --oneline of this subphase>
FILES:   <git diff --stat vs subphase start>

LOOK AT THIS (localhost:3000):
1. <URL + scroll position + what to look for / interact with>
2. ...

COMPLETENESS TABLE:
| Item in this subphase | Built | Gate | Sid-verified |
|---|---|---|---|
| ...每 task ... | ✅/❌ | ✅/❌ | pending |

Reply "continue" to proceed to <next subphase>, or list rejections.
```

Wait. Address the user as **Sid**. Do not start the next subphase in the same reply.

## 8. Context management rules (1M context does not excuse drift)

1. Execute subphases **strictly in order** 4.0 → 4.7; tasks in order within a subphase.
2. Touch ONLY the files a task names. A fix that needs an unnamed file = STOP and report.
3. Re-grep every anchor before editing (this plan's line numbers were valid 2026-07-07).
4. If confused: re-read §3 (don't-wants) + the current task block ONLY. Do not re-read the whole session.
5. If the working tree contradicts the plan (file missing, anchor gone, unexpected diff): STOP and report — never reconcile silently.
6. One commit per task (§9). Never batch multiple tasks into one commit.

## 9. Commit protocol

- Run the §5 gates BEFORE every commit; commit only on green.
- Subject convention: `<type>(<scope>): <what>` — e.g. `fix(nav): decrypt once per load, never on hover`.
- One task = one commit. No attribution trailers, no AI mentions (N6). **Never push.**

---

---

# SUBPHASE 4.0 — Repo hygiene & baseline freeze

*Goal: everything currently untracked is either committed or ignored, so every later diff is clean evidence.*
*Model: DeepSeek HIGH.*

### T4.0.1 — Root `.gitignore` for tooling
**Files:** `/home/sidd/project/freelance/portfolio-website/.gitignore` (CREATE)
**Change:** create with exactly:
```
.agents/
.commandcode/
.devin/
questions/
```
**Done:** `git status` no longer lists those four dirs.
**Verify:** `git status --short | grep -E "agents|commandcode|devin|questions"` → empty.

### T4.0.2 — Move planning docs into `docs/plans/` and commit
**Files:** move these root files into `/home/sidd/project/freelance/portfolio-website/docs/plans/`:
`layers-heropage.md`, `phase1-layer-restack.md`, `phase2-1-layer2-fixes.md`, `phase2-2-remaining-fixes.md`, `plan-heropage-layers.md`. Also `git add` the existing `docs/hero-layer-plan.md`, `docs/layers-heropage.md`, `docs/t14-answers-and-plan.md`, `report/` (move `report/` → `docs/reports/`), and this file (`docs/plans/phase4-execution-plan.md`).
**Change:** `git mv`-equivalent moves (they're untracked, so plain `mv` + `git add`). Do not edit their contents.
**Done:** repo root has no stray planning `.md` except the canonical five source-of-truth files (CLAUDE/CONTEXT/COPY/DESIGN/EXECUTION-PLAN + reference/donor files that were already there).
**Verify:** `ls /home/sidd/project/freelance/portfolio-website/*.md` shows no `phase*`/`plan-*`/`layers-*` files; `git status --short` shows adds under `docs/`.
**Commit:** `chore(docs): move planning docs to docs/plans and docs/reports`

### T4.0.3 — Commit the untracked site work (knowme + components + assets)
**Files:** `site/src/app/knowme/`, `site/src/components/KnowMeBackground.tsx`, `site/src/components/PageBackground.tsx`, `site/public/placeholders/`, `site/public/test/`
**Change:** no edits — `git add` + commit as-is (they are the working state Sid approved on screen).
**Done:** `git status` clean except files later tasks will touch.
**Verify:** `git status --short` → empty.
**Commit:** `feat(knowme): commit KnowMe page, background components, temp assets`

⛔ **STOP 4.0** — small gate: paste `git log --oneline -5` + `git status`. No visual check needed; Sid replies continue.

---

# SUBPHASE 4.1 — Deletions (dead code + /about)

*Goal: everything the audits + Claude's supplement flagged as dead is gone. Git history preserves all of it (Sid's verdict: delete now).*
*Model: DeepSeek HIGH.*

### T4.1.1 — Delete `/about` page + sitemap entry
**Files:** `site/src/app/about/` (DELETE whole dir), `site/public/sitemap.xml`
**Change:** remove the directory. In `sitemap.xml`: replace the `<url>` block whose `<loc>` is `https://Siddharthsinghkumar.github.io/about/` with one for `https://Siddharthsinghkumar.github.io/knowme/` (copy the structure of the existing entries). Leave `public/og/about.png` in place — `/knowme` metadata references it (`site/src/app/knowme/page.tsx:11`); do NOT rename it in this task.
**Done:** build outputs 6 routes (no `/about`); sitemap lists `/knowme/`, not `/about/`.
**Verify:** `npm run build 2>&1 | grep -E "about|knowme"` → only knowme; `grep -c "about" public/sitemap.xml` → 0.
**Commit:** `feat(pages): delete orphaned /about — /knowme is the about page`

### T4.1.2 — Delete orphaned component files
**Files (DELETE):**
- `site/src/components/Footer.tsx`
- `site/src/components/CssHeroAtmosphere.tsx`
- `site/src/components/ScrollReveal.tsx`
- `site/src/components/ScrollRevealContainer.tsx`
- `site/src/hooks/useScrollReveal.ts`

**Pre-check (mandatory):** `grep -rn "Footer\|CssHeroAtmosphere\|ScrollReveal\|useScrollReveal" site/src --include="*.ts*" | grep -v "components/Footer.tsx\|components/CssHeroAtmosphere.tsx\|components/ScrollReveal"` — the only hit should be the stale comment in `site/src/app/page.tsx:35` (`{/* Layer 0 & 1 skipped: no PageBackground or CssHeroAtmosphere in hero */}`). Update that comment to `{/* Layers 0 & 1: body bg + noscript poster (layout.tsx) — nothing rendered here */}`. If ANY live import shows up: STOP and report.
**Done:** 5 files gone, build green.
**Verify:** `ls` the five paths → all "No such file".
**Commit:** `chore(cleanup): delete orphaned Footer, CssHeroAtmosphere, ScrollReveal chain`

### T4.1.3 — Delete commented-out dead blocks in the 3D engine
**Files:** `site/src/components/engine/EngineCanvas.tsx`, `site/src/components/engine/SceneObjects.tsx`
**Change (EngineCanvas.tsx — re-grep, anchors of 2026-07-07):**
- L18–44-ish: the commented `buildStreamCurves()` definition + `streamDefs` — delete.
- L74: `// const streamGroupRef = ...` — delete.
- L176–184: commented stream-opacity block in `useFrame` — delete (keep the live `sceneOpacity` const, it feeds the grid below).
- L219–223: the four commented breathe lines (`eIntensity`/`baseBreathe`/`ePulse`) — delete; keep the live `const breathe = ...` line and the `// T14: always fast pulse` comment.
- L228–237: commented waypoint-E exit-stream block — delete.
- L258–272: the `{/* DataStream disabled ... */}` JSX comment block — delete.
**Change (SceneObjects.tsx):**
- The commented SpriteGlow halo calls in `Core` (~L89–92) + their deprecation comment — delete.
- **KEEP** the `DataStream` component definition and the `SpriteGlow` component definition — `Satellite` uses `DataStream` internally (~L377–388) and `SpriteGlow` is used by Satellite/StageNodes. Deleting either = broken build. Only the commented-out *call sites* die.
**Done:** `grep -n "streamGroupRef\|buildStreamCurves\|baseBreathe\|ePulse" EngineCanvas.tsx` → 0 hits; build green; hero page visually unchanged.
**Verify:** the grep above + gates.
**Commit:** `chore(engine): delete commented-out DataStream/SpriteGlow/breathe dead code`

### T4.1.4 — Simplify DecryptedText (ponytail finding 4, partial — safe half only)
**Files:** `site/src/components/DecryptedText.tsx`
**Change:** remove the dead `direction` state (`"forward" | "reverse"`, L52 + branches at L176/190/208/233). All current usages are one-way forward reveals (`animateOn` = "view"/"hover" only; no "click" usage exists — verified). Keep `isDecrypted` and the `hover` mode for now — **subphase 4.2 rewires the nav and then decides what else is dead. Do not remove `hover` here.**
**Done:** `grep -n "direction" DecryptedText.tsx` → 0; all pages still decrypt on view; nav still decrypts (current behavior) on hover.
**Verify:** gates + grep.
**Commit:** `refactor(decrypt): remove dead reverse-direction logic`

⛔ **STOP 4.1** — LOOK AT THIS: (1) `/about` → branded NO SIGNAL 404; (2) `/` hero — 3D scene identical to before (core, satellite at waypoint C, no visual change); (3) any page — text decrypt still fires. Completeness table per §7.

---

# SUBPHASE 4.2 — Nav rework: decrypt-once + liquid-glass ripple

*Goal: W2 + W3. This is the taste-heaviest subphase.*
*Model: DeepSeek HIGH; **T4.2.3 ripple at ⬆ MAX**. (⛔ If Sid prefers, T4.2.3 can go to GLM 5.2 1M MAX instead — Sid switches models himself; never assume.)*

### T4.2.1 — Decrypt once per page load, never on hover
**Files:** `site/src/components/Nav.tsx`
**Change:**
- Delete the dead `scrolled`/`setScrolled` state (L19), the TEMP comment (L18), and the entire first `useEffect` (L25–39: the `supportsBackdrop` no-op with the commented onScroll block). Nothing reads `scrolled` — verified.
- Replace the `hasInitialDecrypted` logic: nav decrypts once on EVERY page load. Home (`pathname === "/"`) waits for `engineReady` (+500ms, existing pattern L41–52); subpages trigger on mount immediately. After the initial run completes, `animateOn` must resolve to a mode that **never re-animates** (add/use a `"none"`-like static mode on DecryptedText if needed — smallest possible change).
- Hover on nav links: color-to-orange only (CSS already does this via `group-hover:text-[--accent]`). While initial decrypt is running, suppress the hover color (e.g. a `data-decrypting` attribute on `<nav>` + CSS override).
**Done:** hard-reload `/` → name+links scramble once after the loading screen, then never again on hover. Hard-load `/prospect` → scramble once on load. Hover any nav link mid-decrypt → no color change; after decrypt → orange.
**Verify:** gates; manual steps go in the STOP checklist.
**Commit:** `feat(nav): decrypt once per page load everywhere, hover = color only`

### T4.2.2 — Strip now-dead DecryptedText hover machinery
**Files:** `site/src/components/DecryptedText.tsx`
**Pre-check:** `grep -rn 'animateOn' site/src --include="*.tsx" | grep -v DecryptedText.tsx` — if any usage other than `"view"` (or the new static mode) remains, STOP and report.
**Change:** remove the `hover` event listeners/branches and the `isDecrypted` remnants that only served hover re-animation. Component keeps: view-triggered sequential reveal, reduced-motion guard, aria semantics.
**Done:** grep shows no `hover` mode; all decrypt sites still animate once on view.
**Commit:** `refactor(decrypt): remove hover mode after nav rework`

### T4.2.3 ⬆ MAX — Liquid-glass "droplet in puddle" ripple
**Files:** `site/src/components/Nav.tsx`, `site/src/app/globals.css`, NEW `site/src/components/NavRipple.tsx`
**What it is (Sid's aesthetic, frozen):** concentric expanding ripples + subtle press distortions, semi-transparent frosted-capsule look. Wave sweeps the nav once when the LAST nav link finishes its initial decrypt; text the wave touches turns `--accent` orange in <100ms, fades back to its normal color over ~200ms. Additionally every nav link click/tap emits a small ripple from the press point (W3).
**Implementation constraints:**
- **N3: no new dependencies.** Use SVG `feTurbulence`+`feDisplacementMap` filter or raw WebGL/canvas (pattern exists in `site/src/components/paper-ink-shader.ts`) or `@paper-design/shaders-react`. CSS `backdrop-filter` may provide the frost.
- Mount inside the Layer 5.1 slot: the reserved sibling div in `Nav.tsx` L56–57 (`z-[40]`, pointer-events-none). Nav links stay at z-50 above it; the *distortion* may overlay the links visually via the filter but must never block clicks.
- `prefers-reduced-motion: reduce` → no ripple at all, instant orange flash ≤200ms or nothing (content unaffected).
- Pause/no-op when tab hidden. Error boundary or graceful degrade if the filter is unsupported (feature-query) — fallback = the CSS color wave only.
- **N1: it must be plainly visible.** If the displacement reads as invisible at spec values, INCREASE amplitude until visible and note the final numbers in the STOP report. Invisible = failed.
- This becomes the site's **single** glassmorphism instance (D25 slot, vacated when FlutedGlass nav was removed).
**Done:** hard reload → decrypt completes → one visible liquid wave crosses the nav, links flash orange fast and fade slow; clicking a nav link emits a small ripple at the press point; 60fps-ish (no visible jank while scrolling).
**Verify:** gates; STOP checklist drives Sid's visual verdict.
**Commit:** `feat(nav): liquid-glass droplet ripple on decrypt-complete and link press`

⛔ **STOP 4.2** — LOOK AT THIS: (1) hard-reload `/` — watch nav after loading screen: one decrypt, then the wave; (2) hover links during vs after decrypt; (3) click a nav link — press ripple; (4) hard-load `/prospect` — decrypt fires there too; (5) OS reduced-motion on → no ripple, page still fine. **This is a taste gate: Sid may reject the ripple rendering; if rejected, note his exact words and STOP for a revised spec — do not freelance a redesign.**

---

# SUBPHASE 4.3 — Waypoint re-mapping (phase4-plan Objective 1)

*Goal: W1 — camera waypoints match the 5 real DOM sections at every viewport.*
*Model: DeepSeek HIGH.*

### T4.3.1 — Measure sections dynamically, drive waypoint p-values from the DOM
**Files:** `site/src/components/engine/EngineCanvas.tsx` (WAYPOINTS array ~L62–68, `p` computation in the scroll handler), `site/src/app/page.tsx` (5 section anchors: `<section>` L37 + `<Section>` L110, L152, L188, L252 — re-grep)
**Approach (engineering decision, documented):** hardcoded percentages cannot be correct across viewports because text wraps and section heights change. Instead:
- Tag the 5 sections with `data-waypoint="a|b|c|d|e"` (or stable ids).
- On mount + on `resize` (debounced), measure each section's `offsetTop` relative to total scrollable height → produce the 5 waypoint trigger `p` values (a=0.0 fixed, e anchored so the last section is fully framed at p=1.0).
- Feed measured values into the existing WAYPOINTS interpolation (keep camPos/lookAt/sceneOpacity per waypoint; only the p-ranges become dynamic).
- Keep the damped-lerp scroll feel exactly as-is (smoothP, factor 0.06). No scroll-jacking (D4).
**Done:** at 1440px width AND at a narrow window (~800px), each camera arrival visibly coincides with its section's text entering the viewport — especially waypoint C no longer fires in empty space between SYSTEM/02 and the timeline.
**Verify:** gates; add a temporary `console.debug` of measured p-values, note them at the STOP, then REMOVE the debug line before commit (no debug residue).
**Commit:** `feat(engine): waypoints measured from DOM sections, synced to text entry`

⛔ **STOP 4.3** — LOOK AT THIS: slow-scroll `/` top→bottom at full-screen and at a half-width window; check each of the 5 sections gets its camera moment aligned; check the satellite (waypoint C) appears alongside the Travel Planner section, not in dead space.

---

# SUBPHASE 4.4 — Subpage layer restacking (phase4-plan Objective 3)

*Goal: W4, W9, W10, W11. Three page groups, each its own task + commit.*
*Model: DeepSeek HIGH.*

**Shared rules for all three tasks:**
- BG images: use `site/public/test/` files (TEMP per W9). Wire through `PageBackground` (`site/src/components/PageBackground.tsx` — currently orphaned; it becomes Layer 0) with an explicit `image` prop per page. Default fallback inside PageBackground stays.
- Z-scale per page-local stacking (nav z-50, loader z-[100], cursor z-[9999] are global and untouched): L0 bg `-z-10`→`z-0`-equivalent (keep `-z-10` fixed pattern already in PageBackground), then ascending page-local values; text `z-[20]`, links `z-[30]` mirroring the hero schema.
- Every layer that exists in Sid's schema but has no content yet (Future Expansion) = documented comment, no DOM.
- Glitch pulse: ensure every link/button on these pages carries `link-pulse-auto link-pulse-hover` (Button.tsx adds them by default via `linkPulse`; audit raw `<a>` tags) — W8.

### T4.4.1 — Prospect + Travel Planner restack
**Files:** `site/src/app/prospect/page.tsx`, `site/src/app/travel-planner/page.tsx`, `site/src/components/PaperInkLoader.tsx` (read-only unless z-fix needed)
**Change:** implement Sid's 9-layer schema: L0 PageBackground (test image, screen-anchored) → L1 hero image covering the hero section (use a `test/` image; source may differ per page) → L2 PaperInk shader over the hero image (PaperInkLoader already mounts on these pages — re-scope it to cover the hero-image bounds) → L3 all text + section separator lines `z-[20]` → L4 all links/buttons `z-[30]` → L5 nav (global) → L6 future (comment) → L7 loader slot → L8 cursor (global).
**Done:** both pages show bg image + hero image + ink shader stacked correctly; all text readable; no element unreachable (click every link).
**Commit:** `feat(subpages): prospect + travel-planner layer restack per phase4 schema`

### T4.4.2 — Projects restack
**Files:** `site/src/app/projects/page.tsx`, `site/src/components/GridBackdrop.tsx` (read-only)
**Change:** L0 PageBackground (test image) → L1 GridBackdrop → L2 text `z-[20]` → L3 links/cards `z-[30]` → rest global. GridBackdrop currently renders first — verify stacking against the new L0.
**Done:** grid visible over bg image, cards hover/click fine.
**Commit:** `feat(projects): layer restack with bg image under grid backdrop`

### T4.4.3 — KnowMe restack + lanyard above nav
**Files:** `site/src/app/knowme/page.tsx`, `site/src/app/knowme/KnowMeClient.tsx`, `site/src/components/KnowMeBackground.tsx`
**Change:** L0 section container (exists) → L1.1 bg image (KnowMeBackground already uses `/test/pic_idea.png`) → L1.2 FlutedGlass (exists in KnowMeBackground) → L2 text: keep the frosted scrim; set text color STATICALLY per the current image's average tone (compute once — eyeball or a throwaway node script; `pic_idea.png` decision goes in the commit body) → L3 links/buttons `z-[30]` → L4 nav (global z-50) → **L5 Lanyard: raise the lanyard wrapper (currently `z-[1]` in KnowMeClient.tsx L28) above the nav → `z-[60]`** so the card can swing over nav links. Loader `z-[100]` and cursor `z-[9999]` must still beat it.
**Done:** dragging the card over the nav renders the card ON TOP of nav links; nav still clickable where the card isn't; text readable.
**Commit:** `feat(knowme): layer restack, lanyard above nav, static text tone`

### T4.4.4 — Entry-load overlay on subpages (W10)
**Files:** `site/src/components/IntroScreen.tsx`, `site/src/app/layout.tsx`, `site/src/app/page.tsx`, NEW small module `site/src/components/intro-session.ts`
**Change:** module-scope `let introShown = false` (in-memory, NOT sessionStorage — a hard reload resets it, which is exactly the wanted semantics). First page mounted in the JS session shows the overlay; client-side navigations skip it. Home keeps the full engine-aware IntroScreen (`engineReady`, MIN 1000ms, MAX_WAIT 10000 — unchanged contract). Subpages get the same overlay visuals but readiness = fonts + window `load` (real signals, N9), same min/max. Mount strategy: move IntroScreen mount from `page.tsx` into `layout.tsx` OR mount per-page — choose the smaller diff, state which in the commit body. Scroll-lock while visible (existing `phase < 3` overflow pattern).
**Done:** hard-load `/prospect` → overlay shows ≥1s then dismisses; navigate `/` → `/prospect` → NO overlay; hard-reload `/` → overlay as today.
**Commit:** `feat(loader): entry-load overlay on subpages, in-session navigations skip`

⛔ **STOP 4.4** — LOOK AT THIS (one row per page in the completeness table): `/prospect`, `/travel-planner` (bg + hero image + ink shader + readable text), `/projects` (grid over bg), `/knowme` (drag card over nav; text tone), hard-load vs client-nav loader behavior on all four. **Reminder shown to Sid: the images are the TEMP /test/ ones you approved — including your personal photo — swap is on LAUNCH-CHECKLIST.**

---

# SUBPHASE 4.5 — Report fixes: frames, touch targets, safe-area, T14 buttons

*Model: DeepSeek HIGH.*

### T4.5.1 — Shared ScreenshotPlaceholder: scanlines out, ticks stay, SVGs in
**Files:** NEW `site/src/components/ScreenshotFrame.tsx`; `site/src/app/prospect/page.tsx` (~L176–195), `site/src/app/travel-planner/page.tsx` (~L134–152)
**Change:** extract the duplicated frame (aspect-video, `--surface-2`, border, 4 corner ticks) into one component. DELETE the scanline overlay divs entirely (W7 — including the boosted 0.30/5px values and the `{/* testing different size and opacity */}` comments). Wire the real placeholder diagrams: prospect → `/placeholders/prospect-telegram.svg` + `/placeholders/prospect-pipeline.svg`; travel-planner → `/placeholders/travel-grafana.svg` + `/placeholders/travel-sse.svg` (match each to its caption text). Captions stay ("SCREENSHOT — Sid to capture: ..." until real captures land).
**Done:** no `repeating-linear-gradient` scanlines anywhere; ticks visible; SVGs render inside frames on both pages.
**Verify:** `grep -rn "repeating-linear-gradient" site/src/app` → 0 hits.
**Commit:** `refactor(subpages): shared ScreenshotFrame — scanlines removed, placeholder diagrams wired`

### T4.5.2 — 44px touch targets (invisible hit-area expansion — visual size unchanged, N2-safe)
**Files:** `site/src/components/Button.tsx`, `site/src/components/Nav.tsx` (Resume button L118–125), `site/src/app/knowme/KnowMeClient.tsx` (footer `<a>` L60–65), inline `<a>` links in `site/src/app/prospect/page.tsx`, `site/src/app/travel-planner/page.tsx`, `site/src/app/projects/page.tsx`, `site/src/app/page.tsx` (timeline/publication links)
**Change:** add a reusable expanded-hit-area pattern (`relative` + `before:absolute before:inset-[-10px]` or padding+negative-margin — pick ONE pattern, use it everywhere) to every interactive element whose rendered box is under 44×44. Visual appearance must not change.
**Done:** DevTools-measure the Resume button and one knowme footer link: effective hit box ≥44px tall.
**Commit:** `fix(a11y): 44px touch targets via invisible hit-area expansion`

### T4.5.3 — iOS safe-area on nav
**Files:** `site/src/app/layout.tsx` (add `export const viewport: Viewport = { ..., viewportFit: "cover" }` — no viewport export exists today), `site/src/components/Nav.tsx`
**Change:** nav gets `pt-[env(safe-area-inset-top)]` (and the fixed L5.1 slot div matches). Height grows by the inset only on notched devices; zero change elsewhere.
**Done:** desktop unchanged; DevTools iPhone emulation shows nav content below the notch line.
**Commit:** `fix(nav): iOS safe-area inset + viewport-fit cover`

### T4.5.4 — "Want your own version?" buttons (T14 P7, W14)
**Files:** `site/src/app/prospect/page.tsx` (CTA footer ~L214–229), `site/src/app/travel-planner/page.tsx` (~L162–179)
**Change:** in each CTA footer row: LEFT = primary Button `Want your own version?` →
prospect: `mailto:siddharthsingh8418@gmail.com?subject=Prospect%20System%20Inquiry`;
travel-planner: `mailto:siddharthsingh8418@gmail.com?subject=Travel%20Planner%20Agent%20Inquiry`.
RIGHT-ALIGNED (same row, `justify-between`) = existing cross-link ghost Button (`Travel Planner Agent →` / `Prospect →`). Keep the existing "Email me"/"Resume ↓" pair above untouched. This copy is scoped and exact — do not invent variants (N4).
**Done:** both pages show left mailto + right cross-link in one row; mailto opens with the correct subject.
**Commit:** `feat(subpages): Want-your-own-version mailto + right-aligned cross-links`

### T4.5.5 — Sitewide link-pulse audit (W8)
**Files:** read-only sweep of all `site/src/app/**/page.tsx` + `Nav.tsx`; edit only where classes are missing
**Change:** every `<a>`/link/button gets `link-pulse-auto link-pulse-hover` (Button default already does; `linkPulse={false}` on the nav Resume button gets REMOVED so it pulses like everything else). Do NOT touch `AUTO_INTERVAL` (3000ms) or the AMPED keyframes (N10).
**Done:** watch any subpage for 6s → links pulse on the shared clock.
**Commit:** `fix(links): glitch pulse on shared clock sitewide`

⛔ **STOP 4.5** — LOOK AT THIS: frames on both case studies (ticks, diagrams, NO lines), tap-target feel on a phone-sized window, notch emulation, the new CTA rows (click both mailtos), 6-second pulse watch on `/projects`. Completeness table per §7.

---

# SUBPHASE 4.6 — 3D scene aspect responsiveness (deferred item, W13)

*Model: DeepSeek HIGH, ⬆ MAX if the first attempt reads wrong.*

### T4.6.1 — Aspect-adaptive camera
**Files:** `site/src/components/engine/EngineCanvas.tsx` (Canvas `camera={{ position: [1.8, 0.8, 7], fov: 45 }}` L329; waypoint camPos vectors ~L62–68)
**Change:** compute an aspect factor each frame/resize (`viewport` from R3F or `size.width/size.height`): for aspect < ~1.2 (portrait/narrow), widen effective FOV (up to ~60) or scale camera distance so the core (radius 2.9 desktop / 2.0 coarse) fits within ~45–60% of frame height at waypoint A and never clips off both edges. Keep desktop 16:9 rendering IDENTICAL to today (regression = reject). The existing `coarse` scaling stays.
**Done (pass criteria):** DevTools at 375×812, 768×1024, 1440×900, 3440×1440 — core fully in frame at waypoint A on all; satellite visible at waypoint C on ≥768px; desktop unchanged side-by-side.
**Verify:** gates + the four-viewport check in the STOP list.
**Commit:** `feat(engine): aspect-adaptive camera — core framed on all viewports`

⛔ **STOP 4.6** — LOOK AT THIS: the four viewport widths above, scroll each through waypoints A–E; Sid confirms desktop is pixel-identical and phone no longer bleeds.

---

# SUBPHASE 4.7 — Close-out: docs, copy register, decision log, final sweep

*Model: DeepSeek HIGH.*

### T4.7.1 — COPY.md registration
**Files:** `/home/sidd/project/freelance/portfolio-website/COPY.md`
**Change:** append a "KnowMe page" section registering the copy that exists in `KnowMeClient.tsx` verbatim (bio paragraph, buttons, footer links) and the two new mailto button labels + subjects from T4.5.4. Mark each claim's source (all verified against COPY.md's register 2026-07-07: six weeks ✓, firefighting robot ✓). Invent nothing.
**Commit:** `docs(copy): register knowme + want-your-own copy`

### T4.7.2 — DESIGN.md decision log rows
**Files:** `/home/sidd/project/freelance/portfolio-website/DESIGN.md` §6
**Change:** append exactly:

| # | Date | Decision | Why |
|---|---|---|---|
| D41 | 2026-07-07 | Commented-out dead code deleted (DataStream/SpriteGlow call sites, breathe math, onScroll) — reverses C4 "keep commented" | Sid: delete now; git history preserves it; audits stop re-flagging |
| D42 | 2026-07-07 | /about deleted; /knowme is the about page; sitemap swapped | Orphaned duplicate with placeholder QR card |
| D43 | 2026-07-07 | Nav decrypt: once per page load everywhere, never on hover; hover = color only, suppressed during decrypt | phase4-plan Obj 2; supersedes 2026-07-06 dual-trigger |
| D44 | 2026-07-07 | Liquid-glass droplet ripple = the site's single glassmorphism instance (D25 slot); once post-decrypt + press ripples; zero new deps | Sid picked liquid-glass over CSS wave |
| D45 | 2026-07-07 | Link glitch pulse uniform sitewide (auto 3s shared clock + hover) | Supersedes T14 hover-only-subpages |
| D46 | 2026-07-07 | Screenshot frames: scanlines removed permanently, corner ticks stay, placeholder SVGs until real captures | Sid: "Lines are weird" |
| D47 | 2026-07-07 | Subpage layer schemas per phase4-plan Obj 3; KnowMe lanyard renders above nav | Sid's written layer architecture |
| D48 | 2026-07-07 | Loading overlay on the session's entry page only (in-memory flag, hard reload resets) | Sid: "real loading on subpages only if the site loads firstly on a subpage" |
| D49 | 2026-07-07 | /test/ images TEMP-approved as BG assets; must be swapped before launch | Sid accepted interim public exposure |
| D50 | 2026-07-07 | Waypoint p-values measured from DOM section offsets at runtime (resize-aware), not hardcoded | Hardcoded percentages can't hold across viewports |

**Commit:** `docs(design): decision log D41–D50`

### T4.7.3 — LAUNCH-CHECKLIST + layer docs update
**Files:** `docs/LAUNCH-CHECKLIST.md`, `docs/plans/layers-heropage.md` (post-move path)
**Change:** LAUNCH-CHECKLIST gains three unchecked items: (1) **Replace all `site/public/test/` images with final assets — personal photo currently public**; (2) re-verify KnowMe text tone after image swap (D-static choice); (3) capture + drop in the four real screenshots (frames + captions ready). Layer doc gains the three subpage schemas (copy from phase4-plan Obj 3, updated with final z values used).
**Commit:** `docs: launch checklist + subpage layer schemas`

### T4.7.4 — Final sweep
**Change:** run gates; `git status` must be EMPTY (untracked = failure); `grep -rn "TEMP\|FIXME\|testing different" site/src --include="*.tsx"` → only intentional hits (list each with justification in the STOP report; the `/test/` image paths are the only expected TEMP survivors).
**No commit** (nothing should change; if something does, STOP and report).

⛔ **STOP 4.7 — FINAL** — full completeness table listing every task T4.0.1–T4.7.4 with Built/Gate/Sid-verified columns, `git log --oneline` for the whole phase, and the sentence: "Phase 4 is complete pending your final visual pass. Nothing has been pushed."

---

## 10. Knowledge-base step (part of 4.7)

Planning docs live in `docs/plans/`, reports in `docs/reports/` (T4.0.2). This plan file itself is committed. Sid's Obsidian vault update is Sid-manual (out of executor scope).

## 11. Kickoff prompt (paste into DeepSeek v4 Pro 1M, effort HIGH)

```
Read /home/sidd/project/freelance/portfolio-website/docs/plans/phase4-execution-plan.md
fully, then execute it starting at SUBPHASE 4.0, strictly in order.

Non-negotiables you must hold for the entire run:
- Execute ONLY the named tasks on the named files. Re-grep every line anchor first.
- Gates after every task: cd site && npm run build && npm run lint && npm run guards.
  One failed-fix attempt max, then STOP with full output. Never edit gate scripts.
- One task = one commit, no attribution trailers, no AI mentions, NEVER push.
- ⛔ STOP at the end of every subphase using the plan's §7 template and WAIT for Sid.
  Never continue past a STOP. Silence is not yes.
- The DON'T-WANT list (§3) overrides everything: no invisible effects, no new
  dependencies, no layout/content changes beyond the scoped tasks, no relitigating
  decided items.
- If the tree contradicts the plan: STOP and report. Do not improvise.
- Effort: HIGH. Tasks marked ⬆ MAX (T4.2.3, optionally T4.6.1): raise effort to MAX.

Address the user as Sid.
```

## 12. Grill record + confidence

- Self-grill: all six audit reports verified line-by-line against the tree; four orphaned-file families found beyond the reports; build/gates baseline green; every anchor in this plan re-checked 2026-07-07.
- Sid grill (12 questions, 3 rounds): scope = all four blocks + phase4-plan objectives; delete dead code now; delete /about; Sid verifies visually at every STOP; decrypt once-per-load everywhere; ripple = liquid-glass, once + press; scanlines out / ticks stay; pulse uniform sitewide; test images TEMP; entry-load overlay only; KnowMe static text tone + scrim; lanyard above nav; commit docs / ignore tooling; don't-wants = no imperceptible effects, no layout/content changes, no new dependencies; done = per-subphase visual sign-off.
- **Confidence: 8.5/10.** Top risks: (1) T4.2.3 liquid-glass ripple is a taste gate — Sid may reject the first rendering (mitigated: STOP explicitly allows rejection + respec, and the CSS-wave fallback exists inside the same task); (2) waypoint dynamic measurement interacts with the loading-screen scroll-lock and Lenis smooth scroll — measurement must run after layout settles (called out in T4.3.1); (3) subpage layer restack touches the same files as 4.5 polish — order is fixed (4.4 before 4.5) to prevent conflicts.

**SCOPE FREEZE (2026-07-07):** additions at execution time are rejected. STOPs are accept/reject only — new ideas go to a Phase 5 list, not into this run.
