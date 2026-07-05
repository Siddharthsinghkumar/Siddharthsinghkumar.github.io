"use client";

import Link from "next/link";
import Button from "@/components/Button";
import DecryptedText from "@/components/DecryptedText";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* CSS grain + glow atmosphere for visual-gate */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05, mixBlendMode: "overlay" as React.CSSProperties["mixBlendMode"] }}>
          <filter id="nf-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope="0.6" /></feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#nf-grain)" />
        </svg>
        <div className="absolute top-[20%] left-[15%] blur-[120px]" style={{ width: "40vw", height: "40vw", maxWidth: "500px", maxHeight: "500px", borderRadius: "50%", background: "radial-gradient(circle, hsl(17 100% 55% / 0.07), transparent 70%)" }} />
        <div className="absolute bottom-[20%] right-[10%] blur-[100px]" style={{ width: "30vw", height: "30vw", maxWidth: "400px", maxHeight: "400px", borderRadius: "50%", background: "radial-gradient(circle, hsl(17 100% 55% / 0.05), transparent 70%)" }} />
      </div>

      <h1 className="relative z-10 font-mono text-[clamp(1.25rem,3vw,2rem)] uppercase tracking-[0.08em] mb-4">
        <DecryptedText
          text="404 — NO SIGNAL"
          animateOn="view"
          speed={50}
          maxIterations={8}
          sequential={true}
          revealDirection="center"
          className="text-[--muted]"
          encryptedClassName="text-[--line]"
          parentClassName="font-mono tracking-[0.08em] uppercase"
        />
      </h1>
      <p className="relative z-10 text-[--muted] text-lg mb-8">
        This route doesn&rsquo;t exist. The systems that do:
      </p>

      <div className="relative z-10 flex flex-wrap gap-4 mb-8">
        <Link
          href="/"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Home
        </Link>
        <Link
          href="/prospect"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Prospect
        </Link>
        <Link
          href="/travel-planner"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Travel Planner
        </Link>
      </div>

      <p className="relative z-10 text-[--muted] text-sm mb-4">
        Or skip the browsing:
      </p>
      <div className="relative z-10">
        <Button href="mailto:siddharthsingh8418@gmail.com">
          Email me
        </Button>
      </div>
    </section>
  );
}
