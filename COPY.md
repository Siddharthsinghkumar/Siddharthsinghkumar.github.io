# COPY.md — Every Page's Copy

> Drafted 2026-07-04 from `CONTEXT.md`; verdicts applied same day from Sid's
> claims-check interview. Written for people first; search terms worked into
> titles, headings, and opening lines naturally.
> **Status: verdicts applied — pending Sid's final read-through approval.**
>
> SEO targets (Sid-confirmed): his name ("Siddharth Singh", "Siddharthsinghkumar"),
> agentic/LLM tech terms ("LangGraph", "RAG pipeline", "LLM tool calling",
> "agentic AI engineer"), and "AI backend engineer India / Noida".
>
> Verified-claims register (Sid, 2026-07-04):
> - ✅ TRUE as stated: V1 (15–20 GB PDFs/day), V2 (11-stage pipeline),
>   V3 (sub-100ms robot response), V4 (25–28 kg robot), V6 (k3s + Prometheus/Grafana).
> - ✏️ V5 CORRECTED: Sindhey was ~1.5 months, not 6 → site says **"six weeks"**.
>   ⚠️ Sid's resume PDF still says 6 months — **update the resume before launch**
>   so site and resume agree.
> - ✏️ V7: use fallback → "multi-stage admissions pipeline".
> - ✏️ V8: never print an exact contribution count. Compute at build time
>   (GitHub Action) and ballpark **down to the nearest hundred + "+"**
>   (505 → "500+"). Render with the **DecryptedText** effect for a live-system feel.

---

## PAGE: Home `/`

**Title tag:** `Siddharth Singh — AI Backend Engineer · Agentic Systems, LLM Pipelines`
**Meta description:** `Siddharth Singh is an AI backend engineer in India building agentic
LLM systems — RAG pipelines, tool-calling runtimes, and local inference. Creator of
Prospect, an autonomous job-prospecting engine.`

### Hero *(angle confirmed: named-system lead)*

> **SIDDHARTH SINGH**
>
> # I build systems that work while you sleep.
>
> AI backend engineer — agentic pipelines, LLM orchestration, local inference.
> Creator of **Prospect**, an autonomous job-prospecting engine that reads the
> morning papers before I wake up.
>
> **[ Email me ]** **[ Resume ↓ ]**
>
> <sub>Noida, India · open to remote worldwide</sub>

### Section: Prospect (flagship teaser → /prospect)

> **SYSTEM / 01 — PROSPECT**
>
> ## An autonomous job-prospecting engine.
>
> Every morning, Prospect scans newspapers with OCR, extracts job postings with
> LLMs, matches them against persona-scoped resumes with semantic search, and
> delivers ranked alerts to Telegram. A multi-agent system — scanner, context
> engine, generation runtime, tracker — built and run on my own hardware.
>
> Pipeline: `SCAN → EXTRACT → EMBED → MATCH → GENERATE → DELIVER`
>
> **[ Read the system breakdown → ]**

### Section: Travel Planner (flagship teaser → /travel-planner)

> **SYSTEM / 02 — TRAVEL PLANNER AGENT**
>
> ## An agent that survives its own failures.
>
> An agentic AI travel planner with a deterministic memory layer, a custom model
> router, and an async circuit breaker — when cloud APIs degrade, it falls back
> to local Ollama inference and keeps streaming. Deployed on a k3s multi-node
> cluster with full Prometheus/Grafana observability.
>
> **[ Read the system breakdown → ]**

### Section: Project grid *(set confirmed: 4 cards)*

Heading: **`More systems, shipped and documented`**
Sub-line: *Live data from GitHub — stars and last-push are fetched, not typed.*

1. **Sindhey Pathology** — Production healthcare booking platform: payments,
   OTP auth, DPDP-compliant erasure. Live at sindheypathology.com. — `SHIPPED · CLIENT WORK`
2. **Autonomous Firefighting Robot** — 25–28 kg tracked robot that finds and
   extinguishes fires: FPGA-deployed CNN, multi-sensor fusion. Published in
   IJFMR 2024. — `HARDWARE · PUBLISHED`
3. **MTK Firmware Unlock** — Python toolchain for MediaTek bootloader unlock,
   firmware extraction, and root — security research. — `SYSTEMS · SECURITY`
4. **TrueNAS ZFS Recovery Lab** — Deliberately destroyed a RAID-Z array, then
   recovered it with CLI and forensic tooling. — `STORAGE · FORENSICS`

### Section: Experience timeline

Heading: **`Where the systems shipped`**

- **2026 — now · Lead Full-Stack Engineer, Sindhey Pathology** — Took a
  diagnostic lab from zero to a live booking platform **in six weeks**:
  Next.js 16, Supabase, Cashfree payments, WhatsApp notifications, Playwright e2e.
- **2026 — now · AI Backend Developer, LLM Travel Planner** — Agent memory,
  model routing, circuit breaking, SSE streaming, local-inference fallback.
