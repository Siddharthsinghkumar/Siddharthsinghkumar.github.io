"use client";

import { useRef, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { Core, GridPlane, DustField, StageNode, COLORS, GLOW_TEXTURE } from "./SceneObjects";

// ── Scene Inner (runs inside Canvas) ──────────────────────
function SceneInner() {
  const { scene, camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Fog
  useMemo(() => {
    scene.fog = new THREE.Fog(COLORS.bg, 6, 22);
  }, [scene]);

  // Camera position — WP-A: wide shot, core center-right
  useMemo(() => {
    camera.position.set(1.8, 0.2, 7);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const stageNodes = useMemo(() => {
    const nodes: Array<{ pos: [number, number, number]; idx: number }> = [];
    const radius = 2.6;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      nodes.push({
        pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        idx: i,
      });
    }
    return nodes;
  }, []);

  // Accent glow sprite (shared texture)
  const glowTex = useMemo(() => GLOW_TEXTURE, []);

  useFrame((state, delta) => {
    timeRef.current += delta;

    // Core slow rotation
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.008 * delta;
      coreRef.current.rotation.y += 0.012 * delta;
      // Breathing scale ±1.5%, 8s period
      const breathe = 1 + 0.015 * Math.sin(timeRef.current * (Math.PI * 2 / 8));
      coreRef.current.scale.setScalar(breathe);
    }

    // Dust drift (group-level slow translation)
    if (groupRef.current) {
      // Subtle autonomous drift
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core — center, main attraction */}
      <group ref={coreRef}>
        <Core position={[0, 0, 0]} radius={1.6} />
      </group>

      {/* Stage ring nodes */}
      {stageNodes.map(({ pos, idx }) => (
        <StageNode key={idx} position={pos} index={idx} />
      ))}

      {/* Environment */}
      <DustField />
      <GridPlane />

      {/* Ambient glow sprite behind the core — large, additive */}
      <sprite position={[0, 0, -1.5]} scale={[6, 6, 1]}>
        <spriteMaterial map={glowTex} color={new THREE.Color(COLORS.accent)} opacity={0.18} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
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
        camera={{ position: [1.8, 0.2, 7], fov: 45 }}
        style={{ position: "fixed", inset: 0 }}
      >
        <SceneInner />
      </Canvas>
    </div>
  );
}
