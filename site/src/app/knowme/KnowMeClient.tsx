"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import LanyardLoader from "@/components/LanyardLoader";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { TOKEN_HEX } from "@/lib/token-hex";

// Must match Lanyard.tsx camera defaults (position z / fov) — used to convert
// the KNOWME nav link's screen position into scene world units.
const CAM_Z = 30;
const CAM_FOV = 20;

const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="${TOKEN_HEX.bg}"/>
  <rect x="0" y="0" width="400" height="100" fill="${TOKEN_HEX.accent}"/>
  <text x="200" y="280" font-family="monospace" font-size="32" font-weight="bold" fill="${TOKEN_HEX.text}" text-anchor="middle">SCAN TO</text>
  <text x="200" y="320" font-family="monospace" font-size="32" font-weight="bold" fill="${TOKEN_HEX.text}" text-anchor="middle">CONNECT</text>
  <rect x="50" y="350" width="300" height="200" rx="12" fill="none" stroke="${TOKEN_HEX.accent}" stroke-width="2"/>
  <text x="200" y="440" font-family="monospace" font-size="14" fill="${TOKEN_HEX.muted}" text-anchor="middle">github.com/</text>
  <text x="200" y="460" font-family="monospace" font-size="14" fill="${TOKEN_HEX.muted}" text-anchor="middle">Siddharthsinghkumar</text>
  <text x="200" y="530" font-family="monospace" font-size="14" fill="${TOKEN_HEX.accent}" text-anchor="middle">siddharthsingh8418@gmail.com</text>
</svg>`;
const frontImage = "/images/profile.jpeg";
const backImage = `data:image/svg+xml,${encodeURIComponent(backSvg)}`;

export default function KnowMeClient() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  // The cardScale and anchor depend on viewport. Catch initial state too.
  const cardScale = isMobile ? 1 : 2;
  const [lanyard, setLanyard] = useState<{
    anchor: [number, number];
    fraction: number;
    key: string;
  } | null>(null);

  // Anchor the strap's top under the KNOWME nav link: measure the link and
  // the canvas region, convert to world units. Resize remounts the scene
  // (physics bodies take their positions at creation).
  useEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      let fraction = 0.68;
      if (isMobile) {
        // On mobile: center the card — the KNOWME nav link is in the hamburger
        // menu and the 280px fallback image must sit fully inside the viewport.
        fraction = 0.5;
      } else {
        // trailingSlash export renders href="/knowme/"
        for (const a of document.querySelectorAll('a[href^="/knowme"]')) {
          const r = a.getBoundingClientRect();
          if (r.top < 100 && r.width > 0) {
            fraction = (r.left + r.width / 2 - rect.left) / rect.width;
            break;
          }
        }
      }
      const visH = 2 * CAM_Z * Math.tan((CAM_FOV * Math.PI) / 360);
      const visW = visH * (rect.width / rect.height);
      // Include cardScale in the key so the R3F scene remounts when the prop
      // changes — without this the physics bodies keep their birth-position
      // layout while the prop says a different scale (fallback latch, R3).
      setLanyard({
        anchor: [(fraction - 0.5) * visW, visH / 2 + 0.3],
        fraction,
        key: `${Math.round(rect.width)}x${Math.round(rect.height)}-${cardScale}`,
      });
    };
    compute();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(compute, 400);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
    // Re-compute when mobile state changes (the hook flips on first mount)
  }, [isMobile]);

  return (
    <>
      <div ref={wrapRef} className="absolute inset-0 z-[60] pointer-events-none">
        {lanyard && (
          <LanyardLoader
            key={lanyard.key}
            frontImage={frontImage}
            backImage={backImage}
            anchor={lanyard.anchor}
            anchorFraction={lanyard.fraction}
            cardScale={cardScale}
          />
        )}
      </div>

      <div className="relative z-[2] flex flex-col justify-start md:justify-center pt-[68svh] md:pt-0 min-h-[100svh] md:min-h-[80svh] px-4">
        <div className="relative max-w-[60ch] bg-surface md:bg-bg/60 md:backdrop-blur-sm rounded-[--r-md] p-8">
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
            <Button variant="ghost" href="/resume/resume-siddharth-singh.pdf" className="border-white text-white border-2 bg-white/10">
              Resume ↓
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[--muted]">
            <a href="https://github.com/Siddharthsinghkumar" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors link-pulse-hover link-pulse-auto expanded-hit-area">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/siddharth-singh-735340296" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors link-pulse-hover link-pulse-auto expanded-hit-area">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
