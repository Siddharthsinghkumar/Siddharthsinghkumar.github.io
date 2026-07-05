# T12 — FINISH LINE: close every open item; the project ends here

> **This plan ends the portfolio project.** Nothing gets added after it; STOPs
> are accept/reject only. Authored by Claude (planner) 2026-07-05 from a
> line-by-line audit of the repo against T10-ENGINE.md F1–F24 — every anchor
> below was verified against the working tree on that date, but **line numbers
> go stale: re-grep every anchor before editing.**
>
> **Executors & model switching (Sid runs the sessions):**
> - **Batch A (mechanical) + Batch C (launch prep): DeepSeek v4 Pro 1M, effort MAX** — broad, exact, many small edits.
> - **Batch B (visual/deep): GLM 5.2 1M, effort MAX** — perception, shaders, motion.
> - Explicit `⛔ SWITCH MODEL` markers sit between batches. An executor must
>   STOP at those markers, commit, and tell Sid to start the next batch in a
>   fresh session with the other model. Do not continue past a switch marker.
>
> **Cold-start reading list (every session, in order, absolute paths):**
> 1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` (donor rule, commit rules, address the user as **Sid**)
> 2. `/home/sidd/project/freelance/portfolio-website/DESIGN.md` (tokens, decision log §6)
> 3. This file — your batch's section **and** §1–§5 (rules) in full.
> 4. Batch B only: `/home/sidd/project/freelance/portfolio-website/T10-ENGINE.md` §F17 (don't-want list) + §F19/§F20.
>
> App: `/home/sidd/project/freelance/portfolio-website/site/` — all `npm` commands run THERE, never repo root.

---

## §0. Mission & definition of DONE

The site is built and the home 3D engine is approved. What remains: 13 verified
spec violations, a loading screen that doesn't track real assets, subpages Sid
calls "lifeless — black background with white text", a missing poster, and
stale docs. **DONE means all of the following, no exceptions:**

1. Every task in Batches A, B, C committed with green gates.
2. Sid has said **yes** at every STOP (loader has third-strike rule — an
   explicit yes on the recording or it does not ship).
3. Full gate suite green:
   `cd /home/sidd/project/freelance/portfolio-website/site && npm run build && npm run guards && npx playwright test && node scripts/lighthouse-gate.mjs && node scripts/visual-gate.mjs`
4. The F22 completeness table (§3.4) shows every page: sections ✓, atmosphere ✓,
   choreography ✓, visual-gate % ≥ threshold, gates ✓ — presented at the final
   STOP and signed off by Sid.
5. `docs/qa/qa-report.md` and `docs/LAUNCH-CHECKLIST.md` updated to the real
   6-page state; CONTEXT.md page inventory corrected.
6. Everything committed. **Never pushed** — launch day is Sid's.

What DONE is **not**: Sid's manual launch items (resume PDF six-weeks fix, his
4 screenshots, LinkedIn checks, the push itself) stay on LAUNCH-CHECKLIST.md as
his. T11 (authored .glb centerpiece) stays future — out of scope, do not touch.

---

## §1. THE WANT LIST (Sid's words, frozen 2026-07-05)

- W1. Loading screen on **home only**, GooeyLoader skin kept (orange `--accent`
  goo + dim-orange `--accent-dim` goo on `--line` baseline over `#0B0B0D` —
  already brand-correct), counter tied to **REAL total asset progress**
  (fonts + engine chunk + first frame + poster), not elapsed time.
- W2. Subpages must be **alive**: visible backgrounds, motion without pointer
  input, choreography, hover feedback. Sid's verdict on current state: "no
  background, no images, just black with white text — lifeless." Structure is
  done; **perceptibility and motion are the work.**
- W3. Every one of the 13 verified violations closed (tasks below).
- W4. Reduced-motion/no-WebGL users see a real poster, not black.
- W5. Docs made truthful (CONTEXT.md 6 pages, LAUNCH-CHECKLIST current).
- W6. Launch-prep artifacts DeepSeek CAN do: Pages-repo README, static-export
  dry run, cron verified.
