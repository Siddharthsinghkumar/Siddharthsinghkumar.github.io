# M3 Plan — Verification Fixes + Launch Execution (2026-07-11)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m3plan.md`
> Successor to [`m2plan.md`](m2plan.md) (Batch 1 executed by DeepSeek 2026-07-11, independently
> verified by Claude same day — see m2plan §9 status ledger for the verdict table; m2plan Batch 2
> is superseded by this plan's Batch 2).
> Executors: **DeepSeek v4 Pro 1M @ HIGH** (Batch 1 — trivial mechanical batch) and
> **Sid+Claude ONLY** (Batch 2 — the push). Sid switches models at every **⛔** marker himself.
> An executor must NEVER continue past one.
> **STATUS: FROZEN — verdicts M3.1–M3.4 taken by Sid 2026-07-11. Scope freeze in effect.**

---

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you
   know." Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
   (Batch 1 touches no Next API — this is a tripwire, not homework.)
3. **This plan, top to bottom.** m0plan §3 (N1–N13), m1plan §2 (N14–N16), m2plan §2 (N17–N18)
   remain law verbatim; §3 below adds N19.
4. Per-task: ONLY files named in the task block. Reference/research files stay unread.

## 1. Mission & definition of DONE

**Close the verification findings, get Sid's knowme verdict, then put the site live.**

DONE means ALL of:
1. D49 pointer restored in the gate memo (M3.2) and the rapier warning filtered (M3.3) — suite green.
2. Sid explicitly accepted the /knowme fallback→card swap at ⛔ STOP M3-A (it is NOT yet accepted —
   he accepted only the README at STOP M2).
3. Site live at `https://siddharthsinghkumar.github.io`; first Actions run green end-to-end.
4. D6–D8 post-deploy checks pasted; docs carry the dated exit sentence
   **"Live and verified. Lint zero. Playwright 36/36."**
5. Sid said yes at every ⛔ STOP.

DONE is NOT: D2 screenshots / D3 tiles (Batch P — blocked on Sid's drop, lands post-launch via the
D70 flow), the @react-three/rapier upgrade (v2 parking lot), GridMotion, merlin-cli-bridge,
authored .glb.

## 2. WANT list (Sid's words, frozen 2026-07-11)

- "Memorable enough to revisit, not fast or professional — it needs to define me" (D60, still the doctrine).
- STOP M2 verdict: "Accept README, re-judge knowme" — the swap-in feel gets his eyes before launch.
- "Restore the pointer" (D49 memo, N7 written approval), "ConsoleFix filter line" for the rapier warn.
- "DeepSeek fixes, launch after" — fix batch first, then the push runbook with Claude.

## 3. DON'T-WANT list — N1–N18 all binding, plus:

| # | Rule |
|---|---|
| N19 | **An evidence path that doesn't exist is a false report.** Every claimed proof states a real path (`ls` pasted) or says "no evidence produced". Claiming `docs/qa/…` dirs that were never created (it happened at STOP M2) = the whole report is suspect. |

## 4. FROZEN VERDICTS (Sid, 2026-07-11)

| # | Verdict |
|---|---|
| M3.1 | **README accepted. Knowme swap-in NOT yet accepted** — re-judged by Sid at ⛔ STOP M3-A on a served prod build. Reject ⇒ taste fix gets planned with Claude, never improvised by an executor. |
| M3.2 | **Restore the D49 pointer** in `lighthouse-gate.mjs`'s memo — comment-only, this verdict is the written N7 approval. → T1, D72 |
| M3.3 | **Add the rapier deprecation warning to ConsoleFix's known-noise filter** (prod-real, library-internal, cosmetic). Lib upgrade stays parked for v2. → T2, D73 |
| M3.4 | **DeepSeek runs Batch 1; launch after** — Batch 2 is Sid+Claude only. |

Triage record (no task, documented as D74): the `THREE.WebGLRenderer: Context Lost` logs Sid saw
are **benign** — prod-probed 2026-07-11 with route attribution: each fires as R3F tears down the
*previous* page's renderer on client-side nav; the live page's canvas always survives; visual gate
green. Not a leak, not a launch blocker.

## 5. Execution order

```
BATCH 1 (DeepSeek v4 Pro 1M @ HIGH): T1 → T2 → T3 → T4 (cert + D-rows)
   → ⛔ STOP M3-A (Sid re-judges /knowme on served prod build; accept/reject)
   → ⛔ SWITCH MODEL — executor done permanently; nothing below is executor work
BATCH 2 (Sid+Claude ONLY): T5 (quiet-machine lighthouse) → T6 (snapshot + privacy verify)
   → T7 (Sid pushes + Pages settings + first Actions run) → T8 (D6–D8) → T9 (docs close)
BATCH P (BLOCKED until Sid's D2/D3 drop, post-launch): P1 (assets) → P2 (D70 release flow)
```

Strictly T-order. One task = one commit. Build green before every commit. No attribution trailers.
**NEVER push — only Sid, only at T7, only from the snapshot directory.**

---

## BATCH 1 — Verification fixes (DeepSeek v4 Pro 1M @ HIGH, ~30 min)

### T1 — Restore the D49 pointer (M3.2 — Sid's written N7 approval; comment-only)
- **File:** `site/scripts/lighthouse-gate.mjs`. Current memo (lines 12–14, re-grep before editing):
  ```
  // Memo: home perf gate 55 (was 85), case perf gate 72 (was 75 then 90).
  // Sid 2026-07-11 (D71): case floor 72 — CI runner-variance insurance on a
  // 1-pt margin; D68 pre-authorized ≥70. Home 55 unchanged.
  ```
- **Do:** insert EXACTLY one comment line after that block, before `const HOME_PERF`:
  ```
  // D49 (2026-07-05, Sid): "performance is not the issue — it's a portfolio, people can wait. The problem is it can't be forgettable." DESIGN.md §6.
  ```
  Touch NOTHING else in this or any gate script (N7 — this exact line is the entire approval).
- **Done:** `git diff` shows exactly +1 comment line; `node scripts/lighthouse-gate.mjs` still
  prints `(min 72)` for case pages. Commit: `docs(gates): restore D49 pointer per D72`

### T2 — ConsoleFix: filter the rapier init deprecation (M3.3)
- **File:** `site/src/components/ConsoleFix.tsx` — three known-noise filters exist at lines 10–12
  (`THREE.Clock`, `u_worldWidth`, `u_worldHeight`; re-grep). Add alongside them:
  ```ts
  if (args[0].includes("using deprecated parameters for the initialization function")) return;
  ```
  (Message is a `console.warn` from @react-three/rapier 2.2.0's WASM init — prod-verified
  2026-07-11; library-internal, not our code.)
- **Done:** build green; served prod `/knowme/` shows no rapier deprecation warn in console
  (paste the check method used). Commit: `chore(console): filter rapier init deprecation per D73`

### T3 — Housekeeping commits
- Commit `.commandcode/taste/taste.md` (verified 1-line confidence bump, 0.75→0.78) and the
  regenerated `docs/qa/t10/*.png` gate screenshots (churn from verification re-runs — they are the
  current proof set). If your own rules forbid touching `.commandcode/`, commit only the PNGs and
  say so in the STOP report — do not silently skip.
- **Do NOT touch** `192.168.0.20.har` at repo root — it is Sid's own capture; leave it untracked.
- **Done:** `git status` clean except the `.har`. Commit: `chore: taste note + refreshed gate screenshots`

### T4 — D-rows + certification 1×
- Append to `DESIGN.md` §6 (4-column, after D71; re-grep last row first):
  - `| D72 | 2026-07-11 | M3.2: D49 doctrine pointer restored to lighthouse-gate memo (comment-only N7 edit) | Executor's D71 edit erased the quoted rationale; provenance chain in-file matters; Sid's written approval 2026-07-11 |`
  - `| D73 | 2026-07-11 | M3.3: rapier WASM init deprecation added to ConsoleFix known-noise filter | Prod-real but library-internal (@react-three/rapier 2.2.0) and cosmetic; upgrade parked to v2 |`
  - `| D74 | 2026-07-11 | Context Lost logs on route change triaged BENIGN — R3F disposing the previous page's renderer | Prod probe with route attribution 2026-07-11: live canvas always survives; disposal working as designed |`
- Full suite 1×: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate.
  **Environment note:** if home lighthouse lands <55 while Sid's browser is open, report the number
  with the environment observation — do NOT retry-loop, do NOT touch thresholds (N18); Batch 2's T5
  settles home on a quiet machine.
- **Done:** suite summary pasted (playwright must be 36/36); `docs/qa/qa-report.md` gains a
  3-line "M3 fixes" note from observed output. Commit: `docs(qa): M3 fix batch certification`

## ⛔ STOP M3-A — Sid re-judges /knowme (do not pass without explicit yes)

Present, per N19 with real paths or "none produced":

| Item | Status | Proof |
|---|---|---|
| T1 D49 pointer | | git diff line |
| T2 rapier filter | | console check method |
| T3 housekeeping | | git status output |
| T4 cert 1× | | suite summary (playwright 36/36) |
| /knowme re-judge | SID'S CALL | see below |

**Sid's re-judge ritual:** `cd site && npm run build && node scripts/serve-out.mjs` →
`http://localhost:4173/knowme/` — hard-load (fallback photo should appear immediately, 3D card
swaps in after mount), then nav to `/` and back (second mount), then drag the card.
**Accept** ⇒ Sid switches to Batch 2 with Claude. **Reject** ⇒ full stop; the taste fix is planned
with Claude (cheapest-demo-first), never improvised here.

## ⛔ SWITCH MODEL — executor work ends here permanently.

---

## BATCH 2 — Launch runbook (Sid+Claude ONLY)

### T5 — Quiet-machine lighthouse (precondition for the snapshot)
- Sid closes Chromium/dev servers for ~10 min. `node scripts/lighthouse-gate.mjs` once: home ≥55,
  cases ≥72. (Context: home is environment-sensitive — 61 quiet vs 46–52 with the browser open,
  on a tree whose home code was byte-identical.) Red on a quiet machine = real; STOP and diagnose
  with Claude before any snapshot.

### T6 — Public snapshot + privacy verification (m2plan T8 verbatim)
- `git archive HEAD site/ .github/ README.md | tar -x -C <fresh temp dir>` → `git init` →
  single commit `Initial release` (no trailers).
- Claude pastes every line: top level exactly `site/ .github/ README.md`; m2plan §6 privacy grep →
  zero hits; no `site/public/test`; resume PDF opens; `git log --oneline` → exactly 1 commit.
- Any failure = fix in the private repo, re-archive. Never hand-edit the snapshot.

### T7 — Sid pushes + Pages settings (m2plan T9 verbatim)
- From the **snapshot directory only**:
  `git push https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git HEAD:main`
- Settings → Pages: source = **GitHub Actions**; **Enforce HTTPS**.
- Watch the first Actions run — the full gate suite on a GitHub runner for the first time.
  Red → rerun once; red twice → STOP, Sid decides (N18). No threshold edits.

### T8 — Post-deploy verification (D6–D8, m2plan T10 verbatim)
- 6 routes 200 on the live URL; resume downloads + opens; OG meta on home + knowme; D6 LinkedIn
  clicked by Sid's own browser; D7 profile website field + pinned repos per D65; D8 nightly cron
  (`30 22 * * *` UTC ≈ 04:00 IST) observed green next morning.

### T9 — Docs close + knowledge base
- `docs/qa/qa-report.md` + `docs/LAUNCH-CHECKLIST.md`: final dated exit state +
  **"Live and verified. Lint zero. Playwright 36/36."** Claude updates project memory the same day.

---

## BATCH P — Post-launch asset drop (BLOCKED until Sid's D2/D3 drop; m2plan Batch P verbatim)

P1: D2 screenshots → `site/public/screenshots/`, D3 tiles → `site/public/tiles/`, AVIF/WebP
pipeline, N16 lighthouse before case-page commits, taste STOP for Sid.
P2: D70 release flow — certify private tree → `git archive` sync onto a public-repo checkout →
m2plan §6 privacy grep (every public commit, forever) → normal commit → **Sid pushes**.

## 6. Gates, proof, context, commit protocol

m0plan §7/§8/§10/§11, m1plan N14–N16, m2plan §5–§6 apply verbatim. Evidence claims obey N19.
Statuses: verified / failed / not-run. Playwright floor: 36/36.

## 7. KICKOFF PROMPT — DeepSeek v4 Pro 1M @ HIGH (Batch 1 only)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13),
m1plan.md §2 (N14–N16), m2plan.md §2 (N17–N18), then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m3plan.md.
Execute Batch 1 (T1–T4) strictly in order. Non-negotiables: T1 is a single comment line in a gate
script under Sid's written approval (D72) — any other gate-script change is a violation; edit only
files named in the current task; re-grep every anchor before editing; every claimed proof states a
real path with pasted ls output or says "no evidence produced" (N19); build green before every
commit; one task = one commit; no attribution trailers; NEVER push. If a fix isn't clean in ONE
attempt, STOP and report. STOP COMPLETELY at ⛔ STOP M3-A, post the completeness table, and wait —
Batch 2 is not executor work under any circumstances. Address the user as Sid.
```

## 8. Confidence: 9.4/10 — frozen

Grounded: every anchor re-verified against the live tree today (memo lines quoted post-D71,
ConsoleFix filter lines read, taste.md diff inspected, context-lost triage prod-probed twice with
route attribution, playwright 36/36 re-run independently). Batch 1 is four trivial, fully-specified
tasks. Residual risks: (1) Sid may reject the knowme swap-in at STOP M3-A — by design, that's the
gate's job (taste loop returns to Claude, cost is schedule only); (2) home lighthouse on a quiet
machine could expose a real regression — unlikely (home code byte-identical to the 61-scoring
build) but T5 exists precisely to catch it; (3) first CI run on GitHub runners remains untested
territory until T7 (D71 floor + N18 rerun-once-then-STOP cover it).

**SCOPE FREEZE: 2026-07-11.** M3.1–M3.4 frozen. Executors may not add, merge, reorder, or
reinterpret tasks; STOPs are accept/reject only.

---

## 9. STATUS LEDGER (Claude, 2026-07-12 — check-verify on the STOP M3-A report)

**Batch 1 (T1–T4): executed by DeepSeek v4 Pro 1M @ HIGH 2026-07-11, all claims verified REAL:**

| claim | evidence checked | verdict |
|---|---|---|
| T1 `3eb722d` D49 pointer +1 line | diff = exactly the approved comment; no other gate-script change since `0c97e80` (N7 clean) | REAL |
| T2 `78b1e6d` rapier filter | diff = exactly the plan's line | REAL |
| T3 `b238100` 8 PNGs; taste.md skipped (disclosed); .har untouched | diff-stat 8 PNGs; deviation allowed by T3's fallback clause | REAL |
| T4 `4e87521` D72–D74 + qa-report note | rows verbatim; report honest per N19 (home 52 disclosed as environmental) | REAL |
| playwright 36/36 | independently re-run 2026-07-12 on a fresh build: 36 passed | REAL |
| marker discipline / plan integrity | stopped at ⛔ STOP M3-A; `docs/plans/` untouched | REAL |

Defect the report couldn't see: D72–D74 were inserted after the table-closing blank line —
they render outside the §6 table (fix = m4plan T1).

**⛔ STOP M3-A outcome: REJECTED by Sid 2026-07-11.** Two defects, diagnosed 2026-07-12:
1. **/knowme first-load** — Sid's screenshot (dev :3000) shows the lanyard canvas layer
   (z-[60], translateX(18%), opacity .8 — wash edge exactly at 18%) painting its white lighting
   Environment before the scene loads; self-heals on reload. NOT reproducible on the served prod
   build; prod instead shows an EMPTY card area for the whole card.glb (2.4 MB) download on slow
   networks because the fallback only covers pre-mount/no-WebGL. One fix covers both → m4plan T3.
2. **Layer structure** — L0 PageBackground on prospect/travel-planner/projects was commented out
   by D62 (perf floor, "can restore later"), then the imports (M1.3 `24e5143`) and the file
   (m2 T3 `497b338`) were deleted as dead code. Restore → m4plan T2, underlay variant = Sid's
   pick at ⛔ STOP M4-A. Knowme's own layers confirmed intact (Sid 2026-07-12: after reloads
   "it works as I planned").

**Batch 2 (T5–T9): NOT RUN — superseded.** Sid consolidated all remaining work 2026-07-12 into
three plans: m4 (fixes) → m5 (visual upgrade: scroll-video, textured renders, D2/D3 assets) →
m6 (cert + launch). **Batch P is DEAD — nothing lands after launch; D2/D3 land in m5.**
