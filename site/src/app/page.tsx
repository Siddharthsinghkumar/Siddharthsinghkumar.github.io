import type { Metadata } from "next";
import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import TimelineEntry from "@/components/TimelineEntry";
import SkillsRow from "@/components/SkillsRow";
import JsonLd from "@/components/JsonLd";
import ContributionsDisplay from "@/components/ContributionsDisplay";
import CssHeroAtmosphere from "@/components/CssHeroAtmosphere";
import PaperInkLoader from "@/components/PaperInkLoader";
import EngineLoader from "@/components/engine/EngineLoader";
import GridBackdrop from "@/components/GridBackdrop";
import ChoreoReveal, { CascadeRows } from "@/components/ChoreoReveal";
import contributions from "@/data/contributions.json";

export const metadata: Metadata = {
  title: "Siddharth Singh — AI Backend Engineer · Agentic Systems, LLM Pipelines",
  description:
    "Siddharth Singh is an AI backend engineer in India building agentic LLM systems — RAG pipelines, tool-calling runtimes, and local inference. Creator of Prospect, an autonomous job-prospecting engine.",
  openGraph: {
    title: "Siddharth Singh — AI Backend Engineer",
    description:
      "AI backend engineer building agentic LLM systems — RAG pipelines, tool-calling runtimes, and local inference.",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd />
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-4 overflow-hidden">
        <CssHeroAtmosphere />
        <PaperInkLoader />
        <EngineLoader />
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(17 100% 55% / 0.06), transparent)",
          }}
        />

        <div className="mx-auto max-w-[1200px] w-full">
          <ChoreoReveal variant="hero-item" heroIndex={0}>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-4">
              SIDDHARTH SINGH
            </p>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={1}>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-8">
              I build systems that work while you sleep.
            </h1>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={2}>
            <p className="text-[--muted] text-lg max-w-[68ch] mb-2">
              AI backend engineer — agentic pipelines, LLM orchestration, local
              inference. Creator of{" "}
              <strong className="text-[--text] font-medium">Prospect</strong>, an
              autonomous job-prospecting engine that reads the morning papers
              before I wake up.
            </p>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={3}>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button href="mailto:siddharthsingh8418@gmail.com">
                Email me
              </Button>
              <Button variant="ghost" href="/resume-siddharth-singh.pdf">
                Resume ↓
              </Button>
            </div>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={4}>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--line] mt-6">
              Noida, India · open to remote worldwide
            </p>
          </ChoreoReveal>
        </div>
      </section>

      {/* ── Prospect Teaser ─────────────────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>SYSTEM / 01 — PROSPECT</Eyebrow>
        <ChoreoReveal variant="heading">
          <h2 className="font-display text-[clamp(1.953rem,4vw,2.441rem)] leading-tight text-[--text] mb-4">
            An autonomous job-prospecting engine.
          </h2>
        </ChoreoReveal>
        <p className="text-[--muted] max-w-[68ch] mb-4">
          Every morning, Prospect scans newspapers with OCR, extracts job
          postings with LLMs, matches them against persona-scoped resumes with
          semantic search, and delivers ranked alerts to Telegram. A multi-agent
          system — scanner, context engine, generation runtime, tracker — built
          and run on my own hardware.
        </p>
        <p className="font-mono text-[13px] tracking-[0.04em] text-[--accent] mb-6">
          SCAN → EXTRACT → EMBED → MATCH → GENERATE → DELIVER
        </p>
        <Button variant="ghost" href="/prospect">
          Read the system breakdown →
        </Button>
      </Section>

      {/* ── Travel Planner Teaser ────────────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>SYSTEM / 02 — TRAVEL PLANNER AGENT</Eyebrow>
        <ChoreoReveal variant="heading">
          <h2 className="font-display text-[clamp(1.953rem,4vw,2.441rem)] leading-tight text-[--text] mb-4">
            An agent that survives its own failures.
          </h2>
        </ChoreoReveal>
        <p className="text-[--muted] max-w-[68ch] mb-6">
          An agentic AI travel planner with a deterministic memory layer, a
          custom model router, and an async circuit breaker — when cloud APIs
          degrade, it falls back to local Ollama inference and keeps streaming.
          Deployed on a k3s multi-node cluster with full Prometheus/Grafana
          observability.
        </p>
        <Button variant="ghost" href="/travel-planner">
          Read the system breakdown →
        </Button>
      </Section>

      {/* ── Project Grid ────────────────────────────────────── */}
      <Section className="border-t border-[--line] relative overflow-hidden">
        <GridBackdrop />
        <div className="relative z-[1]">
          <Eyebrow>More systems, shipped and documented</Eyebrow>
          <p className="text-[--muted] text-sm mb-8">
            Live data from GitHub — stars and last-push are fetched, not typed.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <ProjectCard
              title="Sindhey Pathology"
              description="Production healthcare booking platform: payments, OTP auth, DPDP-compliant erasure. Live at sindheypathology.com."
              status="SHIPPED · CLIENT WORK"
              href="https://www.sindheypathology.com"
            />
            <ProjectCard
              title="Autonomous Firefighting Robot"
              description="25–28 kg tracked robot that finds and extinguishes fires: FPGA-deployed CNN, multi-sensor fusion. Published in IJFMR 2024."
              status="HARDWARE · PUBLISHED"
              href="https://github.com/Siddharthsinghkumar/autonomous-firefighting-robot"
              repo="autonomous-firefighting-robot"
              fallbackStars={2}
              fallbackPush=""
            />
            <ProjectCard
              title="MTK Firmware Unlock"
              description="Python toolchain for MediaTek bootloader unlock, firmware extraction, and root — security research."
              status="SYSTEMS · SECURITY"
              href="https://github.com/Siddharthsinghkumar/mtk-firmware-unlock"
              repo="mtk-firmware-unlock"
              fallbackStars={8}
              fallbackPush=""
            />
            <ProjectCard
              title="TrueNAS ZFS Recovery Lab"
              description="Deliberately destroyed a RAID-Z array, then recovered it with CLI and forensic tooling."
              status="STORAGE · FORENSICS"
              href="https://github.com/Siddharthsinghkumar/truenas-zfs-recovery-lab"
              repo="truenas-zfs-recovery-lab"
              fallbackStars={3}
              fallbackPush=""
            />
          </div>
        </div>
      </Section>

      {/* ── Experience Timeline ──────────────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Where the systems shipped</Eyebrow>

        <CascadeRows staggerMs={40}>
          <div className="mt-8 max-w-[720px]">
            <TimelineEntry period="2026 – now" role="Lead Full-Stack Engineer, Sindhey Pathology">
              Took a diagnostic lab from zero to a live booking platform{" "}
              <strong className="font-medium text-[--text]">in six weeks</strong>:
              Next.js 16, Supabase, Cashfree payments, WhatsApp notifications,
              Playwright e2e.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2026 – now" role="AI Backend Developer, LLM Travel Planner">
              Agent memory, model routing, circuit breaking, SSE streaming,
              local-inference fallback.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2026" role="Lead Developer (contract), Play-School Management Platform">
              Multi-stage admissions pipeline CRM, UPI payments, parent daily-diary
              with real-time notifications.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2023–24" role="Lead Developer, Autonomous Firefighting Robot">
              FPGA + Arduino master-slave architecture, CNN flame verification,
              sub-100ms deterministic response, autonomous navigation.
            </TimelineEntry>
          </div>
        </CascadeRows>
      </Section>

      {/* ── Publication & Open Source ───────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Verifiable elsewhere</Eyebrow>

        <div className="space-y-4 max-w-[68ch]">
          <p className="text-[--text]">
            Peer-reviewed:{" "}
            <em>
              <a
                href="https://www.ijfmr.com/research-paper.php?id=32630"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--accent] hover:underline"
              >
                Autonomous Firefighting Vehicle
              </a>
            </em>
            , IJFMR 2024.
          </p>
          <p className="text-[--text]">
            Open source: added llama.cpp and NVIDIA NIM provider support to{" "}
            <a
              href="https://github.com/interviewstreet/hiring-agent/pulls?q=is%3Apr+author%3ASiddharthsinghkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[--accent] hover:underline"
            >
              interviewstreet/hiring-agent
            </a>
            .
          </p>
          <p className="text-[--text]">
            GitHub:{" "}
            <ContributionsDisplay
              display={contributions.display}
              fallback={!contributions.display}
            />
          </p>
        </div>
      </Section>

      {/* ── Skills ──────────────────────────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Stack</Eyebrow>

        <div className="grid md:grid-cols-2 gap-8">
          <SkillsRow
            dominant
            label="AI / Backend"
            skills="Python · FastAPI · LangGraph · LangChain · LLM tool calling · RAG pipelines · Ollama · llama.cpp · Pydantic · Node.js"
          />
          <SkillsRow
            label="ML / CV"
            skills="PyTorch · OpenCV · OCR &amp; layout detection · CNN training · Stable Diffusion / LoRA inference"
          />
          <SkillsRow
            label="Frontend"
            skills="Next.js · React · TypeScript · Tailwind · Zustand · Three.js"
          />
          <SkillsRow
            label="Data"
            skills="PostgreSQL · Redis · MongoDB · Pinecone · ChromaDB · FAISS · SQLite"
          />
          <SkillsRow
            label="Systems / Ops"
            skills="Linux · Docker · k3s · AWS · GCP · Prometheus/Grafana · ZFS · CI/CD"
          />
          <SkillsRow
            label="Embedded"
            skills="C++ · ESP32 · Arduino · FPGA (Xilinx) · I2C/SPI/UART · BLE"
          />
        </div>
      </Section>

      {/* ── Contact (inline CTA before footer) ──────────────── */}
      <Section className="border-t border-[--line]">
        <h2 className="font-display text-[clamp(1.953rem,4vw,2.441rem)] leading-tight text-[--text] mb-4">
          The next system could be yours.
        </h2>
        <p className="text-[--muted] max-w-[68ch] mb-8">
          I&rsquo;m open to AI backend roles — India or remote, full-time or
          contract. Email gets answered fastest.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="mailto:siddharthsingh8418@gmail.com">
            siddharthsingh8418@gmail.com
          </Button>
          <Button variant="ghost" href="/resume-siddharth-singh.pdf">
            Resume ↓
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-[--muted]">
          <a
            href="https://github.com/Siddharthsinghkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/siddharth-singh-735340296"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </Section>
    </>
  );
}
