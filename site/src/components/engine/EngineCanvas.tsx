"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Core, GridFloor, DustField, StageNodes, DataStream, Satellite, getGlowTexture, COLORS } from "./SceneObjects";

// ── Build stream curves — entering from ALL frame edges, flow toward core ──
function buildStreamCurves(): THREE.CatmullRomCurve3[] {
  return [
    { from: [-10, 6, -3], mid: [-3, 1.5, 0], to: [0, 0.2, 0.5] },
    { from: [8, 5, -4], mid: [2, 1.8, -1], to: [-0.3, -0.1, 0.3] },
    { from: [-7, -5, 2], mid: [-2, -1.5, 0.5], to: [0.2, 0, -0.2] },
    { from: [9, -4, -2], mid: [3, -1, -0.5], to: [-0.1, 0.1, 0] },
    { from: [-9, 1, -5], mid: [-2.5, 0.5, -1.5], to: [0, 0, 0.1] },
    { from: [6, 2, 4], mid: [1.5, 0.8, 1], to: [0.3, -0.2, -0.4] },
    // Exit stream — core → forward-down
    { from: [0, -0.3, 1], mid: [1.5, -2, 4], to: [4, -5, 8] },
  ].map(({ from, mid, to }) =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to),
    ])
  );
}

// ── Waypoint camera config ────────────────────────────────
interface Waypoint {
  name: string;
  pMin: number;
  pMax: number;
  camPos: THREE.Vector3;
  camLook: THREE.Vector3;
  sceneOpacity: number;
  streamBrightness: number;
  satelliteVisible: boolean;
}

