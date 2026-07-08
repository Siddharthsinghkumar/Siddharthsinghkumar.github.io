import type { Metadata } from "next";
import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import Button from "@/components/Button";
import TravelPlannerDiagram from "@/components/TravelPlannerDiagram";
import PaperInkLoader from "@/components/PaperInkLoader";
import ChoreoReveal from "@/components/ChoreoReveal";
import PageBackground from "@/components/PageBackground";
import ScreenshotFrame from "@/components/ScreenshotFrame";

export const metadata: Metadata = {
  title: "Travel Planner Agent — agentic AI with failure-proof inference",
  description:
    "An agentic AI travel planner: deterministic memory, custom model router, async circuit breaker with local Ollama fallback, SSE streaming, deployed on k3s with Prometheus/Grafana. By Siddharth Singh.",
  openGraph: {
    title: "Travel Planner Agent — agentic AI with failure-proof inference",
    description:
      "An agentic AI travel planner with deterministic memory, custom model router, and async circuit breaker with local Ollama fallback.",
    images: [{ url: "/og/travel-planner.png", width: 1200, height: 630 }],
  },
};

export default function TravelPlannerPage() {
  return (
    <>
      {/* <PageBackground image="/test/final-df-h.webp" /> Can be restored if visuals require */}
      {/* Hero */}
      <Section className="pt-[calc(4rem+96px)] relative overflow-hidden min-h-[75svh] flex flex-col justify-center">
        <PaperInkLoader />
        <ChoreoReveal variant="hero-item" heroIndex={0}>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-3 relative z-10">
            TRAVEL PLANNER AGENT ·{" "}
            <span className="text-[--ok]">SHIPPED — OPEN SOURCE</span>
          </p>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={1}>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-6 relative z-10">
            An agent that survives its own failures.
          </h1>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={2}>
          <p className="text-[--muted] text-lg max-w-[68ch] relative z-10 mb-8">
            Cloud LLM APIs degrade. Rate limits hit. This agent keeps planning
            anyway — a custom model router and an async circuit breaker fall back
            to local Ollama inference mid-conversation, and the user keeps
            streaming.
          </p>
        </ChoreoReveal>
        <ChoreoReveal variant="hero-item" heroIndex={3}>
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] relative z-10 flex flex-wrap gap-4 mt-4">
            <span>K3S MULTI-NODE</span>
            <span className="text-[--line]">·</span>
            <span>CIRCUIT-BREAKER FALLBACK</span>
            <span className="text-[--line]">·</span>
            <span>SSE STREAMING</span>
          </div>
        </ChoreoReveal>
      </Section>

      {/* Interesting problems */}
      <Section className="border-t border-[--line]">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-8">
          The interesting problems
        </p>

        <div className="space-y-6 max-w-[68ch]">
          {[
            {
              num: "1",
              title: "Deterministic memory",
              body: "Agent state that replays identically, so a multi-step plan can be debugged like code, not vibes.",
            },
            {
              num: "2",
              title: "Model routing",
              body: "Requests scored and routed across providers by preference, cost, and health.",
            },
            {
              num: "3",
              title: "Failure as a first-class state",
              body: "The async circuit breaker detects API degradation and reroutes to local inference without dropping the SSE stream.",
            },
            {
              num: "4",
              title: "Human-in-the-loop booking",
              body: "The agent plans; a human approves the spend.",
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="p-4 rounded-[--r-md] hover:bg-[--surface-2] transition-colors duration-[--dur-fast] border border-transparent hover:border-[--line]">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] mb-1">
                {num}
              </p>
              <h3 className="font-display text-lg text-[--text] mb-1">
                {title}
              </h3>
              <p className="text-[--muted] text-sm">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Infrastructure */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Infrastructure</Eyebrow>
        <p className="text-[--muted] max-w-[68ch] mb-8">
          Runs on a k3s multi-node cluster with a full Prometheus/Grafana
          observability stack — because an agent you can&rsquo;t observe is an
          agent you can&rsquo;t trust. FastAPI backend, Streamlit front,
          retrieval pipeline behind it.
        </p>

        <div className="overflow-x-auto pb-2 focus-visible:outline-2 focus-visible:outline-[--accent]" tabIndex={0} role="region" aria-label="Architecture diagram (scrollable)">
          <div className="min-w-[700px]">
            <TravelPlannerDiagram />
          </div>
        </div>
      </Section>

      {/* Proof */}
      <Section className="border-t border-[--line]">
        <Eyebrow>Proof</Eyebrow>

        <p className="text-[--text] mb-4">
          Code:{" "}
          <a
            href="https://github.com/Siddharthsinghkumar/ai-travel-planner-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[--accent] hover:underline"
          >
            github.com/Siddharthsinghkumar/ai-travel-planner-agent
          </a>
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <ScreenshotFrame
            caption="SCREENSHOT — Sid to capture: Grafana dashboards during a planning session"
            placeholder="/placeholders/travel-grafana.svg"
          />
          <ScreenshotFrame
            caption="SCREENSHOT — Sid to capture: SSE stream surviving a forced provider failure"
            placeholder="/placeholders/travel-sse.svg"
          />
        </div>
      </Section>

      {/* CTA footer */}
      <Section className="border-t border-[--line]">
        <p className="text-[--muted] max-w-[68ch] mb-6">
          This is how I build agents: observable, degradable, honest.
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Button href="mailto:siddharthsingh8418@gmail.com">
            Email me
          </Button>
          <Button variant="ghost" href="/resume-siddharth-singh.pdf">
            Resume ↓
          </Button>
        </div>
        <div className="flex justify-between items-center gap-4">
          <Button href="mailto:siddharthsingh8418@gmail.com?subject=Travel%20Planner%20Agent%20Inquiry">
            Want your own version?
          </Button>
          <Button variant="ghost" href="/prospect">
            Prospect →
          </Button>
        </div>
      </Section>
    </>
  );
}
