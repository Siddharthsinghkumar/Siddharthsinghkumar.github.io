"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
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
  if (typeof document === "undefined") return null as unknown as HTMLCanvasElement;
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
    const c = createGlowTexture();
    if (!c) return null as unknown as THREE.CanvasTexture;
    _glowTex = new THREE.CanvasTexture(c);
    _glowTex.needsUpdate = true;
  }
  return _glowTex;
}

// ── Shader-based particle material (head-bright, tail-faint) ──
const particleVertexShader = /* glsl */ `
  attribute float aT;
  attribute float aSize;
  varying float vT;
  uniform float uSize;
  void main() {
    vT = aT;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = /* glsl */ `
  varying float vT;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float alpha = (1.0 - d) * smoothstep(0.6, 0.0, vT) * smoothstep(1.0, 0.85, vT);
    alpha *= uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// ── Core — F1: scaled to 45-55% frame height ──────────────
export function Core({ radius = 3.5 }: { radius?: number }) {
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  const segments = useMemo(() => new THREE.IcosahedronGeometry(radius, 2), [radius]);
  const inner = useMemo(() => new THREE.IcosahedronGeometry(radius * 0.95, 2), [radius]);
  const edges = useMemo(() => new THREE.EdgesGeometry(segments), [segments]);

  return (
    <group>
      <mesh>
        <primitive object={inner} attach="geometry" />
        <meshBasicMaterial color={COLORS.bg} />
      </mesh>
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color={accentColor} opacity={0.85} transparent />
      </lineSegments>
    </group>
  );
}