- W7. RGB micro-glitch: **decision gate** — Sid is reviewing
  `docs/qa/glitch-demo.html`. His verdict is recorded in §7 task B4 before
  Batch B starts. No verdict = B4 skipped and logged as rejected.

## §2. THE DON'T-WANT LIST — N1–N16 inherited (T10-ENGINE.md §F17, read it), plus:

| # | Sid does NOT want | Origin |
|---|---|---|
| N17 | Any change to the approved home 3D scene composition (waypoints, scene objects, framing) beyond tasks listed here | Scene approved at STOP 2 |
| N18 | New npm dependencies beyond those a task explicitly names | Budget + audit surface |
| N19 | Work claimed done without file evidence. T10.7's commit claimed a poster; **no poster file exists in the repo.** Every STOP message must include `ls`/`grep` proof lines for files it claims created | DeepSeek false self-report, caught twice |
| N20 | Spec numbers treated as targets. They are FLOORS. Shipping a spec-compliant value that is invisible on screen = failed task (N1, hardened). The acceptance test is the screenshot/recording and the visual-gate %, never the number | T9 + PaperInk at "amped" values still invisible |
| N21 | Scope additions at STOPs. Accept or reject only — rejected work is redone, nothing new is invented | Sid's freeze |

## §3. Gates, verification, and proof

**3.1 After EVERY task** (from `/home/sidd/project/freelance/portfolio-website/site/`):
`npm run build && npm run guards && npx playwright test` — then commit (one
task = one commit, subject `fix(t12): <task-id> <summary>` or `feat(t12): ...`,
**no attribution trailers, never push**). Visual tasks additionally:
`node scripts/lighthouse-gate.mjs && node scripts/visual-gate.mjs`.

**3.2 Budgets (guards.mjs, verified):** home ≤480 KB gz initial (assert total
≤620 only when the /about lanyard chunk is counted), case pages ≤230 KB gz.
Lighthouse: home perf ≥85, case ≥90, a11y ≥95, seo ≥95. CLS ≤0.05. LCP ≤2.0s.

**3.3 Proof rules:** visual work = screenshots (`docs/qa/t12/`) + screen
recordings for motion (mandatory for loader, case-page choreography, /about
entrance). "Gates green" alone is never proof of visual quality (N16). Every
claimed file: paste `ls -la <absolute path>` output in the STOP message (N19).

**3.4 F22 completeness table — paste at EVERY STOP:**

```
| page | sections present | atmosphere layer | choreography | visual-gate % (scene/orange) | gates |
|------|------------------|------------------|--------------|------------------------------|-------|
| /    | ...              | 3D engine        | ...          | e.g. 41% / 3.2%              | ✓/✗   |
| /prospect | ... | PaperInk amped | ... | ... | ... |
| /travel-planner | ... | PaperInk amped | ... | ... | ... |
| /projects | ... | GridBackdrop tiles | ... | ... | ... |
| /about | ... | void + lanyard | ... | ... | ... |
| /404 | ... | decrypt + grain | ... | ... | ... |
```

**3.5 STOP protocol (F23):** after every task that changes anything visible,
ask Sid to look (dev URL `http://localhost:3000` via `npm run dev` from
`site/`, plus screenshots; recording for motion) and WAIT. State in one line
what changed since the last look. Batching allowed only for tasks touching
neither hero, loader, nor any page's atmosphere. Gates must be green with the
test summary line pasted BEFORE presenting (N10).

## §4. Context management (executor rules)

- Every task below is self-contained: files (absolute), exact change, done
  criteria, verify command. Execute strictly in order within your batch.
- **Re-grep every anchor** (`grep -n "<pattern>" <file>`) before editing —
  never trust a line number from this document.
- Do not read or modify anything outside the files a task names, plus
  `DESIGN.md` §6 for decision rows. Do not refactor adjacent code.
- If your context degrades or you lose the thread: re-read §1–§5 and your
  current task ONLY. Do not re-read the whole repo.
- If a gate fails and the fix isn't obvious within one attempt: STOP, report
  the exact failing output to Sid. Never "fix forward" through a red gate.
