"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

export const COLORS = {
  bg: 0x0b0b0d,
  accent: 0xff5c1a,
  accentDim: 0xdb4a0f,
  line: 0x26262a,
  text: 0xe8e6e1,
  white: 0xd4d4d8,
  ok: 0x2ea85a,
};

// ── Glow texture factory ──────────────────────────────────
export function createGlowTexture(innerColor = "rgba(255, 92, 26, 1.0)", size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.08, innerColor);
  gradient.addColorStop(0.5, "rgba(255, 92, 26, 0.08)");
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

let _glowTex: THREE.CanvasTexture | null = null;
export function getGlowTexture() {
  if (!_glowTex) {
    _glowTex = new THREE.CanvasTexture(createGlowTexture());
    _glowTex.needsUpdate = true;
  }
  return _glowTex;
}

// ── Core — F1: scaled to 45-55% frame height ──────────────
// Radius pumped up to ~3.5 so it fills visible area at z=7 camera.
export function Core({ radius = 3.5 }: { radius?: number }) {
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  const glowTex = useMemo(() => getGlowTexture(), []);
  const segments = useMemo(() => new THREE.IcosahedronGeometry(radius, 2), [radius]);
  const inner = useMemo(() => new THREE.IcosahedronGeometry(radius * 0.95, 2), [radius]);
  const edges = useMemo(() => new THREE.EdgesGeometry(segments), [segments]);

  return (
    <group>
      {/* Dark solid inner */}
      <mesh>
        <primitive object={inner} attach="geometry" />
        <meshBasicMaterial color={COLORS.bg} />
      </mesh>
      {/* Orange wireframe */}
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color={accentColor} opacity={0.85} transparent />
      </lineSegments>
      {/* Large wide glow sprites */}
      <SpriteGlow size={radius * 5} opacity={0.28} position={[0, 0, -0.3]} />
      <SpriteGlow size={radius * 3.5} opacity={0.15} position={[radius * 0.6, radius * 0.3, 0.2]} />
      <SpriteGlow size={radius * 3} opacity={0.12} position={[-radius * 0.4, -radius * 0.5, 0]} />
    </group>
  );
}

function SpriteGlow({ size, opacity, position }: { size: number; opacity: number; position: [number, number, number] }) {
  const glowTex = getGlowTexture();
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={glowTex} color={accentColor} opacity={opacity} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

// ── Grid floor — visible across lower third at WP-A ───────
export function GridFloor() {
  const gridGeo = useMemo(() => new THREE.PlaneGeometry(30, 20, 30, 20), []);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(gridGeo), [gridGeo]);

  return (
    <group position={[0, -6, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <lineSegments>
        <primitive object={edgesGeo} attach="geometry" />
        <lineBasicMaterial color={COLORS.line} opacity={0.22} transparent />
      </lineSegments>
      {/* Accent glow bleeding onto the floor from below */}
      <sprite position={[0, 0.1, 3]} scale={[18, 18, 1]}>
        <spriteMaterial map={getGlowTexture()} color={new THREE.Color(COLORS.accent)} opacity={0.06} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// ── Dust field — spans full frame with z-parallax layers ──
export function DustField({ count = 2500 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() * 18) - 4;
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
      <primitive object={geo} attach="geometry" />
      <pointsMaterial color={COLORS.white} size={0.05} opacity={0.3} transparent depthWrite={false} />
    </points>
  );
}

// ── Stage ring nodes ──────────────────────────────────────
export function StageNodes({ radius = 5 }: { radius?: number }) {
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  const nodes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      arr.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return arr;
  }, [radius]);

  return (
    <group>
      {nodes.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial color={accentColor} opacity={0.85} transparent />
          </mesh>
          <sprite scale={[1.2, 1.2, 1]}>
            <spriteMaterial map={getGlowTexture()} color={accentColor} opacity={0.3} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

// ── Data stream particles — flowing along CatmullRom curves ──
export function DataStream({ curve, count = 300, color = COLORS.accent, speed = 0.5, headSize = 2.5 }: {
  curve: THREE.CatmullRomCurve3;
  count?: number;
  color?: number;
  speed?: number;
  headSize?: number;
}) {
  const segments = 100;
  const positions = useMemo(() => {
    const arr = new Float32Array(segments * 3);
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const p = curve.getPoint(t);
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    }
    return arr;
  }, [curve, segments]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color,
    size: 0.12,
    opacity: 0.7,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [color]);

  return (
    <points>
      <primitive object={geo} attach="geometry" />
      <primitive object={mat} attach="material" />
    </points>
  );
}
