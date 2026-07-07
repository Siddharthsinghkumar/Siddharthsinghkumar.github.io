"use client";

import Button from "@/components/Button";
import LanyardLoader from "@/components/LanyardLoader";

const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#0B0B0D"/>
  <rect x="0" y="0" width="400" height="100" fill="#FF5C1A"/>
  <text x="200" y="300" font-family="monospace" font-size="60" font-weight="bold" fill="#E8E8E8" text-anchor="middle" dominant-baseline="middle">SS</text>
  <text x="200" y="500" font-family="monospace" font-size="24" fill="#FF5C1A" text-anchor="middle">AI BACKEND ENGINEER</text>
</svg>`;
const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="#0B0B0D"/>
  <rect x="0" y="0" width="400" height="100" fill="#FF5C1A"/>
  <text x="200" y="280" font-family="monospace" font-size="32" font-weight="bold" fill="#E8E8E8" text-anchor="middle">SCAN TO</text>
  <text x="200" y="320" font-family="monospace" font-size="32" font-weight="bold" fill="#E8E8E8" text-anchor="middle">CONNECT</text>
  <rect x="50" y="350" width="300" height="200" rx="12" fill="none" stroke="#FF5C1A" stroke-width="2"/>
  <text x="200" y="440" font-family="monospace" font-size="14" fill="#8A8A93" text-anchor="middle">github.com/</text>
  <text x="200" y="460" font-family="monospace" font-size="14" fill="#8A8A93" text-anchor="middle">Siddharthsinghkumar</text>
  <text x="200" y="530" font-family="monospace" font-size="14" fill="#FF5C1A" text-anchor="middle">siddharthsingh8418@gmail.com</text>
</svg>`;
const frontImage = `data:image/svg+xml,${encodeURIComponent(frontSvg)}`;
const backImage = `data:image/svg+xml,${encodeURIComponent(backSvg)}`;

export default function KnowMeClient() {
  return (
    <>
      <div className="absolute inset-0 z-[60]" style={{ opacity: 0.8, transform: "translateX(18%)" }}>
        <LanyardLoader frontImage={frontImage} backImage={backImage} />
      </div>

      <div className="relative z-[2] flex flex-col justify-center min-h-[80svh] px-4">
        {/* T14: dark backdrop for text readability on light images */}
        <div className="absolute inset-0 bg-[--bg]/60 backdrop-blur-sm rounded-[--r-md]" style={{ maxWidth: "65ch", left: 0 }} />
        <div className="relative max-w-[60ch]">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-6">
            Know Me
          </h1>
          <p className="text-[--muted] text-[clamp(1.25rem,2.5vw,1.563rem)] mb-8 leading-relaxed">
            I&rsquo;m Siddharth — an AI backend engineer in Noida. I build
            agentic systems that keep working when no one&rsquo;s watching:
            pipelines that read, match, and deliver on their own schedule, and
            agents that survive their own failures. Before that I led the build
            of an autonomous firefighting robot, and took a healthcare platform
            from zero to production in six weeks. I like honest status labels,
            observable systems, and tools that earn their place. The card is
            real — drag it.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button href="mailto:siddharthsingh8418@gmail.com">
              siddharthsingh8418@gmail.com
            </Button>
            <Button variant="ghost" href="/resume-siddharth-singh.pdf" className="border-white text-white border-2 bg-white/10">
              Resume ↓
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[--muted]">
            <a href="https://github.com/Siddharthsinghkumar" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors link-pulse-hover link-pulse-auto">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/siddharth-singh-735340296" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors link-pulse-hover link-pulse-auto">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
