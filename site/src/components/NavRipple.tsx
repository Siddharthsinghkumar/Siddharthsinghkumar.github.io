"use client";

import { useEffect, useRef, useCallback } from "react";

export interface RippleEvent {
  x: number; // normalized 0-1
  startTime: number; // performance.now() threshold
}

export default function NavRipple({ ripples }: { ripples: RippleEvent[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<RippleEvent[]>(ripples);
  ripplesRef.current = ripples;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    interface ActiveRipple {
      x: number; y: number;
      startTime: number;
      sweep: boolean;
    }

    const active: ActiveRipple[] = [];
    let frameId: number;

    const draw = (now: number) => {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // Spawn queued ripples
      const pending = ripplesRef.current;
      for (let i = 0; i < pending.length; i++) {
        if (now >= pending[i].startTime) {
          active.push({
            x: pending[i].x,
            y: 0.4 + Math.random() * 0.2,
            startTime: now,
            sweep: pending[i].x < 0,
          });
        }
      }
      if (pending.length > 0) {
        ripplesRef.current = [];
      }

      for (let i = active.length - 1; i >= 0; i--) {
        const r = active[i];
        const elapsed = now - r.startTime;
        const duration = r.sweep ? 1200 : 700;
        const progress = Math.min(1, elapsed / duration);
        if (progress >= 1) { active.splice(i, 1); continue; }

        const maxR = r.sweep ? Math.max(w, h) * 0.7 : w * 0.18;
        const radius = progress * maxR;
        const alpha = Math.max(0, 1 - Math.pow(progress, 1.5)) * 0.6;

        // Multiple concentric rings for liquid feel
        for (let ring = 0; ring < 3; ring++) {
          const rPhase = ring * 0.08;
          const rProgress = Math.max(0, Math.min(1, (progress - rPhase) / (1 - rPhase)));
          if (rProgress <= 0 || rProgress >= 1) continue;
          const rRadius = rProgress * maxR;
          const rAlpha = Math.max(0, 1 - Math.pow(rProgress, 2)) * alpha * (1 - ring * 0.25);
          if (rAlpha < 0.01) continue;

          ctx!.beginPath();
          ctx!.arc(r.x * w, r.y * h, rRadius, 0, Math.PI * 2);
          ctx!.strokeStyle = `hsla(17, 100%, 55%, ${rAlpha})`;
          ctx!.lineWidth = Math.max(0.5, 2.5 * (1 - rProgress) * (1 - ring * 0.2));
          ctx!.stroke();
        }

        // Glassy fill
        const grad = ctx!.createRadialGradient(r.x * w, r.y * h, 0, r.x * w, r.y * h, radius);
        const gradA = Math.max(0, 0.1 * (1 - Math.pow(progress, 1.5)));
        grad.addColorStop(0, `hsla(17, 100%, 55%, ${gradA})`);
        grad.addColorStop(1, `hsla(17, 100%, 55%, 0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(r.x * w, r.y * h, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!document.hidden) {
        frameId = requestAnimationFrame(draw);
      }
    };

    frameId = requestAnimationFrame(draw);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frameId);
      else frameId = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[41]"
      aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}