function SpriteGlow({ size, opacity, position }: { size: number; opacity: number; position: [number, number, number] }) {
  const glowTex = getGlowTexture();
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  if (!glowTex) return null;
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
      <sprite position={[0, 0.1, 3]} scale={[18, 18, 1]}>
        <spriteMaterial map={getGlowTexture() || undefined} color={new THREE.Color(COLORS.accent)} opacity={0.06} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

// ── Dust field — spans full frame with z-parallax layers ──
export function DustField({ count = 2500 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const driftOffsets = useRef<Float32Array | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const offsets = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() * 18) - 4;
      offsets[i * 3] = (Math.random() - 0.5) * 0.005;
      offsets[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    driftOffsets.current = offsets;
    return arr;
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame(() => {
    if (!meshRef.current || !driftOffsets.current) return;
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const off = driftOffsets.current;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3] += off[i * 3];
      pos.array[i * 3 + 1] += off[i * 3 + 1];
      pos.array[i * 3 + 2] += off[i * 3 + 2];
      // Wrap around
      if (Math.abs(pos.array[i * 3]) > 11) pos.array[i * 3] *= -0.99;
      if (Math.abs(pos.array[i * 3 + 1]) > 7) pos.array[i * 3 + 1] *= -0.99;
      if (pos.array[i * 3 + 2] > 14) pos.array[i * 3 + 2] -= 18;
      if (pos.array[i * 3 + 2] < -4) pos.array[i * 3 + 2] += 18;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <primitive object={geo} attach="geometry" />
      <pointsMaterial color={COLORS.white} size={0.06} opacity={0.3} transparent depthWrite={false} />
    </points>
  );
}

// ── Stage ring nodes — counter-rotation + sequential pulse ─
export function StageNodes({ radius = 5 }: { radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);

  const nodes = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      // Slightly tilted ring
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      arr.push([x, Math.sin(angle * 2) * 0.6, z]);
    }
    return arr;
  }, [radius]);

  useFrame((_, delta) => {
    // Counter-rotate the whole ring
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.15;
      groupRef.current.rotation.x += delta * 0.2;
    }
    // Sequential pulse — 6-second loop, each node lights in order (SCAN→DELIVER cadence)
    const t = performance.now() * 0.001;
    const cycleT = (t % 6) / 6; // 0→1 over 6 seconds
    nodeRefs.current.forEach((node, i) => {
      if (!node) return;
      const nodeT = (cycleT + i / 6) % 1;
      // Pulse when this node is the "active" one
      const active = nodeT < 0.17; // each node active for ~1s of the 6s cycle
      const scale = active ? 1 + 0.5 * Math.sin(nodeT / 0.17 * Math.PI) : 1;
      node.scale.setScalar(scale);
      // Brighten the glow sprite
      const sprite = node.children[1] as THREE.Sprite;
      if (sprite) {
        sprite.material.opacity = active ? 0.5 : 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <group key={i} position={pos} ref={(el) => { nodeRefs.current[i] = el; }}>
          <mesh>
            <octahedronGeometry args={[0.40, 0]} />
            <meshBasicMaterial color={accentColor} opacity={0.85} transparent />
          </mesh>
          <sprite scale={[1.0, 1.0, 1]}>
            <spriteMaterial map={getGlowTexture() || undefined} color={new THREE.Color(COLORS.accent)} opacity={0.2} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

// ── Animated Data stream — flowing particles along curve ──
// DataStream disabled for external use — Sid: "don't like it, comment out in case I change my mind"
// export function DataStream(...) { ... }
// NOTE: Kept internal non-exported version below for Satellite
function DataStream({
  curve,
  count = 570,
  color = COLORS.accent,
  speed = 0.35,
  bright = false,
}: {
  curve: THREE.CatmullRomCurve3;
  count?: number;
  color?: number;
  speed?: number;
  bright?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const tValues = useRef(new Float32Array(count));
  const posArray = useRef(new Float32Array(count * 3));
  const sizeArray = useRef(new Float32Array(count));

  // Initialize t values and sizes
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    for (let i = 0; i < count; i++) {
      tValues.current[i] = Math.random();
      sizeArray.current[i] = 0.6 + Math.random() * 1.4;
      const p = curve.getPoint(tValues.current[i]);
      posArray.current[i * 3] = p.x;
      posArray.current[i * 3 + 1] = p.y;
      posArray.current[i * 3 + 2] = p.z;
    }
  }, [count, curve]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(posArray.current, 3));
    g.setAttribute("aT", new THREE.BufferAttribute(tValues.current, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizeArray.current, 1));
    return g;
  }, []);

  const shaderMat = useMemo(() => {
    const c = new THREE.Color(color);
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uSize: { value: bright ? 0.24 : 0.18 },
        uColor: { value: c },
        uOpacity: { value: 0.85 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color, bright]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const tv = tValues.current;
    const pos = posArray.current;
    for (let i = 0; i < count; i++) {
      tv[i] += speed * delta * (0.7 + Math.random() * 0.6);
      if (tv[i] > 1) tv[i] -= 1;
      const p = curve.getPoint(tv[i]);
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
    }
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    const tAttr = pointsRef.current.geometry.attributes.aT as THREE.BufferAttribute;
    tAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <primitive object={geo} attach="geometry" />
      <primitive object={shaderMat} attach="material" />
    </points>
  );
}

// ── Satellite system — router node + 2 orbiting fallback nodes ──
export function Satellite({ position, groupRef: externalRef }: {
  position: [number, number, number];
  groupRef?: React.MutableRefObject<THREE.Group | null>;
}) {
  const internalRef = useRef<THREE.Group>(null);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);
  const whiteColor = useMemo(() => new THREE.Color(COLORS.white), []);

  // expose internal ref through externalRef
  useEffect(() => {
    if (externalRef) externalRef.current = internalRef.current;
  });

  // 2 orbiting fallback nodes
  const orbitRefs = useRef<(THREE.Mesh | null)[]>([]);
  const orbitAngles = useRef([0, Math.PI * 0.7]);
  const orbitSpeeds = useRef([0.85, 1.1]);

  useFrame((_, delta) => {
    if (!internalRef.current) return;

    orbitAngles.current.forEach((angle, i) => {
      orbitAngles.current[i] += orbitSpeeds.current[i] * delta;
      const orbitRadius = 1.12 + i * 0.28;
      const x = Math.cos(orbitAngles.current[i]) * orbitRadius;
      const z = Math.sin(orbitAngles.current[i]) * orbitRadius;
      const y = Math.sin(orbitAngles.current[i] * 1.7) * 0.35;
      const mesh = orbitRefs.current[i];
      if (mesh) mesh.position.set(x, y, z);
    });
  });

  return (
    <group ref={internalRef} position={position} visible={true}>
      <mesh>
        <octahedronGeometry args={[0.34, 0]} />
        <meshBasicMaterial color={accentColor} opacity={0.9} transparent />
      </mesh>
      <sprite scale={[1.75, 1.75, 1]}>
        <spriteMaterial map={getGlowTexture() || undefined} color={accentColor} opacity={0.25} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {[accentColor, whiteColor].map((col, i) => (
        <mesh key={i} ref={(el) => { orbitRefs.current[i] = el; }}>
          <octahedronGeometry args={[0.13, 0]} />
          <meshBasicMaterial color={col} opacity={1.0} />
        </mesh>
      ))}

      {/* 
      <lineSegments>
        <edgesGeometry args={[new THREE.TorusGeometry(1.12, 0.02, 8, 64)]} />
        <lineBasicMaterial color={COLORS.line} opacity={0.4} transparent />
      </lineSegments>
      */}
    </group>
  );
}
