# M6 Plan — Certification + Launch (site done = live)

> **This file:** `/home/sidd/project/freelance/portfolio-website/docs/plans/m6plan.md`
> Runs after ⛔ STOP M5-B is accepted ([`m5plan.md`](m5plan.md)). **Sid+Claude ONLY — no executors.**
> Inherits the launch runbook from m2plan T8–T10 / m3plan Batch 2 verbatim.
> **STATUS: FROZEN 2026-07-12.** "m6 done = fully functional and launched." Nothing lands after.

## T1 — Final certification (roadmap M8 discipline)
- Full suite **3× consecutive**: build → tsc → lint → guards → playwright → lighthouse-gate →
  visual-gate. All green, all three runs. `git status` clean (the `.har` stays untracked, Sid's).
- Completeness table posted: every m4/m5 task + the two M3-A defects, with Built / Gate /
  Sid-verified columns. **⛔ FINAL STOP:** "Ready pending your visual pass. Nothing pushed."

## T2 — Quiet-machine lighthouse (precondition for the snapshot)
- Sid closes Chromium/dev servers ~10 min; `node scripts/lighthouse-gate.mjs`: home ≥55, cases ≥72.
  Red on a quiet machine = real; STOP and diagnose before any snapshot (N18 — no threshold edits).

## T3 — Public snapshot + privacy verification (m2plan T8 verbatim)
- `git archive HEAD site/ .github/ README.md | tar -x -C <fresh temp dir>` → `git init` → single
  commit `Initial release` (no trailers). Claude pastes every line: top level exactly
  `site/ .github/ README.md`; m2plan §6 privacy grep → **zero hits** (N17: no docs/, no plans, no
  `local-resume-references.md`, no `.commandcode/`, no `site/public/test`, no `+91`, no
  `downl2160@gmail.com`); resume PDF opens; `git log --oneline` → exactly 1 commit.
- Any failure = fix in the private repo, re-archive. Never hand-edit the snapshot.

## T4 — Sid pushes + Pages settings
- From the **snapshot directory only**:
  `git push https://github.com/Siddharthsinghkumar/Siddharthsinghkumar.github.io.git HEAD:main`
- Settings → Pages: source = **GitHub Actions**; **Enforce HTTPS**.
- Watch the first Actions run (full gate suite on a GitHub runner, first time). Red → rerun once;
  red twice → STOP, Sid decides (N18).

## T5 — Post-deploy verification (D6–D8)
- All 6 routes 200 on the live URL; resume downloads + opens; OG meta on home + knowme; D6 LinkedIn
  URL clicked by Sid's own browser (bots get 999); D7 GitHub profile website field + pinned repos
  per D65; D8 nightly cron (`30 22 * * *` UTC ≈ 04:00 IST) observed green next morning.

## T6 — Docs close + knowledge base
- `docs/qa/qa-report.md` + `docs/LAUNCH-CHECKLIST.md`: final dated exit state +
  **"Live and verified. Lint zero. Playwright 36/36."** Claude updates project memory same day.
- Future public updates (if ever): D70 flow — certify private tree → `git archive` sync → N17
  privacy grep → normal commit → **Sid pushes**. This grep runs before every public push, forever.

**SCOPE FREEZE: 2026-07-12.**