const WAYPOINTS: Waypoint[] = [
  { name: "A", pMin: 0.00, pMax: 0.12, camPos: new THREE.Vector3(1.8, 0.8, 7), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 1.0, streamBrightness: 0.6, satelliteVisible: false },
  { name: "B", pMin: 0.12, pMax: 0.32, camPos: new THREE.Vector3(0.6, 1.2, 4.2), camLook: new THREE.Vector3(0.4, 0, 0), sceneOpacity: 1.0, streamBrightness: 1.0, satelliteVisible: false },
  { name: "C", pMin: 0.32, pMax: 0.48, camPos: new THREE.Vector3(-2.5, 0.6, 5.5), camLook: new THREE.Vector3(-3.5, 0.2, 2), sceneOpacity: 0.95, streamBrightness: 0.9, satelliteVisible: true },
  { name: "D", pMin: 0.48, pMax: 0.72, camPos: new THREE.Vector3(0.5, 2.5, 9), camLook: new THREE.Vector3(0, -1.5, 0), sceneOpacity: 0.45, streamBrightness: 0.4, satelliteVisible: true },
  { name: "E", pMin: 0.72, pMax: 1.00, camPos: new THREE.Vector3(0, 0.6, 5), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 0.75, streamBrightness: 0.8, satelliteVisible: false },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Scene Inner ────────────────────────────────────────────
function SceneInner() {
  const { scene, camera, gl } = useThree();
  const coreRef = useRef<THREE.Group>(null);
  const streamGroupRef = useRef<THREE.Group>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const scrollP = useRef(0); // damped scroll progress
  const smoothP = useRef(0); // lerped toward scrollP
  const pointerNorm = useRef({ x: 0, y: 0 });
  const isFine = useRef(true);

  const streamCurves = useMemo(() => buildStreamCurves(), []);
  const glowTex = useMemo(() => getGlowTexture(), []);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);

  // ── Scroll tracking ─────────────────────────────────────
  const updateScroll = useCallback(() => {
    const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
    scrollP.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }, []);

  useEffect(() => {
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  // ── Pointer tracking for parallax ───────────────────────
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerNorm.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNorm.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    isFine.current = window.matchMedia("(pointer: fine)").matches;
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ── Init camera ─────────────────────────────────────────
  useEffect(() => {
    scene.fog = new THREE.Fog(COLORS.bg, 6, 26);
    scene.background = new THREE.Color(COLORS.bg);
    camera.position.copy(WAYPOINTS[0].camPos);
    camera.lookAt(WAYPOINTS[0].camLook);
  }, [scene, camera]);

  // ── Frame loop ──────────────────────────────────────────
  useFrame((_, delta) => {
    const t = timeRef.current;
    timeRef.current += delta;

    // Lerp smoothP toward scrollP
    smoothP.current += (scrollP.current - smoothP.current) * 0.06;

    // Find active waypoints and blend
    const p = smoothP.current;
    let wpA = WAYPOINTS[0];
    let wpB = WAYPOINTS[WAYPOINTS.length - 1];
    let blend = 0;

    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      if (p >= WAYPOINTS[i].pMin && p < WAYPOINTS[i + 1].pMax) {
        wpA = WAYPOINTS[i];
        wpB = WAYPOINTS[i + 1];
        blend = smoothstep(wpA.pMax, wpB.pMin, p);
        break;
      }
    }
    if (p >= WAYPOINTS[WAYPOINTS.length - 1].pMin) {
      wpA = WAYPOINTS[WAYPOINTS.length - 1];
      wpB = WAYPOINTS[WAYPOINTS.length - 1];
      blend = 0;
    }

    // Interpolate camera
    const camTarget = new THREE.Vector3().lerpVectors(wpA.camPos, wpB.camPos, blend);
    const lookTarget = new THREE.Vector3().lerpVectors(wpA.camLook, wpB.camLook, blend);

    // Pointer parallax (fine pointer only, subtle ±3° tilt)
    if (isFine.current) {
      const px = pointerNorm.current.x * 0.8;
      const py = pointerNorm.current.y * 0.5;
      camTarget.x += px;
      camTarget.y += py;
    }

    // Idle camera drift — subtle, continuous
    const driftX = Math.sin(t * 0.15) * 0.12 + Math.cos(t * 0.23) * 0.08;
    const driftY = Math.cos(t * 0.18) * 0.10 + Math.sin(t * 0.27) * 0.06;
    camera.position.lerp(
      new THREE.Vector3(camTarget.x + driftX, camTarget.y + driftY, camTarget.z),
      0.05
    );
    camera.lookAt(lookTarget);

    // Scene opacity blend
    const sceneOpacity = wpA.sceneOpacity + (wpB.sceneOpacity - wpA.sceneOpacity) * blend;
    if (streamGroupRef.current) {
      streamGroupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Points) {
          child.material.opacity = sceneOpacity * 0.7;
        }
      });
    }
    if (gridRef.current) {
      gridRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          child.material.opacity = sceneOpacity * 0.22;
        }
      });
    }

    // Core rotation + breathing
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006 * delta;
      coreRef.current.rotation.y += 0.01 * delta;
      const breathe = 1 + 0.015 * Math.sin(t * (Math.PI * 2 / 8));
      coreRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Core */}
      <group ref={coreRef}>
        <Core radius={3.5} />
      </group>

      {/* Stage ring */}
      <StageNodes radius={5} />

      {/* Data streams */}
      <group ref={streamGroupRef}>
        {streamCurves.map((curve, i) => (
          <DataStream
            key={i}
            curve={curve}
            color={i === 6 ? COLORS.accent : (i % 3 === 0 ? COLORS.accent : COLORS.white)}
            speed={0.4 + i * 0.12}
            count={i === 6 ? 600 : 500}
          />
        ))}
      </group>

      {/* Satellite system — visible around waypoint C */}
      <Satellite position={[-8, 0.8, 3.5]} visible={scrollP.current > 0.25 && scrollP.current < 0.75} />

      {/* Dust — two z-parallax layers */}
      <DustField count={2000} />
      <group position={[0, 0, 3]}>
        <DustField count={800} />
      </group>

      {/* Grid floor */}
      <group ref={gridRef}>
        <GridFloor />
      </group>

      {/* Wide ambient glow — covers full frame */}
      <sprite position={[0, 0, -2]} scale={[16, 10, 1]}>
        <spriteMaterial map={glowTex} color={accentColor} opacity={0.12} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
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
