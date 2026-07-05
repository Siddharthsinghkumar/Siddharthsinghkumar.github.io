"use client";

// F18: Loading screen v3 — Sid-supplied GooeyLoader, brand-skinned.
// Replaces F10's particle-assembly concept after two failed attempts.
// Sequence: black overlay → eyebrow fades in → GooeyLoader centered →
// SIDDHARTH SINGH decrypts → counter ties to real progress → dismiss.
// Skips on reduced-motion, repeat visits, 2.2s failsafe.

import { useEffect, useState, useRef } from "react";
import DecryptedText from "./DecryptedText";

const CSS_SAFETY = 2200;

export default function IntroScreen() {
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(0);
  const startTime = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("intro-shown")) {
      setPhase(3);
      return;
    }

    startTime.current = performance.now();
    let rafId: number;

    const tick = () => {
      const elapsed = performance.now() - startTime.current;

      // Phase 0: 0-150ms — black overlay, eyebrow fades in
      if (elapsed < 150) {
        setPhase(0);
        setCounter(0);
      }
      // Phase 1: 150-1200ms — GooeyLoader + decrypt + counter
      else if (elapsed < 1200) {
        if (phase !== 1) setPhase(1);
        // Honest monotonic counter: map elapsed 150→1200ms to 0→100, slightly
        // eased-in so it accelerates naturally
        const raw = (elapsed - 150) / (1200 - 150);
        const eased = Math.round(raw * raw * 100);
        const target = Math.min(100, Math.max(0, eased));
        if (target > counterRef.current) {
          counterRef.current = target;
          setCounter(target);
        }
      }
      // Phase 2: 1200-1600ms — exit animation
      else if (elapsed < 1600) {
        if (phase !== 2) setPhase(2);
        setCounter(100);
      }
      // Phase 3: done
      else if (elapsed >= 1600) {
        setPhase(3);
        sessionStorage.setItem("intro-shown", "1");
        return;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  if (phase === 3) return null;

  return (
    <>
      {/* CSS auto-dismiss safety — if JS fails, this hides the overlay after 2.2s */}
      <style>{`
        @keyframes intro-overlay-out {
          0%, 98% { opacity: 1; pointer-events: auto; }
          100% { opacity: 0; pointer-events: none; }
        }
        .intro-overlay {
          animation: intro-overlay-out ${CSS_SAFETY}ms forwards;
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

      {/* SVG gooey filter — donor values exactly, hidden from layout */}
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

      {/* Overlay container */}
      <div
        role="status"
        aria-label="Loading"
        className={`intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none ${
          phase === 0 ? "bg-[--bg]" : "bg-[--bg]"
        }`}
      >
        {/* Eyebrow — top-left */}
        <div
          className={`absolute top-[20%] left-0 right-0 text-center transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] px-4">
            INITIALIZING — PROSPECT ENGINE
          </p>
        </div>

        {/* GooeyLoader — centered */}
        <div
          className={`transition-opacity duration-200 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          } ${phase === 2 ? "animate-[loader-scale-out_250ms_forwards]" : ""}`}
        >
          <div className="gooey-loader" />
        </div>

        {/* Decrypting name — below loader */}
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

        {/* Mono percent counter — bottom-left */}
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
