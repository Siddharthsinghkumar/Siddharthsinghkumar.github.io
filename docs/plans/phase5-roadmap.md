# Phase 5 Roadmap — Launch Milestones (2026-07-08)

> Companion to [`phase5-todolist.md`](phase5-todolist.md) — every item ID (A1–A9,
> B1–B4, C1–C4, D1–D8, E1–E6; **31 items**, the "27" in the sweep summary was a
> miscount) is mapped to exactly one milestone below. Work order is deliberate:
> **decide the design diet (M0/M4) BEFORE perf tuning (M5)** — removing effects
> changes what perf work is even needed. Sid pushes; executors never push.
>
> Design findings feeding this roadmap (sweep 2026-07-08):
> - `NavRipple.tsx` is not liquid glass — flat canvas rings + orange blob, no
>   refraction. It ALSO runs an idle rAF loop (lines 101–106), banned by
>   DESIGN.md §3 / CLAUDE.md. It cannot ship as-is regardless of taste.
> - Case pages violate D37 ("one ambient system per page"): paper shader +
>   PaperInk WebGL + D54 3s sitewide pulse run concurrently. Evidence: perf
>   76→56, travel-planner scene invisible (A7), test suite buckles under WebGL.

---

## M0 — Decision gate (Sid only, ~30–45 min) ⛔ BLOCKS EVERYTHING

No code moves until these verdicts are frozen. Answer inline, one line each.

| # | Decision | Options | Claude's recommendation |
|---|---|---|---|
| M0.1 | **Ripple** (reverses/upholds D53) | (a) REMOVE for launch, donor → v2 list · (b) replace now with Sid's found donor | **(a) remove** — current one is guardrail-broken anyway; replacing puts a taste loop on the critical path. If (b): drop the donor link/file into the repo first. |
| M0.2 | **D54 3s auto-pulse** | keep · hover-only · remove | **hover-only** — recurring never-resting motion is the clearest "playful not engineered" offender; hover keeps the effect where attention already is. |
| M0.3 | **Case-page ambient diet** (D37 conflict) | keep both shaders · drop paper shader · drop PaperInk | **decide after seeing A7 fix** — travel-planner first needs its scene visible at all; then pick ONE ambient system per D37. |
| M0.4 | **C3 privacy / push strategy** | (a) fresh-history single-commit push, this repo stays private working copy · (b) separate deploy-only repo · (c) push full history | **(a)** — personal photos + phone number are in tracked history; a public github.io repo publishes it forever. |
| M0.5 | **B2 dead GitHub repos** | publish/create `autonomous-firefighting-robot` + `mtk-firmware-unlock` · re-point links · remove stat rows for them | Sid's call — links and star counts must end up verifiable either way. |
| M0.6 | **Gate-script edit approval (N7)** for A2 (guards hex allowlist), A3 (guards asset-link check), A8 (visual-gate /about→/knowme) | approve · discuss | **approve all three** — each is making a gate measure reality, not weakening a threshold. |
| M0.7 | **A9 Playwright stability** | pin `workers: 2` in config · raise smoke budget 15s→30s · both | **pin workers** — deterministic, doesn't hide real slowness. |
| M0.8 | **Asset ETA (D1–D5)** | today · tomorrow · later | Determines whether launch is today or tomorrow. |

**Done:** all 8 verdicts written (reply or edits to this table). New D-rows appended
to DESIGN.md §6 for M0.1–M0.3.

## M1 — Tree & plumbing (Claude/executor, ~30 min)

- B4: commit the verified IntroScreen fix (probe-proven: overlay dismisses ~4s, no console errors).
- C2: `git mv site/.github .github` — workflow becomes runnable (content already assumes root).
- C4: delete `howtodeploy.md` (Coolify contradicts the GitHub Pages constraint).
- C1: add remote `Siddharthsinghkumar/Siddharthsinghkumar.github.io`; plan `master`→`main` mapping. **No push.**

**Done:** `git status` clean, `git remote -v` populated, build green.

## M2 — Test & gate truth (Claude/executor, ~1–2 h; needs M0.6/M0.7)

- A4: `tests/smoke.spec.ts:11` `/about`→`/knowme` (`/Know Me/i`), `:95` route list.
- B3: add `/projects` + `/knowme` to `tests/a11y.spec.ts:7`.
- A8: visual-gate route `/about`→`/knowme` (per approval).
- A2: guards hex — centralize token hexes or extend `allowedHexFiles` (per approval).
- A3: guards link check — validate against files existing in `out/` (per approval).
- A9: workers/timeout per M0.7.
- A5 resolves via B2 (M3) + this milestone's A4; verify with a clean 3× suite run in M8.

**Done:** guards green; Playwright red ONLY on `/projects` console-404s (falls in M3).

## M3 — Code correctness (Claude/executor, ~2–4 h)

