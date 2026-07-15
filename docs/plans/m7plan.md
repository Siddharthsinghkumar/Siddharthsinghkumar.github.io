# m7 — POST-LAUNCH MOBILE BATCH (site live 2026-07-15; desktop 80/100, phone 50/100 per Sid)

Read first, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, site/AGENTS.md,
m0plan §3 … m6plan §2 (all N-rules), then this file entirely. m6plan §5 records the launch state.
The site is LIVE — every change here re-certifies and re-archives before Sid pushes (D70 flow).

## 1. Verified defects (empirical, docs/qa/m7/*.png, prod build :4173, 375×812 + 360×800)

| # | Defect | Evidence |
|---|---|---|
| D1 | Nav overflows viewport on EVERY page: links row spans x=87..483 on a 375px screen; **Resume button starts at x=396 — fully off-screen**; KNOWME clipped; wordmark + "TRAVEL PLANNER" wrap to 2 lines (jumble). No mobile menu exists. | iphone-*-top.png, overflow probe in plan commit message |
| D2 | knowme mobile: cardScale=2 card covers ~60% of the phone screen, overlaps the entire bio text, hangs off right edge (anchored to the clipped KNOWME nav link). | iphone-knowme-top.png |
| D3 | Perf stutter on phone (Sid observed). Already mitigated in code: engine dpr [0.3,0.6] coarse, lanyard dpr ≤1.5, Lenis touchMultiplier 0 (native touch scroll). Remaining suspects: backdrop-blur panels, DecryptedText timers, paint layers. VERIFY, don't guess. | Sid's report |
| — | NOT defects: prospect/travel diagrams (min-w 720/700) sit in labeled overflow-x-auto scroll regions — deliberate. Projects marquee off-screen items — deliberate animation. | probe output |

## 2. Sid's framework questions — answered, closed, do not revisit

- `responsive_framework` (pub.dev) is a **Flutter/Dart** package — cannot run in React/Next.js.
- **Spring Boot** is a Java backend framework — a static GitHub Pages export has no server; zero benefit.
- The responsive framework for this stack is **Tailwind CSS 4, already installed**. m7 = actually
  using its breakpoints for nav/knowme. No new frameworks, no new dependencies (hard rule).

## 3. Fix batch (DeepSeek v4 Pro @ HIGH) — one task = one commit, build green before each

### F1 — Mobile nav with dropdown (D1)
- Below `md`: nav row = wordmark (SS decrypt behavior stays) + hamburger button (44×44 hit area,
  `aria-expanded`, `aria-controls`, focus-visible ring, rest/hover/active states).
- Menu: full-width panel under the 64px bar, token bg + `border-b border-[--line]`, the 4 links
  stacked (each ≥44px tall, mono uppercase style preserved) + Resume button last. Closes on route
  change, Escape, and outside tap. Body scroll locked while open. `prefers-reduced-motion`: panel
  appears/disappears with no animation, content always reachable.
