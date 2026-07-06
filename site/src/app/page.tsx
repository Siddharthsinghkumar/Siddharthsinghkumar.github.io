import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import TimelineEntry from "@/components/TimelineEntry";
import SkillsRow from "@/components/SkillsRow";
import JsonLd from "@/components/JsonLd";
import ContributionsDisplay from "@/components/ContributionsDisplay";
import CssHeroAtmosphere from "@/components/CssHeroAtmosphere";
import PageBackground from "@/components/PageBackground";
import EngineLoader from "@/components/engine/EngineLoader";
import IntroScreen from "@/components/IntroScreen";
import TextPressure, { TEXTPRESSURE_ENABLED } from "@/components/TextPressure";
import ChoreoReveal, { CascadeRows } from "@/components/ChoreoReveal";
import StatusPill from "@/components/StatusPill";
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
      <IntroScreen />
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-4 overflow-hidden z-10">
        <PageBackground image="/test/pic_idea.png" />
        <CssHeroAtmosphere />
        <EngineLoader />
        {/* F8: radial scrim behind hero text — ≤30% darkening for legibility */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            left: 0, top: "10%", width: "55%", height: "80%",
            background: "radial-gradient(ellipse at 30% 50%, rgba(11,11,13,0.28), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(17 100% 55% / 0.06), transparent)",
          }}
        />

        <div className="mx-auto max-w-[1200px] w-full relative z-[1]">
          <ChoreoReveal variant="hero-item" heroIndex={0}>
            <Link
              href="/"
              aria-label="Siddharth Singh — AI Backend Engineer"
              className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[--accent] focus-visible:outline-offset-4"
              style={{ color: "inherit", textDecoration: "none" }}
            >
            {TEXTPRESSURE_ENABLED ? (
              <div className="mb-6">
                <TextPressure text="SIDDHARTH SINGH" className="text-[--text]" />
              </div>
            ) : (
              <p className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-[-0.02em] text-[--text] mb-6" aria-label="SIDDHARTH SINGH">
                SIDDHARTH SINGH
              </p>
            )}
            </Link>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={1}>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-8">
              I build systems that work while you sleep.
            </h1>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={2}>
            <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] mb-2">
              AI backend engineer — agentic pipelines, LLM orchestration, local
              inference. Creator of{" "}
              <strong className="text-[--text] font-medium">Prospect</strong>, an
              autonomous job-prospecting engine that reads the morning papers
              before I wake up.
            </p>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={3}>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] mt-6 mb-6">
              11-STAGE PIPELINE · 15–20 GB SCANNED DAILY · RUNS ON MY OWN HARDWARE
            </p>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={4}>
            <div className="flex flex-wrap gap-3">
              <Button href="mailto:siddharthsingh8418@gmail.com" className="border-white text-white border-2">
                Email me
              </Button>
              <Button variant="ghost" href="/resume-siddharth-singh.pdf" className="border-white text-white border-2 bg-white/10">
                Resume ↓
              </Button>
            </div>
          </ChoreoReveal>
          <ChoreoReveal variant="hero-item" heroIndex={5}>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--line] mt-6">
              Noida, India · open to remote worldwide
            </p>
          </ChoreoReveal>
        </div>
      </section>

      {/* ── Prospect Teaser (RICHER per F11/F21) ─────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>SYSTEM / 01 — PROSPECT</Eyebrow>
        <ChoreoReveal variant="heading">
          <h2 className="font-display text-[clamp(1.953rem,4vw,2.441rem)] leading-tight text-[--text] mb-4">
            An autonomous job-prospecting engine.
          </h2>
        </ChoreoReveal>
        <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] mb-4">
          Every morning, Prospect scans newspapers with OCR, extracts job
          postings with LLMs, matches them against persona-scoped resumes with
          semantic search, and delivers ranked alerts to Telegram. A multi-agent
          system — scanner, context engine, generation runtime, tracker — built
          and run on my own hardware.
        </p>
        <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] mb-6">
          No job boards, no third-party crawlers. Prospect reads the same
          newspapers a human would — then does the part humans skip. It OCRs
          every page, extracts each posting with an LLM, embeds and scores it
          against persona-scoped resumes, and writes the ranked shortlist to my
          phone. Eleven stages, running unattended on hardware I own.
        </p>
        <p className="font-mono text-[13px] tracking-[0.04em] text-[--accent] mb-4">
          SCAN → EXTRACT → EMBED → MATCH → GENERATE → DELIVER
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <StatusPill status="RUNNING LOCAL" />
          <StatusPill status="IN DEVELOPMENT" />
          <StatusPill status="RESEARCH" />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-6 flex flex-wrap gap-4">
          <span>11 STAGES</span>
          <span className="text-[--line]">·</span>
          <span>15–20 GB / DAY</span>
          <span className="text-[--line]">·</span>
          <span>5 COMPONENTS</span>
        </div>
        <Button variant="ghost" href="/prospect" className="border-white text-white border-2 bg-white/10 z-10 relative">
          Read the system breakdown →
        </Button>
      </Section>

      {/* ── Travel Planner Teaser (RICHER per F11/F21) ────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>SYSTEM / 02 — TRAVEL PLANNER AGENT</Eyebrow>
        <ChoreoReveal variant="heading">
          <h2 className="font-display text-[clamp(1.953rem,4vw,2.441rem)] leading-tight text-[--text] mb-4">
            An agent that survives its own failures.
          </h2>
        </ChoreoReveal>
        <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] mb-4">
          An agentic AI travel planner with a deterministic memory layer, a
          custom model router, and an async circuit breaker — when cloud APIs
          degrade, it falls back to local Ollama inference and keeps streaming.
          Deployed on a k3s multi-node cluster with full Prometheus/Grafana
          observability.
        </p>
        <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] mb-6">
          Cloud APIs degrade. Rate limits hit. This agent is built for that
          moment: a deterministic memory layer so retries never repeat work, a
          router that picks the right model per task, and an async circuit
          breaker that swaps to local Ollama inference mid-stream — the response
          never stops. Deployed on a k3s multi-node cluster with Prometheus and
          Grafana watching every request.
        </p>
        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-6 flex flex-wrap gap-4">
          <span>K3S MULTI-NODE</span>
          <span className="text-[--line]">·</span>
          <span>CIRCUIT BREAKER</span>
          <span className="text-[--line]">·</span>
          <span>SSE STREAMING</span>
        </div>
        <Button variant="ghost" href="/travel-planner" className="border-white text-white border-2 bg-white/10 z-10 relative">
          Read the system breakdown →
        </Button>
      </Section>


      {/* ── Experience Timeline ──────────────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Where the systems shipped</Eyebrow>

        <CascadeRows staggerMs={40}>
          <div className="mt-8 max-w-[720px]">
            <TimelineEntry period="2026 – now" role="Lead Full-Stack Engineer, Sindhey Pathology" href="https://www.sindheypathology.com">
              Took a diagnostic lab from zero to a live booking platform{" "}
              <strong className="font-medium text-[--text]">in six weeks</strong>:
              Next.js 16, Supabase, Cashfree payments, WhatsApp notifications,
              Playwright e2e.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2026 – now" role="AI Backend Developer, LLM Travel Planner" href="/travel-planner">
              Agent memory, model routing, circuit breaking, SSE streaming,
              local-inference fallback.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2026" role="Lead Developer (contract), Play-School Management Platform" href="/projects">
              Multi-stage admissions pipeline CRM, UPI payments, parent daily-diary
              with real-time notifications.
            </TimelineEntry>
          </div>
          <div>
            <TimelineEntry period="2023–24" role="Lead Developer, Autonomous Firefighting Robot" href="https://github.com/Siddharthsinghkumar/ai-travel-planner-agent">
              FPGA + Arduino master-slave architecture, CNN flame verification,
              sub-100ms deterministic response, autonomous navigation.
            </TimelineEntry>
          </div>
        </CascadeRows>
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

      {/* ── Publication & Open Source ───────────────────────── */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Verifiable elsewhere</Eyebrow>

        <div className="space-y-4 max-w-[68ch]">
          <p className="text-[--text] text-[clamp(1rem,2vw,1.25rem)]">
            Peer-reviewed:{" "}
            <em>
              <a
                href="https://www.ijfmr.com/research-paper.php?id=32630"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--accent] hover:underline link-pulse-hover link-pulse-auto"
              >
                Autonomous Firefighting Vehicle
              </a>
            </em>
            , IJFMR 2024.
          </p>
          <p className="text-[--text] text-[clamp(1rem,2vw,1.25rem)]">
            Open source: added llama.cpp and NVIDIA NIM provider support to{" "}
            <a
              href="https://github.com/interviewstreet/hiring-agent/pulls?q=is%3Apr+author%3ASiddharthsinghkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[--accent] hover:underline link-pulse-hover link-pulse-auto"
            >
              interviewstreet/hiring-agent
            </a>
            .
          </p>
          <p className="text-[--text] text-[clamp(1rem,2vw,1.25rem)]">
            GitHub:{" "}
            <ContributionsDisplay
              display={contributions.display}
              fallback={!contributions.display}
            />
          </p>
        </div>
      </Section>

      {/* ── Contact (inline CTA before footer) ──────────────── */}
      <Section className="border-t border-[--line]">
        <Button variant="ghost" href="/knowme" className="border-white text-white border-2 bg-white/10 z-10 relative">
          Know Me →
        </Button>
      </Section>
    </>
  );
}
