# M2 Plan — Hydration Fix + Launch (2026-07-11)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m2plan.md`
> Successor to [`m1plan.md`](m1plan.md) (M1 certified 2026-07-10; independently re-verified by Claude
> 2026-07-11 — every gate re-run, all claims held, five gaps found; this plan closes them).
> Executors: **DeepSeek v4 Flash @ MAX** (Batch 1) and **Sid+Claude ONLY** (Batch 2 — the push).
> Sid switches models at every **⛔** marker himself. An executor must NEVER continue past one.
> **STATUS: FROZEN — verdicts M2.1–M2.4 taken by Sid 2026-07-11. Scope freeze in effect: executors
> may not add, merge, reorder, or reinterpret tasks; STOPs are accept/reject only.**

---

## 0. Cold-start reading list (in order, nothing else)

1. `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` — build rules. Wins all conflicts.
2. `/home/sidd/project/freelance/portfolio-website/site/AGENTS.md` — "This is NOT the Next.js you know."
   Read the relevant `site/node_modules/next/dist/docs/` guide before touching any Next API.
3. **This plan, top to bottom.** m0plan §3 (N1–N13) and m1plan §2 (N14–N16) remain law verbatim;
   §2 below adds N17–N18.
4. Per-task: ONLY files named in the task block. Reference/research files stay unread.

## 1. Mission & definition of DONE

**The site goes live at `siddharthsinghkumar.github.io` with the first genuinely all-green suite.**

DONE means ALL of: Playwright **36/36** (the /knowme hydration mismatch fixed — M1 certified at 34/36);
`site/public/test/` (personal photo) gone from tree and index; root `README.md` exists (the D64 minimal
tree requires it and it does not exist today); full suite 3× green on the final tree; privacy
verification passed on the public snapshot; **Sid pushed**; first Actions run green end-to-end;
D6–D8 post-deploy checks pasted; docs closed with a dated exit state.

DONE is NOT: D2 screenshots / D3 tiles (Batch P, blocked on Sid's drop, lands post-launch via the
D70 update flow) or anything in the v2 parking lot.

**Why M2 exists (verification findings, 2026-07-11):** deploy.yml runs the FULL gate suite —
including Playwright — before deploying, so the /knowme failure would red the very first push.
It is deterministic (desktop + mobile, reproduced twice), not the "pre-existing flake" the M1
report called it. Root cause found and anchored in T1.

## 2. Additional N-rules for M2 (on top of N1–N16, all still binding)

| # | Rule |
|---|---|
| N17 | **The public repo never contains:** `docs/`, any plan file, `local-resume-references.md`, `.commandcode/`, `site/public/test/*`, any phone number, `downl2160@gmail.com`. The §6 privacy grep runs on the snapshot before the initial push AND on every future public commit (D70). A single hit = STOP. |
| N18 | **Red CI ≠ threshold edit.** If the first Actions run (or a nightly) fails a gate, rerun once; a second consecutive failure is a STOP for Sid — no gate edits beyond what M2.3/D71 already authorizes. |

## 3. FROZEN VERDICTS (Sid, 2026-07-11)

| # | Verdict |
|---|---|
| M2.1 | **Purge `site/public/test/` via `git rm -r` now.** Deletes the 3 files (incl. the personal photo) from disk + index; private git history keeps them recoverable. → T2 |
| M2.2 | **Public update flow = normal commits** (rejects the force-push model). Initial push is still the D64 fresh-history single commit; afterwards the public repo accumulates history. Consequence: EVERY future public commit passes the §6 privacy grep before Sid pushes. → D70, Batch P |
| M2.3 | **CI case perf floor lowered 75 → 72 now** (insurance against runner variance on a 1-point margin; local runs 2026-07-11: prospect 76, travel-planner 76). This verdict is Sid's written N7 approval, backed by D68's ≥70 pre-authorization. Home floor 55 unchanged. → T4, D71 |
| M2.4 | **DeepSeek v4 Flash @ MAX executes Batch 1.** Batch 2 (snapshot + push + post-deploy) is Sid+Claude only — executors stop at ⛔ STOP M2. |

## 4. Execution order

```
BATCH 1 (DeepSeek v4 Flash @ MAX): T1 → T2 → T3 → T4 → T5 → T6 → T7 (cert 3×)
   → ⛔ STOP M2 (Sid judges /knowme fix feel + README text; accept/reject)
BATCH 2 (Sid+Claude ONLY): T8 (snapshot + privacy verify) → T9 (Sid pushes + Pages settings)
   → T10 (D6–D8 post-deploy) → T11 (docs close)
BATCH P (BLOCKED until Sid's D2/D3 drop, post-launch): P1 (assets in) → P2 (D70 release flow)
```

