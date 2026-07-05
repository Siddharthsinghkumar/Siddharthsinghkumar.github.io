"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Core, GridFloor, DustField, StageNodes, DataStream, Satellite, getGlowTexture, COLORS } from "./SceneObjects";
import { signalEngineReady } from "./engine-ready";

export type DeviceProfile = {
  isFine: boolean;
  isReducedMotion: boolean;
  isCoarse: boolean;
};

// ── Build stream curves — 5 orange + 2 grey-white = 7 streams, 70% orange per spec ──
// Plus exit stream: flows from core downward-forward, brighter (sorted output)
function buildStreamCurves(): { curve: THREE.CatmullRomCurve3; color: number; isExit: boolean }[] {
  const accent = COLORS.accent;
  const grey = COLORS.white;
  const raw = [
    // 5 orange streams entering from edges
    { from: [-10, 6, -3], mid: [-3, 1.5, 0], to: [0, 0.2, 0.5], color: accent },
    { from: [8, 5, -4], mid: [2, 1.8, -1], to: [-0.3, -0.1, 0.3], color: accent },
    { from: [-7, -5, 2], mid: [-2, -1.5, 0.5], to: [0.2, 0, -0.2], color: accent },
    { from: [9, -4, -2], mid: [3, -1, -0.5], to: [-0.1, 0.1, 0], color: accent },
    { from: [6, 2, 4], mid: [1.5, 0.8, 1], to: [0.3, -0.2, -0.4], color: accent },
    // 2 grey-white streams
    { from: [-9, 1, -5], mid: [-2.5, 0.5, -1.5], to: [0, 0, 0.1], color: grey },
    { from: [2, -6, 3], mid: [-0.5, -2.5, 1], to: [0.1, -0.1, -0.3], color: grey },
    // Exit stream — brighter, core → forward-down
    { from: [0, -0.3, 1], mid: [1.5, -2, 4], to: [4, -5, 8], color: accent },
  ];
  return raw.map(({ from, mid, to, color }) => ({
    curve: new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to),
    ]),
    color,
    isExit: from[0] === 0 && from[1] === -0.3 && from[2] === 1,
  }));
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
  { name: "A", pMin: 0.00, pMax: 0.12, camPos: new THREE.Vector3(1.8, 0.2, 7), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 1.0, streamBrightness: 0.6, satelliteVisible: false },
  { name: "B", pMin: 0.12, pMax: 0.32, camPos: new THREE.Vector3(0.6, 1.2, 4.2), camLook: new THREE.Vector3(0.4, 0, 0), sceneOpacity: 1.0, streamBrightness: 1.0, satelliteVisible: false },
  { name: "C", pMin: 0.32, pMax: 0.48, camPos: new THREE.Vector3(-2.5, 0.6, 5.5), camLook: new THREE.Vector3(-3.5, 0.2, 2), sceneOpacity: 0.95, streamBrightness: 0.9, satelliteVisible: true },
  { name: "D", pMin: 0.48, pMax: 0.72, camPos: new THREE.Vector3(0.5, 2.5, 9), camLook: new THREE.Vector3(0, -1.5, 0), sceneOpacity: 0.45, streamBrightness: 0.4, satelliteVisible: true },
  { name: "E", pMin: 0.72, pMax: 1.00, camPos: new THREE.Vector3(0, 0.2, 5), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 0.75, streamBrightness: 0.8, satelliteVisible: false },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Scene Inner ────────────────────────────────────────────