- If anything in this plan contradicts the tree you find: STOP and report —
  do not improvise (the plan may be stale, or a prior task claimed-not-landed).

## §5. Decision-log rows (append to DESIGN.md §6 in the same commit as the task that triggers them)

```
| D42 | 2026-07-05 | T12 finish plan: 13 audit violations + loader real-progress + subpage perceptibility redesign; scope frozen, STOPs accept/reject only | Sid: "finish properly, no rush job, nothing added after." |
| D43 | 2026-07-05 | Loader counter = real milestone progress (fonts/chunk/first-frame/poster), monotonic; elapsed-time easing retired | Sid: counter must reflect actual asset loading (N8). |
| D44 | 2026-07-05 | RGB micro-glitch: <ACCEPTED at spec | ACCEPTED amped | REJECTED permanently> after live demo (docs/qa/glitch-demo.html) | Sid's verdict from the prototype-first gate. |
| D45 | 2026-07-05 | Poster re-cut as hard artifact w/ file-existence guard; T10.7's claimed poster never existed in-tree | N19: claimed work must show files. |
| D46 | 2026-07-05 | Case-page atmosphere = visibility redesign (autonomous ink motion, no-pointer perceptibility gate), not parameter bump | PaperInk at T10.6 "amped" values measured imperceptible (±4 RGB pts on #0B0B0D). |
```

---

# BATCH A — mechanical closures — **DeepSeek v4 Pro 1M, MAX**

> Small, exact edits. No refactors. Gates + commit after each task.

**A1 — Sitemap completes.**
File: `/home/sidd/project/freelance/portfolio-website/site/public/sitemap.xml`
(currently lists only `/`, `/prospect/`, `/travel-planner/`). Add `<url>`
entries for `https://Siddharthsinghkumar.github.io/projects/` and
`.../about/`, matching the existing entries' structure exactly (trailing
slashes kept — GH-Pages trailingSlash rule).
**Done:** `grep -c "<loc>" sitemap.xml` → 5. Verify guards green.

**A2 — OG images for /projects and /about.**
Files: `/home/sidd/project/freelance/portfolio-website/site/scripts/generate-og.mjs`
(re-grep its page array — it currently generates home/prospect/travel-planner
only) + `src/app/projects/page.tsx` + `src/app/about/page.tsx` metadata
exports. Add both pages to the generator (PNG like the others — the SVG-only
og:image bug was already fixed once, do not regress), wire
`openGraph.images` metadata per COPY.md title/description conventions.
**Done:** after `npm run build`, `ls site/public/og/` shows `projects.png` and
`about.png`; `grep -l "og/projects.png" site/out/projects/index.html` hits.

**A3 — GridBackdrop reads the manifest.**
Files: `/home/sidd/project/freelance/portfolio-website/site/src/components/GridBackdrop.tsx`
(hardcoded `const tiles: ReactNode[]` array, no manifest import) +
`src/data/tiles-manifest.json` (currently `{"tiles": []}` — `public/tiles/`
is empty; Sid adds screenshots post-launch).
Change: import the manifest; if `tiles.length > 0`, render those images
(blur(8px), brand tint overlay, opacity **0.30–0.35** per F7) filling slots
first, generated tiles filling the rest; if empty, current generated tiles
remain BUT at the F7-visible opacity treatment (see B3d for the visibility
pass — here just wire the data path).
**Done:** drop any test image into `site/public/tiles/`, run
`node scripts/scan-tiles.mjs && npm run build` → tile appears on /projects;
remove test image, rescan, build green again. Show both states in screenshots.

**A4 — Hero name links to /about.**
File: `/home/sidd/project/freelance/portfolio-website/site/src/app/page.tsx`
(re-grep `TEXTPRESSURE_ENABLED` — two render branches around lines 58–66).
Wrap BOTH branches (TextPressure div and the fallback `<p aria-label>`) in a
Next `<Link href="/about" aria-label="About Siddharth Singh">`, preserving
exact typography/layout (display block, no underline, no color shift; add a
subtle focus-visible outline for a11y). Nav wordmark already links /about —
match its pattern.
**Done:** Playwright: clicking the giant name navigates to /about; axe green;
no CLS change (lighthouse-gate).

