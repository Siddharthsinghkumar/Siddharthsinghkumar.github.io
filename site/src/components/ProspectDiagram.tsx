"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const stages = [
  { key: "SCAN", x: 20, w: 100, sub: "OCR engine" },
  { key: "EXTRACT", x: 140, w: 100, sub: "LLM pipeline" },
  { key: "EMBED", x: 260, w: 100, sub: "FAISS vectors" },
  { key: "MATCH", x: 380, w: 100, sub: "Semantic search" },
  { key: "GENERATE", x: 500, w: 100, sub: "Resume tailoring" },
  { key: "DELIVER", x: 620, w: 100, sub: "Telegram alerts" },
];

const bottoms = [
  { x: 70, label: "smart-job-scanner-v2" },
  { x: 190, label: "merlin-cli/bridge" },
  { x: 310, label: "persona-context-engine" },
  { x: 430, label: "job-discovery-engine" },
  { x: 550, label: "merlin-cli/bridge" },
  { x: 670, label: "jobboard-api" },
];

export default function ProspectDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const motionOn = !prefersReduced;
  const [observedStage, setObservedStage] = useState(-1);
  const litStage = prefersReduced ? stages.length : observedStage;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const ratio = entry.intersectionRatio;
        const stageIndex = Math.min(
          stages.length - 1,
          Math.floor(ratio * stages.length * 1.3),
        );
        setObservedStage(Math.max(0, stageIndex));
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) }, // 0, 0.05, 0.10, ..., 1.0
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div ref={containerRef}>
      <svg
        viewBox="0 0 800 160"
        className="w-full h-auto"
        role="img"
        aria-label="Prospect pipeline: SCAN → EXTRACT → EMBED → MATCH → GENERATE → DELIVER"
      >
        {stages.map(({ key, x, w, sub }, i) => {
          const lit = i <= litStage || !motionOn;
          const isLast = i === stages.length - 1;
          const nextX = !isLast ? stages[i + 1].x : 0;

          return (
            <g key={key}>
              <rect
                x={x}
                y={30}
                width={w}
                height={56}
                rx="6"
                fill={lit ? "var(--surface-2)" : "var(--surface)"}
                stroke={lit ? "var(--accent)" : "var(--line)"}
                strokeWidth={lit ? 1.5 : 1}
                style={{ transition: "fill 400ms var(--ease), stroke 400ms var(--ease)" }}
              />
              <text
                x={x + w / 2}
                y={52}
                textAnchor="middle"
                fill={lit ? "var(--accent)" : "var(--muted)"}
                fontFamily="var(--font-ibm-plex-mono), monospace"
                fontSize="11"
                fontWeight="600"
                style={{ transition: "fill 400ms var(--ease)" }}
              >
                {key}
              </text>
              <text
                x={x + w / 2}
                y={72}
                textAnchor="middle"
                fill="var(--muted)"
                fontFamily="var(--font-inter), sans-serif"
                fontSize="10"
              >
                {sub}
              </text>

              {/* Connector line with flow particles */}
              {!isLast && (
                <>
                  <line
                    x1={x + w + 4}
                    y1={39}
                    x2={nextX - 4}
                    y2={39}
                    stroke={lit ? "var(--accent)" : "var(--line)"}
                    strokeWidth={lit ? 1.5 : 1}
                    style={{ transition: "stroke 400ms var(--ease)" }}
                  />
                  {lit && motionOn && (
                    <>
                      <circle r="2.5" fill="var(--accent)" opacity="0.8">
                        <animateMotion
                          dur="2.2s"
                          repeatCount="indefinite"
                          path={`M ${x + w + 8} 39 L ${nextX - 8} 39`}
                        />
                      </circle>
                      <circle r="2" fill="var(--accent)" opacity="0.5">
                        <animateMotion
                          dur="2.2s"
                          repeatCount="indefinite"
                          begin="0.7s"
                          path={`M ${x + w + 8} 39 L ${nextX - 8} 39`}
                        />
                      </circle>
                      <circle r="3" fill="var(--accent)" opacity="0.6">
                        <animateMotion
                          dur="2.2s"
                          repeatCount="indefinite"
                          begin="1.4s"
                          path={`M ${x + w + 8} 39 L ${nextX - 8} 39`}
                        />
                      </circle>
                    </>
                  )}
                </>
              )}
            </g>
          );
        })}

        {bottoms.map(({ x, label }, idx) => (
          <text
            key={`${label}-${idx}`}
            x={x}
            y={120}
            fill="var(--muted)"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="10"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
