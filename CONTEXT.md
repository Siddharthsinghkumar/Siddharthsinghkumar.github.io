# CONTEXT.md — Facts the Portfolio Website Is Built From

> Compiled 2026-07-04 from a structured interview with Sid, plus:
> `local-resume-references.md`, `/home/sidd/project/PROJECT_ECOSYSTEM_MAP.md`,
> `/home/sidd/project/all_projects_dataset.json`, and Sid's live GitHub profile.
> Every fact here was confirmed by Sid or taken from his own documents. Nothing is invented.
> **This file is the single source of truth for COPY.md and all build phases.
> If copy or design contradicts this file, this file wins.**

---

## 1. What the site is

- The personal portfolio of **Siddharth Singh**. Its single job: **get him hired**.
- Primary audience: **AI/ML backend recruiters and hiring managers**.
  Secondary audience: full-stack recruiters.
- Positioning: **AI Backend Engineer** is the headline identity.
  Full-stack (shipped production products) and embedded/systems (robotics, FPGA,
  firmware, homelab) appear as **supporting range** — proof of depth, never
  competing headlines.
- Employment terms the copy expresses: open to **full-time roles in India or
  global remote**; contract work acceptable. Preference order: (1) AI backend
  India/remote, (2) AI backend global remote.
- **Tone rule (binding): confident and specific, never desperate.** No begging
  language, no "looking for any opportunity." Specificity and polish do the selling.
- **Page inventory (amended 2026-07-05):** 6 pages — `/`, `/prospect`, `/travel-planner`,
  `/projects`, `/about`, `/404`. The original planning scope was 4 pages; `/projects`
  and `/about` were added per D36/D37 (DESIGN.md §6). Note: `CONTEXT.md §3` exclusion
  of education still holds — it does not appear on any page, including `/about`.

## 2. Hard technical constraints

- Hosted on **GitHub Pages** at `https://Siddharthsinghkumar.github.io`
  (repo: `Siddharthsinghkumar/Siddharthsinghkumar.github.io`, currently empty).
- Therefore the build is a **fully static export**. No server routes, no backend,
  no server-side rendering at request time, no secrets in the client.
- **Fresh-data mechanism (decided):**
  - Project cards fetch live repo data (stars, last-push, description) client-side
    from GitHub's free public API (`api.github.com/users/Siddharthsinghkumar/repos`,
    unauthenticated). Graceful fallback to build-time snapshot data if the API is
    unavailable or rate-limited.
  - A **GitHub Action rebuilds and redeploys the site nightly and on every push**.
  - Resume updates = Sid pushes a new PDF to the repo → auto-redeploy.
  - **Rejected alternatives** (decision log): Supabase backend (anon-key exposure,
    RLS burden, free-tier auto-pause risk) and Google Sheets backend (fragile
    endpoint, rate limits, unprofessional network traces). Reason: YAGNI — a
    portfolio needs zero server dependencies.
- Deployment note: `howtodeploy.md` (Coolify) is **superseded** for this project.
  GitHub Pages is the decided target.

## 3. The subject

- **Siddharth Singh** — Noida, Uttar Pradesh, India.
- Three professional identities (resume language):
  1. **AI Backend Engineer** — production LLM orchestration, agentic tool-calling
     runtimes, local inference (Ollama, llama.cpp), RAG pipelines. **← headline**
  2. **Full-Stack Engineer** — Next.js, FastAPI, Supabase; zero-to-one booking &
     management platforms.
  3. **Embedded & Systems Engineer** — C++, Arduino, ESP32, FPGA, Linux CLI,
     hardware debugging, systems survival (TrueNAS, ZFS).
- **Deliberate exclusion (Sid's decision):** education (B.Tech EE, college name,
  GATE 2024) does **not** appear on the website. Reasoning: it supports neither
  the AI-backend nor full-stack story and dilutes focus; it remains in the
  downloadable resume, so nothing is hidden — it just isn't foregrounded.
- Contact shown on site (and nothing else):
  - Email: `siddharthsingh8418@gmail.com` (primary CTA)
  - GitHub: `https://github.com/Siddharthsinghkumar`
  - LinkedIn: `https://www.linkedin.com/in/siddharth-singh-735340296` (confirmed correct)
  - **No phone number anywhere on the site.**
