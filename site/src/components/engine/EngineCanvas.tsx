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

const WAYPOINT_CONFIGS: Omit<Waypoint, "pMin" | "pMax">[] = [
  { name: "A", camPos: new THREE.Vector3(1.8, 0.2, 7), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 1.0, streamBrightness: 0.6, satelliteVisible: false },
  { name: "B", camPos: new THREE.Vector3(0.6, 1.2, 4.2), camLook: new THREE.Vector3(0.4, 0, 0), sceneOpacity: 1.0, streamBrightness: 1.0, satelliteVisible: false },
  { name: "C", camPos: new THREE.Vector3(-2.5, 0.6, 5.5), camLook: new THREE.Vector3(-3.5, 0.2, 2), sceneOpacity: 0.95, streamBrightness: 0.9, satelliteVisible: true },
  { name: "D", camPos: new THREE.Vector3(0.5, 2.5, 9), camLook: new THREE.Vector3(0, -1.5, 0), sceneOpacity: 0.45, streamBrightness: 0.4, satelliteVisible: true },
  { name: "E", camPos: new THREE.Vector3(0, 0.2, 5), camLook: new THREE.Vector3(0, 0, 0), sceneOpacity: 0.75, streamBrightness: 0.8, satelliteVisible: false },
];

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function measureWaypoints(): Waypoint[] {
  const sections = document.querySelectorAll("[data-waypoint]");
  if (sections.length === 0 || typeof document === "undefined") {
    // Fallback to equal distribution
    return WAYPOINT_CONFIGS.map((c, i) => ({
      ...c,
      pMin: i / WAYPOINT_CONFIGS.length,
      pMax: (i + 1) / WAYPOINT_CONFIGS.length,
    }));
  }

  // Section order: a-hero, b-prospect, c-travel, d-timeline, e-publication

  // Get each section's offsetTop — normalized
  const offsets: { name: string; top: number; height: number }[] = [];
  sections.forEach((el) => {
    const name = el.getAttribute("data-waypoint");
    if (!name) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    offsets.push({ name, top, height: rect.height });
  });
  offsets.sort((a, b) => a.top - b.top); // ensure DOM order

  if (offsets.length < 2) {
    return WAYPOINT_CONFIGS.map((c, i) => ({
      ...c,
      pMin: i / WAYPOINT_CONFIGS.length,
      pMax: (i + 1) / WAYPOINT_CONFIGS.length,
    }));
  }

  // Anchor: waypoint A starts at p=0
  // Each waypoint's p range is the normalized offset of its section center
  // Waypoint E is anchored to end at p=1.0
  const minTop = offsets[0].top;
  const maxTop = offsets[offsets.length - 1].top + offsets[offsets.length - 1].height;

  return WAYPOINT_CONFIGS.map((c, i) => {
    const section = offsets.find((o) => o.name === c.name.toLowerCase()) || offsets[i] || offsets[0];
    const center = section.top + section.height * 0.4; // upper portion of section
    const pCenter = Math.max(0, Math.min(1, (center - minTop) / (maxTop - minTop)));

    // Each waypoint gets territory around its center
    const halfSpan = 0.5 / (WAYPOINT_CONFIGS.length + 1); // ~0.08 for 5 waypoints
    const pMin = i === 0 ? 0 : Math.max(0, pCenter - halfSpan);
    let pMax = i === WAYPOINT_CONFIGS.length - 1 ? 1 : Math.min(1, pCenter + halfSpan);

    // Ensure no gaps and no overlap: next waypoint's min must be >= this max
    if (i < WAYPOINT_CONFIGS.length - 1) {
      const nextSection = offsets.find((o) => o.name === WAYPOINT_CONFIGS[i + 1].name.toLowerCase()) || offsets[i + 1] || offsets[0];
      const nextCenter = Math.max(0, Math.min(1, (nextSection.top + nextSection.height * 0.4 - minTop) / (maxTop - minTop)));
      const nextMin = Math.max(0, nextCenter - halfSpan);
      pMax = Math.min(pMax, nextMin);
    }

    return { ...c, pMin, pMax };
  });
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
  const waypointsRef = useRef<Waypoint[]>(measureWaypoints());

  const glowTex = useMemo(() => getGlowTexture(), []);
  const accentColor = useMemo(() => new THREE.Color(COLORS.accent), []);

  // ── Dynamic waypoint measurement ─────────────────────────
  const remeasure = useCallback(() => {
    waypointsRef.current = measureWaypoints();
  }, []);

  useEffect(() => {
    // Measure on mount after layout settles
    requestAnimationFrame(() => requestAnimationFrame(remeasure));

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(remeasure, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, [remeasure]);

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
    const wp = waypointsRef.current;
    if (wp.length > 0) {
      camera.position.copy(wp[0].camPos);
      camera.lookAt(wp[0].camLook);
    }
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

    // Aspect-adaptive FOV: wider field of view on narrow viewports
    // to keep the core in frame. Desktop 16:9 keeps fov=45.
    const aspect = window.innerWidth / window.innerHeight;
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = aspect < 1.2 ? 45 + (1.2 - aspect) * 30 : 45;
      camera.fov += (targetFov - camera.fov) * 0.02;
      camera.updateProjectionMatrix();
    }

    // Lerp smoothP toward scrollP
    smoothP.current += (scrollP.current - smoothP.current) * 0.06;

    const waypoints = waypointsRef.current;
    if (waypoints.length === 0) return;

    // Find active waypoints and blend
    const p = smoothP.current;
    let wpA = waypoints[0];
    let wpB = waypoints[waypoints.length - 1];
    let blend = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      if (p >= waypoints[i].pMin && p < waypoints[i + 1].pMax) {
        wpA = waypoints[i];
        wpB = waypoints[i + 1];
        blend = smoothstep(wpA.pMax, wpB.pMin, p);
        break;
      }
    }
    if (p >= waypoints[waypoints.length - 1].pMin) {
      wpA = waypoints[waypoints.length - 1];
      wpB = waypoints[waypoints.length - 1];
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

    // Satellite visibility: show around waypoint C
    if (satelliteRef.current && waypoints.length >= 3) {
      const wpc = waypoints[2]; // C
      const satVisible = p > wpc.pMin - 0.08 && p < wpc.pMax + 0.08;
      satelliteRef.current.visible = satVisible;
      
      if (satVisible) {
        let satOpacity = 1;
        const fadeInEnd = wpc.pMin + 0.06;
        const fadeOutStart = wpc.pMax - 0.06;
        if (p < fadeInEnd && p > wpc.pMin - 0.08) {
          satOpacity = Math.max(0, (p - (wpc.pMin - 0.08)) / 0.14);
        } else if (p > fadeOutStart && p < wpc.pMax + 0.08) {
          satOpacity = Math.max(0, ((wpc.pMax + 0.08) - p) / 0.14);
        }
        
        satelliteRef.current.traverse((child) => {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.Material | undefined;
          if (mat) {
            if (child.userData.baseOpacity === undefined) {
              child.userData.baseOpacity = mat.opacity;
            }
            mat.opacity = child.userData.baseOpacity * satOpacity;
          }
        });
      }
    }

    // Core rotation + breathing — always fast 3s pulse
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.006 * delta;
      coreRef.current.rotation.y += 0.01 * delta;
      const breathe = 1 + 0.04 * Math.sin(t * (Math.PI * 2 / 3));
      coreRef.current.scale.setScalar(breathe);
    }

    // p > 0.95: slow drift hold
    if (p > 0.95) {
      const lastWp = waypoints[waypoints.length - 1];
      camera.position.lerp(
        new THREE.Vector3(lastWp.camPos.x + driftX * 0.3, lastWp.camPos.y + driftY * 0.3, lastWp.camPos.z),
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