- B1: `src/app/page.tsx:211` — firefighting-robot timeline href points at the travel-planner repo; fix per M0.5.
- B2: implement M0.5 (links + `projects-snapshot.json` star counts must match reality).
- A1: burn down 52 lint errors — real fixes (setState-in-effect patterns, `Nav.tsx:101` `<Link>`, typed Lanyard donor code, `@ts-expect-error`). No eslint-config edits without Sid's written OK.

**Done:** `npm run lint` exit 0; `/projects` smoke tests green.

## M4 — Design diet (Claude/executor + ⛔ Sid's eyes, ~1–2 h)

- M0.1 ripple verdict: remove `NavRipple` (+ its wiring in Nav) OR scoped donor port. Either kills the idle rAF violation.
- M0.2 pulse verdict applied.
- A7: travel-planner scene visibility — find where the Phase 4 restack buried the atmosphere; make it plainly visible (N1: spec numbers are floors).
- M0.3 ambient-diet verdict applied after A7 is visible.

**⛔ STOP — visual check:** hard-load `/`, `/prospect`, `/travel-planner`; nav press feel without (or with new) ripple; travel-planner atmosphere plainly visible; pulse behavior per verdict. Screenshots posted. Sid's yes required.

## M5 — Performance (Claude/executor, ~2–4 h; AFTER M4 — diet changes the baseline)

- A6: convert `/test/` interim + future final images to AVIF/WebP properly sized
  (DESIGN.md §5); verify shader idle-mount behavior (`requestIdleCallback`, tab-hidden
  pause per D27); check the entry loader isn't the LCP element on subpages.
- Re-run `lighthouse-gate.mjs`. Target: case ≥75, home ≥55, CLS ≤0.05.

**⛔ STOP only if still <75 after honest optimization** — then it's Sid's threshold
call (N7), with the D49 rationale ("can't be forgettable" > raw perf) on the table.

## M6 — Docs truth (Claude/executor, ~1 h)

- E1: LAUNCH-CHECKLIST 6× `/about` refs → `/knowme`.
- E2: TESTING.md — 6 pages, real thresholds (55/75), current guard list.
- E3: site/README.md page list + test count.
- E4: DESIGN.md §5 "all 4 pages" → 6.
- E5: regenerate `docs/qa/qa-report.md` from M8's actual gate output (not before).
- E6: OG rename `about`→`knowme` end-to-end (`generate-og.mjs:13`, `knowme/page.tsx`, check rendered card title says Know Me).

**Done:** every doc describes the tree as it is; no stale counts anywhere.

## M7 — Sid asset drop (Sid only, parallel with M2–M6)

- D1: real resume PDF (current file is 4KB of text), "six weeks" claim fixed inside it.
- D2: 4 real screenshots → `site/public/screenshots/`, frames re-pointed.
- D3: tile images → `site/public/tiles/`.
- D4: card face photo for /knowme lanyard.
- D5: swap `/test/` images for finals (D58 binding) + re-verify /knowme text tone.

**Done:** no placeholder assets anywhere; D58 satisfied.

## M8 — Certification (Claude/executor, ~1 h)

- Full suite 3× consecutive: build → tsc → lint → guards → playwright → lighthouse-gate → visual-gate. All green, all three runs.
- `git status` empty; `grep -rn "TEMP\|FIXME" site/src` only justified hits.
- Completeness table: all 31 todolist items with Built / Gate / Sid-verified columns.

**⛔ FINAL STOP:** table + `git log --oneline` posted. "Ready pending your visual pass. Nothing pushed."

## M9 — Launch (Sid only)

- Execute M0.4 strategy (fresh-history commit if (a)) → **Sid pushes** to `main`.
- Watch Actions run green end-to-end; GitHub Pages settings: source = Actions, Enforce HTTPS.
- D6: LinkedIn URL verified by hand (bots get 999 — only your browser counts).
- D7: profile website field + pinned repos (consistent with M0.5).
- D8: live URL on all 6 pages, resume link, nightly cron (`30 22 * * *` UTC) fires next night.

**Done:** site live, checklist closed, qa-report + LAUNCH-CHECKLIST get final dated exit-state.

---

## Post-launch / v2 parking lot (NOT current scope)

- Ripple donor from Sid's ui-design find — unhurried evaluation, taste gate, then D-row (if M0.1 = remove).
- GridMotion reconsideration (D6/LAUNCH-CHECKLIST §7).
- merlin-cli-bridge publication (scrub `auth.json` cookies first).
- Authored .glb scene swap (D40's T11 reservation).

## Critical path & timeline

```
M0 (Sid, now) → M1 → M2 → M3 → M4 ⛔ → M5 (⛔ if red) → M8 ⛔ → M9 (Sid)
                 M6 anywhere after M2 · M7 (Sid) parallel, must land before M8
```

M1–M6 is roughly **one focused executor day**. Launch TODAY only if: M0 decided this
sitting + M0.1=remove + D1–D5 assets land within hours + A6/A7 turn out shallow.
Otherwise this is a clean tomorrow-push. Rushing past M4/M8 STOPs is how we ship
another invisible-scene bug — the sweep exists because Phase 4 skipped re-running gates.