Strictly T-order. One task = one commit. Build green before every commit. No attribution trailers.
**NEVER push — only Sid, only at T9, only from the snapshot directory.**

---

## BATCH 1 — Fix, purge, launch prep (DeepSeek v4 Flash @ MAX, ~2–3 h)

### T1 — /knowme hydration fix (LAUNCH-BLOCKING)
- **File:** `site/src/components/LanyardLoader.tsx` (anchors verified 2026-07-11; re-grep before editing).
- **Root cause (confirmed by Claude):** line 33 computes
  `const webglOk = typeof window !== "undefined" && supportsWebGL()` in the render body.
  Server prerender: `webglOk = false` → renders `<LanyardFallback>` HTML. Client hydration pass:
  `webglOk = true` but `mounted` still reads the server snapshot (`false`, line 34) → the
  lines 44–48 branch returns `null`. Server HTML has an element where the client renders nothing →
  **React #418** console error on /knowme, deterministic on desktop AND mobile projects →
  smoke.spec.ts fails 2/36.
- **Fix shape (behavior-preserving, one attempt — m0plan §10.4):** render the fallback until
  mounted, and probe WebGL only after mount so server and hydration passes render identical HTML:
  - In the existing mount effect (lines 37–42), before `isMounted = true`, run `supportsWebGL()`
    once and cache the result in a module-level variable (the probe is deterministic per session —
    m1plan T5 already blessed this pattern).
  - Render logic becomes: `if (prefersReduced || !mounted || !cachedWebglOk) return <LanyardFallback …>`.
    The `return null` branch dies (bonus: no pre-mount blank — the fallback image shows immediately,
    then the 3D card swaps in).
  - Delete the now-unused line-33 expression. No new state, no new effects, no eslint-disable
    (the M1.1 budget is CLOSED — if lint objects, STOP and report, don't spend lines).
- **N14 proof:** /knowme visual-gate row within tolerance of 89.0% scene / 22.6% orange / 7.1:1;
  lanyard still loads and drags (screenshot or recording → `docs/qa/m2/`); reduced-motion still
  gets the static fallback (smoke test covers it).
- **Done:** `npx playwright test` → **36/36**, zero console errors on /knowme both projects. Paste the
  summary line. Commit: `fix(knowme): render fallback until mount — kill hydration mismatch`

### T2 — Privacy purge (M2.1)
- `git rm -r site/public/test/` — removes `final-df-h.jpg`, `photo_5_2025-06-03_22-31-35.jpg`
  (the personal photo — this deletion is the point), `pic_idea.png` from disk + index.
- Pre-verified 2026-07-11: `grep -rn "/test/" site/src` → empty; nothing references these files;
  build cannot break. Re-run the grep anyway and paste it.
- **Done:** `git ls-files | grep public/test` → empty; `ls site/public/test` → No such file;
  build green. Commit: `chore(privacy): remove tracked test images`

### T3 — Delete dead PageBackground.tsx
- **File:** `site/src/components/PageBackground.tsx` — zero importers (verified 2026-07-11:
  `grep -rln "PageBackground" site/src` returns only the file itself; re-run and paste). M1.3's
  "no third state" doctrine: the restore path is git history, not a dead file.
- **Do NOT touch** `KnowMeBackground.tsx` — it is alive (imported by `knowme/page.tsx`). N13: only
  the named file.
- **Done:** grep returns nothing; build green. Commit: `chore: delete dead PageBackground component`

### T4 — CI case perf floor 72 (M2.3 — Sid's written N7 approval, D68-backed)
- **File:** `site/scripts/lighthouse-gate.mjs:17` — `const CASE_PERF = 75;` → `72`. Update the memo
  comment at lines 12–15 with one line: `Sid 2026-07-11 (D71): case floor 72 — CI runner-variance
  insurance on a 1-pt margin; D68 pre-authorized ≥70.` Touch NOTHING else in the script (N7 —
  this one-line edit is the entire approval).
- **File:** `DESIGN.md` §5 line ~163 — case threshold text becomes truthful: perf ≥55 home,
  **≥72 case (CI ship-floor, D71; local target remains 75+)**; a11y/SEO unchanged.
- **Done:** `node scripts/lighthouse-gate.mjs` green with `(min 72)` printed for case pages.
  Commit: `chore(gates): case perf CI floor 72 per D71`

### T5 — Root README.md (the public repo's face)
- The D64 minimal tree is `site/` + `.github/` + `README.md` — **root README does not exist**
  (only `site/README.md` does). Create `/home/sidd/project/freelance/portfolio-website/README.md`.
- **Words from `COPY.md`'s verified register ONLY** (component-donor rule: no invented copy, no
  invented claims). Content, ~25–35 lines: what the site is (Siddharth Singh — AI backend engineer,
  portfolio), live URL `https://siddharthsinghkumar.github.io`, the 6 pages, stack one-liner
  (Next.js static export + React Three Fiber, deployed via GitHub Actions with a nightly rebuild),
  how to run locally (`cd site && npm ci && npm run dev`). **No phone number, no education section,
  no private email** — public contact is the one already on the site.
