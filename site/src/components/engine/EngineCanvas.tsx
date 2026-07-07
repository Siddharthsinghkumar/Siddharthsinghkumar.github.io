"use client";

import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Core, GridFloor, DustField, StageNodes, Satellite, getGlowTexture, COLORS } from "./SceneObjects";
import { signalEngineReady } from "./engine-ready";

export type DeviceProfile = {
  isFine: boolean;
  isReducedMotion: boolean;
  isCoarse: boolean;
};



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
  { name: "A", pMin: 0.00, pMax: 0.15, camPos: new THREE.Vector3(1.8, 0.2, 7), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 1.0, streamBrightness: 0.6, satelliteVisible: false },
  { name: "B", pMin: 0.15, pMax: 0.35, camPos: new THREE.Vector3(0.6, 1.2, 4.2), camLook: new THREE.Vector3(0.4, 0, 0), sceneOpacity: 1.0, streamBrightness: 1.0, satelliteVisible: false },
  { name: "C", pMin: 0.35, pMax: 0.55, camPos: new THREE.Vector3(-2.5, 0.6, 5.5), camLook: new THREE.Vector3(-3.5, 0.2, 2), sceneOpacity: 0.95, streamBrightness: 0.9, satelliteVisible: true },
  { name: "D", pMin: 0.55, pMax: 0.85, camPos: new THREE.Vector3(0.5, 2.5, 9), camLook: new THREE.Vector3(0, -1.5, 0), sceneOpacity: 0.45, streamBrightness: 0.4, satelliteVisible: true },
  { name: "E", pMin: 0.85, pMax: 1.00, camPos: new THREE.Vector3(0, 0.2, 5), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 0.75, streamBrightness: 0.8, satelliteVisible: false },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ── Scene Inner ────────────────────────────────────────────
function SceneInner({ coarse }: { coarse: boolean }) {
  const { scene, camera } = useThree();
  const coreRef = useRef<THREE.Group>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const firstFrameDone = useRef(false);
  const scrollP = useRef(0);
  const smoothP = useRef(0);
  const pointerNorm = useRef({ x: 0, y: 0 });
  const isFine = useRef(!coarse);

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
    scene.fog = new THREE.FogExp2(COLORS.bg, 0.012);
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

    // Scene opacity blend — applies to grid (LineSegments)
    const sceneOpacity = wpA.sceneOpacity + (wpB.sceneOpacity - wpA.sceneOpacity) * blend;
    if (gridRef.current) {
      gridRef.current.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          child.material.opacity = sceneOpacity * 0.22;
        }
      });
    }

    // Satellite visibility: show around waypoints B-D (p 0.20–0.50)
    // Smooth fade-in: p 0.20–0.26, fade-out: p 0.44–0.50
    if (satelliteRef.current) {
      const satVisible = p > 0.20 && p < 0.50;
      satelliteRef.current.visible = satVisible;
      
      if (satVisible) {
        let satOpacity = 1;
        if (p < 0.26) satOpacity = Math.max(0, (p - 0.20) / 0.06);
        else if (p > 0.44) satOpacity = Math.max(0, (0.50 - p) / 0.06);
        
        satelliteRef.current.traverse((child: any) => {
          if (child.material) {
            if (child.userData.baseOpacity === undefined) {
              child.userData.baseOpacity = child.material.opacity;
            }
            child.material.opacity = child.userData.baseOpacity * satOpacity;
          }
        });
      }
    }

    // Core rotation + breathing — always fast 3s pulse (T14: removed slow 8s)
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006 * delta;
      coreRef.current.rotation.y += 0.01 * delta;
      const breathe = 1 + 0.04 * Math.sin(t * (Math.PI * 2 / 3));
      coreRef.current.scale.setScalar(breathe);
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
        <Core radius={coarse ? 2.0 : 2.9} />
      </group>

      {/* Stage ring */}
      <StageNodes radius={coarse ? 3.0 : 4.0} />

      {/* Satellite system — visible around waypoint C */}
      {/* [-5.616, 0.5616, 2.457] best for dis[play with 16 by 9 desktop */}
      <Satellite position={coarse ? [-3.6, 0.4, 1.8] : [-5.616, 0.5616, 2.457]} groupRef={satelliteRef} />

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
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");

  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className={`fixed inset-0 z-[2] pointer-events-none ${className}`}>
      <Canvas
        gl={{
          antialias: !coarse,
          alpha: true,
          powerPreference: coarse ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={coarse ? [0.3, 0.6] : [0.5, 0.75]}
        camera={{ position: [1.8, 0.8, 7], fov: 45 }}
        style={{ position: "fixed", inset: 0 }}
        frameloop={frameloop}
      >
        <SceneInner coarse={coarse} />
      </Canvas>
    </div>
  );
}
