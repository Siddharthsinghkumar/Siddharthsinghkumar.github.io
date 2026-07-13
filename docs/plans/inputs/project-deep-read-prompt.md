# Project deep-read prompt (Gemini 3.1 Pro) — portfolio asset source material

> Purpose (Sid, 2026-07-13): the post-launch asset queue (m5plan §7 — workflow-graph images,
> D3 tiles, D2 shot picking) needs real understanding of each featured project. Gemini 3.1 Pro
> does the hard read INSIDE each project folder and delivers `PORTFOLIO-SUMMARY.md` there.
> Sid + Claude then pick facts/graphs from those summaries. Nothing here is launch-blocking.

## 1. Ownership sweep of `/home/sidd/project/` (checked 2026-07-13)

**NOT Sid's — never feature, never summarize:**

| Folder | Why |
|---|---|
| `hiring-agent`, `hiring-agent-upstream` | remote = `interviewstreet/hiring-agent` (external org) |
| `not my project but github repos i like to use/` (PLFM_RADAR) | Sid's own label |
| `venv`, `exp` | environment / scratch, not projects |

**Sid's but NOT featured on the site** (no summary needed): `auto-job-match-pipeline`
(abandoned V1), `auto-pay-reminder-system`, `Bluetooth-ESP32-Controller`,
`code-auditer-helper`, `img2img-sd-flux-custom`, `iot-smartbulb-debug-tools`,
`job_pipline_v2`, `linux-system-recovery`, `localfans`, `robust-face-verification`,
`freelance/project-2` (local-play-school-website variant).

## 2. Targets — run the prompt in each of these, in this order

Case pages first (they need workflow graphs), grid cards after (tiles/imagery).

| # | Folder (open Gemini here) | Portfolio slot |
|---|---|---|
| 1 | `/home/sidd/project/smart-job-scanner-v2` | /prospect — 11-stage OCR+LLM pipeline |
| 2 | `/home/sidd/project/llm-travel-agent` | /travel-planner — the whole page |
| 3 | `/home/sidd/project/merlin-cli-bridge` | /prospect — generation runtime (PRIVATE) |
| 4 | `/home/sidd/project/persona-context-engine` | /prospect — FAISS persona memory |
| 5 | `/home/sidd/project/job-discovery-engine` | /prospect — LangGraph orchestrator |
| 6 | `/home/sidd/project/jobboard-api` | /prospect — Django tracker |
| 7 | `/home/sidd/project/firefighting-robot-public` | home grid card |
| 8 | `/home/sidd/project/mtk-firmware-unlock-root` | home grid card |
| 9 | `/home/sidd/project/truenas-zfs-recovery-lab` | home grid card |
| 10 | `/home/sidd/project/freelance/project-3/sindhey-website` | home grid card (Sindhey) |

Optional 11th: `/home/sidd/project/merlin-cli` — messy working dir (scraped reference pages,
generated resumes); only worth a pass if the bridge summary leaves gaps.

## 3. The prompt — paste into Gemini 3.1 Pro @ HIGH with cwd = the project folder

```
You are doing a read-only deep study of the project in the current working directory. Your ONLY
deliverable is ONE new file, PORTFOLIO-SUMMARY.md, in the project root. You change nothing else:
no code edits, no refactors, no git add/commit/push, no other files created or deleted.

READ ORDER: 1) README and any docs/ folder, 2) dependency/config manifests (package.json,
requirements.txt, pyproject.toml, docker/k8s files, CI), 3) entry points and main modules,
4) the core source tree, 5) tests and scripts. Skip entirely: node_modules, venv/.venv, .git,
build outputs, datasets, model weights, media files, and any folder of downloaded third-party
pages. If the tree is too large to read fully, prioritize source over data and SAY at the end
which directories you did not read.

HARD RULES:
- Every factual claim in the summary carries evidence: a file path (path:line where possible).
- Never invent or estimate metrics. A number appears ONLY if it exists in code/config/docs at a
  citable path. Anything you believe but cannot cite gets the label UNVERIFIED.
- Report status honestly from what the code proves: working / partial / stubbed / abandoned.
  Docs may lie; code wins. Never upgrade a status to sound better.
- If you see secrets, tokens, API keys, or personal data (emails, phone numbers, real names of
  third parties), do NOT quote them — list their file paths in section 8 as redaction warnings.

WRITE PORTFOLIO-SUMMARY.md WITH EXACTLY THESE SECTIONS:

# <project name> — Portfolio Summary
## 1. What this is
Three plain-language sentences. What it does, who/what it serves, what makes it non-trivial.
## 2. Honest status
What actually runs end-to-end today, what is partial, what is stubbed or dead. Evidence path
per claim.
## 3. Architecture
Table of real components: name | role in one line | key files. Only components that exist in
the tree.
## 4. Workflow graph (the important one)
A Mermaid flowchart of the MAIN data/control flow: nodes = the real components from section 3,
edges labeled with what actually passes between them (file type, message, API call). If the
project has a distinct multi-stage pipeline, add a second Mermaid graph of just that pipeline
with every stage named as in the code. These graphs become portfolio diagram images later, so
correctness beats completeness — omit what you are not sure of rather than guessing.
## 5. Tech stack (proven)
Only languages/frameworks/services actually imported or configured, each with one evidence path.
No résumé-padding.
## 6. True numbers
Quantities that are real and citable: stage counts, data volumes, model names, node counts,
timeouts, coverage. One line each: number — meaning — path. Mark UNVERIFIED anything notable
you could not confirm.
## 7. Visual opportunities
What from this project would make a strong image: which workflow graph, which runnable UI/
dashboard/bot/hardware could be screenshotted or photographed (and the exact command/URL to
bring it up if discoverable), any existing diagrams/assets already in the repo worth reusing.
## 8. Redaction warnings
File paths containing secrets or personal data that must never appear in a screenshot. If none:
"None found."
## 9. Coverage note
Directories/files you did NOT read and why.

Address the user as Sid. When the file is written, print only: the absolute path of the summary,
its section list, and your coverage note.
```

## 4. After the summaries exist

Sid + Claude pick per project: the workflow graph to redraw as a token-styled diagram image
(DESIGN.md tokens, not Mermaid default colors), the true numbers worth adding to copy (must
still pass COPY.md's verified register), and the screenshot targets for D2/D3. Generated
imagery stays bound by M5.5/N22 (ambience/brand art only — the workflow DIAGRAMS are drawn
diagrams like ProspectDiagram, not "generated media", so they are allowed).