function SceneInner({ coarse }: { coarse: boolean }) {
  const { scene, camera } = useThree();
  const coreRef = useRef<THREE.Group>(null);
  const streamGroupRef = useRef<THREE.Group>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const firstFrameDone = useRef(false);
  const scrollP = useRef(0);
  const smoothP = useRef(0);
  const pointerNorm = useRef({ x: 0, y: 0 });
  const isFine = useRef(!coarse);

  const streamDefs = useMemo(() => buildStreamCurves(), []);
  const glowTex = useMemo(() => getGlowTexture(), []);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);

  // ── Scroll tracking — native scrollY with damped lerp (0.06) smooths it ──
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

    // Signal ready on first render frame — engine assets are loaded
    if (!firstFrameDone.current) {
      firstFrameDone.current = true;
      signalEngineReady();
    }

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

    // Scene opacity blend — applies to grid (LineSegments) + stream particles
    const sceneOpacity = wpA.sceneOpacity + (wpB.sceneOpacity - wpA.sceneOpacity) * blend;
    if (streamGroupRef.current) {
      streamGroupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
          child.material.uniforms.uOpacity.value = sceneOpacity * 0.7;
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

    // Satellite visibility: show around waypoints C-D (p 0.28–0.72)
    if (satelliteRef.current) {
      satelliteRef.current.visible = p > 0.28 && p < 0.72;
    }

    // Core rotation + breathing (intensifies at waypoint E)
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006 * delta;
      coreRef.current.rotation.y += 0.01 * delta;
      // E-phase: intensified pulse
      const eIntensity = p >= 0.72 ? (p < 0.95 ? (p - 0.72) / 0.23 : 1) : 0;
      const baseBreathe = 1 + 0.015 * Math.sin(t * (Math.PI * 2 / 8));
      const ePulse = 1 + 0.04 * Math.sin(t * (Math.PI * 2 / 3));
      const breathe = baseBreathe * (1 - eIntensity) + ePulse * eIntensity;
      coreRef.current.scale.setScalar(breathe);
    }

    // Waypoint E p>0.95: emit bright stream toward camera
    const brightStreamIdx = 7; // exit/TOWARD stream
    if (streamGroupRef.current && streamGroupRef.current.children[brightStreamIdx]) {
      const exitStream = streamGroupRef.current.children[brightStreamIdx] as THREE.Points;
      const eFade = p >= 0.72 ? Math.min(1, (p - 0.72) / 0.18) : 0;
      const mat = (exitStream.material as unknown) as THREE.ShaderMaterial;
      if (mat.uniforms) mat.uniforms.uOpacity.value = eFade;
    }

    // p > 0.95: slow drift hold
    if (p > 0.95) {
      camera.position.lerp(
        new THREE.Vector3(WAYPOINTS[4].camPos.x + driftX * 0.3, WAYPOINTS[4].camPos.y + driftY * 0.3, WAYPOINTS[4].camPos.z),
        0.02
      );
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Core */}
      <group ref={coreRef}>
        <Core radius={3.5} />
      </group>

      {/* Stage ring — spec radius ~2.6 */}
      <StageNodes radius={2.6} />

      {/* Data streams — ~4,500 total; half on coarse */}
      <group ref={streamGroupRef}>
        {streamDefs.map((def, i) => (
          <DataStream
            key={i}
            curve={def.curve}
            color={def.color}
            speed={0.4 + i * 0.12}
            count={coarse ? (def.isExit ? 320 : 320) : (def.isExit ? 650 : 640)}
            bright={def.isExit}
          />
        ))}
      </group>

      {/* Satellite system — visible around waypoint C */}
      <Satellite position={[-8, 0.8, 3.5]} groupRef={satelliteRef} />

      {/* Dust — two z-parallax layers; half counts on coarse */}
      <DustField count={coarse ? 1000 : 2000} />
      <group position={[0, 0, 3]}>
        <DustField count={coarse ? 400 : 800} />
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
  deviceProfile: DeviceProfile;
}

export default function EngineCanvas({ className = "", deviceProfile }: EngineCanvasProps) {
  const coarse = deviceProfile.isCoarse;

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      <Canvas
        gl={{
          antialias: !coarse,
          alpha: false,
          powerPreference: coarse ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={coarse ? [0.3, 0.6] : [0.5, 0.75]}
        camera={{ position: [1.8, 0.8, 7], fov: 45 }}
        style={{ position: "fixed", inset: 0 }}
      >
        <SceneInner coarse={coarse} />
      </Canvas>
    </div>
  );
}
