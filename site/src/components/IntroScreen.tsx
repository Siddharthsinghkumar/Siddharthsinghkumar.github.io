"use client";

// F18: Loading screen v3 — Sid-supplied GooeyLoader, brand-skinned.
// Sequence: black overlay → eyebrow → GooeyLoader + name + counter →
// holds until the 3D engine signals ready → exit. No hardcoded timing.
// Failsafe: 2.5s CSS auto-dismiss. Skips on reduced-motion / repeat visits.
// B2/D43: counter tracks REAL asset progress (fonts→chunk→first-frame→poster).

import { useEffect, useState, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { engineReady, onEngineProgress, reportProgress } from "./engine/engine-ready";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const MAX_WAIT = 10000;

export default function IntroScreen({ waitForEngine = true }: { waitForEngine?: boolean }) {
  const [phase, setPhase] = useState(0); // 0: black, 1: loading, 2: exiting, 3: done
  const [counter, setCounter] = useState(0);
  const phaseRef = useRef(0);
  const counterRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneRef = useRef(false);
  const prefersReduced = usePrefersReducedMotion();

  // Hydration-safe skip: always render the overlay structurally (match SSR),
  // then immediately dismiss. The CSS html.intro-skip rule hides it before
  // first paint, so no flash.
  useEffect(() => {
    startRef.current ??= Date.now();
    if (typeof document !== "undefined" && document.documentElement.classList.contains("intro-skip")) {
      setPhase(3);
      return;
    }
    if (prefersReduced) {
      setPhase(3);
      return;
    }

    let rafId: number;
    const phase1 = () => { if (phaseRef.current === 0) { phaseRef.current = 1; setPhase(1); } };
    const phase2 = () => { if (phaseRef.current < 2) { doneRef.current = true; setCounter(100); phaseRef.current = 2; setPhase(2); } };

    // Sync module-level progress → window bridge for rAF poll
    const unsub = onEngineProgress((p: number) => {
      (window as unknown as Record<string, number>).__engineProgress = p;
    });

    if (waitForEngine) {
      // ── Asset-progress milestones (B2/D43) ────────────────
      reportProgress(0);

      document.fonts.ready.then(() => { if (!doneRef.current) reportProgress(15); });
      const posterImg = new Image();
      posterImg.src = "/poster-home.webp";
      posterImg.decode().then(() => { if (!doneRef.current) reportProgress(100); }).catch(() => { if (!doneRef.current) reportProgress(100); });

      maxTimerRef.current = setTimeout(() => { if (!doneRef.current) { phase2(); cancelAnimationFrame(rafId); } }, MAX_WAIT);
      const start = startRef.current!;

      engineReady.then(() => {
        if (!doneRef.current) {
          const elapsed = Date.now() - start;
          setTimeout(() => {
            if (!doneRef.current) { phase2(); cancelAnimationFrame(rafId); }
          }, Math.max(0, 1000 - elapsed));
        }
      });

      const tick = () => {
        if (doneRef.current) return;
        const target = (window as unknown as Record<string, number>).__engineProgress ?? 0;
        if (target > counterRef.current) {
          counterRef.current = Math.max(counterRef.current, Math.min(target, counterRef.current + Math.ceil((target - counterRef.current) * 0.15)));
          setCounter(counterRef.current);
        }
        if (phaseRef.current === 0 && Date.now() - start > 150) phase1();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    } else {
      // Subpage: no 3D engine — fonts + document ready + min 1000ms
      const start = startRef.current!;
      const dismiss = () => {
        if (!doneRef.current) {
          const elapsed = Date.now() - start;
          setTimeout(() => {
            if (!doneRef.current) { phase2(); cancelAnimationFrame(rafId); }
          }, Math.max(0, 1000 - elapsed));
        }
      };

      document.fonts.ready.then(() => { if (!doneRef.current) reportProgress(15); });
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
      maxTimerRef.current = setTimeout(() => { if (!doneRef.current) { phase2(); cancelAnimationFrame(rafId); } }, MAX_WAIT);

      const tick = () => {
        if (doneRef.current) return;
        const target = (window as unknown as Record<string, number>).__engineProgress ?? 0;
        if (target > counterRef.current) {
          counterRef.current = Math.max(counterRef.current, Math.min(target, counterRef.current + Math.ceil((target - counterRef.current) * 0.15)));
          setCounter(counterRef.current);
        }
        if (phaseRef.current === 0 && Date.now() - start > 150) phase1();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      unsub();
      cancelAnimationFrame(rafId);
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
    };
  }, [waitForEngine, prefersReduced]);

  // Scroll lock effect (Layer 7 requirement)
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (phase < 3) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [phase]);

  // Phase 2: exiting — overlay fades out
  useEffect(() => {
    if (phase !== 2) return;
    const id = setTimeout(() => {
      setPhase(3);
      sessionStorage.setItem("intro-shown", "1");
    }, 300);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === 3) return null;

  return (
    <>
      {/* CSS auto-dismiss safety */}
      <style>{`
        @keyframes intro-overlay-out {
          0%, 98% { opacity: 1; pointer-events: auto; }
          100% { opacity: 0; pointer-events: none; }
        }
        .intro-overlay {
          animation: intro-overlay-out ${MAX_WAIT + 300}ms forwards;
        }
        @keyframes intro-exit {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes loader-scale-out {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.96); opacity: 0; }
        }
      `}</style>

      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey-loader-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .gooey-loader {
          width: 12em;
          height: 3em;
          position: relative;
          overflow: hidden;
          border-bottom: 8px solid var(--line);
          filter: url(#gooey-loader-filter);
        }
        .gooey-loader::before,
        .gooey-loader::after {
          content: '';
          position: absolute;
          border-radius: 50%;
        }
        .gooey-loader::before {
          width: 22em;
          height: 18em;
          background-color: var(--accent);
          left: -2em;
          bottom: -18em;
          animation: gooey-wee1 2s linear infinite;
        }
        .gooey-loader::after {
          width: 16em;
          height: 12em;
          background-color: var(--accent-dim);
          left: -4em;
          bottom: -12em;
          animation: gooey-wee2 2s linear infinite 0.75s;
        }
        @keyframes gooey-wee1 {
          0% { transform: translateX(-10em) rotate(0deg); }
          100% { transform: translateX(7em) rotate(180deg); }
        }
        @keyframes gooey-wee2 {
          0% { transform: translateX(-8em) rotate(0deg); }
          100% { transform: translateX(8em) rotate(180deg); }
        }
      `}</style>

      <div
        role="status"
        aria-label="Loading"
        className={`intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none bg-[--bg]`}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          backgroundColor: "rgb(11,11,13)",
        }}
      >
        {/* Eyebrow */}
        <div
          className={`absolute top-[20%] left-0 right-0 text-center transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] px-4">
            INITIALIZING — PROSPECT ENGINE
          </p>
        </div>

        {/* GooeyLoader */}
        <div
          className={`transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[loader-scale-out_250ms_forwards]" : ""}`}
        >
          <div className="gooey-loader" />
        </div>

        {/* Decrypting name */}
        <div
          className={`mt-8 transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}
        >
          <div className="text-[clamp(1.5rem,4vw,2.5rem)] font-mono tracking-[0.08em] text-[--text] text-center px-4">
            {phase >= 1 && (
              <DecryptedText
                text="SIDDHARTH SINGH"
                animateOn="view"
                speed={30}
                maxIterations={10}
                sequential={true}
                revealDirection="center"
                className="text-[--text]"
                encryptedClassName="text-[--muted]"
                parentClassName="font-mono tracking-[0.08em] uppercase"
              />
            )}
          </div>
        </div>

        {/* Counter — bottom-left */}
        <div
          className={`absolute bottom-8 left-8 transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}
        >
          <p className="font-mono text-[13px] tracking-[0.08em] text-[--accent]">
            {String(counter).padStart(3, "0")}
          </p>
        </div>
      </div>
    </>
  );
}
