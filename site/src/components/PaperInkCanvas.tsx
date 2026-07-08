"use client";

// Paper-ink WebGL hero canvas — raw WebGL fragment shader, no three.js.
// Mounts lazily via requestIdleCallback after first paint.
// Pointer-reactive: cursor leaves an ink-glow trail that decays over ~2s.
// Touch devices: autonomous slow grain drift only.
// Reduced-motion / saveData / !pointer:fine → component returns null (CSS fallback handles it).

import { useEffect, useRef } from "react";
import { vertexSrc, fragmentSrc } from "./paper-ink-shader";

const MAX_TRAIL = 16;
const MAX_DPR = 1.5;

export default function PaperInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    gl: WebGLRenderingContext;
    locs: Record<string, WebGLUniformLocation | null>;
    dpr: number;
    trail: Array<{ x: number; y: number; age: number; strength: number }>;
    pointer: { x: number; y: number };
    time: number;
    raf: number;
    autoBlobs: Array<{ phaseX: number; phaseY: number; speedX: number; speedY: number; ampX: number; ampY: number; radius: number }>;
  } | null>(null);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(any-pointer: fine)").matches;
    let saveData = false;
    if ("connection" in navigator) {
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      saveData = conn?.saveData ?? false;
    }
    if (rmq.matches || !fine || saveData) return;

    let cancelled = false;

    const schedule = window.requestIdleCallback || ((fn: () => void) => setTimeout(fn, 200));
    const idleId = schedule(() => {
      if (cancelled) return;
      initAndStart();
    });

    function initAndStart() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      });
      if (!gl) return;

      // Compile
      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const vShader = compile(gl.VERTEX_SHADER, vertexSrc);
      if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) return;
      const fShader = compile(gl.FRAGMENT_SHADER, fragmentSrc);
      if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) return;

      const program = gl.createProgram()!;
      gl.attachShader(program, vShader);
      gl.attachShader(program, fShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const locs = {
        uTime: gl.getUniformLocation(program, "uTime"),
        uResolution: gl.getUniformLocation(program, "uResolution"),
        uPointer: gl.getUniformLocation(program, "uPointer"),
        uTrail: gl.getUniformLocation(program, "uTrail"),
        uTrailCount: gl.getUniformLocation(program, "uTrailCount"),
        uAutoBlobs: gl.getUniformLocation(program, "uAutoBlobs"),
        uAutoBlobsCount: gl.getUniformLocation(program, "uAutoBlobsCount"),
        uDpr: gl.getUniformLocation(program, "uDpr"),
      };

      stateRef.current = {
        gl,
        locs,
        dpr,
        trail: [],
        pointer: { x: 0.5, y: 0.5 },
        time: 0,
        raf: 0,
        autoBlobs: [
          { phaseX: 0.2, phaseY: 0.35, speedX: 0.07, speedY: 0.05, ampX: 0.3, ampY: 0.25, radius: 0.25 },
          { phaseX: 0.75, phaseY: 0.6, speedX: 0.05, speedY: 0.08, ampX: 0.25, ampY: 0.28, radius: 0.20 },
          { phaseX: 0.5, phaseY: 0.2, speedX: 0.06, speedY: 0.04, ampX: 0.28, ampY: 0.22, radius: 0.22 },
          { phaseX: 0.35, phaseY: 0.8, speedX: 0.04, speedY: 0.06, ampX: 0.20, ampY: 0.25, radius: 0.18 },
        ],
      };

      gl.uniform2f(locs.uResolution, canvas.width, canvas.height);
      gl.uniform1f(locs.uDpr, dpr);

      drawFrame(performance.now());
    }

    function drawFrame(ts: number) {
      const s = stateRef.current;
      if (!s) return;
      s.time = ts;

      const { gl, locs, dpr: _dpr, trail, autoBlobs } = s;
      void _dpr;
      const dt = 0.016;
      const t = ts * 0.001;

      // Age trail points
      for (const p of trail) p.age -= dt * 0.5;
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].age <= 0) trail.splice(i, 1);
      }

      // Pack trail uniforms
      const flatTrail = new Float32Array(MAX_TRAIL * 4);
      for (let i = 0; i < MAX_TRAIL; i++) {
        if (i < trail.length) {
          const tt = trail[i];
          flatTrail[i * 4] = tt.x;
          flatTrail[i * 4 + 1] = tt.y;
          flatTrail[i * 4 + 2] = tt.age;
          flatTrail[i * 4 + 3] = tt.strength;
        }
      }
      gl.uniform4fv(locs.uTrail, flatTrail);
      gl.uniform1i(locs.uTrailCount, trail.length);

      // Autonomous ink blobs — slow sinusoidal drifting
      const flatBlobs = new Float32Array(4 * 3);
      for (let i = 0; i < autoBlobs.length; i++) {
        const b = autoBlobs[i];
        const x = b.phaseX + Math.sin(t * b.speedX) * b.ampX;
        const y = b.phaseY + Math.cos(t * b.speedY) * b.ampY;
        flatBlobs[i * 3] = x;
        flatBlobs[i * 3 + 1] = y;
        flatBlobs[i * 3 + 2] = b.radius;
      }
      gl.uniform3fv(locs.uAutoBlobs, flatBlobs);
      gl.uniform1i(locs.uAutoBlobsCount, autoBlobs.length);

      gl.uniform1f(locs.uTime, t);
      gl.uniform2f(locs.uPointer, s.pointer.x, s.pointer.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      s.raf = requestAnimationFrame(drawFrame);
    }

    // Pointer handlers
    const onPointer = (e: PointerEvent) => {
      const state = stateRef.current;
      if (!state || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      state.pointer = { x, y };
      const strength = Math.min(1, Math.max(0.15, e.pressure || 0.4));
      state.trail.unshift({ x, y, age: 1, strength });
      if (state.trail.length > MAX_TRAIL) state.trail.length = MAX_TRAIL;
    };

    const onTouch = (e: TouchEvent) => {
      const state = stateRef.current;
      const t = e.touches[0];
      if (!state || !canvasRef.current || !t) return;
      const rect = canvasRef.current.getBoundingClientRect();
      state.pointer = {
        x: (t.clientX - rect.left) / rect.width,
        y: 1.0 - (t.clientY - rect.top) / rect.height,
      };
      state.trail = [{ x: state.pointer.x, y: state.pointer.y, age: 1, strength: 0.3 }];
    };

    const onVisibility = () => {
      const state = stateRef.current;
      if (!state) return;
      if (document.hidden) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      } else if (state.raf === 0) {
        state.raf = requestAnimationFrame(drawFrame);
      }
    };

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("touchmove", onTouch, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (typeof idleId === "number") cancelIdleCallback(idleId);
      const s = stateRef.current;
      if (s) cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