- `≥md` desktop nav: **zero visual change** (Sid rated it 80/100 — don't touch).
- The nav row must never exceed viewport width at 320/360/375/768.

### F2 — knowme card fits the phone (D2)
- `<768px`: pass `cardScale={1}`; clamp anchor fraction so the FULL card rests inside the
  viewport (fraction ≤ ~0.78, tune visually); if the KNOWME nav link is off-screen/clipped
  (mobile menu now hides it), fall back to fraction 0.72 — strap from top edge is fine.
- The card must not cover the text panel's readable column: at 375px the bio text stays fully
  readable without moving the card. If unavoidable, place the card region BELOW the text panel
  on mobile (text first, card hangs in its own ≥60svh block). Drag must still work (touch).
- Desktop (≥768): unchanged — cardScale 2, nav-link anchor, as Sid approved in m6.

### F3 — Mobile perf verification pass (D3) — measure, then fix only what measures bad
- Run lighthouse-gate (mobile emulation) + a 4x-CPU-throttled trace on home and knowme.
- Allowed fixes if (and only if) the trace fingers them: replace `backdrop-blur` with solid
  token bg at `<md`; pause DecryptedText hover re-scrambles on coarse pointers; add
  `will-change: transform` ONLY where a measured layer thrashes. No dpr/threshold edits (N18),
  no gate-script edits (N7).

### F4 — Mobile gate tests (Sid-authorized ADDITIONS — N7 forbids weakening, not strengthening)
- New playwright [mobile] assertions: (a) nav row right edge ≤ viewport width on all 5 pages +
  404; (b) Resume reachable & visible on mobile (open menu → link in viewport); (c) menu
  opens/closes/locks scroll; (d) knowme: bio text not occluded by canvas at 375×812
  (elementFromPoint probes on 4 text corners); (e) every interactive element ≥40px tap target
  on mobile; (f) viewport meta = `width=device-width, initial-scale=1` present in out/ HTML.
- Evidence to docs/qa/m7/: post-fix screenshots, same viewports, md5-unique, :4173, ≥5s settle
  (N23) — PLUS one landscape set (667×375 or 800×360) per page: layout must not break rotated.

## 4. Runbook after F1–F4
1. Full suite 3× consecutive green (build/tsc/lint/guards/playwright/lighthouse/visual).
2. ⛔ STOP M7-A — Sid judges on :4173 **from a real phone or devtools device mode**:
   nav menu, knowme card, both case pages, 404. Accept ⇒ step 3. Reject ⇒ STOP, re-plan.
3. Re-archive snapshot (m6plan T3 procedure verbatim) → N17 privacy grep zero hits →
   **Sid pushes** `--force` not needed this time (fast-forward from live main is fine only if
   history preserved — otherwise same snapshot flow: fresh `Initial release`… NO: post-launch
   updates use D70 — certify private tree → `git archive` sync into the LIVE clone → normal
   commit on top of main → Sid pushes). Claude reconciles this at STOP M7-A with exact commands.
4. T5-style live check on the phone after deploy.

## 5. Non-negotiables (breach = work rejected even if green)
No new dependencies. No desktop visual changes. No gate-script or threshold edits (N7/N18).
No generated imagery (N22). Copy verbatim from COPY.md — the menu introduces NO new words
except existing link labels + "Menu"/"Close" aria-labels (register in COPY.md). Evidence paths
must exist (N19). Screenshots md5-unique from :4173 (N20/N23). No attribution trailers. NEVER push.
STOP COMPLETELY at ⛔ STOP M7-A. Address the user as Sid.

## 6. Wix 18-point mobile checklist — mapped in full (Sid supplied 2026-07-15; every point accounted for)

| # | Tip | Status here |
|---|---|---|
| 1 | Mobile-first approach | ADOPTED for F1/F2: build the <md layouts first; desktop ≥md frozen |
| 2 | Responsive template/framework | HAVE: Tailwind CSS 4 breakpoints (this stack's equivalent; no Wix/Flutter) |
| 3 | Avoid Flash | N/A — Flash is dead; site is HTML5/CSS/WebGL already |
| 4 | Page speed | GATED: lighthouse-gate mobile emulation, floors home ≥55 / cases ≥72 + F3 trace pass. trailingSlash links emit no redirects; GitHub Pages CDN hosting |
| 5 | Readable fonts | next/font self-hosted (zero font-download delay); body ~17px ≥14px verified m6. **F1 folds in: menu link text ≥14px** (current 10px nav mono is below the floor on phone) |
| 6 | Image optimization | webp posters/heroes already; static export lazy-loads below-fold imgs — **F3 verifies `loading="lazy"` on below-fold `<img>`**; widths are % / max-w already |
| 7 | Space out links | **F1/F2 fold-in: ≥44px hit areas** (expanded-hit-area util exists); F4(e) asserts it |
| 8 | Viewport meta tag | Next emits `width=device-width, initial-scale=1` — F4(f) asserts it in out/ (Wix's fixed width=320 advice is outdated; do NOT copy it) |
| 9 | Short forms, no autocorrect | N/A — site has zero forms (mailto CTA is deliberate) |
| 10 | Avoid large text chunks | SID RULES: knowme bio is one long paragraph — reads as a wall at 375px. Splitting it = copy change = Sid's call at STOP M7-A (COPY.md is frozen otherwise) |
| 11 | CTA buttons | Token-contrast buttons exist; F1 puts Resume in the menu ≥44px tall; email CTA already bottom-of-page thumb zone |
| 12 | Search function | N/A — 5 pages; nav covers everything; search on a 5-page site is clutter (declutter doctrine wins) |
| 13 | Declutter + hamburger menu | EXACTLY F1 |
| 14 | Both orientations | F4 landscape evidence set added |
| 15 | Simplify navigation | F1 menu = flat 4 links + Resume; critical actions ≤2 taps; F4(b) asserts |
| 16 | No text-blocking ads/pop-ups | N/A — no ads, no pop-ups; intro screen is a loader that self-dismisses and honors reduced-motion |
| 17 | Desktop-view toggle | REJECTED — anti-pattern on a properly responsive site; contradicts #13 |
| 18 | Test on real devices | RUNBOOK: STOP M7-A explicitly requires Sid's judge from a real phone; lighthouse gates in CI |

## 7. KICKOFF PROMPT — DeepSeek v4 Pro @ HIGH

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then site/AGENTS.md,
then docs/plans/m0plan.md §3, m1plan.md §2, m2plan.md §2, m3plan.md §3, m4plan.md §3,
m5plan.md §3, m6plan.md §2+§5, then the ENTIRE plan at docs/plans/m7plan.md.
Execute F1→F4 strictly in order, one task = one commit, build green before every commit.
Desktop ≥md is FROZEN — pixel-identical. Mobile evidence at 360 AND 375 widths from the
served prod build :4173 after ≥5s settle, md5-unique, saved to docs/qa/m7/ with real paths.
F3 is measure-first: no perf edit without a trace line that names the cost. New tests in F4
are additions only — never modify existing assertions or thresholds. STOP COMPLETELY at
⛔ STOP M7-A after the 3× green suite and wait for Sid. Address the user as Sid.
```

---

# BATCH 2 — ⛔ STOP M7-A REJECTED (Sid's screenshots, 2026-07-15). Push deadline: ~1 hour.

## 8. Breach log (batch 1)

- **f4e8058 broke the FROZEN desktop**: the links row became an `overflow-x-auto
  max-w-[50vw]` strip with a visible scrollbar — Sid's "wtf slider" on BOTH phone and PC,
  and the old broken row still visible behind the hamburger on mobile. The commit message
  admits it was done to appease pre-existing getByRole tests. Component hacked to satisfy
  tests = the tail wagging the dog. Logged.
- **Menu-open state was never screenshotted**: batch-1 evidence had 18 files, none with the
  menu open — the transparent panel shipped unseen. From now on: every overlay state gets a
  screenshot (skill: mobile-responsive-check).

## 9. Root causes — all five PROVEN before this plan was written

| # | Sid's report | Proven root cause |
|---|---|---|
| R1 | Dropdown has no bg, overlays text | **Tailwind v4 silently drops `bg-[--surface]`** (v3 bracket-var shorthand). Compiled CSS has ZERO `var(--surface)` rules. Panel + knowme mobile text panel have no background at all. |
| R2 | Globe ball lines "tearing" | Engine DPR capped at [0.3, 0.6] on coarse pointers — hairline wireframe shreds at 0.3–0.6 DPR on a 2.6-DPR phone screen. |
| R3 | Knowme lanyard never renders on mobile/tablet; static block instead | Fallback card latches on mobile (watch: `useMediaQuery` flips false→true after mount, changing `cardScale` prop WITHOUT changing the remount key — scene/physics mismatch mid-load; reproduce first, then fix). Fallback ALSO mispositioned: `translateX((0.72-0.5)*100%)` shoves the 280px card half off-screen. |
| R4 | Bottom black bar on knowme mobile | Background layer is `absolute inset-0` inside a parent shorter than the scrolled content — page tail below one viewport height shows raw `--bg` black. |
| R5 | Old nav row + slider visible everywhere | f4e8058 (see breach log). |

## 10. Fix batch F5–F9 (surgical; desktop stays FROZEN — restoring it IS the fix)

### F5 — Revert the nav hack, restore frozen desktop (R5)
- Links row: back to `hidden md:flex` (gaps `md:gap-8` as pre-m7). NO overflow-x-auto, no
  max-w-[50vw], anywhere, at any breakpoint. Desktop 1440 screenshot must be pixel-identical
  to pre-m7 (`docs/qa/t10/home-wp-0.png` region as reference).
- Fix the failing pre-existing nav test PROPERLY (Sid-authorized test adaptation, logged):
  in the [mobile] project, navigation goes hamburger-first (open menu → click link). This
  asserts MORE (the menu works), never less. Desktop project unchanged.

### F6 — Real backgrounds: Tailwind v4 syntax (R1)
- Mobile menu panel and knowme text panel: use `@theme`-mapped utilities (`bg-surface`) or
  paren syntax `bg-(--surface)` — then PROVE it: grep compiled CSS for the `var(--surface)`
  rule AND pixel-sample the open-menu screenshot (panel pixel = #141416, not hero text).
- Backdrop `bg-[--bg]/80` on the menu overlay has the same dead-class bug — fix to working
  syntax (`bg-(--bg)/80` if supported, else explicit style) and pixel-verify.
- **Inventory, do NOT mass-fix**: list all ~15 `-[--` classNames in src with file:line in
  the report. Activating dead classes CHANGES approved desktop visuals — that's an m8
  decision for Sid, not a batch-2 edit. Fix ONLY what this batch's defects require.
- Add guard [9] (Sid-authorized guard ADDITION): fail on `-[--` inside className strings in
  src/ — this footgun must never ship again.

### F7 — Knowme mobile: the real card, centered (R3)
- Reproduce first on Pixel 7 emulation (412×915, touch). Find why fallback latches; fix so
  the REAL 3D lanyard loads on mobile. Include `cardScale` in the LanyardLoader remount key
  (`key={`${lanyard.key}-${cardScale}`}`) so the flip can't corrupt a mounted scene.
- Mobile anchor: card centered-ish (fraction ~0.5–0.6), cardScale 1, full card on-screen.
- Fallback (genuine no-WebGL only): clamp its translate so the 280px card is FULLY visible —
  centered on <md. Never half off-screen.
- Acceptance: Pixel 7 emulation screenshot shows the REAL rendered card, draggable, not
  covering the bio text; plus fallback-forced screenshot (webgl flag off) centered.

### F8 — Kill the black bar (R4)
- Knowme background layer → `fixed inset-0 z-0` (viewport-locked, covers all scroll states
  and dvh changes), or make the positioning parent span the full content height. Verify on
  Pixel 7 emulation scrolled to bottom: zero raw-black band. Check the other pages for the
  same pattern while there (report, fix only if visibly broken).

### F9 — Globe line integrity (R2)
- Raise engine coarse-pointer DPR from [0.3, 0.6] to [0.75, 1.25]. Verify: (a) close-up
  mobile screenshot — continuous lines, no tearing; (b) home lighthouse still ≥55 (floor,
  N18 — if it drops below, STOP with the number, do not ship the DPR raise).

## 11. Batch-2 runbook (the 1-hour path)

1. F5→F9, one commit each, build green each.
2. ONE full suite (build/tsc/lint/guards/playwright/lighthouse/visual) — deadline waiver of
   the 3× rule, Sid's call, logged here. All green or STOP.
3. Evidence (docs/qa/m7/batch2/): menu OPEN at 375, knowme Pixel 7 with real card, knowme
   bottom-of-page (no black bar), globe close-up, desktop 1440 nav (identical to pre-m7),
   404 mobile. md5-unique, :4173, ≥5s settle.
4. ⛔ STOP M7-B — Sid judges on :4173 (devtools Pixel 7 + his real phone).
5. Accept ⇒ re-archive snapshot (m6plan T3 verbatim) → N17 grep zero hits → **Sid pushes**
   (`git push --force …github.io.git HEAD:main` from the fresh snapshot).

## 12. The 20-point editorial critique (Sid pasted 2026-07-15) — triaged, NOT in this push

Honest call: points 1–20 are copy/IA/design restaging (hero density, paragraph lengths,
metrics ribbons, stack chips, featured-project weighting, section pacing). COPY.md is
frozen, every rewrite needs Sid's verdict per line, and none of it is a breakage. Doing it
in the same hour as five structural fixes guarantees a sloppy version of both. It becomes
**m8 (post-push)**: a staged mobile-editorial pass — hero trim, per-project copy layers
(one-liner → proof → architecture), metric chips that wrap by design, stack as chips with
progressive disclosure, one featured project weighted first. Each with a
prototype → Sid verdict → freeze cycle. The three cheap CSS-only candidates that COULD
ride along later without copy changes: stat-ribbon `flex-wrap` with row-gap, section
padding reduction at <md, CTA button full-width at <sm. Sid rules on m8 scope after this
push is live.

## 13. KICKOFF PROMPT — Batch 2, DeepSeek v4 Pro @ MAX

```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md, site/AGENTS.md, then
docs/plans/m7plan.md §8–§11 (Batch 2) in full, plus §1–§5 for context. Execute F5→F9
strictly in order. Non-negotiables: desktop ≥md restored to pre-m7 pixels (F5 reverts the
overflow-auto hack; that desktop breach is why this batch exists); every overlay state
screenshotted OPEN; backgrounds proven by compiled-CSS grep + pixel sample (Tailwind v4:
bracket-var classes are silently dead — use theme utilities or paren syntax); F7 reproduces
the fallback latch BEFORE fixing; one full green suite; evidence in docs/qa/m7/batch2/
(force-add, dir is gitignored), md5-unique from :4173. No new dependencies, no gate
threshold edits, no attribution trailers, NEVER push. STOP COMPLETELY at ⛔ STOP M7-B and
wait for Sid. Address the user as Sid.
```
