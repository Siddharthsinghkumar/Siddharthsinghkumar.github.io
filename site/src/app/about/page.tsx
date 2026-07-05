import type { Metadata } from "next";
import Section from "@/components/Section";
import LanyardLoader from "@/components/LanyardLoader";

export const metadata: Metadata = {
  title: "About | Siddharth Singh",
  description: "AI Backend Engineer — agentic pipelines, LLM orchestration, local inference.",
  openGraph: {
    title: "About | Siddharth Singh",
    description: "AI Backend Engineer — agentic pipelines, LLM orchestration, local inference.",
    images: [{ url: "/og/about.png", width: 1200, height: 630 }],
  },
};

export default function About() {
  const frontImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><rect width='400' height='600' fill='%230B0B0D'/><rect x='0' y='0' width='400' height='100' fill='%23FF5C1A'/><text x='200' y='300' font-family='monospace' font-size='60' font-weight='bold' fill='%23E8E8E8' text-anchor='middle' dominant-baseline='middle'>SS</text><text x='200' y='500' font-family='monospace' font-size='30' fill='%23FF5C1A' text-anchor='middle'>AI BACKEND ENGINEER</text></svg>";
  const backImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><rect width='400' height='600' fill='%230B0B0D'/><rect x='0' y='0' width='400' height='100' fill='%23FF5C1A'/><text x='200' y='300' font-family='monospace' font-size='40' font-weight='bold' fill='%23E8E8E8' text-anchor='middle'>QR CODE HERE</text></svg>";

  return (
    <div className="pt-24 pb-24 min-h-[100svh] relative overflow-hidden">
      {/* Void atmosphere — CSS dust + subtle orange glow (no WebGL, no blur) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04, mixBlendMode: "overlay" as React.CSSProperties["mixBlendMode"] }}>
          <filter id="about-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#about-grain)" />
        </svg>
        <div className="absolute inset-0 blur-[120px]" style={{ background: "radial-gradient(ellipse 60% 40% at 30% 50%, hsl(17 100% 55% / 0.06), transparent)" }} />
        <div className="absolute inset-0 blur-[80px]" style={{ background: "radial-gradient(ellipse 40% 30% at 70% 60%, hsl(17 100% 55% / 0.04), transparent)" }} />
      </div>

      {/* Lanyard card — 3D physics layer */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.8 }}>
        <LanyardLoader frontImage={frontImage} backImage={backImage} />
      </div>

      <Section className="relative z-[2] flex flex-col justify-center min-h-[80svh] px-4">
        <div className="max-w-[60ch] mx-auto">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-6">
            About
          </h1>
          {/* F21 verbatim bio — first person, education excluded */}
          <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] mb-6 leading-relaxed">
            I&rsquo;m Siddharth — an AI backend engineer in Noida. I build
            agentic systems that keep working when no one&rsquo;s watching:
            pipelines that read, match, and deliver on their own schedule, and
            agents that survive their own failures. Before that I led the build
            of an autonomous firefighting robot, and took a healthcare platform
            from zero to production in six weeks. I like honest status labels,
            observable systems, and tools that earn their place. The card is
            real — drag it.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-[--muted]">
            <a href="mailto:siddharthsingh8418@gmail.com" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              Email
            </a>
            <a href="https://github.com/Siddharthsinghkumar" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/siddharth-singh-735340296" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
