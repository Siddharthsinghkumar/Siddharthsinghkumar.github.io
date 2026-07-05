"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Core, GridFloor, DustField, StageNodes, DataStream, getGlowTexture, COLORS } from "./SceneObjects";

// ── Build stream curves — enter from ALL frame edges, flow toward core ──
function buildStreamCurves(): THREE.CatmullRomCurve3[] {
  // Core is at origin; curve endpoints near core center
  const curves: THREE.CatmullRomCurve3[] = [];
  const variations = [
    // From top-left, top, top-right, left, right, bottom-left, bottom, far-left
    { from: [-10, 6, -3], mid: [-3, 1.5, 0], to: [0, 0.2, 0.5] },
    { from: [8, 5, -4], mid: [2, 1.8, -1], to: [-0.3, -0.1, 0.3] },
    { from: [-7, -5, 2], mid: [-2, -1.5, 0.5], to: [0.2, 0, -0.2] },
    { from: [9, -4, -2], mid: [3, -1, -0.5], to: [-0.1, 0.1, 0] },
    { from: [-9, 1, -5], mid: [-2.5, 0.5, -1.5], to: [0, 0, 0.1] },
    { from: [6, 2, 4], mid: [1.5, 0.8, 1], to: [0.3, -0.2, -0.4] },
    // Exit stream: core → forward-down (sorted output, Prospect's story)
    { from: [0, -0.3, 1], mid: [1.5, -2, 4], to: [4, -5, 8] },
  ];

  for (const { from, mid, to } of variations) {
    const vFrom = new THREE.Vector3(...from);
    const vMid = new THREE.Vector3(...mid);
    const vTo = new THREE.Vector3(...to);
    curves.push(new THREE.CatmullRomCurve3([vFrom, vMid, vTo]));
  }

  return curves;
}

// ── Scene Inner ────────────────────────────────────────────
function SceneInner() {
  const { scene, camera } = useThree();
  const coreRef = useRef<THREE.Group>(null);
  const worldRef = useRef<THREE.Group>(null);
  const camRef = useRef({ baseX: 1.8, baseY: 0.8, baseZ: 7, offsetX: 0, offsetY: 0 });
  const timeRef = useRef(0);

  const streamCurves = useMemo(() => buildStreamCurves(), []);
  const glowTex = useMemo(() => getGlowTexture(), []);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);

  useEffect(() => {
    scene.fog = new THREE.Fog(COLORS.bg, 6, 22);
    scene.background = new THREE.Color(COLORS.bg);
    // WP-A: wide shot, core fills 45-55% frame height
    camera.position.set(1.8, 0.8, 7);
    camera.lookAt(0, 0, 0);
  }, [scene, camera]);

  useFrame((_, delta) => {
    const t = timeRef.current;
    timeRef.current += delta;

    // Idle camera drift — subtle, continuous, never quite still
    const driftX = Math.sin(t * 0.15) * 0.15 + Math.cos(t * 0.23) * 0.1;
    const driftY = Math.cos(t * 0.18) * 0.12 + Math.sin(t * 0.27) * 0.08;
    camera.position.x = camRef.current.baseX + driftX;
    camera.position.y = camRef.current.baseY + driftY;
    camera.lookAt(0, 0, 0);

    // Core rotation + breathing
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006 * delta;
      coreRef.current.rotation.y += 0.01 * delta;
      const breathe = 1 + 0.015 * Math.sin(t * (Math.PI * 2 / 8));
      coreRef.current.scale.setScalar(breathe);
    }

    // Dust layer z-parallax
    if (worldRef.current) {
      // First child is the near dust layer — slight drift
      const nearDust = worldRef.current.children[2] as THREE.Points;
      if (nearDust) {
        nearDust.position.x += 0.003 * delta;
        nearDust.position.y += 0.002 * delta;
      }
    }
  });

  return (
    <group ref={worldRef}>
      {/* Core — centered, radius 3.5 fills 45-55% frame */}
      <group ref={coreRef}>
        <Core radius={3.5} />
      </group>

      {/* Stage ring — large orbit */}
      <StageNodes radius={5} />

      {/* Data streams — 7 curves entering from all edges */}
      {streamCurves.map((curve, i) => (
        <DataStream
          key={i}
          curve={curve}
          color={i === 6 ? COLORS.accent : (i % 2 === 0 ? COLORS.accent : COLORS.white)}
          speed={0.4 + i * 0.15}
        />
      ))}

      {/* Dust — two z-parallax layers */}
      <DustField count={2000} />
      {/* Near dust layer — rendered slightly forward */}
      <group position={[0, 0, 3]}>
        <DustField count={800} />
      </group>

      {/* Grid floor — visible lower third */}
      <GridFloor />

      {/* Wide ambient glow — covers entire frame */}
      <sprite position={[0, 0, -2]} scale={[16, 10, 1]}>
        <spriteMaterial map={glowTex} color={accentColor} opacity={0.10} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite position={[3, 2, -1]} scale={[10, 6, 1]}>
        <spriteMaterial map={glowTex} color={accentColor} opacity={0.08} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// ── Canvas Wrapper ────────────────────────────────────────
interface EngineCanvasProps {
  className?: string;
}

export default function EngineCanvas({ className = "" }: EngineCanvasProps) {
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[0.5, 0.75]}
        camera={{ position: [1.8, 0.8, 7], fov: 45 }}
        style={{ position: "fixed", inset: 0 }}
      >
        <SceneInner />
      </Canvas>
    </div>
  );
}
