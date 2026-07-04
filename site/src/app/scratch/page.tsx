import Section from "@/components/Section";
import Eyebrow from "@/components/Eyebrow";
import StatusPill from "@/components/StatusPill";
import Button from "@/components/Button";

export default function ScratchPage() {
  return (
    <>
      {/* Section wrapper demo */}
      <Section>
        <Eyebrow>SYSTEM / PRIMITIVES</Eyebrow>
        <h2 className="font-display text-3xl mb-8">Layout Primitives</h2>
        <p className="text-[--muted] max-w-[68ch] mb-12">
          Every design element from DESIGN.md §4, rendered for visual verification.
          Tab through, hover, active, focus-visible on each interactive element.
        </p>

        {/* Buttons */}
        <Eyebrow>Buttons</Eyebrow>
        <div className="flex flex-wrap gap-4 mb-12">
          <Button>Email me</Button>
          <Button variant="ghost">Resume ↓</Button>
          <Button>siddharthsingh8418@gmail.com</Button>
        </div>

        {/* Status pills — all 5 states + custom */}
        <Eyebrow>Status Pills</Eyebrow>
        <div className="flex flex-wrap gap-4 mb-12">
          <StatusPill status="SHIPPED" />
          <StatusPill status="RUNNING LOCAL" />
          <StatusPill status="IN DEVELOPMENT" />
          <StatusPill status="RESEARCH" />
          <StatusPill status="CONCEPT" />
          <StatusPill status="SHIPPED · CLIENT WORK" />
          <StatusPill status="HARDWARE · PUBLISHED" />
          <StatusPill status="SYSTEMS · SECURITY" />
          <StatusPill status="STORAGE · FORENSICS" />
        </div>

        {/* Typography */}
        <Eyebrow>Typography Scale</Eyebrow>
        <div className="space-y-4 mb-12">
          <h1 className="font-display text-[4.5rem] leading-none">H1 Hero</h1>
          <h2 className="font-display text-[3.052rem] leading-tight">H2 3.052rem</h2>
          <h3 className="font-display text-[2.441rem] leading-tight">H3 2.441rem</h3>
          <h4 className="font-display text-[1.953rem] leading-tight">H4 1.953rem</h4>
          <p className="text-base max-w-[68ch]">
            Body text in Inter at 16px / 1.6 line-height. This paragraph
            demonstrates the max-width of 68ch for comfortable reading on all
            screen sizes. AI backend engineer building agentic LLM systems.
          </p>
          <p className="text-[--muted] text-sm">Small muted text for captions.</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted]">
            Mono label — 11px, uppercase, +8% letter-spacing
          </p>
        </div>

        {/* Nav test: manual at top of page via layout */}
        <Eyebrow>Navigation</Eyebrow>
        <p className="text-[--muted]">
          Nav is rendered globally in layout.tsx — check sticky bar at top. Wordmark
          left, three links + Resume button right. Hover = accent color.
          At 375px: nav fits without hamburger.
        </p>
      </Section>
    </>
  );
}