- **Done:** file exists, §6 privacy grep clean on it, Sid reviews the text at ⛔ STOP M2.
  Commit: `docs: public root README`

### T6 — Decision-log backfill (DESIGN.md §6, 4-column format, after D68)
- `| D69 | 2026-07-10 | M1.3: PageBackground mounts + imports deleted; component file deleted in M2 | Restored-on-finals lighthouse could not hold the ≥75 floor; restore path is git history |`
- `| D70 | 2026-07-11 | M2.2: public-repo updates via normal commits after the D64 single-commit initial push | Sid's call over the force-push model; consequence: every public commit passes the N17 privacy grep before push |`
- `| D71 | 2026-07-11 | M2.3: CI case perf floor 72 (from 75), home 55 unchanged | Runner-variance insurance on a 1-pt local margin (76 vs 75); written N7 approval, inside D68's ≥70 pre-authorization |`
- **Done:** rows appended verbatim; build green. Commit: `docs(design): D69–D71`

### T7 — Housekeeping + certification 3×
- Commit the private working copy's loose ends (this repo never goes public — N17 protects the
  snapshot): `docs/plans/m1plan.md`, `docs/plans/m2plan.md`,
  `docs/qa/phase5/claude-verification-2026-07-08.md`, the 1-line `.commandcode/taste/taste.md` change.
  Commit: `docs(plans): m1/m2 plans + verification record`
- Full suite **3× consecutive** on the final tree (m0plan §7 verbatim): build → tsc → lint →
  guards → playwright → lighthouse-gate → visual-gate. **All green including Playwright 36/36** —
  this is the first certification with zero asterisks. Paste all three summary blocks.
- `docs/qa/qa-report.md` gains an "M2 certification" section from observed output only.
  `git status` → clean. Commit: `docs(qa): M2 certification`

