import type { Metadata } from "next";
import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import StatusPill from "@/components/StatusPill";
import ProspectDiagram from "@/components/ProspectDiagram";
import DecryptedText from "@/components/DecryptedText";
import PaperInkLoader from "@/components/PaperInkLoader";
import ChoreoReveal from "@/components/ChoreoReveal";
import ScreenshotFrame from "@/components/ScreenshotFrame";

export const metadata: Metadata = {
  title: "Prospect — an autonomous job-prospecting engine",
  description:
    "A multi-agent LLM system that scans newspapers with OCR, matches jobs with RAG and semantic search, and delivers ranked alerts to Telegram. LangGraph state machine, FAISS persona embeddings, local inference. By Siddharth Singh.",
  openGraph: {
    title: "Prospect — an autonomous job-prospecting engine",
    description:
      "A multi-agent LLM system that scans newspapers with OCR, matches jobs with RAG and semantic search, and delivers ranked alerts to Telegram.",
    images: [{ url: "/og/prospect.png", width: 1200, height: 630 }],
  },
};

const components = [
  {
    name: "smart-job-scanner-v2",
    role: "11-stage OCR + LLM extraction pipeline; chews through 15–20 GB of newspaper PDFs daily; semantic matching; Telegram delivery",
    status: "RUNNING LOCAL" as const,
    code: "https://github.com/Siddharthsinghkumar/smart-job-scanner-v2",
  },
  {
    name: "merlin-cli / bridge",
    role: "Tool-calling runtime executing sandboxed local commands from LLM decisions; generation engine",
    status: "RUNNING LOCAL" as const,
    code: null,
  },
  {
    name: "persona-context-engine",
    role: "FAISS embeddings strict-mapping projects to three base resumes — no context bleeding between personas",
    status: "RESEARCH" as const,
    code: null,
  },
  {
    name: "job-discovery-engine",
    role: "LangGraph state machine orchestrating discovery; NVIDIA NIM integration",
    status: "IN DEVELOPMENT" as const,
    code: null,
  },
  {
    name: "jobboard-api",
    role: "Django REST + Postgres + Redis application tracker",
    status: "SHIPPED" as const,
    code: "https://github.com/Siddharthsinghkumar/jobboard-api",
  },
];

