"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

// Glow sprite texture — radial gradient, orange on dark
function createGlowTexture(innerColor: string, size = 128): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.15, innerColor);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

// Procedural materials/functions for the R3F scene
export const COLORS = {
  bg: 0x0b0b0d,
  accent: 0xff5c1a,
  accentDim: 0xdb4a0f,
  line: 0x26262a,
  text: 0xe8e6e1,
  white: 0xd4d4d8,
  ok: 0x2ea85a,
};

export const GLOW_TEXTURE = (() => {
  const canvas = createGlowTexture("rgba(255, 92, 26, 1.0)");
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
})();

export function useBg() {
  return useMemo(() => new THREE.Color(COLORS.bg), []);
}

export function useAccent() {
  return useMemo(() => new THREE.Color(COLORS.accent), []);
}

// Core: icosahedron wireframe over dark inner solid
export function Core({ position, radius = 1.6 }: { position: [number, number, number]; radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const accentColor = useAccent();

  const glowTex = useMemo(() => GLOW_TEXTURE, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Dark solid inner — occludes back wireframe edges */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.95, 2]} />
        <meshBasicMaterial color={COLORS.bg} />
      </mesh>
      {/* Orange wireframe outer */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(radius, 2)]} />
        <lineBasicMaterial color={accentColor} opacity={0.85} transparent />
      </lineSegments>
      {/* Additive glow sprite behind core */}
      <sprite position={[0, 0, -0.5]} scale={[radius * 4, radius * 4, 1]}>
        <spriteMaterial map={glowTex} color={accentColor} opacity={0.22} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// Grid plane — vast thin wireframe floor
export function GridPlane() {
  const gridSize = 14;
  const divisions = 28;
  const gridGeo = useMemo(() => new THREE.PlaneGeometry(gridSize, gridSize, divisions, divisions), [gridSize, divisions]);

  return (
    <lineSegments position={[0, -3.5, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <edgesGeometry args={[gridGeo]} />
      <lineBasicMaterial color={COLORS.line} opacity={0.18} transparent />
    </lineSegments>
  );
}

// Dust field — 1800 tiny particles
export function DustField() {
  const count = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points>
      <pointsMaterial color={COLORS.white} size={0.04} opacity={0.25} transparent depthWrite={false} />
      <bufferGeometry {...geo} />
    </points>
  );
}

// Fog setup — returned as props for the Canvas
export function fogConfig(): { fog: THREE.Fog } {
  return { fog: new THREE.Fog(COLORS.bg, 6, 22) };
}

// Orbit nodes — small octahedrons for the stage ring
export function StageNode({ position, index, _total = 6 }: { position: [number, number, number]; index: number; _total?: number }) {
  const accentColor = useAccent();
  const glowTex = useMemo(() => GLOW_TEXTURE, []);

  return (
    <group position={position}>
      <mesh>
        <octahedronGeometry args={[0.15, 0]} />
        <meshBasicMaterial color={accentColor} opacity={0.75} transparent />
      </mesh>
      <sprite scale={[0.7, 0.7, 1]}>
        <spriteMaterial map={glowTex} color={accentColor} opacity={0.2} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}