## ⛔ STOP M2 — Sid's eyes (do not pass without explicit yes)
Present: Playwright 36/36 output; /knowme before/after (does the fallback-then-card swap-in FEEL
right? — N1, gates can't judge feel); README.md full text for approval; purge proofs (T2 pastes);
3× cert summaries. Sid accepts or rejects. **Executors stop here permanently.**

---

## BATCH 2 — Snapshot, push, verify (Sid+Claude ONLY)

### T8 — Build the public snapshot + privacy verification
- From the clean, certified tree:
  `git archive HEAD site/ .github/ README.md | tar -x -C <fresh temp dir>` — tracked files only
  (no node_modules, no out/, nothing untracked can leak). In the temp dir: `git init`, single
  commit `Initial release` (no trailers).
- **Privacy verification (Claude runs, pastes every line — N17):**
  1. Top level is EXACTLY `site/ .github/ README.md` (`ls -A`).
  2. §6 privacy grep on the whole snapshot → zero hits.
  3. `test -e site/public/test` → absent; `git log --oneline` → exactly 1 commit.
  4. `file site/public/resume/resume-siddharth-singh.pdf` → PDF; open it — it renders.
- Any failure = fix in the private repo, re-archive. Never hand-edit the snapshot.

### T9 — Sid pushes + Pages settings
- From the **snapshot directory** (never the working copy — D64):
  `git push https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git HEAD:main`
- GitHub → repo Settings → Pages: **source = GitHub Actions**; **Enforce HTTPS** on.
- Watch the first Actions run end-to-end. It runs the full suite on a GitHub runner — the first
  time these gates run off this machine. Red → rerun once; red twice → STOP, Sid decides (N18).

### T10 — Post-deploy verification (D6–D8)
- All 6 routes return 200 on `https://siddharthsinghkumar.github.io` (`/`, `/prospect/`,
  `/travel-planner/`, `/projects/`, `/knowme/`, a 404 check).
- Resume downloads and opens from the live site. OG meta present on home + knowme (curl the HTML;
  card-render check with a debugger tool by hand).
- D6: LinkedIn URL clicked **by Sid's own browser** (bots get 999 — only human eyes count).
- D7: GitHub profile website field set; pinned repos consistent with D65
  (`firefighting-robot-public`, `mtk-firmware-unlock-root`).
- D8: nightly cron (`30 22 * * *` UTC ≈ 04:00 IST) — confirm the next scheduled run goes green.

### T11 — Docs close
- `docs/qa/qa-report.md` + `docs/LAUNCH-CHECKLIST.md` get the final dated exit state and the
  sentence: **"Live and verified. Lint zero. Playwright 36/36."** Commit (private repo).

---

## BATCH P — Post-launch asset drop (BLOCKED until Sid's D2/D3 drop)

### P1 — Assets in (DeepSeek, per M2.4 default)
- D2 screenshots → `site/public/screenshots/`, frames re-pointed; D3 tiles → `site/public/tiles/`.
  Same AVIF/WebP pipeline as before. N16 still applies: lighthouse before committing anything
  touching case pages. Taste STOP for Sid on the new images.

### P2 — D70 release flow (Sid+Claude; the template for every future update)
1. Certify the private tree (full suite 1×, all green).
2. `git archive` a fresh export of `site/ .github/ README.md`; sync it over a local checkout of the
   public repo; review `git status` + full diff.
3. §6 privacy grep on the resulting tree → zero hits (N17 — every public commit, forever).
4. Normal commit (clean message, no trailers) → **Sid pushes** → watch Actions green.

---

## 5. Gate suite, proof rules, context rules, commit protocol

m0plan §7, §8, §10, §11 and m1plan N14–N16 apply verbatim. Evidence dir: `docs/qa/m2/`
(`mkdir -p` at first use). Statuses remain verified / failed / not-run. Playwright expectation is
now 36/36 — "34/36 with known flake" is no longer an accepted state.

## 6. The privacy grep (canonical — N17, used in T7 sanity, T8, and every P2 release)

```bash
grep -rn "+91\|downl2160\|photo_5_2025\|pic_idea\|local-resume\|commandcode\|docs/plans" <tree> \
  --include="*" || echo CLEAN
ls -A <tree>   # must be exactly: site/  .github/  README.md
```

Zero hits + exact tree shape, or the push does not happen.

## 7. KICKOFF PROMPT — DeepSeek v4 Flash @ MAX (Batch 1)

```
Read, in order: /home/sidd/project/freelance/portfolio-website/CLAUDE.md, then
/home/sidd/project/freelance/portfolio-website/site/AGENTS.md, then m0plan.md §3 (N1–N13) and
§7–§11, then m1plan.md §2 (N14–N16), then the ENTIRE plan at
/home/sidd/project/freelance/portfolio-website/docs/plans/m2plan.md.
Execute Batch 1 (T1–T7) strictly in order. Non-negotiables: T1 is one-attempt — if the hydration
fix isn't clean in one try, STOP and report; the M1.1 disable budget is CLOSED (no new
eslint-disable lines); edit only files named in the current task; re-grep every anchor before
editing; a fix that changes observed behavior is a FAILED task (N14) — prove with visual-gate +
playwright + evidence in docs/qa/m2/; T4 is a one-line threshold edit with Sid's written approval
(D71) — touch nothing else in any gate script; build green before every commit; one task = one
commit; no attribution trailers; NEVER push. STOP COMPLETELY at ⛔ STOP M2 and post the report:
playwright 36/36 output, /knowme evidence, README full text, purge proofs, 3× cert summaries.
Address the user as Sid.
```

## 8. Confidence: 9.0/10 — frozen

Grounded: every claim in the M1 report was independently re-verified 2026-07-11 (all gates re-run
locally by Claude; lint 0/13, tsc clean, build 6 routes, guards/lighthouse/visual green, playwright
34/36 reproduced); the T1 root cause was traced to exact lines, not guessed; every anchor in this
plan was grepped today. Residual risks: (1) **first CI run on GitHub runners is untested territory**
— visual-gate and lighthouse were only ever run on this machine; runner rendering/perf may differ
(mitigations: D71 floor, N18 rerun-once-then-STOP); (2) T1 is a hydration fix — the class of fix
that can whack-a-mole (mitigation: exact root cause + one-attempt STOP); (3) OG card rendering on
the live domain is unverifiable until after T9 (covered in T10).

**SCOPE FREEZE: 2026-07-11.** M2.1–M2.4 frozen. Executors may not add, merge, reorder, or
reinterpret tasks at execution time; STOPs are accept/reject only.