export default function ProspectPage() {
  return (
    <>
      <Section className="pt-[calc(4rem+96px)] relative overflow-hidden min-h-[75svh] flex flex-col justify-center">
        <PaperInkLoader />
        <ChoreoReveal variant="hero-item" heroIndex={0}>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] mb-3 relative z-10">
            <DecryptedText
              text="PROSPECT · SYSTEM / LIVE — IN ACTIVE DEVELOPMENT"
              animateOn="view"
              speed={35}
              maxIterations={6}
              sequential={true}
              revealDirection="start"
              className="text-[--muted]"
              encryptedClassName="text-[--line]"
              parentClassName="font-mono tracking-[0.08em] uppercase"
            />
          </p>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={1}>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-6 relative z-10">
            It reads the morning papers before I wake up.
          </h1>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={2}>
          <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] max-w-[60ch] relative z-10 mb-8">
            Prospect is an autonomous job-prospecting engine: a multi-agent system
            that discovers job postings, matches them against persona-scoped resumes,
            and delivers ranked alerts — end to end, without me touching it.
          </p>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={3}>
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] relative z-10 flex flex-wrap gap-4 mt-4">
            <span>11 STAGES</span>
            <span className="text-[--line]">·</span>
            <span>15–20 GB / DAY</span>
            <span className="text-[--line]">·</span>
            <span>RUNNING LOCAL</span>
          </div>
        </ChoreoReveal>
      </Section>

      <Section className="border-t border-[--line]">
        <h2 className="font-display text-[clamp(1.563rem,3vw,1.953rem)] leading-tight text-[--text] mb-4">
          Why it exists
        </h2>
        <p className="text-[--muted] max-w-[68ch]">
          Job hunting is a pipeline problem. Postings are scattered across
          newspapers, boards, and feeds; matching them against a resume is
          retrieval; tailoring an application is generation. So I built it as a
          pipeline: OCR at the front, RAG in the middle, Telegram at the end.
        </p>
      </Section>

      <Section className="border-t border-[--line]">
        <Eyebrow>Architecture</Eyebrow>
        <div className="overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-[--accent]" tabIndex={0} role="region" aria-label="Architecture diagram (scrollable)">
          <div className="min-w-[720px]">
            <ProspectDiagram />
          </div>
        </div>
      </Section>

      <Section className="border-t border-[--line]">
        <p className="text-[--muted] text-sm mb-8">
          Five components. Each is honest about its state.
        </p>

        <div className="space-y-0">
          {components.map(({ name, role, status, code }) => (
            <div
              key={name}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 px-2 border-b border-[--line] hover:bg-[--surface] hover:border-[--accent]/20 transition-all duration-[--dur-fast] hover:translate-x-1"
            >
              <p className="font-mono text-[13px] font-semibold text-[--text] sm:w-[220px] shrink-0">
                {name}
              </p>
              <p className="text-[--muted] text-sm flex-1">{role}</p>
              <StatusPill status={status} className="sm:w-[160px] shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] sm:w-[90px] shrink-0 text-right">
                {code ? (
                  <a
                    href={code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--accent] hover:underline"
                  >
                    GitHub →
                  </a>
                ) : (
                  <span className="text-[--muted]">PRIVATE</span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-[--r-md] bg-[--surface] border border-[--line] text-sm text-[--muted] space-y-1">
          <p>
            <span className="text-[--ok] font-mono text-[11px] uppercase tracking-[0.08em]">SHIPPED</span> — running and done.
          </p>
          <p>
            <span className="text-[--accent] font-mono text-[11px] uppercase tracking-[0.08em]">RUNNING LOCAL</span> — battle-tested on my hardware, not published.
          </p>
          <p>
            <span className="text-[--warn] font-mono text-[11px] uppercase tracking-[0.08em]">IN DEVELOPMENT</span> — being built now.
          </p>
          <p>
            <span className="text-[--muted] font-mono text-[11px] uppercase tracking-[0.08em]">RESEARCH</span> — proven in experiments, not integrated.
          </p>
          <p>Private components are described here and available on request.</p>
        </div>
      </Section>

      <Section className="border-t border-[--line]">
        <Eyebrow>Proof</Eyebrow>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <ScreenshotFrame
            caption="SCREENSHOT — Sid to capture: Telegram alert arriving with ranked matches"
            placeholder="/placeholders/prospect-telegram.svg"
          />
          <ScreenshotFrame
            caption="SCREENSHOT — Sid to capture: pipeline run — pages OCR'd, blocks extracted"
            placeholder="/placeholders/prospect-pipeline.svg"
          />
        </div>
      </Section>

      <Section className="border-t border-[--line]">
        <Eyebrow>What I&rsquo;d tell another engineer</Eyebrow>
        <p className="text-[--muted] max-w-[68ch]">
          Parts of this system are boring on purpose — the Telegram bot and the
          multi-key Gemini client are legacy code transplanted from v1 because
          they never failed. Parts are hard — stealth crawling and LaTeX-safe
          generation are still in development, and I say so above. A system that
          reports its own state honestly is the point.
        </p>
      </Section>

      <Section className="border-t border-[--line]">
        <p className="text-[--muted] max-w-[68ch] mb-6">
          Want this kind of pipeline thinking on your team?
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Button href="mailto:siddharthsingh8418@gmail.com">
            Email me
          </Button>
          <Button variant="ghost" href="/resume/resume-siddharth-singh.pdf">
            Resume ↓
          </Button>
        </div>
        <div className="flex justify-between items-center gap-4">
          <Button href="mailto:siddharthsingh8418@gmail.com?subject=Prospect%20System%20Inquiry">
            Want your own version?
          </Button>
          <Button variant="ghost" href="/travel-planner">
            Travel Planner Agent →
          </Button>
        </div>
      </Section>
    </>
  );
}