- Primary visitor actions (dual CTA): **email Sid** and **download the resume PDF**
  — a single AI-Backend resume (built from Sid's `resume_1` AI/Backend persona set).

## 4. Flagship case study #1 — **Prospect** (the super project)

> Name decided 2026-07-04: **Prospect** — "an autonomous job-prospecting engine."
> Chosen for the double meaning: job prospects + prospecting the gold mine
> (Sid's own ecosystem map calls smart-job-scanner-v2 "The Gold Mine").
> Alternates considered: Lodestar, Talon, Beacon.

A multi-agent system that discovers jobs, matches them against persona-scoped
resumes, generates tailored applications, and delivers alerts. It is **presented
honestly as a living system**, with a per-component status board. Allowed status
labels: `SHIPPED` / `RUNNING LOCAL` / `IN DEVELOPMENT` / `RESEARCH` / `CONCEPT`.

Components (status as of 2026-07-04, from Sid's ecosystem map):

| Component | What it is | Status | Public? |
|---|---|---|---|
| smart-job-scanner-v2 | 11-stage OCR + LLM pipeline scanning newspapers daily; semantic resume matching; Telegram alert delivery; Gemini multi-key client | RUNNING LOCAL (battle-tested) | **Public repo** |
| merlin-cli / merlin-cli-bridge | Agent framework + tool-calling runtime executing sandboxed local commands from LLM decisions; browser-bridge inference engine | RUNNING LOCAL (active, tested) | Local/private |
| persona-context-engine | FAISS local embeddings strict-mapping repos/projects to 3 base resumes to prevent context bleeding | RESEARCH | Local |
| job-discovery-engine | LangGraph state machine; NVIDIA NIM skills; Crawl4AI stealth discovery (planned) | IN DEVELOPMENT | Local |
| jobboard-api | Django REST + PostgreSQL + Redis application tracker | SHIPPED (v1, needs extension) | **Public repo** |

**Proof rules (binding):**
- Link only components that are public at launch. Private/local components are
  described with diagrams and screenshots, labeled with their status — never
  linked, never claimed as shipped.
- Proof assets at launch: **public code links, real screenshots/recordings**
  (Telegram alerts arriving, pipeline runs, generated resumes, dashboards),
  and **fresh architecture diagrams** drawn from the roadmap docs.
- **No aspirational roadmap claims presented as done.** Sid's own audit doc calls
  parts of the spec "30% fiction" — the site claims only what is E2E-verified.

## 5. Flagship case study #2 — LLM Travel Planner Agent

- Public repo: `github.com/Siddharthsinghkumar/ai-travel-planner-agent`.
- Facts (from resume): agentic AI travel planner using local LLMs (Ollama);
  deterministic agent memory layer; custom model router; async circuit breaker
  handling API degradation; distributed retrieval pipeline with real-time SSE
  streaming falling back to local Ollama inference; deployed on a k3s multi-node
  cluster with full Prometheus/Grafana observability; human-in-the-loop booking
  handoff; FastAPI + Streamlit.
- Proof: code link, screenshots (Grafana, streaming UI), architecture diagram.

## 6. Project grid (compact cards)

Candidate pool (final subset chosen during the copy phase — "subset" means which
of these appear as cards; the rest are simply omitted):

- **Sindhey Pathology platform** — live production healthcare booking platform at
  `sindheypathology.com`: Cashfree payments, phone-OTP auth, WhatsApp/email
  notifications, DPDP-compliant erasure, Playwright e2e. Proves Sid ships real
  products for real clients.
- **Autonomous Firefighting Robot** — 25–28 kg tracked robot; FPGA + Arduino
  master-slave; CNN flame detection; multi-sensor fusion (IR, temp, smoke, PIR,
  ultrasonic, UWB radar). Public showcase repo + IJFMR publication.
- **HeartAIoT Monitor** — ESP8266 + MAX30100 wearable; live Blynk dashboard;
  Python ML anomaly detection. Public.
- **MTK Firmware Unlock Toolchain** — Python toolchain: MediaTek bootloader
  unlock, firmware extraction, TWRP, Magisk root (security research). Public, 8 stars.
- **TrueNAS ZFS Recovery Lab** — simulated RAID-Z failure + forensic recovery,
  mixed CMR/SMR disks, PXE boot. Public.
- **auto-pay-reminder-system** — Google Sheets + Apps Script + Telegram;
  click-to-send WhatsApp links. Public, 5 stars.
- **linux-system-recovery** — documented rescue of a broken `/home` partition. Public.
- **robust-face-verification** — custom CNN + contrastive embeddings, selfie vs
  profile-photo identity verification. Private (describe only if used).

## 7. Experience timeline (site section)

| Period | Role | Facts |
|---|---|---|
| Jan 2026 – present | **Lead Full-Stack Engineer, Sindhey Pathology** (healthcare) | Zero-to-one booking platform: Next.js 16, React 19, Supabase; 4-step booking wizard (Zustand, rules engine); Cashfree UPI/card payments; 3-tier role verification, HMAC OTPs; WhatsApp/Email notifications; admin dashboard with payment reconciliation; Playwright e2e. Live at sindheypathology.com. |
| Jan 2026 – present | **AI Backend Developer, LLM Travel Planner** | See §5. |
| Q1 2026 | **Lead Developer (Contract), Play-School Management Platform** | 11-stage admissions Kanban CRM; Cashfree UPI; time-decay fee escalation via cron; digital daily diary with real-time notifications; Supabase Storage photo uploads. |
| 2023 – 2024 | **Lead Developer, Autonomous Firefighting Robot** (capstone) | See §6. Sub-100ms deterministic response; 6-wheel track drive; autonomous navigation. |

## 8. Publication & open source

- **Publication:** "Autonomous Firefighting Vehicle," IJFMR 2024 —
  `https://www.ijfmr.com/research-paper.php?id=32630`. Peer-reviewed, linkable.
- **OSS contribution:** PR to `interviewstreet/hiring-agent` —
  "feat: add llama.cpp and NVIDIA NIM provider support" (July 2026).
- GitHub activity: 465 contributions in the last year; 126 commits to
  `sindheypathology-collab/sindhey-website` in July 2026 alone.

## 9. Skills

The list below is the *minimum confirmed set* (from `local-resume-references.md`).
**Sid states he has more skills than this** — during the copy phase, expand from
`/home/sidd/project/all_resumes_dataset.json` and the resume persona sets, then
curate for AI-backend-first presentation (breadth shown, focus kept).

- **AI / Backend:** Python, FastAPI, LangGraph, Node.js, Express, LLM tool
  calling, RAG pipelines, Ollama, llama.cpp, Pydantic, Supabase (Auth/RLS/RPC)
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI,
  Zustand, Framer Motion, Three.js, Playwright
- **Databases & vectors:** PostgreSQL, MongoDB, Pinecone, ChromaDB, Redis, SQLite
- **Systems & ops:** Linux CLI, Docker, Kubernetes (k3s), AWS (EC2/RDS), GCP,
  Prometheus/Grafana, ZFS RAID-Z, CI/CD
- **Embedded:** C++, Arduino, ESP32/ESP8266, FPGA (Xilinx), I2C/SPI/UART, BLE, Wi-Fi

## 10. Claims pending Sid's verification (yes / no / adjust — before copy freezes)

Every numeric or superlative claim that could appear in copy. None may be printed
until Sid marks it:

| # | Claim (source: resume/docs) | Verdict |
|---|---|---|
| V1 | smart-job-scanner-v2 processes **15–20 GB of PDFs daily** | ☐ |
| V2 | smart-job-scanner-v2 is an **11-stage** pipeline | ☐ |
| V3 | Firefighting robot: **sub-100ms** deterministic response | ☐ |
| V4 | Firefighting robot weighs **25–28 kg** | ☐ |
| V5 | Sindhey platform shipped **zero-to-one in 6 months** | ☐ |
| V6 | Travel planner runs on a **k3s multi-node cluster** with Prometheus/Grafana | ☐ |
| V7 | Play-school platform: **11-stage** admissions pipeline | ☐ |
| V8 | **465 contributions** last year (GitHub-rendered, auto-true) | ☐ |

## 11. Open decisions (carried into later phases)

1. ~~System name~~ — **DECIDED: Prospect** (2026-07-04, Sid delegated, Claude coined).
2. ~~Fresh-data mechanism~~ — **DECIDED: GitHub API client-side + nightly/on-push Actions rebuild.**
3. Claims table (§10) — resolve during copy interview.
4. Final grid-card subset (§6) — resolve during copy interview.
5. Resume PDF file itself — Sid produces/exports the AI-Backend PDF before launch.
6. `reference-website-3.md` is empty — **Sid says leave it; ignore.**

## 12. Related build files (workflow)

- `COPY.md` (project root, next phase) — every page's copy, drafted from this file.
- `DESIGN.md` (project root) — merged design system; brand kit wins colours/fonts,
  reference sites win layout/feel; includes a decision log.
- `CLAUDE.md` (project root) — build rules including the component-donor rule.
- `docs/learned.md` — 974 lines of prior-project mistakes; binding guardrails for
  the executor.
