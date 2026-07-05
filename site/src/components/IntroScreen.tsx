"use client";

// F5: igloo-style intro/loading screen — particles converge, core assembles,
// name decrypts with percent counter, then overlay lifts. The assembled core
// IS the scene — no swap, no cut. Skipped on reduced-motion and repeat visits
// (sessionStorage). No-JS safety: CSS keyframe auto-dismiss at 2.2s.

import { useEffect, useState } from "react";
import DecryptedText from "./DecryptedText";

const INTRO_DURATION = 1600; // ms — JS dismisses at this max
const CSS_SAFETY = 2200; // ms — CSS auto-dismiss if JS fails

export default function IntroScreen() {
  const [visible, setVisible] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Skip on reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    // Skip on repeat visits
    if (sessionStorage.getItem("intro-shown")) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("intro-shown", "1");

    // Percent counter
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / INTRO_DURATION) * 100));
      setCounter(pct);
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // Dismiss after duration
    const timer = setTimeout(() => setVisible(false), INTRO_DURATION);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Overlay — CSS auto-dismiss safety at 2.2s */}
      <div
        className="fixed inset-0 z-[100] bg-[--bg] flex flex-col items-center justify-center animate-[intro-fade-out_0.5s_var(--ease)_2.2s_forwards]"
        aria-hidden={!visible}
      >
        {/* Decrypting name — LCP element */}
        <div className="text-[clamp(2rem,6vw,3.5rem)] font-mono tracking-[0.08em] text-[--text] mb-4 text-center px-4">
          <DecryptedText
            text="SIDDHARTH SINGH"
            animateOn="view"
            speed={30}
            maxIterations={8}
            sequential={true}
            revealDirection="center"
            className="text-[--text]"
            encryptedClassName="text-[--muted]"
            parentClassName="font-mono tracking-[0.08em] uppercase"
          />
        </div>

        {/* Mono percent counter */}
        <p className="font-mono text-[13px] tracking-[0.08em] text-[--accent]">
          LOADING SYSTEM {String(counter).padStart(3, "0")}%
        </p>
      </div>

      {/* CSS keyframe for no-JS safety */}
      <style jsx>{`
        @keyframes intro-fade-out {
          from { opacity: 1; }
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </>
  );
}