**A5 — CSS fallback grain to spec.**
File: `/home/sidd/project/freelance/portfolio-website/site/src/components/CssHeroAtmosphere.tsx`
(re-grep `opacity: 0.05`). Set to `0.10` per T10 §0.
**Done:** value changed, build green, home screenshot attached (this layer
shows under the canvas and for no-JS — confirm it doesn't fight the 3D scene).

**A6 — Canvas mounts via requestIdleCallback.**
File: `/home/sidd/project/freelance/portfolio-website/site/src/components/engine/EngineLoader.tsx`
(30-line file; currently mounts EngineCanvas as soon as matchMedia state set).
Change: after profile detection, gate the `<EngineCanvas>` mount behind
`requestIdleCallback(cb, { timeout: 1500 })` (fallback `setTimeout(cb, 200)`
where rIC is undefined — Safari). The IntroScreen overlay (home) already
covers the visual gap; verify loader still dismisses via engineReady.
**Done:** canvas still appears ≤1.6s on a normal load (recording), LCP ≤2.0s
observed, visual-gate all frames still pass.

**A7 — Explicit rAF pause on tab-hidden.**
File: `/home/sidd/project/freelance/portfolio-website/site/src/components/engine/EngineCanvas.tsx`.
Add a `visibilitychange` listener that sets R3F `frameloop` `"always"` ↔
`"never"` (via `useThree`/setFrameloop or a state prop on `<Canvas>`).
Browsers already throttle rAF when hidden — this makes the spec explicit and
guarantees zero work when hidden. Pattern reference:
`src/components/PaperInkCanvas.tsx` (has the same listener, ~line 188).
**Done:** with DevTools → switch tab → no rAF ticks (verify via a temporary
counter or Performance trace, remove any temp code); gates green.

**A8 — Lanyard hardening: error boundary + static fallback + mobile timestep.**
Files: `/home/sidd/project/freelance/portfolio-website/site/src/components/LanyardLoader.tsx`
+ `src/components/Lanyard.tsx` (neither has ErrorBoundary/timestep — verified).
(1) Class-component error boundary around the 3D card; on error OR
reduced-motion OR WebGL-unavailable render the static fallback: a styled card
`<div>` using the same front-face design tokens (monogram, orange band, mono
name — NOT a screenshot placeholder). (2) On `pointer: coarse`, set rapier
`<Physics timeStep={1/30}>`, drag stays enabled (F3 rule).
**Done:** force a throw inside the canvas in dev → fallback card renders,
no white screen; Playwright mobile project green; /about visual-gate ≥10%.

**A9 — Docs truthfulness.**
Files: `/home/sidd/project/freelance/portfolio-website/CONTEXT.md`
(§2 "4 pages" claim — re-grep `4 pages` / page list),
`/home/sidd/project/freelance/portfolio-website/docs/LAUNCH-CHECKLIST.md`
(says "all 4 pages", lists Lanyard as post-launch — it shipped on /about).
Update: CONTEXT page inventory → 6 pages (`/`, `/prospect`, `/travel-planner`,
`/projects`, `/about`, `/404`) with a dated amendment note referencing D36/D37
(do NOT rewrite history elsewhere in the file); LAUNCH-CHECKLIST → current
reality: 6 pages in the verify list, Lanyard done, add "drop tile screenshots
into site/public/tiles/ (auto-picked next build)" and "supply photo for card
face (replaces monogram)" as Sid asset items, keep resume-PDF six-weeks fix +
4 screenshots + push steps.
**Done:** `grep -in "4 pages" CONTEXT.md docs/LAUNCH-CHECKLIST.md` → no hits.

**A10 — visual-gate: h1 text-region contrast check (F8a).**
File: `/home/sidd/project/freelance/portfolio-website/site/scripts/visual-gate.mjs`
(no contrast logic today — verified). At each checked URL's p=0 frame: locate
the h1 via Playwright `boundingBox()`, sample the screenshot pixels in that
box, compute contrast between text pixels (near-white cluster) and background
pixels (the rest) per WCAG relative-luminance; fail < 4.5:1. Print the ratio
per page. Also ensure the URL list covers ALL SIX pages (F19/D41) with the
≥10% scene / ≥1.5% orange thresholds — extend if any page is missing.
**Done:** gate prints 6 pages × (scene%, orange%, h1 contrast); all green on
current build OR failures listed for Batch B to fix (expected: subpages may
fail scene% — that is Batch B's job; record the numbers in the commit body).

**⛔ STOP-A — present to Sid:** one batched presentation (allowed: nothing
here touched atmosphere except A5's fallback layer): screenshots of home
(hero name link focus state, grain layer), /projects with test tile in/out,
/about fallback card, the visual-gate 6-page number table, F22 table, pasted
green-gates summary. **WAIT for Sid's yes.**

**⛔ SWITCH MODEL → Sid starts a fresh session with GLM 5.2 1M at MAX for Batch B.**

---

# BATCH B — visual finish — **GLM 5.2 1M, MAX**

> This batch is judged by eyes, not numbers (N20). Every task here ends with
> a screenshot or recording in `docs/qa/t12/` and a STOP where noted. Re-read
> T10-ENGINE.md §F17 (N1–N16) before starting.

**B1 — Poster (hard artifact this time — D45).**
New script `/home/sidd/project/freelance/portfolio-website/site/scripts/make-poster.mjs`:
Playwright chromium 1600×900 loads the served build (`node scripts/serve-out.mjs`
pattern — see visual-gate.mjs for the serve+screenshot plumbing to copy), waits
for the canvas + 2s of settle at scroll 0, injects CSS hiding DOM text layers
(`main { opacity: 0 }` — keep canvas + atmosphere), screenshots, converts to
webp quality ~70 (use `sharp` — devDependency, allowed by N18 exception listed
here) at `site/public/poster-home.webp`, target ≤120 KB. Add an existence
check to `scripts/guards.mjs` (fail if `public/poster-home.webp` missing —
this is the D45 guard). Wire consumption:
`src/components/engine/EngineLoader.tsx` — reduced-motion (and WebGL-fail /
rIC-never-fires) renders `<div className="fixed inset-0 z-0" style={{backgroundImage: url(poster), backgroundSize: "cover"}} aria-hidden>`
instead of `null` (keep CssHeroAtmosphere beneath as today).
**Done:** file exists (paste `ls -la`), guards has the check and is green,
emulate `prefers-reduced-motion: reduce` in Playwright → screenshot shows the
scene poster, not black. Screenshot to `docs/qa/t12/poster-reduced-motion.png`.

**B2 — Loading screen: real asset progress (W1/D43).**
Files: `/home/sidd/project/freelance/portfolio-website/site/src/components/IntroScreen.tsx`
(counter currently eases on ELAPSED TIME toward 99 — re-grep `ease-out cubic`),
`src/components/engine/engine-ready.ts` (extend), `src/components/engine/EngineLoader.tsx`.
Replace time-easing with **milestones**, each flipping a real event:
- 15 → `document.fonts.ready` resolved
- 45 → engine chunk loaded (resolve a new promise in engine-ready.ts when the
  `dynamic(() => import("./EngineCanvas"))` module actually resolves — signal
  from EngineLoader)
- 85 → first rendered frame (`signalEngineReady`, exists)
- 100 → poster-home.webp decoded (`new Image()` + decode) — also warms the
  reduced-motion path cache (F5e spirit: counter time does real work)
Counter animates smoothly UP to the latest reached milestone value and never
beyond it; monotonic; jumps to 100 on engineReady-all or the 2.5s failsafe.
Keep everything else: GooeyLoader skin (colors already brand: `--accent` /
`--accent-dim` / `--line` — do not change), skips (reduced-motion, repeat
visit via sessionStorage), CSS auto-dismiss failsafe, LCP rule (name paints
early; LCP ≤2.0s observed).
**Done:** recording of a cold load (DevTools "Disable cache" + Fast 3G) saved
to `docs/qa/t12/loader-cold.webm` showing the counter stepping with real
loads, plus a normal-speed load recording. Gates + lighthouse green.
**⛔ STOP-B2 — loader recording to Sid. THIRD-STRIKE RULE: without his
explicit yes the loader does not ship. WAIT.**

**B3 — Subpages come alive (W2/D46 — the centerpiece).**
Sid's verdict: "no background, no motion, just black with white text — worse
than 2000s sites." The wired atmosphere exists but is imperceptible. This is
a **visibility redesign**. Acceptance is: `node scripts/visual-gate.mjs`
passes on every page **with no pointer input**, AND per-page recordings show
obvious idle motion, AND Sid approves at the STOPs. Do not present a page
whose screenshot could be mistaken for plain black-with-text (N5/N20).

- **B3a `/prospect` + `/travel-planner`** — files:
  `src/components/paper-ink-shader.ts` (grain `*0.16 - 0.08` @ line ~69, ink
  clamp 0.35 @ ~86 — these ARE the T10.6 values and they are invisible; treat
  as floors and raise until the gate + eye agree),
  `src/components/PaperInkCanvas.tsx`, both page files under
  `src/app/prospect/` and `src/app/travel-planner/`.
  Required, all of them:
  1. **Autonomous ink life**: 2–3 slow-drifting ink blobs rendered by the
     shader WITHOUT pointer input (the current orange blob only follows the
     mouse — touch/idle users see nothing). Visible drift period ~15–25s.
  2. Grain visibly textured on a real display (raise amplitude and/or scale;
     judge on screenshots at 100% zoom, not values).
  3. Scroll choreography: sections reveal via the existing
     `ChoreoReveal`/`ScrollReveal` components; the pipeline strip lights
     stage-by-stage on scroll; particles on it move.
  4. Hover states on every component-board row (border/tint/translate — must
     be obvious, not 2% opacity).
  5. The 4 screenshot placeholders (`Sid to capture` frames) redesigned as
     DESIGNED artifacts: framed panel, mono caption, faint grid/scanline
     texture, orange corner ticks — they must look intentional until Sid's
     screenshots replace them.
  6. Stat strips exist (verified: `11 STAGES` prospect:90, `K3S MULTI-NODE`
     travel-planner:49) — keep, just ensure they sit in the choreography.
  Budgets hold: case pages ≤230 KB gz, perf ≥90 (raw-WebGL shader is cheap;
  keep it that way — no three.js on case pages, N18).
  **⛔ STOP-B3a — both case pages: recordings (idle 10s showing autonomous
  motion + a full scroll-through) + screenshots + F22 table. WAIT.**

- **B3b `/projects`** — files: `src/components/GridBackdrop.tsx`,
  `src/app/projects/page.tsx`. GridBackdrop tiles to F7-visible treatment
  (0.30–0.35 effective opacity, gap glow), slow autonomous drift/parallax on
  the tile field (GridMotion donor concept — CSS transforms, no gsap, N7),
  obvious card hover (lift + border + orange tint), live GitHub stats row
  verified rendering (or its build-time fallback). No >40vh dead gaps (N4).

- **B3c `/about`** — files: `src/app/about/page.tsx` (CSS void layer exists
  in-file). Make the void breathe: dust motes drifting (CSS animations,
  10–20 elements, GPU-cheap), the orange glow slowly pulsing (~8s), Lanyard
  card gets an entrance (drops/settles on load — rapier gravity already does
  this if the card spawns above rest position; verify it's perceptible).
  A8's fallback card must ALSO sit on the animated void.

- **B3d `/404`** — verify decrypt effect + grain are actually visible; if the
  grain is another invisible layer, raise it to match the B3a treatment.
  **⛔ STOP-B3bcd — /projects, /about, /404: recordings + screenshots + F22
  table + visual-gate 6-page numbers. WAIT.**

**B4 — RGB micro-glitch — DECISION GATE (D44).**
Sid's verdict from `docs/qa/glitch-demo.html`: **<PENDING — Sid fills this
line before Batch B starts: REJECTED / SPEC / AMPED>**.
- REJECTED (or line still pending): skip, log D44 as rejected, done.
- SPEC or AMPED: implement exactly the chosen variant from the demo file
  (its keyframes are the reference implementation) on section eyebrows, fired
  once per camera-waypoint arrival on home + once per section-entry on case
  pages; orange/grey only (N13); slow-mo + real-speed recording at the next
  STOP; Sid may still kill it there — removal in the same session if so.

**B5 — Full sweep + QA report.**
Run the complete suite (§0.3). Update the QA report at
`/home/sidd/project/freelance/portfolio-website/docs/qa/qa-report.md`:
new Lighthouse/LCP/CLS/JS-size numbers per page, visual-gate percentages per
page, screenshot + recording index for `docs/qa/t12/`.
**Done:** report updated, everything committed.

**⛔ SWITCH MODEL → Sid starts a fresh session with DeepSeek v4 Pro 1M at MAX for Batch C.**

---

# BATCH C — launch-prep artifacts — **DeepSeek v4 Pro 1M, MAX**

**C1 — Pages-repo README.** Write
`/home/sidd/project/freelance/portfolio-website/site/README.md` (it deploys
with the repo Sid pushes): what the site is, stack line, how the nightly
rebuild works (cron `30 22 * * *` UTC — verified present in
`site/.github/workflows/deploy.yml`), how to update the resume PDF, how tile
screenshots auto-appear (drop into `public/tiles/`), gate suite one-liner.
Short, factual, no marketing.

**C2 — Static-export dry run (GH-Pages simulation).**
From `site/`: `npm run build`, serve `out/` with `node scripts/serve-out.mjs`,
then verify and PASTE results: all 6 pages 200 with trailing slashes; direct
deep-load of `/prospect/` and `/about/` (not client-nav) renders; resume PDF
200; `poster-home.webp` 200; og PNGs 200; guards' link-integrity green against
the final build; no console errors on any page (Playwright smoke already
asserts this — run it against the served build).

**C3 — Final F22 + handoff note.** Paste the final completeness table, the
full green gate output, and a 10-line handoff in
`/home/sidd/project/freelance/portfolio-website/docs/LAUNCH-CHECKLIST.md`
under a "T12 exit state" heading: what shipped, the only remaining human
steps (resume PDF, 4 screenshots, tiles, photo, push), where every artifact
lives. **⛔ STOP-FINAL — Sid signs off. Project closed.**

---

## Kickoff prompts (Sid: paste verbatim)

**Batch A + (later) C — DeepSeek v4 Pro 1M, effort MAX:**
```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then DESIGN.md,
then T12-FINISH.md §0–§5 and Batch A (or Batch C when Sid says so). Execute
your batch's tasks strictly in order at maximum effort. Rules that override
everything: re-grep every anchor before editing; gates green + commit after
every task; no attribution trailers; never push; numbers are floors, the
screenshot is the acceptance test; every claimed file needs pasted ls proof;
stop at every ⛔ marker and wait for Sid; do not continue past a SWITCH MODEL
marker; if the tree contradicts the plan, stop and report. Address the user
as Sid.
```

**Batch B — GLM 5.2 1M, effort MAX:**
```
Read /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then DESIGN.md,
then T10-ENGINE.md §F17 (the don't-want list N1–N16), then T12-FINISH.md
§0–§5 and Batch B. Confirm Batch A is committed (git log) before starting.
Your batch is visual: the acceptance test is never a number — it is the
screenshot, the recording, and Sid's explicit yes at each ⛔ STOP. A page
whose screenshot could be mistaken for black-with-white-text is failed work
(N5/N20). Check task B4's verdict line before implementing anything for it.
Gates green + commit after every task; recordings to docs/qa/t12/; no new
deps except sharp (B1); never touch the approved home 3D scene beyond listed
tasks; never push. Address the user as Sid.
```
