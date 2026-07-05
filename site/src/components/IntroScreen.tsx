"use client";

// F5: igloo-style intro/loading screen — particles converge, core assembles,
// name decrypts with percent counter, then overlay lifts. The assembled core
// IS the scene — no swap, no cut. Skipped on reduced-motion and repeat visits
// (sessionStorage). No-JS safety: CSS keyframe auto-dismiss at 2.2s.

import { useEffect, useState, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { useProgress } from "@react-three/drei";

const INTRO_DURATION = 1600;

export default function IntroScreen() {
  const [phase, setPhase] = useState(0); // 0: black, 1: assembling, 2: exiting, 3: done
  const [counter, setCounter] = useState(0);
  const { progress } = useProgress();
  const startTime = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("intro-shown")) {
      setPhase(3);
      return;
    }

    startTime.current = performance.now();
    let rafId: number;
    let targetCounter = 0;

    const tick = () => {
      const elapsed = performance.now() - startTime.current;
      
      // Phase 0: 0-150ms
      if (elapsed < 150) {
        setPhase(0);
      } 
      // Phase 1: 150-1200ms
      else if (elapsed >= 150 && elapsed < 1200) {
        setPhase(1);
        // Monotonic counter tied to progress
        targetCounter = Math.max(targetCounter, progress);
        setCounter(prev => {
          if (prev < targetCounter) return prev + 1;
          return prev;
        });
      }
      // Phase 2: 1200-1600ms
      else if (elapsed >= 1200 && elapsed < 1600) {
        if (phase !== 2) setPhase(2);
        setCounter(100);
      }
      // Phase 3: >1600ms
      else if (elapsed >= 1600) {
        setPhase(3);
        sessionStorage.setItem("intro-shown", "1");
        return;
      }
      
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [progress, phase]);

  if (phase === 3) return null;

  return (
    <>
      {/* Container */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none transition-colors duration-[150ms] ${
          phase === 0 ? "bg-[--bg]" : "bg-transparent"
        }`}
      >
        {/* Eyebrow */}
        <div className={`absolute top-[20%] transition-opacity duration-200 ${phase >= 1 ? "opacity-100" : "opacity-0"} ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted]">
            INITIALIZING — PROSPECT ENGINE
          </p>
        </div>

        {/* Decrypting name — Below the core (which is center) */}
        <div className={`absolute top-[65%] transition-opacity duration-200 ${phase >= 1 ? "opacity-100" : "opacity-0"} ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}>
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

        {/* Mono percent counter bottom-left */}
        <div className={`absolute bottom-8 left-8 transition-opacity duration-200 ${phase >= 1 ? "opacity-100" : "opacity-0"} ${phase === 2 ? "animate-[intro-exit_250ms_forwards]" : ""}`}>
          <p className="font-mono text-[13px] tracking-[0.08em] text-[--accent]">
            {String(counter).padStart(3, "0")}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes intro-exit {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