- **2026 · Lead Developer (contract), Play-School Management Platform** —
  Multi-stage admissions pipeline CRM, UPI payments, parent daily-diary with
  real-time notifications.
- **2023–24 · Lead Developer, Autonomous Firefighting Robot** — FPGA + Arduino
  master-slave architecture, CNN flame verification, sub-100ms deterministic
  response, autonomous navigation.

### Section: Publication & open source

Heading: **`Verifiable elsewhere`**

- Peer-reviewed: *Autonomous Firefighting Vehicle*, IJFMR 2024 → link.
- Open source: added llama.cpp and NVIDIA NIM provider support to
  `interviewstreet/hiring-agent` → PR link.
- GitHub: **`{N00}+ contributions in the last year`** → profile link.
  *(Build-time computed, ballparked down to nearest hundred; rendered with
  DecryptedText for a live decode-in effect.)*

### Section: Skills

Heading: **`Stack`**
*(AI/Backend row visually dominant. Additions below the line are evidenced in
Sid's resume dataset/projects — Sid prunes at final review.)*

- **AI / Backend** — Python · FastAPI · LangGraph · LangChain · LLM tool calling ·
  RAG pipelines · Ollama · llama.cpp · Pydantic · Node.js
- **ML / CV** — PyTorch · OpenCV · OCR & layout detection · CNN training ·
  Stable Diffusion / LoRA inference
- **Frontend** — Next.js · React · TypeScript · Tailwind · Zustand · Three.js
- **Data** — PostgreSQL · Redis · MongoDB · Pinecone · ChromaDB · FAISS · SQLite
- **Systems / Ops** — Linux · Docker · k3s · AWS · GCP · Prometheus/Grafana ·
  ZFS · CI/CD
- **Embedded** — C++ · ESP32 · Arduino · FPGA (Xilinx) · I2C/SPI/UART · BLE

### Section: Contact footer

> ## The next system could be yours.
>
> I'm open to AI backend roles — India or remote, full-time or contract.
> Email gets answered fastest.
>
> **[ siddharthsingh8418@gmail.com ]** **[ Resume ↓ ]**
> GitHub · LinkedIn

---

## PAGE: `/prospect`

**Title tag:** `Prospect — an autonomous job-prospecting engine | Siddharth Singh`
**Meta description:** `A multi-agent LLM system that scans newspapers with OCR, matches
jobs with RAG and semantic search, and delivers ranked alerts to Telegram. LangGraph
state machine, FAISS persona embeddings, local inference. By Siddharth Singh.`
**SEO targets:** "autonomous job discovery", "LangGraph state machine", "OCR LLM
pipeline", "RAG resume matching", + name.

### Hero

> **PROSPECT** · `SYSTEM / LIVE — IN ACTIVE DEVELOPMENT`
>
> # It reads the morning papers before I wake up.
>
> Prospect is an autonomous job-prospecting engine: a multi-agent system that
> discovers job postings, matches them against persona-scoped resumes, and
> delivers ranked alerts — end to end, without me touching it.

### Section: Why it exists

> Job hunting is a pipeline problem. Postings are scattered across newspapers,
> boards, and feeds; matching them against a resume is retrieval; tailoring an
> application is generation. So I built it as a pipeline: OCR at the front,
> RAG in the middle, Telegram at the end.

### Section: Architecture (diagram + component board)

Intro line: *Five components. Each is honest about its state.*

| Component | Role | Status | Code |
|---|---|---|---|
| **smart-job-scanner-v2** | 11-stage OCR + LLM extraction pipeline; chews through 15–20 GB of newspaper PDFs daily; semantic matching; Telegram delivery | `RUNNING LOCAL` | GitHub → |
| **merlin-cli / bridge** | Tool-calling runtime executing sandboxed local commands from LLM decisions; generation engine | `RUNNING LOCAL` | private |
| **persona-context-engine** | FAISS embeddings strict-mapping projects to three base resumes — no context bleeding between personas | `RESEARCH` | private |
| **job-discovery-engine** | LangGraph state machine orchestrating discovery; NVIDIA NIM integration | `IN DEVELOPMENT` | private |
| **jobboard-api** | Django REST + Postgres + Redis application tracker | `SHIPPED` | GitHub → |

Status legend (verbatim on page): *`SHIPPED` — running and done. `RUNNING LOCAL` —
battle-tested on my hardware, not published. `IN DEVELOPMENT` — being built now.
`RESEARCH` — proven in experiments, not integrated. Private components are
described here and available on request.*

### Section: Proof

- Screenshot: Telegram alert arriving with ranked matches. `[Sid captures]`
- Screenshot/recording: pipeline run — pages OCR'd, blocks extracted. `[Sid captures]`
- Architecture diagram (drawn for this page).

### Section: What I'd tell another engineer (honest notes)

> Parts of this system are boring on purpose — the Telegram bot and the
> multi-key Gemini client are legacy code transplanted from v1 because they
> never failed. Parts are hard — stealth crawling and LaTeX-safe generation are
> still in development, and I say so above. A system that reports its own state
> honestly is the point.

### CTA footer

> Want this kind of pipeline thinking on your team?
> **[ Email me ]** **[ Resume ↓ ]** · Next: **[ Travel Planner Agent → ]**

---

## PAGE: `/travel-planner`

**Title tag:** `Travel Planner Agent — agentic AI with failure-proof inference | Siddharth Singh`
**Meta description:** `An agentic AI travel planner: deterministic memory, custom model
router, async circuit breaker with local Ollama fallback, SSE streaming, deployed on
k3s with Prometheus/Grafana. By Siddharth Singh.`
**SEO targets:** "agentic AI", "LLM circuit breaker", "Ollama fallback", "model
router", "SSE streaming agent", + name.

### Hero

> **TRAVEL PLANNER AGENT** · `SHIPPED — OPEN SOURCE`
>
> # An agent that survives its own failures.
>
> Cloud LLM APIs degrade. Rate limits hit. This agent keeps planning anyway —
> a custom model router and an async circuit breaker fall back to local Ollama
> inference mid-conversation, and the user keeps streaming.

### Section: The interesting problems

1. **Deterministic memory** — agent state that replays identically, so a
   multi-step plan can be debugged like code, not vibes.
2. **Model routing** — requests scored and routed across providers by
   preference, cost, and health.
3. **Failure as a first-class state** — the async circuit breaker detects API
   degradation and reroutes to local inference without dropping the SSE stream.
4. **Human-in-the-loop booking** — the agent plans; a human approves the spend.

### Section: Infrastructure

> Runs on a k3s multi-node cluster with a full Prometheus/Grafana observability
> stack — because an agent you can't observe is an agent you can't trust.
> FastAPI backend, Streamlit front, retrieval pipeline behind it.

### Section: Proof

- Code: `github.com/Siddharthsinghkumar/ai-travel-planner-agent`
- Screenshot: Grafana dashboards during a planning session. `[Sid captures]`
- Screenshot/recording: SSE stream surviving a forced provider failure. `[Sid captures]`
- Architecture diagram (drawn for this page).

### CTA footer

> This is how I build agents: observable, degradable, honest.
> **[ Email me ]** **[ Resume ↓ ]** · Next: **[ Prospect → ]**

---

## PAGE: `/404`

> **`404 — NO SIGNAL`**
>
> This route doesn't exist. I have five pages — how did you end up here?
> The systems that do exist:
> *(smirk line added by Sid, 2026-07-13; five = /, prospect, travel-planner, projects, knowme)*
>
> [ Home ] [ Prospect ] [ Travel Planner ]
>
> Or skip the browsing: **[ Email me ]**

---

## Resolved decisions (log)

- Hero angle: **named-system lead** (Sid, 2026-07-04).
- Grid: **4 cards** — Sindhey, Firefighting Robot, MTK Unlock, TrueNAS ZFS.
- Claims V1–V8: resolved per register at top of file.
- Contributions counter: build-time computed, "N00+" ballpark, DecryptedText render.
- Mobile nav (m7 F1, 2026-07-15): hamburger button aria-labels `"Menu"` / `"Close"` registered here; panel links use existing page labels verbatim.

## PAGE: `/knowme`

**Copy registered from KnowMeClient.tsx (2026-07-07):**

### Bio
> I'm Siddharth — an AI backend engineer in Noida. I build agentic systems that keep working when no one's watching: pipelines that read, match, and deliver on their own schedule, and agents that survive their own failures. Before that I led the build of an autonomous firefighting robot, and took a healthcare platform from zero to production in six weeks. I like honest status labels, observable systems, and tools that earn their place. The card is real — drag it.

### Buttons
- `siddharthsingh8418@gmail.com` (mailto link)
- `Resume ↓` (PDF link)
- GitHub (external link)
- LinkedIn (external link)

### CTA footer (T4.5.4 — Want your own version)
- Prospect page mailto: `siddharthsingh8418@gmail.com?subject=Prospect%20System%20Inquiry`
- Travel Planner page mailto: `siddharthsingh8418@gmail.com?subject=Travel%20Planner%20Agent%20Inquiry`

### Claims verification
- "six weeks" — already verified in claims register V5.
- "firefighting robot" — already verified in claims register V4.
- Remaining bio claims (Noida, agentic systems, pipelines, healthcare platform) consistent with CONTEXT.md §3 identities.

## Open items

1. **Sid's final read-through of this file** before build.
2. **Resume PDF**: export AI-Backend resume; fix the "6 months" → six-weeks claim
   so resume and site agree.
3. **Skills prune**: Sid removes anything he doesn't want from the ML/CV additions.
4. **Screenshots**: Sid captures the `[Sid captures]` items before or during build.
5. **Brand kit**: none exists in the folder → DESIGN.md phase opens with this question.
6. Build note for DESIGN phase: Sid wants the **ui-ux-pro-max** skill
   (`nextlevelbuilder/ui-ux-pro-max-skill`) used as the design-system generator,
   alongside the reference teardowns and research papers. Premium bar (binding):
   **"looks like a $10,000 commission."**
