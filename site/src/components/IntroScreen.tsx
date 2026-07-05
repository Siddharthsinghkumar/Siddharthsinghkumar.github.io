"use client";

// F18: Loading screen v3 — Sid-supplied GooeyLoader, brand-skinned.
// Sequence: black overlay → eyebrow → GooeyLoader + name + counter →
// holds until the 3D engine signals ready → exit. No hardcoded timing.
// Failsafe: 2.5s CSS auto-dismiss. Skips on reduced-motion / repeat visits.

import { useEffect, useState, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { engineReady } from "./engine/engine-ready";

const MAX_WAIT = 2500;

export default function IntroScreen() {
  const [phase, setPhase] = useState(0); // 0: black, 1: loading, 2: exiting, 3: done
  const [counter, setCounter] = useState(0);
  const startTime = useRef(0);
  const counterRef = useRef(0);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("intro-shown")) {
      setPhase(3);
      return;
    }

    startTime.current = performance.now();
    let rafId: number;
    let done = false;

    // Maximum wait failsafe
    maxTimerRef.current = setTimeout(() => {
      if (!done) {
        done = true;
        setPhase(2);
        cancelAnimationFrame(rafId);
      }
    }, MAX_WAIT);

    // Wait for real engine ready; exit as soon as it fires
    engineReady.then(() => {
      if (!done) {
        done = true;
        setPhase(2);
        cancelAnimationFrame(rafId);
      }
    });

    const tick = () => {
      if (done) return;
      const elapsed = performance.now() - startTime.current;

      // Phase 0: 0-150ms — black, eyebrow fades in
      if (elapsed < 150) {
        if (phase !== 0) setPhase(0);
        setCounter(0);
      }
      // Phase 1: loading — GooeyLoader + name + counter. Counter advances
      // smoothly toward 99, not 100 (100 means "ready"). Slowdown past ~80
      // so the counter visibly rushes the last 20 when engine is actually done.
      else {
        if (phase !== 1) setPhase(1);
        // Map 150ms → MAX_WAIT to counter range 0 → 99, decelerating
        const raw = Math.min(1, (elapsed - 150) / (MAX_WAIT - 150));
        const eased = 1 - Math.pow(1 - raw, 3); // ease-out cubic — fast start, slow near 99
        const target = Math.floor(eased * 98);
        if (target > counterRef.current) {
          counterRef.current = target;
          setCounter(target);
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
    };
  }, [phase]);

  // Phase 2: exiting — counter jumps to 100, overlay fades out
  useEffect(() => {
    if (phase !== 2) return;
    setCounter(100);
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
